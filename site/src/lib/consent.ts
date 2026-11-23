// Mesure d'audience : identifiants lus dans .env, rien n'est chargé sans accord du visiteur.
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || ''
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || ''
export const TRACKING_ENABLED = Boolean(GA_ID || META_PIXEL_ID)

export const CONSENT_KEY = 'bigfive-cookies'
export const CONSENT_EVENT = 'bigfive:cookies'

export type Consent = { analytics: boolean; ads: boolean }

type Tracker = (...args: unknown[]) => void
declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: Tracker
    fbq?: Tracker & { queue?: unknown[]; loaded?: boolean; version?: string; callMethod?: Tracker; push?: Tracker }
    _fbq?: unknown
  }
}

export const readConsent = (): Consent | null => {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY)
    if (!raw) return null
    const v = JSON.parse(raw) as Partial<Consent>
    return { analytics: v.analytics === true, ads: v.ads === true }
  } catch {
    return null
  }
}

export const writeConsent = (c: Consent) => {
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify({ ...c, date: new Date().toISOString() }))
  } catch {
    // Stockage indisponible (navigation privée) : le choix vaut pour la page en cours.
  }
}

// Conversion : une demande envoyée par un formulaire. Sans accord, gtag et fbq n'existent pas.
export const trackLead = (form: string) => {
  window.gtag?.('event', 'generate_lead', { form_type: form })
  window.fbq?.('track', 'Lead', { content_category: form })
}
