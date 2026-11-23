import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { Payload } from 'payload'

import { dictionaries, locales, type Dictionary, type Locale } from '@/i18n/dictionaries'

import { TEXTES_SLUGS } from '../globals/Textes'
import type { Img, Links, PoleDTO, SiteContent, SolutionDTO, SolutionKey } from './content-types'

// Logique de lecture du contenu, sans dépendance à Next (utilisée aussi par les scripts).
// Tout le contenu éditable vient de Payload. On lit chaque collection une fois, dans les deux
// langues (locale « all »), puis on en tire la version FR ou EN.

type Loc<T> = Partial<Record<Locale, T>> | null | undefined
type RawMedia = { url?: string | null; width?: number | null; height?: number | null; alt?: string | null } | number | null | undefined

// Valeur dans la langue demandée, sinon en français.
const pick = <T>(v: Loc<T>, locale: Locale): T | undefined => v?.[locale] ?? v?.fr ?? undefined
const str = (v: Loc<string>, locale: Locale) => pick(v, locale) ?? ''
const items = (v: Loc<{ item: string }[]>, locale: Locale) => (pick(v, locale) ?? []).map((x) => x.item)

// Payload renvoie une URL absolue (serverURL) : on garde le chemin pour next/image.
export const relativeUrl = (url: string) => (url.startsWith('http') ? new URL(url).pathname : url)

const img = (m: RawMedia, alt?: string): Img | null =>
  m && typeof m === 'object' && m.url
    ? { url: relativeUrl(m.url), width: m.width ?? 1200, height: m.height ?? 800, alt: alt ?? m.alt ?? '' }
    : null

// ── Lectures brutes (une par requête grâce à cache) ──────────────────────────

type RawSolution = {
  id: number
  key: SolutionKey
  ordre: number
  pole: 'intel' | 'tech'
  nom: Loc<string>
  metaTitle?: Loc<string>
  slug: Loc<string>
  etape: Loc<string>
  heroSub: Loc<string>
  tag: Loc<string>
  promesse: Loc<string>
  obtenez: Loc<{ item: string }[]>
  porteur: Loc<string>
  image: RawMedia
  imagePos?: string | null
}

export type RawOffre = {
  id: number
  solution: number | { id: number }
  ordre: number
  valide?: boolean | null
  titre: Loc<string>
  slug: Loc<string>
  accroche: Loc<string>
  corps: Loc<SerializedEditorState>
  livrables: Loc<{ item: string }[]>
  faq: Loc<{ question: string; reponse: string }[]>
  metaTitle: Loc<string>
  updatedAt: string
}

export const fetchRaw = async (payload: Payload) => {
  const all = { locale: 'all' as const, overrideAccess: false }
  const [solutions, offres, clients, textes, accueil, seo, liens, politique] = await Promise.all([
    payload.find({ collection: 'solutions', ...all, sort: 'ordre', limit: 20, depth: 1 }),
    payload.find({ collection: 'offres', ...all, where: { _status: { equals: 'published' } }, sort: 'ordre', limit: 200, depth: 0 }),
    payload.find({ collection: 'clients', ...all, sort: 'ordre', limit: 200, depth: 1 }),
    Promise.all(TEXTES_SLUGS.map((slug) => payload.findGlobal({ slug: slug as 'textes-accueil', ...all, depth: 0 }))),
    payload.findGlobal({ slug: 'accueil', ...all, depth: 1 }),
    payload.findGlobal({ slug: 'seo', ...all, depth: 1 }),
    payload.findGlobal({ slug: 'liens', ...all, depth: 0 }),
    payload.findGlobal({ slug: 'politique', ...all, depth: 0 }),
  ])
  return {
    solutions: solutions.docs as unknown as RawSolution[],
    offres: offres.docs as unknown as RawOffre[],
    clients: clients.docs as unknown as { nom: string; logo: RawMedia }[],
    textes: Object.assign({}, ...textes) as Record<string, unknown>,
    accueil: accueil as unknown as {
      couvertures?: { image: RawMedia }[] | null
      personnage?: RawMedia
      poles?: { pole: 'intel' | 'tech'; etape: Loc<string>; promesse: Loc<string>; items: Loc<{ item: string }[]>; responsable: string; role: Loc<string> }[] | null
    },
    seo: seo as unknown as { titre: Loc<string>; description: Loc<string>; image?: RawMedia },
    liens: liens as unknown as { laveiye?: string | null; reseaux?: { label: string; court: string; url: string }[] | null },
    politique: politique as unknown as { sections: Loc<{ titre: string; paragraphes?: { texte: string }[] | null }[]> },
  }
}

export type Raw = Awaited<ReturnType<typeof fetchRaw>>

// ── Textes : le dictionnaire du code sert de valeur par défaut, champ par champ ──

