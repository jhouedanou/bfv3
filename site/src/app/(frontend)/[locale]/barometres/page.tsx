import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { parution } from '@/components/parution'
import { ScrollToTop } from '@/components/ScrollToTop'
import { Footer } from '@/components/sections/Footer'
import { Header } from '@/components/sections/Header'
import { isLocale } from '@/i18n/dictionaries'
import { getPublishedBarometres } from '@/lib/barometres'
import { getSiteContent } from '@/lib/content'
import { JsonLd, breadcrumbJsonLd, buildMetadata } from '@/lib/seo'
import { getSettings } from '@/lib/settings'
import { SITE_URL, localePath, routePath, routePaths } from '@/lib/site'

// Liste de tous les baromètres publiés : une adresse stable que Google peut explorer,
// et qui relie chaque parution au reste du site.
export const revalidate = 3600

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const { t } = await getSiteContent(locale)
  return buildMetadata({
    locale,
    path: routePaths('barometres')[locale],
    paths: routePaths('barometres'),
    title: t.barosMetaTitle,
    description: t.obsSub,
    // Comme les pages de baromètre : contenu publié en français, la page EN pointe vers la page FR.
    canonicalLocale: 'fr',
  })
}

export default async function BarometresPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const [barometres, { emailPublic, telephone, adresse }, { t, links }] = await Promise.all([
    getPublishedBarometres(),
    getSettings(),
    getSiteContent(locale),
  ])
  const frUrl = `${SITE_URL}${routePath('barometres', 'fr')}`

  return (
    <>
      <ScrollToTop />
      <Header alternate={{ fr: routePath('barometres', 'fr'), en: routePath('barometres', 'en') }} />
      <main id="contenu" className="page page--baros">
        <nav className="crumbs" aria-label={t.crumbs}>
          <Link href={`${localePath(locale)}#observatoire`}>← {t.eyObs}</Link>
        </nav>
        <p className="label pink">Big Five Insights</p>
        <h1 className="h2">{t.barosH1}</h1>
        <p className="lead">{t.obsSub}</p>
        {locale === 'en' && <p className="note">{t.frOnly}</p>}
        <ul className="archive__grid baros__list" lang="fr">
          {barometres.map((b) => (
            <li key={b.identifiant}>
              <Link href={routePath('barometres', locale, `/${b.identifiant}`)} className="archive__item">
                <span className="label pink">{parution(b.publishedAt)}</span>
                <span className="archive__title">{b.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer locale={locale} t={t} email={emailPublic} telephone={telephone} adresse={adresse} links={links} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: t.barosH1,
          description: t.obsSub,
          url: frUrl,
          inLanguage: 'fr',
          isPartOf: { '@type': 'WebSite', '@id': `${SITE_URL}/#site`, url: SITE_URL, name: 'BIG FIVE' },
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: barometres.map((b, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: b.title,
              url: `${SITE_URL}${routePath('barometres', 'fr', `/${b.identifiant}`)}`,
            })),
          },
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'BIG FIVE', url: `${SITE_URL}${localePath(locale)}` },
          { name: t.allBaros, url: frUrl },
        ])}
      />
    </>
  )
}
