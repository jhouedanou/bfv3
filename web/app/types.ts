// Formes du contenu passé aux composants. Source : content/ (Nuxt Content), voir composables/useSite.ts.

export type Locale = 'fr' | 'en'
export const LOCALES: Locale[] = ['fr', 'en']

export type SolutionKey = 'veille' | 'conseil' | 'academy' | 'digitales'
export const SOLUTION_KEYS: SolutionKey[] = ['veille', 'conseil', 'academy', 'digitales']

// Libellés de l'interface (content/textes/<langue>.yml).
export type Dictionary = Record<string, string> & { sources: Record<string, string> }

export type Img = { url: string; width: number; height: number; alt: string }

export type OffreLink = { key: string; slug: string; title: string }

export type SolutionDTO = {
  key: SolutionKey
  slug: string
  name: string
  metaTitle: string
  step: string
  heroSub: string
  tag: string
  promise: string
  gets: string[]
  lead: string
  pole: 'intel' | 'tech'
  img: Img | null
  imgPos: string
  offres: OffreLink[]
}

export type PoleDTO = { pole: 'intel' | 'tech'; name: string; step: string; promise: string; items: string[]; lead: string; role: string }

export type Links = { laveiye: string; socials: { label: string; short: string; url: string }[] }

export type Settings = { email: string; telephone: string; adresse: string; ogImage: string }

export type SiteContent = {
  locale: Locale
  t: Dictionary
  solutions: SolutionDTO[]
  covers: Img[]
  personnage: Img | null
  poles: PoleDTO[]
  clients: { name: string; logo: Img }[]
  links: Links
  settings: Settings
  seo: { title: string; description: string }
  privacy: { title: string; body: string[] }[]
}

// Ce qui part vers le navigateur. Jamais de lien interne vers le PDF (CDC § 6.2).
export type BarometreDTO = {
  identifiant: string
  publishedAt: string
  title: string
  metaTitle: string
  scope: string[]
  kpis: { value: string; label: string; explanation: string }[]
  takeaway: string
  cover: Img | null
}

// Source de la demande, reprise dans l'objet de l'e-mail (CDC § 4).
export type ContactSource = 'header' | 'hero' | 'solutions' | 'observatoire' | SolutionKey
export type ContactChoice = SolutionKey | 'multi' | 'unknown'

export type Modal =
  | { kind: 'solution'; key: SolutionKey }
  | { kind: 'contact'; source: ContactSource; choice: ContactChoice }
  | { kind: 'gate'; baro: BarometreDTO }
  | { kind: 'notify' }
  | { kind: 'cover'; baro: BarometreDTO }
  | null
