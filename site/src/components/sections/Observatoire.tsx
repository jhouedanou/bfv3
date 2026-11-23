import Link from 'next/link'

import type { Dictionary, Locale } from '@/i18n/dictionaries'
import type { BarometreDTO } from '@/lib/barometres'
import { localePath } from '@/lib/site'

import { parution } from '../parution'
import { BaroCard } from './BaroCard'

export function Observatoire({ locale, t, barometres, laveiye }: { locale: Locale; t: Dictionary; barometres: BarometreDTO[]; laveiye: string }) {
  const [latest, ...archive] = barometres

  return (
    <section id="observatoire" className="sec obs" aria-labelledby="obs-title">
      <div className="obs__banner">
        <h2 id="obs-title" className="h2">
          {t.eyObs}
        </h2>
        <p className="title obs__brand">Big Five Insights</p>
        <p className="lead">{t.obsSub}</p>
      </div>
      <div className="obs__main">
        {latest ? <BaroCard baro={latest} /> : null}
        {archive.length > 0 && (
          <div className="archive">
            <h3 className="label pink">{t.prevBaros}</h3>
            <ul className="archive__grid" lang="fr">
              {archive.map((a) => (
                <li key={a.identifiant}>
                  <Link href={localePath(locale, `/observatoire/${a.identifiant}`)} className="archive__item">
                    <span className="label pink">{parution(a.publishedAt)}</span>
                    <span className="archive__title">{a.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="laveiye">
          {t.laveiyeLine}{' '}
          <a href={laveiye} target="_blank" rel="noopener noreferrer">
            laveiye.com <span aria-hidden="true">↗</span>
          </a>
        </p>
      </div>
    </section>
  )
}
