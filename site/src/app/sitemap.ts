import type { MetadataRoute } from 'next'

import { getPublishedBarometres } from '@/lib/barometres'
import { getOffres, getSiteContent } from '@/lib/content'
import { SITE_URL, localePath, routePath, routePaths } from '@/lib/site'

export const revalidate = 3600

type Paths = { fr: string; en: string }

// Une entrée par langue, chacune avec ses alternates FR, EN et x-default.
const pair = (paths: Paths, extra: Omit<MetadataRoute.Sitemap[number], 'url' | 'alternates'>): MetadataRoute.Sitemap => {
  // Accueil FR : https://bigfive.solutions, sans « / » final, comme le canonical.
  const abs = (p: string) => (p === '/' ? SITE_URL : `${SITE_URL}${p}`)
  const languages = {
    fr: abs(localePath('fr', paths.fr)),
    en: abs(localePath('en', paths.en)),
    'x-default': abs(localePath('fr', paths.fr)),
  }
  return [
    { url: languages.fr, alternates: { languages }, ...extra },
    { url: languages.en, alternates: { languages }, ...extra },
  ]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [baros, fr, en, offresFr, offresEn] = await Promise.all([
    getPublishedBarometres(),
    getSiteContent('fr'),
    getSiteContent('en'),
    getOffres('fr'),
    getOffres('en'),
  ])
  const latest = baros[0]?.publishedAt
  const same = (p: string) => ({ fr: p, en: p })

  return [
    ...pair(same('/'), { lastModified: latest, changeFrequency: 'weekly', priority: 1 }),
    ...fr.solutions.flatMap((s) => {
      const sEn = en.solutions.find((x) => x.key === s.key)
      return pair({ fr: `/solutions/${s.slug}`, en: `/solutions/${sEn?.slug ?? s.slug}` }, { changeFrequency: 'monthly', priority: 0.8 })
    }),
    // Offres : seulement celles dont le texte est validé par BIG FIVE.
    ...offresFr
      .filter((o) => o.valide)
      .flatMap((o) => {
        const oEn = offresEn.find((x) => x.slugs.fr === o.slugs.fr)
        if (!oEn) return []
        return pair(
          { fr: `/solutions/${o.solution.slug}/${o.slug}`, en: `/solutions/${oEn.solution.slug}/${oEn.slug}` },
          { lastModified: o.updatedAt, changeFrequency: 'monthly', priority: 0.8 },
        )
      }),
    ...pair(routePaths('privacy'), { changeFrequency: 'yearly', priority: 0.2 }),
    // Liste des baromètres, puis une page par baromètre.
    // Baromètres : version FR seulement (la version EN a un canonical vers la FR).
    { url: `${SITE_URL}${routePath('barometres', 'fr')}`, lastModified: latest, changeFrequency: 'weekly' as const, priority: 0.9 },
    ...baros.map((b) => ({ url: `${SITE_URL}${routePath('barometres', 'fr', `/${b.identifiant}`)}`, lastModified: b.publishedAt, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ]
}
