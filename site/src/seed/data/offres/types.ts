// Données de départ des pages « offre ». Après le seed, le contenu se modifie dans l'admin (Offres).
import type { SolutionKey } from '../site'

// Corps de page : intertitres, paragraphes et listes, convertis en Lexical par le seed.
export type Bloc = { h2: string } | { p: string } | { ul: string[] }

export type OffreLocale = {
  titre: string
  slug: string
  metaTitle: string // ≤ 60 caractères
  accroche: string // ≤ 160 caractères, sert aussi de meta description
  corps: Bloc[]
  livrables: string[]
  faq: { q: string; r: string }[]
}

export type OffreSeed = {
  solution: SolutionKey
  ordre: number
  fr: OffreLocale
  en: OffreLocale
}
