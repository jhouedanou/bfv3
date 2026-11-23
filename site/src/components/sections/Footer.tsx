import Image from 'next/image'

import type { Dictionary, Locale } from '@/i18n/dictionaries'
import type { Links } from '@/lib/content-types'
import { routePath } from '@/lib/site'

import { CookieManage } from '../CookieConsent'

export function Footer({
  locale,
  t,
  email,
  links,
  telephone = '',
  adresse = '',
}: {
  locale: Locale
  t: Dictionary
  email: string
  links: Links
  telephone?: string
  adresse?: string
}) {
  // Hors production, un repère rappelle ce qui manque encore (Admin → Paramètres).
  const todo = process.env.VERCEL_ENV !== 'production'
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
          {telephone ? (
            <a href={`tel:${telephone.replace(/[^+\d]/g, '')}`} className="ftr__mail">
              {telephone}
            </a>
          ) : (
            todo && <p className="ftr__todo">[À COMPLÉTER : téléphone]</p>
          )}
          {adresse ? (
            <address className="ftr__addr">{adresse}</address>
          ) : (
            todo && <p className="ftr__todo">[À COMPLÉTER : adresse postale]</p>
          )}
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
            <a href={routePath('barometres', locale)}>{t.allBaros}</a>
          </li>
          <li>
            <a href={routePath('privacy', locale)}>{t.privacy}</a>
          </li>
          <CookieManage label={t.ckManage} />
        </ul>
      </div>
    </footer>
  )
}
