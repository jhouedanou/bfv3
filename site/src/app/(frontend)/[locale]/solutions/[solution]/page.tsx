import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Footer } from '@/components/sections/Footer'
import { ScrollToTop } from '@/components/ScrollToTop'
import { Header } from '@/components/sections/Header'
import { SolutionDetail } from '@/components/SolutionDetail'
import { isLocale, locales } from '@/i18n/dictionaries'
import { getSiteContent, getSolution, getSolutionSlugs } from '@/lib/content'
import { JsonLd, absoluteImage, breadcrumbJsonLd, buildMetadata, serviceJsonLd } from '@/lib/seo'
import { getSettings } from '@/lib/settings'
import { SITE_URL, localePath } from '@/lib/site'

// Page d'une solution : la même fiche que la fenêtre de l'accueil, rendue par le serveur
// pour Google et pour les liens partagés.
export const revalidate = 3600
export const dynamicParams = true

type Props = { params: Promise<{ locale: string; solution: string }> }

export async function generateStaticParams() {
  const all = await Promise.all(
    locales.map(async (locale) => ({ locale, content: await getSiteContent(locale) })),
  )
  return all.flatMap(({ locale, content }) =>
    content.solutions.map((s) => ({ locale, solution: s.slug })),
  )
}

const pathsOf = (slugs: Record<string, string>) => ({
  fr: `/solutions/${slugs.fr}`,
  en: `/solutions/${slugs.en}`,
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, solution } = await params
  if (!isLocale(locale)) return {}
  const s = await getSolution(locale, solution)
  if (!s) return {}
  const desc = `${s.promise} ${s.offres.map((o) => o.title).join(', ')}.`
  return buildMetadata({
    locale,
    path: `/solutions/${s.slug}`,
    paths: pathsOf(await getSolutionSlugs(s.key)),
    title: s.metaTitle || `${s.name} | BIG FIVE`,
    description: desc.length > 160 ? `${desc.slice(0, 157)}…` : desc,
    image: absoluteImage(s.img),
  })
}

export default async function SolutionPage({ params }: Props) {
  const { locale, solution } = await params
  if (!isLocale(locale)) notFound()
  const s = await getSolution(locale, solution)
  if (!s) notFound()
  const [{ emailPublic }, { t, links }, slugs] = await Promise.all([
    getSettings(),
    getSiteContent(locale),
    getSolutionSlugs(s.key),
  ])
  const paths = pathsOf(slugs)
  const url = `${SITE_URL}${localePath(locale, paths[locale])}`

  return (
    <>
      <ScrollToTop />
      <Header alternate={{ fr: localePath('fr', paths.fr), en: localePath('en', paths.en) }} />
      <main id="contenu" className="page page--sol">
        <nav className="crumbs" aria-label={t.crumbs}>
          <Link href={`${localePath(locale)}#solutions`}>← {t.eySol}</Link>
        </nav>
        <div className="sol-page">
          <SolutionDetail s={s} headingLevel={1} />
        </div>
      </main>
      <Footer locale={locale} t={t} email={emailPublic} links={links} />
      {/* Données structurées après le contenu : le premier élément de la page reste visible (défilement en haut à la navigation). */}
      <JsonLd
        data={serviceJsonLd({
          name: s.name,
          description: s.promise,
          url,
          category: s.pole === 'tech' ? t.poleTech : t.poleIntel,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'BIG FIVE', url: `${SITE_URL}${localePath(locale)}` },
          { name: t.eySol, url: `${SITE_URL}${localePath(locale)}#solutions` },
          { name: s.name, url },
        ])}
      />
    </>
  )
}
