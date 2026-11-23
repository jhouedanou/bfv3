import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

import { getPayloadClient } from '@/lib/payload'

// Aperçu d'un baromètre en brouillon : réservé aux utilisateurs connectés à l'admin.
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug') ?? ''
  if (!/^[a-z0-9-]+$/.test(slug)) return new Response('Identifiant invalide', { status: 400 })

  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) return new Response('Connexion requise', { status: 401 })

  ;(await draftMode()).enable()
  redirect(`/observatoire/${slug}`)
}
