import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/site'

// Hors production (pré-production Vercel), tout est fermé aux moteurs.
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') {
    return { rules: { userAgent: '*', disallow: '/' } }
  }
  return {
    // Les images de Payload passent par /api/media/ : Google Images et l'aperçu LinkedIn (CDC § 6.3) doivent y accéder.
    rules: { userAgent: '*', allow: ['/', '/api/media/'], disallow: ['/admin', '/api/'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
