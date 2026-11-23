'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

import type { Img } from '@/lib/content-types'

import { useSite } from '../SiteProvider'

const DELAY = 6000

export function Hero({ covers }: { covers: Img[] }) {
  const { t, solutions, solutionHref, openSolution } = useSite()
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setI((v) => (v + 1) % covers.length), DELAY)
    return () => window.clearInterval(id)
  }, [paused, covers.length])

  return (
    <section id="accueil" className="sec hero" aria-labelledby="hero-title">
      <div className="hero__slides" aria-hidden="true">
        {covers.map((c, k) => (
          <Image
            key={c.url}
            src={c.url}
            alt=""
            fill
            priority={k === 0}
            sizes="100vw"
            className={`hero__slide${k === i ? ' is-on' : ''}`}
          />
        ))}
      </div>
      <div className="hero__shade" aria-hidden="true" />
      <div className="hero__body">
        <h1 id="hero-title" className="h1">
          <span>{t.h1a}</span> <span>{t.h1b}</span> <span className="lav">{t.h1c}</span>{' '}
          <span className="lav">{t.h1d}</span>
        </h1>
        <p className="hero__method">
          {[t.m1, t.m2, t.m3, t.m4].map((m, k) => (
            <span key={m}>
              {k > 0 && (
                <span aria-hidden="true" className="sep">
                  ·
                </span>
              )}
              {m}
            </span>
          ))}
        </p>
        <ul className="paves">
          {solutions.map((s) => (
            <li key={s.key}>
              {/* Lien vers la page de la solution ; un clic ouvre la fiche par-dessus l'accueil. */}
              <a
                href={solutionHref(s)}
                className="pave"
                data-no-veil
                onClick={(e) => {
                  e.preventDefault()
                  openSolution(s.key)
                }}
              >
                <span className="pave__txt">
                  <span className="pave__name">{s.name}</span>
                  <span className="pave__sub">{s.heroSub}</span>
                </span>
                <span className="pave__step">{s.step}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="hero__dots" role="group" aria-label={t.slideshow}>
        {covers.map((c, k) => (
          <button
            key={c.url}
            type="button"
            aria-label={`${t.slide} ${k + 1}`}
            aria-pressed={k === i}
            onClick={() => {
              setI(k)
              setPaused(true)
            }}
          >
            <span className={k === i ? 'is-on' : ''} />
          </button>
        ))}
      </div>
    </section>
  )
}
