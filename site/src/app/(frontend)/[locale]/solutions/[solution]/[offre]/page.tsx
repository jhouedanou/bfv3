import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ContactButton } from '@/components/ContactButton'
import { Footer } from '@/components/sections/Footer'
import { ScrollToTop } from '@/components/ScrollToTop'
import { Header } from '@/components/sections/Header'
import { isLocale, locales } from '@/i18n/dictionaries'
import { getOffre, getOffres, getSiteContent } from '@/lib/content'
import {
  JsonLd,
  absoluteImage,
  breadcrumbJsonLd,
  buildMetadata,
  faqJsonLd,
  serviceJsonLd,
} from '@/lib/seo'
import { getSettings } from '@/lib/settings'
import { SITE_URL, localePath } from '@/lib/site'

// Page d'une offre (contenu : admin → Offres). Hors de Google tant que « Texte validé » n'est pas coché.
export const revalidate = 3600
export const dynamicParams = true

type Props = { params: Promise<{ locale: string; solution: string; offre: string }> }

export async function generateStaticParams() {
  const all = await Promise.all(
    locales.map(async (locale) => ({ locale, offres: await getOffres(locale) })),
  )
  return all.flatMap(({ locale, offres }) =>
    offres.map((o) => ({ locale, solution: o.solution.slug, offre: o.slug })),
  )
}

const pathsOf = (o: { slugs: Record<string, string>; solutionSlugs: Record<string, string> }) => ({
  fr: `/solutions/${o.solutionSlugs.fr}/${o.slugs.fr}`,
  en: `/solutions/${o.solutionSlugs.en}/${o.slugs.en}`,
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, solution, offre } = await params
  if (!isLocale(locale)) return {}
  const o = await getOffre(locale, solution, offre)
  if (!o) return {}
  return buildMetadata({
    locale,
    path: pathsOf(o)[locale],
    paths: pathsOf(o),
    title: o.metaTitle || `${o.title} | BIG FIVE`,
    description: o.accroche,
    image: absoluteImage(o.solution.img),
    noindex: !o.valide,
  })
}

export default async function OffrePage({ params }: Props) {
  const { locale, solution, offre } = await params
  if (!isLocale(locale)) notFound()
  const o = await getOffre(locale, solution, offre)
  if (!o) notFound()
  const [{ emailPublic }, { t, links }] = await Promise.all([getSettings(), getSiteContent(locale)])
  const s = o.solution
  const paths = pathsOf(o)
  const home = localePath(locale)
  const solutionUrl = localePath(locale, `/solutions/${s.slug}`)
  const url = `${SITE_URL}${localePath(locale, paths[locale])}`
  const others = s.offres.filter((x) => x.slug !== o.slug)

  return (
    <>
      <ScrollToTop />
      <Header alternate={{ fr: localePath('fr', paths.fr), en: localePath('en', paths.en) }} />
      <main id="contenu" className="page page--offre">
        <nav className="crumbs" aria-label={t.crumbs}>
          <ol className="crumbs__list">
            <li>
              <Link href={home}>BIG FIVE</Link>
            </li>
            <li>
              <Link href={solutionUrl}>{s.name}</Link>
            </li>
            <li aria-current="page">{o.title}</li>
          </ol>
        </nav>

        <article className="offre">
          <header className="offre__head">
            <p className="label pink">{s.name}</p>
            <h1 className="h2 offre__title">{o.title}</h1>
            <p className="lead offre__accroche">{o.accroche}</p>
          </header>

          <div className="offre__grid">
            <div className="offre__body">{o.corps && <RichText data={o.corps} />}</div>
            <aside className="offre__aside">
              {o.livrables.length > 0 && (
                <>
                  <h2 className="label">{t.youGet}</h2>
                  <ul className="dots dots--lead">
                    {o.livrables.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </>
              )}
              <p className="offre__lead">
                <span className="label">{t.ledBy}</span> {s.lead}
              </p>
              <ContactButton solution={s.key} />
            </aside>
          </div>

          {o.faq.length > 0 && (
            <section className="offre__faq" aria-labelledby="faq-title">
              <h2 id="faq-title" className="h3">
                {t.faqTitle}
              </h2>
              {o.faq.map((f) => (
                <details key={f.question} className="faq">
                  <summary>{f.question}</summary>
                  <p>{f.reponse}</p>
                </details>
              ))}
            </section>
          )}

          {others.length > 0 && (
            <nav className="offre__others" aria-label={t.otherOffers}>
              <h2 className="label">
                {t.otherOffers} · {s.name}
              </h2>
              <ul>
                {others.map((x) => (
                  <li key={x.slug}>
                    <Link href={localePath(locale, `/solutions/${s.slug}/${x.slug}`)}>
                      {x.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </article>
      </main>
      <Footer locale={locale} t={t} email={emailPublic} links={links} />
      {/* Données structurées après le contenu : le premier élément de la page reste visible (défilement en haut à la navigation). */}
      <JsonLd
        data={serviceJsonLd({ name: o.title, description: o.accroche, url, category: s.name })}
      />
      {o.faq.length > 0 && <JsonLd data={faqJsonLd(o.faq)} />}
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'BIG FIVE', url: `${SITE_URL}${home}` },
          { name: s.name, url: `${SITE_URL}${solutionUrl}` },
          { name: o.title, url },
        ])}
      />
    </>
  )
}
