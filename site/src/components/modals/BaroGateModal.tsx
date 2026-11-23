'use client'

import { useState, type FormEvent } from 'react'

import type { BarometreDTO } from '@/lib/barometres'

import { useSite } from '../SiteProvider'
import { Dialog } from './Dialog'
import { Field, Honeypot } from './Field'
import { Failure, Success } from './FormStates'
import { Turnstile } from './Turnstile'
import { useLead } from './useLead'
import { parution } from '../parution'

export function BaroGateModal({ baro }: { baro: BarometreDTO }) {
  const { locale, t } = useSite()
  const { state, setState, invalid, setInvalid, send, onToken } = useLead()
  const [website, setWebsite] = useState('')
  const err = (name: string) => invalid.includes(name)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const get = (k: string) => String(f.get(k) ?? '')
    const missing = ['name', 'email', 'company', 'role'].filter((k) => !get(k).trim())
    if (missing.length) return setInvalid(missing)
    send({
      type: 'barometre',
      barometre: baro.identifiant,
      locale,
      name: get('name'),
      email: get('email'),
      company: get('company'),
      role: get('role'),
      phone: get('phone'),
      optin: Boolean(f.get('optin')),
      website,
    })
  }

  return (
    <Dialog label={baro.title} variant="form">
      {state === 'success' ? (
        <Success title={t.gateDoneT}>
          <p className="dlg-text">{t.gateDoneP}</p>
        </Success>
      ) : state === 'error' ? (
        <Failure onRetry={() => setState('idle')} />
      ) : (
        <form className="form form--narrow" onSubmit={onSubmit} noValidate>
          <p className="eyebrow">
            {t.baro} · {parution(baro.publishedAt)}
          </p>
          <h2 className="dlg-title">{baro.title}</h2>
          <p className="dlg-text">{t.gateIntro}</p>
          <Field label={t.fullName} name="name" autoComplete="name" placeholder={t.phName} required invalid={err('name')} error={t.invalid} />
          <Field label={t.emailPro} name="email" type="email" autoComplete="email" placeholder={t.phEmail} required invalid={err('email')} error={t.invalid} />
          <Field label={t.company} name="company" autoComplete="organization" placeholder={t.phCompany} required invalid={err('company')} error={t.invalid} />
          <Field label={t.jobTitle} name="role" autoComplete="organization-title" placeholder={t.phRole} required invalid={err('role')} error={t.invalid} />
          <Field label={t.phoneOpt} name="phone" type="tel" autoComplete="tel" placeholder="+225 …" />
          <label className="check">
            <input type="checkbox" name="optin" defaultChecked />
            <span>{t.gateNl}</span>
          </label>
          <Honeypot onChange={setWebsite} />
          <Turnstile onToken={onToken} locale={locale} />
          <button type="submit" className="btn btn--grad btn--block" disabled={state === 'sending'} aria-busy={state === 'sending'}>
            {state === 'sending' ? t.sending : t.gateCta}
          </button>
        </form>
      )}
    </Dialog>
  )
}
