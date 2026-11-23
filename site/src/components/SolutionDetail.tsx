'use client'

import Image from 'next/image'
import Link from 'next/link'

import type { SolutionDTO } from '@/lib/content-types'
import { localePath } from '@/lib/site'

import { useSite } from './SiteProvider'

// Fiche d'une solution : même rendu dans la fenêtre (accueil) et sur sa page (/solutions/<slug>).
// Chaque offre de « Ce que nous faisons » mène à sa page.
export function SolutionDetail({ s, headingLevel = 2 }: { s: SolutionDTO; headingLevel?: 1 | 2 }) {
  const { locale, t, openContact, dismiss } = useSite()
  const H = headingLevel === 1 ? 'h1' : 'h2'

  return (
    <div className="sol-modal">
      <div className="sol-modal__media">
        {s.img && <Image src={s.img.url} alt={s.name} fill sizes="(max-width: 1024px) 100vw, 40vw" style={{ objectFit: 'cover', objectPosition: s.imgPos }} />}
      </div>
      <div className="sol-modal__body">
        <H className="sol-modal__title">{s.name}</H>
        <p className="sol-modal__promise">{s.promise}</p>
        <div className="sol-modal__cols">
          <div>
            <div className="label">{t.weDo}</div>
            <ul className="dots dots--lead">
              {s.offres.map((o) => (
                <li key={o.slug}>
                  <Link href={localePath(locale, `/solutions/${s.slug}/${o.slug}`)} className="sol-offre" onClick={dismiss}>
                    {o.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="label">{t.youGet}</div>
            <ul className="dots dots--lead">
              {s.gets.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="sol-modal__foot">
          <div className="sol-modal__lead">
            <hr />
            <p className="sol-modal__pole">
              <span className="label">{t.ledBy}</span> <strong>{s.pole === 'tech' ? t.poleTech : t.poleIntel}</strong>
            </p>
            <p className="sol-modal__person">{s.lead}</p>
            <button type="button" className="btn btn--primary" onClick={() => openContact(s.key, s.key)}>
              {t.letsTalk} <span aria-hidden="true">→</span>
            </button>
          </div>
          <Image src="/images/badge-bigfive.png" alt="" width={200} height={200} className="sol-modal__badge" />
        </div>
      </div>
    </div>
  )
}
