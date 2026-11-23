import type { Locale } from '@/i18n/dictionaries'

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://bigfive.solutions').replace(/\/$/, '')

// FR à la racine, EN sous /en.
export const localePath = (locale: Locale, path = '/') => {
  const p = path.startsWith('/') ? path : `/${path}`
  if (locale === 'fr') return p
  return p === '/' ? '/en' : `/en${p}`
}
