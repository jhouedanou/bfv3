import { Inter, Poppins } from 'next/font/google'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { CookieConsent } from '@/components/CookieConsent'
import { PageTransition } from '@/components/PageTransition'
import { SiteProvider } from '@/components/SiteProvider'
import { isLocale, locales } from '@/i18n/dictionaries'
import { getSiteContent } from '@/lib/content'
import { getSettings } from '@/lib/settings'

import '../site.css'

// Charte du site actuel (CDC § 3) : Poppins pour les titres, Inter pour le texte.
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const generateStaticParams = () => locales.map((locale) => ({ locale }))

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const [{ emailPublic }, { t, solutions, links }] = await Promise.all([
    getSettings(),
    getSiteContent(locale),
  ])

  return (
    <html lang={locale} className={`${poppins.variable} ${inter.variable}`}>
      <body>
        <SiteProvider
          locale={locale}
          t={t}
          emailPublic={emailPublic}
          solutions={solutions}
          links={links}
        >
          {children}
          <PageTransition />
          <CookieConsent />
        </SiteProvider>
      </body>
    </html>
  )
}
