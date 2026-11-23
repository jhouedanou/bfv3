'use client'

import Image from 'next/image'
import { useEffect, useState, type MouseEvent } from 'react'

import { localePath } from '@/lib/site'

import { useSite } from '../SiteProvider'

const NAV = ['agence', 'solutions', 'observatoire', 'references'] as const

// En-tête fixe : menu, Laveiye, « Nous contacter », bascule FR | EN.
// Sous 1024 px, le menu passe dans un bouton (CDC § 3 « Mobile et tablette »).
export function Header({ alternate }: { alternate: { fr: string; en: string } }) {
  const { locale, t, links, openContact, sectionNavRef, activeSection } = useSite()
  // Accueil en plein écran : le lien fait glisser jusqu'à la section au lieu de sauter.
  const onSectionLink = (e: MouseEvent<HTMLAnchorElement>) => {
    setOpen(false)
    const id = e.currentTarget.dataset.section
    if (id && sectionNavRef.current?.(id)) e.preventDefault()
  }
  const [open, setOpen] = useState(false)
  // Section visible de l'accueil, suivie par HomeSlider (Swiper ou défilement normal).
  const current = activeSection
  const active = current === 'accueil' ? null : current
  const home = localePath(locale)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const setLang = (l: 'fr' | 'en') => {
    document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000; samesite=lax`
  }

  return (
    <>
      <header className={`hdr${open ? ' hdr--open' : ''}`}>
        <a href="#contenu" className="skip">
          {t.skip}
        </a>
        <a
          href={`${home}#accueil`}
          className="hdr__logo"
          aria-label={t.homeAria}
          data-section="accueil"
          onClick={onSectionLink}
        >
          <Image
            src="/images/logo-bigfive.png"
            alt={t.logoAlt}
            width={1724}
            height={1286}
            priority
            sizes="124px"
          />
        </a>
        <button
          type="button"
          className="hdr__burger"
          aria-expanded={open}
          aria-controls="main-nav"
          aria-label={open ? t.closeMenu : t.openMenu}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" />
        </button>
        <nav id="main-nav" className="hdr__nav" aria-label={t.sectionsAria}>
          <ul className="hdr__links">
            {NAV.map((id) => {
              const label = {
                agence: t.navAgence,
                solutions: t.navSolutions,
                observatoire: t.navObservatoire,
                references: t.navReferences,
              }[id]
              return (
                <li key={id}>
                  <a
                    href={`${home}#${id}`}
                    className={`hdr__link${active === id ? ' is-active' : ''}`}
                    aria-current={active === id ? 'location' : undefined}
                    data-section={id}
                    onClick={onSectionLink}
                  >
                    {label}
                  </a>
                </li>
              )
            })}
            <li>
              <a
                href={links.laveiye}
                target="_blank"
                rel="noopener noreferrer"
                className="hdr__link hdr__link--lv"
              >
                Laveiye <span aria-hidden="true">↗</span>
              </a>
            </li>
          </ul>
          <button
            type="button"
            className="btn btn--grad btn--nav"
            onClick={() => {
              setOpen(false)
              openContact('header')
            }}
          >
            {t.contactUs}
          </button>
          <div className="lang" role="group" aria-label={t.langGroup}>
            <a
              href={alternate.fr}
              hrefLang="fr"
              lang="fr"
              aria-current={locale === 'fr' ? 'true' : undefined}
              onClick={() => setLang('fr')}
            >
              FR
            </a>
            <a
              href={alternate.en}
              hrefLang="en"
              lang="en"
              aria-current={locale === 'en' ? 'true' : undefined}
              onClick={() => setLang('en')}
            >
              EN
            </a>
          </div>
        </nav>
      </header>
      {/* Points de navigation de la maquette, contre le bord droit (accueil seulement). */}
      {current && (
        <nav className="snapnav" aria-label={t.sectionsAria}>
          {(['accueil', ...NAV] as const).map((id) => {
            const label = {
              accueil: t.navHome,
              agence: t.navAgence,
              solutions: t.navSolutions,
              observatoire: t.navObservatoire,
              references: t.navReferences,
            }[id]
            return (
              <a
                key={id}
                href={`${home}#${id}`}
                title={label}
                aria-label={label}
                aria-current={current === id ? 'location' : undefined}
                data-section={id}
                onClick={onSectionLink}
              >
                <span aria-hidden="true" />
              </a>
            )
          })}
        </nav>
      )}
    </>
  )
}
