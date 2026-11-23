'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

// Passage d'une page à l'autre : voile aux couleurs du site et logo BIG FIVE.
// Il apparaît au clic sur un lien interne vers une autre page, et s'efface quand la nouvelle page est là.
// Ignoré : liens qui ouvrent une fiche (data-no-veil), ancres de la même page,
// nouvel onglet, touches de modification, réglage « réduire les animations ».
const MIN_VISIBLE = 450 // ms : le logo a le temps d'apparaître
const SAFETY = 8000 // ms : si la navigation n'aboutit pas, le voile s'efface quand même

export function PageTransition() {
  const pathname = usePathname()
  const [on, setOn] = useState(false)
  const startedAt = useRef(0)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      // data-no-veil : liens qui ouvrent une fenêtre au lieu de changer de page (pavés, cercles).
      // On ne peut pas se fier à defaultPrevented : <Link> de Next l'active pour toute navigation.
      if (!a || a.target === '_blank' || a.hasAttribute('download') || a.closest('[data-no-veil]'))
        return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return
      if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api')) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      startedAt.current = performance.now()
      setOn(true)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  // Nouvelle page affichée : on laisse au logo le temps d'apparaître, puis le voile s'efface.
  useEffect(() => {
    if (!on) return
    const wait = Math.max(0, MIN_VISIBLE - (performance.now() - startedAt.current))
    const id = window.setTimeout(() => setOn(false), wait)
    return () => window.clearTimeout(id)
    // Seul le changement d'adresse déclenche la fin du voile.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (!on) return
    const id = window.setTimeout(() => setOn(false), SAFETY)
    return () => window.clearTimeout(id)
  }, [on])

  return (
    <div className={`page-veil${on ? ' is-on' : ''}`} aria-hidden="true">
      <Image
        src="/images/logo-bigfive.png"
        alt=""
        width={1724}
        height={1286}
        sizes="180px"
        className="page-veil__logo"
      />
    </div>
  )
}
