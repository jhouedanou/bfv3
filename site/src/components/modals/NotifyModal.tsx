'use client'

import { useEffect, useState, type FormEvent } from 'react'

import { useSite } from '../SiteProvider'
import { Dialog } from './Dialog'
import { Field, Honeypot } from './Field'
import { Failure, Success } from './FormStates'
import { Turnstile } from './Turnstile'
import { useLead } from './useLead'

export function NotifyModal() {
  const { locale, t, setNotified } = useSite()
  const { state, setState, invalid, setInvalid, send, onToken } = useLead()
  const [website, setWebsite] = useState('')

  useEffect(() => {
    if (state === 'success') setNotified(true)
  }, [state, setNotified])

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = String(new FormData(e.currentTarget).get('email') ?? '').trim()
    if (!email) return setInvalid(['email'])
    send({ type: 'notify', email, locale, website })
  }

  return (
    <Dialog label={t.notifyCta} variant="form">
      {state === 'success' ? (
        <Success title={t.notifyTitle}>
          <p className="dlg-text">{t.nlDone}</p>
        </Success>
      ) : state === 'error' ? (
        <Failure onRetry={() => setState('idle')} />
      ) : (
        <form className="form form--narrow" onSubmit={onSubmit} noValidate>
          <p className="eyebrow">Big Five Insights</p>
          <h2 className="dlg-title">{t.notifyTitle}</h2>
          <p className="dlg-text">{t.notifyDesc}</p>
          <Field label={t.emailPro} name="email" type="email" autoComplete="email" placeholder={t.phEmail} required invalid={invalid.includes('email')} error={t.invalid} />
          <Honeypot onChange={setWebsite} />
          <Turnstile onToken={onToken} locale={locale} />
          <button type="submit" className="btn btn--primary btn--block" disabled={state === 'sending'} aria-busy={state === 'sending'}>
            {state === 'sending' ? t.sending : t.notifyCta}
          </button>
        </form>
      )}
    </Dialog>
  )
}
