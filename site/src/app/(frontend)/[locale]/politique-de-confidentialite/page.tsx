import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Footer } from '@/components/sections/Footer'
import { ScrollToTop } from '@/components/ScrollToTop'
import { Header } from '@/components/sections/Header'
import { isLocale } from '@/i18n/dictionaries'
import { getSiteContent } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { getSettings } from '@/lib/settings'
import { routePath, routePaths } from '@/lib/site'

type Props = { params: Promise<{ locale: string }> }


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const { t } = await getSiteContent(locale)
  return buildMetadata({
    locale,
    path: routePaths('privacy')[locale],
    paths: routePaths('privacy'),
    title: `${t.privacy} | BIG FIVE`,
    description: t.privacyIntro.slice(0, 158),
  })
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const [{ emailPublic, telephone, adresse }, { t, privacy, links }] = await Promise.all([
    getSettings(),
    getSiteContent(locale),
  ])

  return (
    <>
      <ScrollToTop />
      <Header alternate={{ fr: routePath('privacy', 'fr'), en: routePath('privacy', 'en') }} />
      <main id="contenu" className="page page--text">
        <p className="label pink">BIG FIVE</p>
        <h1 className="h2">{t.privacy}</h1>
        <p className="meta">{t.privacyUpdated}</p>
        <p className="body-text">{t.privacyIntro}</p>
        {privacy.map((p, i) => (
          <section key={p.title} className="privacy__sec">
            <h2 className="privacy__title">
              <span className="pink">{String(i + 1).padStart(2, '0')}</span> {p.title}
            </h2>
            {p.body.map((para) => (
              <p key={para.slice(0, 40)} className="body-text">
                {para}
              </p>
            ))}
          </section>
        ))}
        <p className="privacy__contact">
          {t.privacyContact} <a href={`mailto:${emailPublic}`}>{emailPublic}</a>
        </p>
      </main>
      <Footer locale={locale} t={t} email={emailPublic} telephone={telephone} adresse={adresse} links={links} />
    </>
  )
}
