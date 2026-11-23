// Formes du contenu envoyé aux composants (serveur et navigateur). Source : Payload, voir lib/content.ts.
import type { Dictionary } from '@/i18n/dictionaries'

export type SolutionKey = 'veille' | 'conseil' | 'academy' | 'digitales'
export const SOLUTION_KEYS: SolutionKey[] = ['veille', 'conseil', 'academy', 'digitales']

export type Img = { url: string; width: number; height: number; alt: string }

export type OffreLink = { slug: string; title: string }

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

export type PoleDTO = { pole: 'intel' | 'tech'; step: string; promise: string; items: string[]; lead: string; role: string }

export type Links = { laveiye: string; socials: { label: string; short: string; url: string }[] }

export type SiteContent = {
  t: Dictionary
  solutions: SolutionDTO[]
  covers: Img[]
  personnage: Img | null
  poles: PoleDTO[]
  clients: { name: string; logo: Img }[]
  links: Links
  seo: { title: string; description: string; image: Img | null }
  privacy: { title: string; body: string[] }[]
}
