'use client'

import type { ReactNode } from 'react'

import { useSite } from '../SiteProvider'

export function Success({ title, children, actions }: { title: string; children?: ReactNode; actions?: ReactNode }) {
  const { t, close } = useSite()
  return (
    <div className="state" role="status">
      <div className="state__icon" aria-hidden="true">
        ✓
      </div>
      <h2 className="dlg-title">{title}</h2>
      {children}
      <div className="state__actions">
        <button type="button" className="btn btn--grad" onClick={close}>
          {t.closeBtn}
        </button>
        {actions}
      </div>
    </div>
  )
}

export function Failure({ onRetry }: { onRetry: () => void }) {
  const { t, emailPublic } = useSite()
  return (
    <div className="state" role="alert">
      <div className="state__icon state__icon--err" aria-hidden="true">
        !
      </div>
      <h2 className="dlg-title">{t.errT}</h2>
      <p className="dlg-text">
        {t.errP} <a href={`mailto:${emailPublic}`}>{emailPublic}</a>.
      </p>
      <div className="state__actions">
        <button type="button" className="btn btn--grad" onClick={onRetry}>
          {t.retryL}
        </button>
      </div>
    </div>
  )
}
