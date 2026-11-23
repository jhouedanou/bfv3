import Image from 'next/image'

import type { Dictionary } from '@/i18n/dictionaries'
import type { Img } from '@/lib/content-types'

// 3 bandes de logos défilantes ; la bande s'arrête au survol (CDC § 3).
export function References({ t, clients }: { t: Dictionary; clients: { name: string; logo: Img }[] }) {
  const rows = [0, 1, 2].map((r) => clients.filter((_, i) => i % 3 === r))

  return (
    <section id="references" className="sec sec--grad refs" aria-labelledby="refs-title">
      <div className="rings" aria-hidden="true">
        <span className="ring ring--d" />
        <span className="ring ring--e" />
      </div>
      <div className="sec__head">
        <h2 id="refs-title" className="h2">
          {t.eyRef}
        </h2>
        <p className="sub lav">{t.refTitle}</p>
      </div>
      <ul className="sr-only">
        {clients.map((c) => (
          <li key={c.name}>{c.name}</li>
        ))}
      </ul>
      <div className="marquees" aria-hidden="true">
        {rows.map((row, r) => (
          <div key={r} className="marquee">
            <div className={`marquee__track marquee__track--${r}`}>
              {[...row, ...row].map((c, i) => (
                <div key={`${c.name}-${i}`} className="logo" title={c.name}>
                  <Image src={c.logo.url} alt={c.name} fill sizes="220px" style={{ objectFit: 'contain' }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
