'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string
      remove: (id: string) => void
    }
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
const SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

let loading: Promise<void> | null = null
const load = () =>
  (loading ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = SRC
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('turnstile'))
    document.head.appendChild(s)
  }))

// Protection anti-spam sans gêne (CDC § 4.5) : mode « managed », invisible dans la plupart des cas.
export function Turnstile({ onToken, locale }: { onToken: (t: string) => void; locale: 'fr' | 'en' }) {
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!SITE_KEY || !box.current) return
    let id: string | undefined
    let cancelled = false
    load()
      .then(() => {
        if (cancelled || !box.current || !window.turnstile) return
        id = window.turnstile.render(box.current, {
          sitekey: SITE_KEY,
          language: locale,
          theme: 'dark',
          appearance: 'interaction-only',
          callback: onToken,
          'expired-callback': () => onToken(''),
        })
      })
      .catch(() => onToken(''))
    return () => {
      cancelled = true
      if (id) window.turnstile?.remove(id)
    }
  }, [onToken, locale])

  if (!SITE_KEY) return null
  return <div ref={box} className="turnstile" />
}
