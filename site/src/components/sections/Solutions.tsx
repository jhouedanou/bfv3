'use client'

import { useSite } from '../SiteProvider'

// Frise de méthode : 4 cercles, accolades des 2 pôles, bouton de contact.
export function Solutions() {
  const { t, solutions, solutionHref, openSolution, openContact } = useSite()

  return (
    <section id="solutions" className="sec sec--grad solutions" aria-labelledby="solutions-title">
      <div className="rings" aria-hidden="true">
        <span className="ring ring--a" />
        <span className="ring ring--b" />
        <span className="ring ring--c" />
      </div>
      <div className="sec__head">
        <h2 id="solutions-title" className="h2">
          {t.eySol}
        </h2>
        <p className="sub lav">{t.solTitle}</p>
      </div>
      <div className="frise">
        <ol className="frise__grid">
          {solutions.map((c) => {
            return (
              <li key={c.key} className="frise__item">
                <span className="label frise__step">{c.step}</span>
                <span className="frise__dot" aria-hidden="true" />
                <a
                  href={solutionHref(c)}
                  className="circle"
                  data-no-veil
                  onClick={(e) => {
                    e.preventDefault()
                    openSolution(c.key)
                  }}
                  aria-label={`${t.discover} ${c.name}`}
                >
                  <span className="circle__name">{c.name}</span>
                  <span className="circle__plus" aria-hidden="true">
                    +
                  </span>
                </a>
                <p className="frise__tag">{c.tag}</p>
              </li>
            )
          })}
        </ol>
        <div className="braces" aria-hidden="true">
          <div className="brace brace--intel">
            <span className="brace__line" />
            <span className="label">{t.poleIntel}</span>
          </div>
          <div className="brace brace--tech">
            <span className="brace__line" />
            <span className="label">{t.poleTech}</span>
          </div>
        </div>
      </div>
      <div className="center">
        <button
          type="button"
          className="btn btn--primary btn--lg"
          onClick={() => openContact('solutions')}
        >
          {t.letsTalk} <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  )
}
