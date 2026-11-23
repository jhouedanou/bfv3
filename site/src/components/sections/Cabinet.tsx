import Image from 'next/image'

import type { Dictionary } from '@/i18n/dictionaries'
import type { Img, PoleDTO } from '@/lib/content-types'

export function Cabinet({ t, poles, personnage }: { t: Dictionary; poles: PoleDTO[]; personnage: Img | null }) {
  return (
    <section id="agence" className="sec sec--grad cabinet" aria-labelledby="agence-title">
      <div className="cabinet__disc" aria-hidden="true" />
      {personnage && (
        <Image src={personnage.url} alt="" aria-hidden="true" width={personnage.width} height={personnage.height} className="cabinet__perso" sizes="(max-width: 1024px) 0px, 34vw" />
      )}
      <div className="cabinet__intro">
        <h2 id="agence-title" className="h2">
          {t.eyFirm}
        </h2>
        <p className="title">{t.firmTitleA}</p>
        <p className="title lav">{t.firmTitleB}</p>
        <p className="lead">
          {t.firmP1a} {t.firmP1b}
        </p>
        <p className="lead">
          {t.firmP2a} {t.firmP2b}
        </p>
      </div>
      <div className="poles">
        {poles.map((p) => (
          <article key={p.pole} className="pole">
            <p className="label">{p.step}</p>
            <h3 className="h3">{p.pole === 'tech' ? t.poleTech : t.poleIntel}</h3>
            <p className="pole__promise">{p.promise}</p>
            <ul className="dots">
              {p.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
            <p className="pole__lead">{p.lead}</p>
            <p className="pole__role">{p.role}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
