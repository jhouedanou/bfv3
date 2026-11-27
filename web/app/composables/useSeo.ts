import type { Img, Locale, SolutionDTO, Links } from '~/types'

export const useSiteUrl = () => useRuntimeConfig().public.siteUrl as string

// Adresse absolue. Accueil FR : https://bigfive.solutions, sans « / » final, comme le sitemap.
export const absUrl = (siteUrl: string, path: string) => (path === '/' ? siteUrl : `${siteUrl}${path}`)

type SeoArgs = {
  locale: Locale
  // Adresses publiques complètes des deux langues (ex. { fr: '/solutions/x', en: '/en/solutions/y' }).
  paths: Record<Locale, string>
  title: string
  description: string
  // Baromètres : contenu en français, canonical vers la version FR, pas de hreflang.
  canonicalLocale?: Locale
  image?: Img | null
  type?: 'website' | 'article'
  // Offres dont le texte n'est pas encore validé.
  noindex?: boolean
}

// Title, description, canonical, hreflang, Open Graph et Twitter d'une page.
export const usePageSeo = (args: () => SeoArgs) => {
  const siteUrl = useSiteUrl()
  const indexable = __INDEXABLE__
  const content = useSiteContent()

  const a = computed(args)
  const canonical = computed(() => absUrl(siteUrl, a.value.paths[a.value.canonicalLocale ?? a.value.locale]))
  const image = computed(() => {
    const img = a.value.image
    if (img) return { url: `${siteUrl}${img.url}`, width: img.width, height: img.height, alt: img.alt || 'BIG FIVE' }
    const og = content.value.settings.ogImage || '/images/og-image.png'
    return { url: `${siteUrl}${og}`, width: 1200, height: 630, alt: 'BIG FIVE' }
  })

  useHead(() => ({
    link: [
      { rel: 'canonical', href: canonical.value },
      ...(a.value.canonicalLocale
        ? []
        : [
            { rel: 'alternate', hreflang: 'fr', href: absUrl(siteUrl, a.value.paths.fr) },
            { rel: 'alternate', hreflang: 'en', href: absUrl(siteUrl, a.value.paths.en) },
            { rel: 'alternate', hreflang: 'x-default', href: absUrl(siteUrl, a.value.paths.fr) },
          ]),
    ],
  }))

  useSeoMeta({
    title: () => a.value.title,
    description: () => a.value.description,
    robots: () => (!indexable ? 'noindex, nofollow' : a.value.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1'),
    ogType: () => a.value.type ?? 'website',
    ogUrl: () => absUrl(siteUrl, a.value.paths[a.value.locale]),
    ogSiteName: 'BIG FIVE',
    ogTitle: () => a.value.title,
    ogDescription: () => a.value.description,
    ogLocale: () => (a.value.locale === 'fr' ? 'fr_FR' : 'en_US'),
    ogLocaleAlternate: () => (a.value.locale === 'fr' ? ['en_US'] : ['fr_FR']),
    ogImage: () => image.value.url,
    ogImageWidth: () => image.value.width,
    ogImageHeight: () => image.value.height,
    ogImageAlt: () => image.value.alt,
    twitterCard: 'summary_large_image',
    twitterTitle: () => a.value.title,
    twitterDescription: () => a.value.description,
    twitterImage: () => image.value.url,
  })
}

// Données structurées, placées en fin de page (le premier élément de la page reste le contenu).
export const useJsonLd = (data: () => (object | null | undefined)[]) => {
  useHead(() => ({
    script: data()
      .filter(Boolean)
      .map((d) => ({
        type: 'application/ld+json',
        innerHTML: JSON.stringify(d).replace(/</g, '\\u003c'),
        tagPosition: 'bodyClose' as const,
      })),
  }))
}

// ── Schémas schema.org ───────────────────────────────────────────────────────

const AREA = [
  { '@type': 'Country', name: "Côte d'Ivoire" },
  { '@type': 'Place', name: 'Afrique francophone' },
]

export const providerOf = (siteUrl: string) => ({
  '@type': 'ProfessionalService',
  '@id': `${siteUrl}/#organisation`,
  name: 'BIG FIVE',
  url: siteUrl,
})

// Accueil : le cabinet et son catalogue (4 solutions, chacune avec ses offres).
export const organizationJsonLd = (o: {
  siteUrl: string
  locale: Locale
  email: string
  telephone?: string
  adresse?: string
  carte?: string
  horaires?: string
  description: string
  solutions: SolutionDTO[]
  links: Links
}) => ({
  '@context': 'https://schema.org',
  ...providerOf(o.siteUrl),
  description: o.description,
  logo: `${o.siteUrl}/images/logo-bigfive.png`,
  image: `${o.siteUrl}/images/logo-bigfive.png`,
  email: o.email,
  ...(o.telephone ? { telephone: o.telephone } : {}),
  address: {
    '@type': 'PostalAddress',
    ...(o.adresse ? { streetAddress: o.adresse.replace(/\s*\n\s*/g, ', ') } : {}),
    addressLocality: 'Abidjan',
    addressCountry: 'CI',
  },
  ...(o.carte ? { hasMap: o.carte } : {}),
  ...(o.horaires ? { openingHours: o.horaires } : {}),
  areaServed: AREA,
  knowsLanguage: ['fr', 'en'],
  sameAs: o.links.socials.map((s) => s.url),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: o.locale === 'fr' ? 'Solutions BIG FIVE' : 'BIG FIVE solutions',
    itemListElement: o.solutions.map((s) => ({
      '@type': 'OfferCatalog',
      name: s.name,
      url: `${o.siteUrl}${solutionPath(o.locale, s.slug)}`,
      itemListElement: s.offres.map((x) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: x.title, url: `${o.siteUrl}${offrePath(o.locale, s.slug, x.slug)}` },
      })),
    })),
  },
})

export const websiteJsonLd = (siteUrl: string, locale: Locale) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#site`,
  url: siteUrl,
  name: 'BIG FIVE',
  inLanguage: locale,
  publisher: { '@id': `${siteUrl}/#organisation` },
})

export const serviceJsonLd = (siteUrl: string, s: { name: string; description: string; url: string; category: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  ...s,
  provider: providerOf(siteUrl),
  areaServed: AREA,
})

export const faqJsonLd = (faq: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
})

export const breadcrumbJsonLd = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
})
