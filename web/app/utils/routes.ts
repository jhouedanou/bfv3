import type { Locale } from '~/types'
import sizes from './image-sizes.json'

// FR à la racine, EN sous /en.
export const localePath = (locale: Locale, path = '/') => {
  const p = path.startsWith('/') ? path : `/${path}`
  if (locale === 'fr') return p
  return p === '/' ? '/en' : `/en${p}`
}

// Rubriques dont l'adresse est traduite.
export const ROUTES = {
  barometres: { fr: '/barometres', en: '/barometers' },
  privacy: { fr: '/politique-de-confidentialite', en: '/privacy-policy' },
} as const

export type RouteKey = keyof typeof ROUTES

// Chemin sans préfixe de langue, ex. routeOf('barometres', 'en', '/x') → « /barometers/x ».
export const routeOf = (key: RouteKey, locale: Locale, rest = '') => `${ROUTES[key][locale]}${rest}`

// Adresse publique complète, ex. routePath('barometres', 'en', '/x') → « /en/barometers/x ».
export const routePath = (key: RouteKey, locale: Locale, rest = '') => localePath(locale, routeOf(key, locale, rest))

// Adresses des deux langues d'une page, pour hreflang et le sélecteur de langue.
export const routePaths = (key: RouteKey, rest = ''): Record<Locale, string> => ({
  fr: routePath(key, 'fr', rest),
  en: routePath(key, 'en', rest),
})

export const solutionPath = (locale: Locale, slug: string) => localePath(locale, `/solutions/${slug}`)
export const offrePath = (locale: Locale, solutionSlug: string, offreSlug: string) =>
  localePath(locale, `/solutions/${solutionSlug}/${offreSlug}`)

// Dimensions des images de public/ (évite les décalages de mise en page). Relevées par
// scripts/image-sizes ; une image ajoutée dans Studio prend des dimensions par défaut.
const SIZES = sizes as Record<string, [number, number]>
export const imageOf = (url: string | undefined | null, alt = '', fallback: [number, number] = [1200, 800]) => {
  if (!url) return null
  const [width, height] = SIZES[url] ?? fallback
  return { url, width, height, alt }
}

// Date ISO (AAAA-MM-JJ) → « août 2026 ».
export const formatMonth = (iso: string, locale: Locale) =>
  new Date(`${iso.slice(0, 10)}T12:00:00Z`).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
