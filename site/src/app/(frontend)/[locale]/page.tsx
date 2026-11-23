import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { HomeSlider } from '@/components/HomeSlider'
import { Cabinet } from '@/components/sections/Cabinet'
import { Footer } from '@/components/sections/Footer'
import { Header } from '@/components/sections/Header'
import { Hero } from '@/components/sections/Hero'
import { Observatoire } from '@/components/sections/Observatoire'
import { References } from '@/components/sections/References'
import { Solutions } from '@/components/sections/Solutions'
import { isLocale } from '@/i18n/dictionaries'
import { getPublishedBarometres } from '@/lib/barometres'
import { getSiteContent } from '@/lib/content'
import { JsonLd, absoluteImage, buildMetadata, organizationJsonLd } from '@/lib/seo'
import { getSettings } from '@/lib/settings'

export const revalidate = 3600

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const { seo } = await getSiteContent(locale)
  return buildMetadata({
    locale,
    path: '/',
    title: seo.title,
    description: seo.description,
    image: absoluteImage(seo.image),
  })
}

export default async function Home({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const [barometres, { emailPublic }, content] = await Promise.all([
    getPublishedBarometres(),
    getSettings(),
    getSiteContent(locale),
  ])
  const { t, links } = content

  return (
    <>
      <Header alternate={{ fr: '/', en: '/en' }} />
      <main id="contenu">
        {/* Plein écran sur ordinateur (Swiper), défilement normal ailleurs. Le pied de page suit les Références. */}
        <HomeSlider
          slides={[
            { id: 'accueil', content: <Hero covers={content.covers} /> },
            {
              id: 'agence',
              content: <Cabinet t={t} poles={content.poles} personnage={content.personnage} />,
            },
            { id: 'solutions', content: <Solutions /> },
            {
              id: 'observatoire',
              content: (
                <Observatoire
                  locale={locale}
                  t={t}
                  barometres={barometres}
                  laveiye={links.laveiye}
                />
              ),
            },
            {
              id: 'references',
              content: (
                <>
                  <References t={t} clients={content.clients} />
                  <Footer locale={locale} t={t} email={emailPublic} links={links} />
                </>
              ),
            },
          ]}
        />
      </main>
      {/* Données structurées après le contenu : le premier élément de la page reste visible (défilement en haut à la navigation). */}
      <JsonLd
        data={organizationJsonLd({
          locale,
          email: emailPublic,
          description: content.seo.description,
          solutions: content.solutions,
          links,
        })}
      />
    </>
  )
}
