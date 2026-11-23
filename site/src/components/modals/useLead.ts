'use client'

import { useCallback, useState } from 'react'

import { submitLead } from '@/actions/submitLead'
import type { LeadInput } from '@/lib/leads'

export type FormState = 'idle' | 'sending' | 'success' | 'error'

// Omit distributif : garde la distinction entre les trois formulaires.
type LeadDraft = LeadInput extends infer T ? (T extends LeadInput ? Omit<T, 'turnstile' | 'page'> : never) : never

export function useLead() {
  const [state, setState] = useState<FormState>('idle')
  const [invalid, setInvalid] = useState<string[]>([])
  const [token, setToken] = useState('')

  const send = useCallback(
    async (input: LeadDraft) => {
      setState('sending')
      setInvalid([])
      try {
        const res = await submitLead({ ...input, turnstile: token, page: window.location.href })
        if (res.ok) return setState('success')
        if (res.error === 'validation') {
          setInvalid(res.fields)
          return setState('idle')
        }
        setState('error')
      } catch {
        setState('error')
      }
    },
    [token],
  )

  return { state, setState, invalid, setInvalid, send, onToken: setToken }
}
