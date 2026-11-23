'use client'

import Image from 'next/image'

import type { BarometreDTO } from '@/lib/barometres'

import { parution } from '../parution'
import { useSite } from '../SiteProvider'

// Fiche d'un baromètre : couverture, titre, périmètre, 3 chiffres clés, « À retenir », CTA.
export function BaroCard({ baro, headingLevel = 3, eyebrow }: { baro: BarometreDTO; headingLevel?: 1 | 3; eyebrow?: string }) {
  const { t, openCover, openGate, openNotify, openContact, notified } = useSite()
  const H = headingLevel === 1 ? 'h1' : 'h3'

  return (
    <div className="baro">
      {baro.cover && (
        <button type="button" className="baro__cover" onClick={() => openCover(baro)} aria-label={t.zoomCover}>
          <Image src={baro.cover.url} alt={baro.cover.alt} width={baro.cover.width} height={baro.cover.height} sizes="(max-width: 1024px) 80vw, 460px" />
          <span className="baro__zoom">
            <span aria-hidden="true">⤢</span> {t.zoomLabel}
          </span>
        </button>
      )}
      <div className="baro__body">
        <p className="label pink">
          {eyebrow ?? t.latestBaro} <span aria-hidden="true">·</span> {parution(baro.publishedAt)}
        </p>
        <H className="baro__title" lang="fr">
          {baro.title}
        </H>
        <ul className="chips" lang="fr">
          {baro.scope.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <dl className="kpis" lang="fr">
          {baro.kpis.map((k) => (
            <div key={k.label} className="kpi">
              <dt className="label pink">{k.label}</dt>
              <dd className="kpi__value">{k.value}</dd>
              <dd className="kpi__text">{k.explanation}</dd>
            </div>
          ))}
        </dl>
        <p className="takeaway">
          <strong>{t.takeaway}</strong> <span lang="fr">{baro.takeaway}</span>
        </p>
        <div className="baro__ctas">
          <button type="button" className="btn btn--primary" onClick={() => openGate(baro)}>
            {t.dlBaro} <span aria-hidden="true">→</span>
          </button>
          {notified ? (
            <p className="lav">{t.nlDone}</p>
          ) : (
            <button type="button" className="btn btn--outline" onClick={openNotify}>
              {t.notifyCta}
            </button>
          )}
        </div>
        <p className="order">
          <span className="label pink">{t.orderEy}</span> {t.orderAsk}{' '}
          <button type="button" className="link-btn" onClick={() => openContact('observatoire', 'veille')}>
            {t.orderCta} <span aria-hidden="true">→</span>
          </button>
        </p>
      </div>
    </div>
  )
}
