import type { Redirect } from 'next/dist/lib/load-custom-routes'

// Redirections 301 depuis le site actuel (Nuxt). Routes relevées dans ses bundles le 12/10/2026 :
// « / » et « /en » gardent leur adresse ; seules les pages de remerciement disparaissent.
// Le site actuel répond 200 sur toute adresse inconnue : aucune autre URL n'est indexée à ce jour.
// Ajouter ici les adresses de l'export Search Console (docs/search-console-pages.csv) quand il sera fourni.
export const redirects: Redirect[] = [
  { source: '/thank-you', destination: '/', statusCode: 301 },
  { source: '/en/thank-you', destination: '/en', statusCode: 301 },
  { source: '/index.html', destination: '/', statusCode: 301 },
  // Première pré-production : les baromètres étaient sous /observatoire.
  { source: '/observatoire', destination: '/barometres', statusCode: 301 },
  { source: '/observatoire/:slug', destination: '/barometres/:slug', statusCode: 301 },
  { source: '/en/observatoire', destination: '/en/barometers', statusCode: 301 },
  { source: '/en/observatoire/:slug', destination: '/en/barometers/:slug', statusCode: 301 },
]
