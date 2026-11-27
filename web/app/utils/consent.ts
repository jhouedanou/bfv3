// Mesure d'audience : rien n'est chargé sans l'accord du visiteur. Les identifiants GA4 et Meta Pixel
// viennent de la configuration (NUXT_PUBLIC_GA_ID, NUXT_PUBLIC_META_PIXEL_ID), lue par CookieConsent.

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

// Rouvre le bandeau en mode « Personnaliser » (lien « Gérer les cookies » du pied de page).
export const openCookieSettings = () => window.dispatchEvent(new Event(CONSENT_EVENT))

// Conversion : une demande envoyée par un formulaire. Sans accord, gtag et fbq n'existent pas.
export const trackLead = (form: string) => {
  window.gtag?.('event', 'generate_lead', { form_type: form })
  window.fbq?.('track', 'Lead', { content_category: form })
}
