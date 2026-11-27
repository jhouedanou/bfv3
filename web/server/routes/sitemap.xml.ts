// Plan du site : une entrée par langue avec ses alternates FR / EN / x-default.
// Offres : seulement celles dont le texte est validé. Baromètres : version FR seulement.
type Entry = { loc: string; alternates?: Record<string, string>; lastmod?: string; changefreq: string; priority: number }

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export default defineEventHandler(async (event) => {
  const siteUrl = useRuntimeConfig(event).public.siteUrl as string
  const abs = (p: string) => (p === '/' ? siteUrl : `${siteUrl}${p}`)
  const today = new Date().toISOString().slice(0, 10)

  const [solutions, offres, baros] = await Promise.all([
    queryCollection(event, 'solutions').all(),
    queryCollection(event, 'offres').select('key', 'locale', 'solution', 'slug', 'validated').all(),
    queryCollection(event, 'barometres').where('published', '=', true).order('publishedAt', 'DESC').all(),
  ])
  const published = baros.filter((b) => b.publishedAt.slice(0, 10) <= today)
  const latest = published[0]?.publishedAt

  const entries: Entry[] = []
  const pair = (fr: string, en: string, extra: Omit<Entry, 'loc' | 'alternates'>) => {
    const alternates = { fr: abs(fr), en: abs(en), 'x-default': abs(fr) }
    entries.push({ loc: abs(fr), alternates, ...extra }, { loc: abs(en), alternates, ...extra })
  }
  const sol = (key: string, l: 'fr' | 'en') => solutions.find((s) => s.key === key && s.locale === l)!

  pair('/', '/en', { lastmod: latest, changefreq: 'weekly', priority: 1 })
  for (const s of solutions.filter((x) => x.locale === 'fr')) {
    pair(`/solutions/${s.slug}`, `/en/solutions/${sol(s.key, 'en').slug}`, { changefreq: 'monthly', priority: 0.8 })
  }
  for (const o of offres.filter((x) => x.locale === 'fr' && x.validated)) {
    const oEn = offres.find((x) => x.locale === 'en' && x.key === o.key)
    if (!oEn) continue
    pair(`/solutions/${sol(o.solution, 'fr').slug}/${o.slug}`, `/en/solutions/${sol(o.solution, 'en').slug}/${oEn.slug}`, { changefreq: 'monthly', priority: 0.8 })
  }
  pair('/politique-de-confidentialite', '/en/privacy-policy', { changefreq: 'yearly', priority: 0.2 })
  entries.push({ loc: abs('/barometres'), lastmod: latest, changefreq: 'weekly', priority: 0.9 })
  for (const b of published) entries.push({ loc: abs(`/barometres/${b.identifiant}`), lastmod: b.publishedAt, changefreq: 'monthly', priority: 0.7 })

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries.map((e) =>
      [
        '<url>',
        `<loc>${esc(e.loc)}</loc>`,
        ...Object.entries(e.alternates ?? {}).map(([l, href]) => `<xhtml:link rel="alternate" hreflang="${l}" href="${esc(href)}"/>`),
        e.lastmod ? `<lastmod>${e.lastmod.slice(0, 10)}</lastmod>` : '',
        `<changefreq>${e.changefreq}</changefreq>`,
        `<priority>${e.priority}</priority>`,
        '</url>',
      ].join(''),
    ),
    '</urlset>',
  ].join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
