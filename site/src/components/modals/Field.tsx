'use client'

import type { InputHTMLAttributes, ReactNode } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & { label: ReactNode; name: string; invalid?: boolean; error?: string }

export function Field({ label, invalid, error, ...input }: Props) {
  const id = `f-${input.name}`
  return (
    <label className="field" htmlFor={id}>
      <span className="field__label">{label}</span>
      <input id={id} className="field__input" aria-invalid={invalid || undefined} aria-describedby={invalid ? `${id}-err` : undefined} {...input} />
      {invalid && error && (
        <span id={`${id}-err`} className="field__error">
          {error}
        </span>
      )}
    </label>
  )
}

// Champ piège invisible pour les robots (CDC § 4.5).
export function Honeypot({ onChange }: { onChange: (v: string) => void }) {
  return (
    <div className="hp" aria-hidden="true">
      <label>
        Site web
        <input type="text" name="website" tabIndex={-1} autoComplete="off" onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  )
}
