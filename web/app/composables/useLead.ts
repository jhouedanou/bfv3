import type { ContactChoice, ContactSource, Locale } from '~/types'

export type FormState = 'idle' | 'sending' | 'success' | 'error'

// Réponse de POST /api/lead (même forme quel que soit le code HTTP).
export type LeadResult = { ok: true } | { ok: false; error: 'validation'; fields: string[] } | { ok: false; error: 'server' | 'rate' }

type Meta = { locale: Locale; website: string }

// Ce qu'envoient les trois formulaires (le jeton Turnstile et la page sont ajoutés ici).
export type LeadDraft =
  | (Meta & {
      type: 'contact'
      source: ContactSource
      name: string
      email: string
      phone: string
      company: string
      role: string
      sector: string
      choice: ContactChoice
      need: string
      consent: true
      optin: boolean
    })
  | (Meta & { type: 'barometre'; barometre: string; name: string; email: string; company: string; role: string; phone: string; optin: boolean })
  | (Meta & { type: 'notify'; email: string })

export function useLead() {
  const state = ref<FormState>('idle')
  const invalid = ref<string[]>([])
  const token = ref('')
  // Trop d'envois en peu de temps : message dédié, sans inviter à écrire par e-mail.
  const rate = ref(false)

  const send = async (input: LeadDraft) => {
    state.value = 'sending'
    invalid.value = []
    rate.value = false
    try {
      const res = await $fetch<LeadResult>('/api/lead', {
        method: 'POST',
        body: { ...input, turnstile: token.value, page: window.location.href },
        // Les refus (400, 429, 500) portent aussi un LeadResult : on le lit au lieu de lever une erreur.
        ignoreResponseError: true,
      })
      if (res?.ok === true) {
        trackLead(input.type)
        state.value = 'success'
        return
      }
      if (res?.ok === false && res.error === 'validation') {
        invalid.value = res.fields
        state.value = 'idle'
        return
      }
      rate.value = res?.ok === false && res.error === 'rate'
      state.value = 'error'
    } catch {
      state.value = 'error'
    }
  }

  return {
    state,
    invalid,
    rate,
    send,
    onToken: (t: string) => {
      token.value = t
    },
    retry: () => {
      state.value = 'idle'
    },
  }
}
