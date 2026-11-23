import type { Locale } from '@/i18n/dictionaries'

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://bigfive.solutions').replace(/\/$/, '')

// FR à la racine, EN sous /en.
export const localePath = (locale: Locale, path = '/') => {
  const p = path.startsWith('/') ? path : `/${path}`
  if (locale === 'fr') return p
  return p === '/' ? '/en' : `/en${p}`
}

// Rubriques dont l'adresse est traduite. Les dossiers de app/(frontend)/[locale] portent le nom
// français ; src/proxy.ts réécrit l'adresse anglaise vers ce dossier.
export const ROUTES = {
  barometres: { fr: '/barometres', en: '/barometers' },
  privacy: { fr: '/politique-de-confidentialite', en: '/privacy-policy' },
} as const

export type RouteKey = keyof typeof ROUTES

// Chemin sans préfixe de langue, ex. routeOf('barometres', 'en', '/x') → « /barometers/x ».
export const routeOf = (key: RouteKey, locale: Locale, rest = '') => `${ROUTES[key][locale]}${rest}`

// Adresse publique complète, ex. routePath('barometres', 'en', '/x') → « /en/barometers/x ».
export const routePath = (key: RouteKey, locale: Locale, rest = '') => localePath(locale, routeOf(key, locale, rest))

export const routePaths = (key: RouteKey, rest = ''): Record<Locale, string> => ({
  fr: routeOf(key, 'fr', rest),
  en: routeOf(key, 'en', rest),
})
