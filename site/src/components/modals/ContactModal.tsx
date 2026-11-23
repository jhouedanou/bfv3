'use client'

import { useState, type FormEvent } from 'react'

import { localePath, routePath } from '@/lib/site'

import { useSite, type ContactChoice, type ContactSource } from '../SiteProvider'
import { Dialog } from './Dialog'
import { Field, Honeypot } from './Field'
import { Failure, Success } from './FormStates'
import { Turnstile } from './Turnstile'
import { useLead } from './useLead'

export function ContactModal({ source, initialChoice }: { source: ContactSource; initialChoice: ContactChoice }) {
  const { locale, t, solutions, close } = useSite()
  const { state, setState, invalid, setInvalid, send, onToken, rate } = useLead()
  const [choice, setChoice] = useState<ContactChoice>(initialChoice)
  const [website, setWebsite] = useState('')

  const options: { v: ContactChoice; l: string }[] = [
    ...solutions.map((s) => ({ v: s.key as ContactChoice, l: s.name })),
    { v: 'multi', l: t.multi },
    { v: 'unknown', l: t.unknown },
  ]
  const choiceLabel = options.find((o) => o.v === choice)?.l ?? ''
  const err = (name: string) => invalid.includes(name)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const get = (k: string) => String(f.get(k) ?? '')
    const missing = ['name', 'email', 'phone', 'company', 'role', 'need'].filter((k) => !get(k).trim())
    if (!f.get('consent')) missing.push('consent')
    if (missing.length) return setInvalid(missing)
    send({
      type: 'contact',
      source,
      locale,
      name: get('name'),
      email: get('email'),
      phone: get('phone'),
      company: get('company'),
      role: get('role'),
      sector: get('sector'),
      choice,
      need: get('need'),
      consent: true,
      optin: Boolean(f.get('optin')),
      website,
    })
  }

  return (
    <Dialog label={t.contactTitle} variant="form">
      {state === 'success' ? (
        <Success
          title={t.okT}
          actions={
            <a className="btn btn--outline" href={`${localePath(locale)}#observatoire`} onClick={close}>
              {t.seeBaro}
            </a>
          }
        >
          <p className="dlg-text">{t.okP}</p>
          <p className="dlg-text dlg-text--muted">
            {t.okRec} {choiceLabel}.
          </p>
        </Success>
      ) : state === 'error' ? (
        <Failure onRetry={() => setState('idle')} rate={rate} />
      ) : (
        <form className="form" onSubmit={onSubmit} noValidate>
          <h2 className="dlg-title">{t.contactTitle}</h2>
          <p className="dlg-intro">{t.cIntro1}</p>
          <p className="dlg-text">{t.cIntro2}</p>
          <p className="dlg-meta">
            {t.required} · {t.origin} {t.sources[source]}
          </p>
          <div className="form__grid">
            <Field label={t.fullName} name="name" autoComplete="name" placeholder={t.phName} required invalid={err('name')} error={t.invalid} />
            <Field label={t.emailPro} name="email" type="email" autoComplete="email" placeholder={t.phEmail} required invalid={err('email')} error={t.invalid} />
            <Field label={t.phone} name="phone" type="tel" autoComplete="tel" placeholder="+225 …" required invalid={err('phone')} error={t.invalid} />
            <Field label={t.company} name="company" autoComplete="organization" placeholder={t.phCompany} required invalid={err('company')} error={t.invalid} />
            <Field label={t.role} name="role" autoComplete="organization-title" placeholder={t.phRole} required invalid={err('role')} error={t.invalid} />
            <Field label={t.sector} name="sector" placeholder={t.phSector} />
          </div>
          <label className="field" htmlFor="f-choice">
            <span className="field__label">{t.which}</span>
            <select id="f-choice" className="field__input" value={choice} onChange={(e) => setChoice(e.target.value as ContactChoice)}>
              {options.map((o) => (
                <option key={o.v} value={o.v}>
                  {o.l}
                </option>
              ))}
            </select>
          </label>
          <label className="field" htmlFor="f-need">
            <span className="field__label">{t.need}</span>
            <textarea id="f-need" name="need" rows={4} className="field__input" placeholder={t.phNeed} required aria-invalid={err('need') || undefined} />
            {err('need') && <span className="field__error">{t.invalid}</span>}
          </label>
          <label className="check">
            <input type="checkbox" name="consent" required aria-invalid={err('consent') || undefined} />
            <span>
              {t.consent}{' '}
              <a href={routePath('privacy', locale)} target="_blank" rel="noopener">
                {t.privacy}
              </a>
            </span>
          </label>
          {err('consent') && <p className="field__error">{t.invalid}</p>}
          <label className="check check--muted">
            <input type="checkbox" name="optin" />
            <span>{t.optin}</span>
          </label>
          <Honeypot onChange={setWebsite} />
          <Turnstile onToken={onToken} locale={locale} />
          <button type="submit" className="btn btn--grad btn--block" disabled={state === 'sending'} aria-busy={state === 'sending'}>
            {state === 'sending' ? t.sending : t.submit}
          </button>
        </form>
      )}
    </Dialog>
  )
}
