import type { Metadata } from 'next'

import type { Locale } from '@/i18n/dictionaries'

import type { Img, Links, SolutionDTO } from './content-types'
import { SITE_URL, localePath } from './site'

// Image de partage par défaut (1200 × 630), en attendant la nouvelle image fournie par BIG FIVE.
const OG_IMAGE = { url: `${SITE_URL}/images/og-image.png`, width: 1200, height: 630, alt: 'BIG FIVE' }

type Args = {
  locale: Locale
  path: string // chemin sans préfixe de langue, ex. « / » ou « /barometres/x »
  paths?: Record<Locale, string> // quand l'adresse diffère selon la langue (solutions, offres)
  title: string
  description: string
  canonicalLocale?: Locale // baromètres : contenu FR, canonical vers la version FR
  image?: { url: string; width?: number; height?: number; alt?: string } | null
  type?: 'website' | 'article'
  noindex?: boolean // offres dont le texte n'est pas encore validé
}

export const absoluteImage = (img: Img | null | undefined) =>
  img ? { url: `${SITE_URL}${img.url}`, width: img.width, height: img.height, alt: img.alt || 'BIG FIVE' } : undefined

export function buildMetadata({ locale, path, paths, title, description, canonicalLocale, image, type = 'website', noindex }: Args): Metadata {
  const pathOf = (l: Locale) => paths?.[l] ?? path
  const canonical = `${SITE_URL}${localePath(canonicalLocale ?? locale, pathOf(canonicalLocale ?? locale))}`
  const img = image ?? OG_IMAGE
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical,
      languages: canonicalLocale
        ? undefined
        : {
            fr: `${SITE_URL}${localePath('fr', pathOf('fr'))}`,
            en: `${SITE_URL}${localePath('en', pathOf('en'))}`,
            'x-default': `${SITE_URL}${localePath('fr', pathOf('fr'))}`,
          },
    },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type,
      url: `${SITE_URL}${localePath(locale, pathOf(locale))}`,
      siteName: 'BIG FIVE',
      title,
      description,
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      alternateLocale: locale === 'fr' ? ['en_US'] : ['fr_FR'],
      images: [img],
    },
    twitter: { card: 'summary_large_image', title, description, images: [img.url] },
  }
}

const PROVIDER = { '@type': 'ProfessionalService', '@id': `${SITE_URL}/#organisation`, name: 'BIG FIVE', url: SITE_URL }
const AREA = [
  { '@type': 'Country', name: "Côte d'Ivoire" },
  { '@type': 'Place', name: 'Afrique francophone' },
]

// Accueil : le cabinet et son catalogue (4 solutions, chacune avec ses offres).
export const organizationJsonLd = ({
  locale,
  email,
  telephone,
  adresse,
  description,
  solutions,
  links,
}: {
  locale: Locale
  email: string
  telephone?: string
  adresse?: string
  description: string
  solutions: SolutionDTO[]
  links: Links
}) => ({
  '@context': 'https://schema.org',
  ...PROVIDER,
  description,
  logo: `${SITE_URL}/images/logo-bigfive.png`,
  image: `${SITE_URL}/images/logo-bigfive.png`,
  email,
  // Téléphone et adresse postale : seulement s'ils sont renseignés dans Admin → Paramètres.
  ...(telephone ? { telephone } : {}),
  address: {
    '@type': 'PostalAddress',
    ...(adresse ? { streetAddress: adresse } : {}),
    addressLocality: 'Abidjan',
    addressCountry: 'CI',
  },
  areaServed: AREA,
  sameAs: links.socials.map((s) => s.url),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: locale === 'fr' ? 'Solutions BIG FIVE' : 'BIG FIVE solutions',
    itemListElement: solutions.map((s) => ({
      '@type': 'OfferCatalog',
      name: s.name,
      url: `${SITE_URL}${localePath(locale, `/solutions/${s.slug}`)}`,
      itemListElement: s.offres.map((o) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: o.title,
          url: `${SITE_URL}${localePath(locale, `/solutions/${s.slug}/${o.slug}`)}`,
        },
      })),
    })),
  },
})

// Accueil : le site lui-même, relié au cabinet.
export const websiteJsonLd = (locale: Locale) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#site`,
  url: SITE_URL,
  name: 'BIG FIVE',
  inLanguage: locale,
  publisher: { '@id': PROVIDER['@id'] },
})

export const serviceJsonLd = ({ name, description, url, category }: { name: string; description: string; url: string; category: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  description,
  url,
  category,
  provider: PROVIDER,
  areaServed: AREA,
})

export const faqJsonLd = (faq: { question: string; reponse: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.reponse } })),
})

export const breadcrumbJsonLd = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
})

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
}
