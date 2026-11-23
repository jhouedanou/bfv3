'use client'

import { useEffect, useRef, type ReactNode } from 'react'

import { useSite } from '../SiteProvider'

type Props = {
  label: string
  variant: 'form' | 'solution' | 'cover'
  children: ReactNode
}

// Fenêtre modale accessible : Échap ferme, clic sur le fond ferme, focus piégé, défilement bloqué.
export function Dialog({ label, variant, children }: Props) {
  const { close, t } = useSite()
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    // Formulaire : focus sur le premier champ. Sinon sur le panneau, pour ne pas faire défiler la fiche.
    const field = panel.current?.querySelector<HTMLElement>('input:not([tabindex="-1"]), select, textarea')
    if (field) field.focus()
    else panel.current?.focus({ preventScroll: true })

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key !== 'Tab' || !panel.current) return
      const items = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      previous?.focus?.({ preventScroll: true })
    }
  }, [close])

  return (
    <div className={`dlg dlg--${variant}`} onClick={close}>
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className="dlg-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="dlg-close" aria-label={t.close} onClick={close}>
          <span aria-hidden="true">✕</span>
        </button>
        {children}
      </div>
    </div>
  )
}
