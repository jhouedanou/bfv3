// Hors production (pré-production Vercel), tout est fermé aux moteurs.
export default defineEventHandler((event) => {
  const { siteUrl } = useRuntimeConfig(event).public
  const indexable = __INDEXABLE__
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  if (!indexable) return 'User-agent: *\nDisallow: /\n'
  return `User-agent: *\nAllow: /\nDisallow: /_studio\nDisallow: /api/\nDisallow: /__nuxt_content/\n\nSitemap: ${siteUrl}/sitemap.xml\n`
})
