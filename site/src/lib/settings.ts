import 'server-only'

import { cache } from 'react'

import { getPayloadClient } from './payload'

const FALLBACK = 'contact@bigfiveabidjan.com'

const fetchSettings = async () => {
  try {
    const payload = await getPayloadClient()
    const p = await payload.findGlobal({ slug: 'parametres', depth: 0 })
    return { emailReception: p.emailReception || FALLBACK, emailPublic: p.emailPublic || FALLBACK }
  } catch {
    return { emailReception: FALLBACK, emailPublic: FALLBACK }
  }
}

export const getSettings = cache(fetchSettings)
