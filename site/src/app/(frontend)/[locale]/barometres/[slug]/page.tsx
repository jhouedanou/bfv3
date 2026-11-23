import type { Metadata } from 'next'
import { draftMode, headers } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BaroCard } from '@/components/sections/BaroCard'
import { Footer } from '@/components/sections/Footer'
import { ScrollToTop } from '@/components/ScrollToTop'
import { Header } from '@/components/sections/Header'
import { isLocale, locales } from '@/i18n/dictionaries'
import { getBarometre, getDraftBarometre, getPublishedBarometres } from '@/lib/barometres'
import { getSiteContent } from '@/lib/content'
import { JsonLd, breadcrumbJsonLd, buildMetadata } from '@/lib/seo'
import { getSettings } from '@/lib/settings'
import { SITE_URL, localePath, routePath, routePaths } from '@/lib/site'

export const revalidate = 3600
// Un baromètre publié après le build doit être servi à la demande.
export const dynamicParams = true

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  const baros = await getPublishedBarometres()
  return locales.flatMap((locale) => baros.map((b) => ({ locale, slug: b.identifiant })))
}

async function load(slug: string) {
  const { isEnabled } = await draftMode()
  if (isEnabled) return getDraftBarometre(slug, await headers())
  return getBarometre(slug)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const baro = await load(slug)
  if (!baro) return {}
  const description =
    `${baro.kpis.map((k) => `${k.value} ${k.label.toLowerCase()}`).join(' · ')}. ${baro.takeaway}`.slice(
      0,
      160,
    )
  return buildMetadata({
    locale,
    path: routePaths('barometres', `/${slug}`)[locale],
    paths: routePaths('barometres', `/${slug}`),
    title: baro.metaTitle || `${baro.title} | BIG FIVE`,
    description,
    // Contenu publié en français uniquement (CDC § 1) : la page EN pointe vers la page FR.
    canonicalLocale: 'fr',
    type: 'article',
    image: baro.cover
      ? {
          url: `${SITE_URL}${baro.cover.url}`,
          width: baro.cover.width,
          height: baro.cover.height,
          alt: baro.cover.alt,
        }
      : undefined,
  })
}

export default async function BarometrePage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const baro = await load(slug)
  if (!baro) notFound()
  const [{ emailPublic, telephone, adresse }, { t, links }] = await Promise.all([getSettings(), getSiteContent(locale)])
  const frUrl = `${SITE_URL}${routePath('barometres', 'fr', `/${slug}`)}`
  const listPath = routePath('barometres', locale)

  return (
    <>
      <ScrollToTop />
      <Header
        alternate={{
          fr: routePath('barometres', 'fr', `/${slug}`),
          en: routePath('barometres', 'en', `/${slug}`),
        }}
      />
      <main id="contenu" className="page page--baro">
        <nav className="crumbs" aria-label={t.crumbs}>
          <Link href={listPath}>← {t.allBaros}</Link>
        </nav>
        {locale === 'en' && <p className="note">{t.frOnly}</p>}
        <BaroCard baro={baro} headingLevel={1} eyebrow={t.baroOf} />
      </main>
      <Footer locale={locale} t={t} email={emailPublic} telephone={telephone} adresse={adresse} links={links} />
      {/* Données structurées après le contenu : le premier élément de la page reste visible (défilement en haut à la navigation). */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Report',
          name: baro.title,
          inLanguage: 'fr',
          datePublished: baro.publishedAt,
          url: frUrl,
          mainEntityOfPage: frUrl,
          image: baro.cover ? `${SITE_URL}${baro.cover.url}` : undefined,
          abstract: baro.takeaway,
          author: { '@type': 'Organization', name: 'BIG FIVE', url: SITE_URL },
          publisher: { '@type': 'Organization', name: 'BIG FIVE', url: SITE_URL },
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'BIG FIVE', url: `${SITE_URL}${localePath(locale)}` },
          { name: t.allBaros, url: `${SITE_URL}${listPath}` },
          { name: baro.title, url: frUrl },
        ])}
      />
    </>
  )
}
