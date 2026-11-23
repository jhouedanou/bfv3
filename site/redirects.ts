import type { Redirect } from 'next/dist/lib/load-custom-routes'

// Redirections 301 depuis le site actuel (Nuxt). Routes relevées dans ses bundles le 12/10/2026 :
// « / » et « /en » gardent leur adresse ; seules les pages de remerciement disparaissent.
// Le site actuel répond 200 sur toute adresse inconnue : aucune autre URL n'est indexée à ce jour.
export const redirects: Redirect[] = [
  { source: '/thank-you', destination: '/', statusCode: 301 },
  { source: '/en/thank-you', destination: '/en', statusCode: 301 },
]
