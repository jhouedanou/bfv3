'use client'

import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import {
  CONSENT_EVENT,
  GA_ID,
  META_PIXEL_ID,
  TRACKING_ENABLED,
  readConsent,
  writeConsent,
  type Consent,
} from '@/lib/consent'
import { routePath } from '@/lib/site'

import { useSite } from './SiteProvider'

const granted = (v: boolean) => (v ? 'granted' : 'denied')

// Consent Mode v2 : les quatre signaux attendus par Google.
const consentSignals = (c: Consent) => ({
  analytics_storage: granted(c.analytics),
  ad_storage: granted(c.ads),
  ad_user_data: granted(c.ads),
  ad_personalization: granted(c.ads),
})

const addScript = (src: string) => {
  const s = document.createElement('script')
  s.async = true
  s.src = src
  document.head.appendChild(s)
}

// Google Analytics 4 : le script n'est ajouté à la page qu'après accord.
const loadGoogle = (c: Consent) => {
  if (!GA_ID || window.gtag) return
  window.dataLayer = window.dataLayer || []
  // gtag attend l'objet « arguments », pas un tableau.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments)
  }
  window.gtag('consent', 'default', consentSignals({ analytics: false, ads: false }))
  window.gtag('consent', 'update', consentSignals(c))
  window.gtag('js', new Date())
  window.gtag('config', GA_ID)
  addScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`)
}

// Meta Pixel : même règle.
const loadMeta = () => {
  if (!META_PIXEL_ID || window.fbq) return
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args)
    else fbq.queue.push(args)
  } as NonNullable<Window['fbq']> & { queue: unknown[] }
  fbq.push = fbq
  fbq.loaded = true
  fbq.version = '2.0'
  fbq.queue = []
  window.fbq = fbq
  window._fbq = fbq
  fbq('init', META_PIXEL_ID)
  fbq('track', 'PageView')
  addScript('https://connect.facebook.net/en_US/fbevents.js')
}

const apply = (c: Consent) => {
  if (c.analytics) loadGoogle(c)
  else window.gtag?.('consent', 'update', consentSignals(c))
  if (c.ads) loadMeta()
}

// Bandeau cookies : Accepter et Refuser ont le même poids visuel ; Personnaliser ouvre le détail.
// Le lien « Gérer les cookies » du pied de page le rouvre à tout moment.
export function CookieConsent() {
  const { t, locale } = useSite()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [custom, setCustom] = useState(false)
  const [choice, setChoice] = useState<Consent>({ analytics: false, ads: false })
  const loadedAds = useRef(false)
  const firstPath = useRef(true)

  useEffect(() => {
    if (!TRACKING_ENABLED) return
    const saved = readConsent()
    if (saved) {
      // Choix déjà enregistré : on l'applique sans afficher le bandeau.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChoice(saved)
      loadedAds.current = saved.ads
      apply(saved)
    } else {
      setOpen(true)
    }
    const reopen = () => {
      setChoice(readConsent() ?? { analytics: false, ads: false })
      setCustom(true)
      setOpen(true)
    }
    window.addEventListener(CONSENT_EVENT, reopen)
    return () => window.removeEventListener(CONSENT_EVENT, reopen)
  }, [])

  // Navigation sans rechargement : GA4 suit l'historique lui-même, le Pixel non.
  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false
      return
    }
    window.fbq?.('track', 'PageView')
  }, [pathname])

  const save = useCallback((c: Consent) => {
    const before = readConsent()
    writeConsent(c)
    setChoice(c)
    setOpen(false)
    setCustom(false)
    // Retrait d'un accord : les scripts déjà chargés ne se déchargent pas, on recharge la page.
    if ((before?.analytics && !c.analytics) || (before?.ads && !c.ads)) {
      window.location.reload()
      return
    }
    apply(c)
  }, [])

  if (!TRACKING_ENABLED || !open) return null

  return (
    <div className="ck" role="region" aria-label={t.ckTitle}>
      <div className="ck__main">
        <p className="ck__text">
          {t.ckText} <a href={routePath('privacy', locale)}>{t.ckMore}</a>
        </p>
        {custom && (
          <ul className="ck__opts">
            <li>
              <label className="ck__opt">
                <input type="checkbox" checked disabled />
                <span>
                  <strong>{t.ckNeeded}</strong>
                  <span className="ck__desc">{t.ckNeededDesc}</span>
                </span>
              </label>
            </li>
            {GA_ID && (
              <li>
                <label className="ck__opt">
                  <input
                    type="checkbox"
                    checked={choice.analytics}
                    onChange={(e) => setChoice((c) => ({ ...c, analytics: e.target.checked }))}
                  />
                  <span>
                    <strong>{t.ckAudience}</strong>
                    <span className="ck__desc">{t.ckAudienceDesc}</span>
                  </span>
                </label>
              </li>
            )}
            {META_PIXEL_ID && (
              <li>
                <label className="ck__opt">
                  <input
                    type="checkbox"
                    checked={choice.ads}
                    onChange={(e) => setChoice((c) => ({ ...c, ads: e.target.checked }))}
                  />
                  <span>
                    <strong>{t.ckAds}</strong>
                    <span className="ck__desc">{t.ckAdsDesc}</span>
                  </span>
                </label>
              </li>
            )}
          </ul>
        )}
      </div>
      <div className="ck__actions">
        {custom ? (
          <button type="button" className="btn btn--outline" onClick={() => save(choice)}>
            {t.ckSave}
          </button>
        ) : (
          <button type="button" className="btn btn--outline" onClick={() => setCustom(true)}>
            {t.ckCustom}
          </button>
        )}
        <button type="button" className="btn btn--primary" onClick={() => save({ analytics: false, ads: false })}>
          {t.ckRefuse}
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => save({ analytics: Boolean(GA_ID), ads: Boolean(META_PIXEL_ID) })}
        >
          {t.ckAccept}
        </button>
      </div>
    </div>
  )
}

// Lien « Gérer les cookies » du pied de page.
export function CookieManage({ label }: { label: string }) {
  if (!TRACKING_ENABLED) return null
  return (
    <li>
      <button type="button" className="ftr__link" onClick={() => window.dispatchEvent(new Event(CONSENT_EVENT))}>
        {label}
      </button>
    </li>
  )
}
