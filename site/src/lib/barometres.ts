import 'server-only'

import { cache } from 'react'

import { getPayloadClient } from './payload'

// Ce qui part vers le navigateur. Jamais de « ressourceInterne » (CDC § 6.2).
export type BarometreDTO = {
  identifiant: string
  publishedAt: string
  title: string
  metaTitle: string
  scope: string[]
  kpis: { value: string; label: string; explanation: string }[]
  takeaway: string
  cover: { url: string; alt: string; width: number; height: number } | null
}

const SELECT = {
  identifiant: true,
  publishedAt: true,
  title: true,
  metaTitle: true,
  scope: true,
  kpis: true,
  takeaway: true,
  cover: true,
} as const

type Raw = {
  identifiant: string
  publishedAt: string
  title: string
  metaTitle?: string | null
  scope?: { item: string }[] | null
  kpis?: { value: string; label: string; explanation: string }[] | null
  takeaway: string
  cover?: { url?: string | null; alt?: string | null; width?: number | null; height?: number | null } | number | null
}

// Payload renvoie une URL absolue (serverURL) : on garde le chemin pour next/image.
const relative = (url: string) => (url.startsWith('http') ? new URL(url).pathname : url)

const toDTO = (d: Raw): BarometreDTO => ({
  identifiant: d.identifiant,
  publishedAt: d.publishedAt,
  title: d.title,
  metaTitle: d.metaTitle ?? '',
  scope: (d.scope ?? []).map((s) => s.item),
  kpis: (d.kpis ?? []).map(({ value, label, explanation }) => ({ value, label, explanation })),
  takeaway: d.takeaway,
  cover:
    d.cover && typeof d.cover === 'object' && d.cover.url
      ? { url: relative(d.cover.url), alt: d.cover.alt ?? d.title, width: d.cover.width ?? 1121, height: d.cover.height ?? 1403 }
      : null,
})

// Lecture publique : overrideAccess à false pour appliquer les droits (publiés seulement, champ interne masqué).
const fetchPublished = async (): Promise<BarometreDTO[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'barometres',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 200,
    depth: 1,
    select: SELECT,
    overrideAccess: false,
  })
  return (res.docs as unknown as Raw[]).map(toDTO)
}

export const getPublishedBarometres = cache(fetchPublished)

export const getBarometre = async (identifiant: string) =>
  (await getPublishedBarometres()).find((b) => b.identifiant === identifiant) ?? null

// Aperçu (brouillon) : réservé aux utilisateurs connectés à l'admin.
export const getDraftBarometre = async (identifiant: string, headers: Headers) => {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers })
  if (!user) return null
  const res = await payload.find({
    collection: 'barometres',
    where: { identifiant: { equals: identifiant } },
    draft: true,
    limit: 1,
    depth: 1,
    select: SELECT,
    user,
    overrideAccess: false,
  })
  const doc = res.docs[0] as unknown as Raw | undefined
  return doc ? toDTO(doc) : null
}
