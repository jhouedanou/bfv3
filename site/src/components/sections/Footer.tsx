import Image from 'next/image'

import type { Dictionary, Locale } from '@/i18n/dictionaries'
import type { Links } from '@/lib/content-types'
import { localePath } from '@/lib/site'

export function Footer({
  locale,
  t,
  email,
  links,
}: {
  locale: Locale
  t: Dictionary
  email: string
  links: Links
}) {
  return (
    // role explicite : sur l’accueil, le pied de page est dans la dernière section (dans <main>).
    <footer className="ftr" role="contentinfo">
      <div className="ftr__top">
        <div>
          <Image
            src="/images/logo-bigfive.png"
            alt={t.logoAlt}
            width={1724}
            height={1286}
            className="ftr__logo"
            sizes="113px"
          />
          <a href={`mailto:${email}`} className="ftr__mail">
            {email}
          </a>
        </div>
        <ul className="socials">
          {links.socials.map((s) => (
            <li key={s.url}>
              {/* Abréviation visible, nom complet pour les lecteurs d'écran (WCAG 2.5.3). */}
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                <span aria-hidden="true">{s.short}</span>
                <span className="sr-only">{s.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <hr className="ftr__rule" />
      <div className="ftr__bottom">
        <p>{t.rights}</p>
        <ul>
          <li>
            <a href={links.laveiye} target="_blank" rel="noopener noreferrer">
              Laveiye
            </a>
          </li>
          <li>
            <a href={localePath(locale, '/politique-de-confidentialite')}>{t.privacy}</a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