const mergeDictionary = (raw: Record<string, unknown>, locale: Locale): Dictionary => {
  const base = dictionaries[locale]
  const out = { ...base, sources: { ...base.sources } } as Dictionary
  const fromCms = (v: unknown) => {
    const s = (v as Loc<string>)?.[locale]
    return typeof s === 'string' && s.trim() ? s : undefined
  }
  for (const key of Object.keys(base) as (keyof Dictionary)[]) {
    if (key === 'sources') {
      const group = (raw.sources ?? {}) as Record<string, unknown>
      for (const k of Object.keys(base.sources) as (keyof Dictionary['sources'])[]) out.sources[k] = fromCms(group[k]) ?? base.sources[k]
    } else {
      ;(out as Record<string, unknown>)[key] = fromCms(raw[key]) ?? base[key]
    }
  }
  return out
}

// ── Contenu d'une langue ─────────────────────────────────────────────────────

const solutionIdOf = (o: RawOffre) => (typeof o.solution === 'object' ? o.solution.id : o.solution)

export const buildContent = (raw: Raw, locale: Locale): SiteContent => {
  const solutions: SolutionDTO[] = raw.solutions.map((s) => ({
    key: s.key,
    slug: str(s.slug, locale),
    name: str(s.nom, locale),
    metaTitle: str(s.metaTitle, locale),
    step: str(s.etape, locale),
    heroSub: str(s.heroSub, locale),
    tag: str(s.tag, locale),
    promise: str(s.promesse, locale),
    gets: items(s.obtenez, locale),
    lead: str(s.porteur, locale),
    pole: s.pole,
    img: img(s.image, str(s.nom, locale)),
    imgPos: s.imagePos || 'center',
    offres: raw.offres
      .filter((o) => solutionIdOf(o) === s.id)
      .map((o) => ({ slug: str(o.slug, locale), title: str(o.titre, locale) }))
      .filter((o) => o.slug && o.title),
  }))

  const poles: PoleDTO[] = (raw.accueil.poles ?? []).map((p) => ({
    pole: p.pole,
    step: str(p.etape, locale),
    promise: str(p.promesse, locale),
    items: items(p.items, locale),
    lead: p.responsable,
    role: str(p.role, locale),
  }))

  const links: Links = {
    laveiye: raw.liens.laveiye || 'https://laveiye.com/',
    socials: (raw.liens.reseaux ?? []).map((r) => ({ label: r.label, short: r.court, url: r.url })),
  }

  return {
    t: mergeDictionary(raw.textes, locale),
    solutions,
    covers: (raw.accueil.couvertures ?? []).map((c) => img(c.image, '')).filter((x): x is Img => Boolean(x)),
    personnage: img(raw.accueil.personnage, ''),
    poles,
    clients: raw.clients.map((c) => ({ name: c.nom, logo: img(c.logo, c.nom) })).filter((c): c is { name: string; logo: Img } => Boolean(c.logo)),
    links,
    seo: { title: str(raw.seo.titre, locale), description: str(raw.seo.description, locale), image: img(raw.seo.image) },
    privacy: (pick(raw.politique.sections, locale) ?? []).map((s) => ({ title: s.titre, body: (s.paragraphes ?? []).map((p) => p.texte) })),
  }
}

// ── Pages « offre » ──────────────────────────────────────────────────────────

export type OffreDTO = {
  solution: SolutionDTO
  slug: string
  slugs: Record<Locale, string> // pour hreflang
  solutionSlugs: Record<Locale, string>
  title: string
  metaTitle: string
  accroche: string
  corps: SerializedEditorState | null
  livrables: string[]
  faq: { question: string; reponse: string }[]
  valide: boolean
  updatedAt: string
}

const toOffre = (o: RawOffre, s: RawSolution, solution: SolutionDTO, locale: Locale): OffreDTO => ({
  solution,
  slug: str(o.slug, locale),
  slugs: Object.fromEntries(locales.map((l) => [l, str(o.slug, l)])) as Record<Locale, string>,
  solutionSlugs: Object.fromEntries(locales.map((l) => [l, str(s.slug, l)])) as Record<Locale, string>,
  title: str(o.titre, locale),
  metaTitle: str(o.metaTitle, locale),
  accroche: str(o.accroche, locale),
  corps: pick(o.corps, locale) ?? null,
  livrables: items(o.livrables, locale),
  faq: pick(o.faq, locale) ?? [],
  valide: Boolean(o.valide),
  updatedAt: o.updatedAt,
})

export const buildOffres = (raw: Raw, content: SiteContent, locale: Locale): OffreDTO[] =>
  raw.offres.flatMap((o) => {
    const s = raw.solutions.find((x) => x.id === solutionIdOf(o))
    const solution = s && content.solutions.find((x) => x.key === s.key)
    return s && solution ? [toOffre(o, s, solution, locale)] : []
  })

export const solutionSlugs = (raw: Raw, key: SolutionKey) => {
  const s = raw.solutions.find((x) => x.key === key)
  return Object.fromEntries(locales.map((l) => [l, s ? str(s.slug, l) : ''])) as Record<Locale, string>
}
