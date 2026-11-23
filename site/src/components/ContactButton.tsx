'use client'

import type { SolutionKey } from '@/lib/content-types'

import { useSite } from './SiteProvider'

// « Parlons de votre projet » depuis une page d'offre : formulaire pré-rempli sur la solution
// (objet d'e-mail « [Veille] », « [Solutions digitales] »… du CDC § 4).
export function ContactButton({ solution, className = 'btn btn--primary' }: { solution: SolutionKey; className?: string }) {
  const { t, openContact } = useSite()
  return (
    <button type="button" className={className} onClick={() => openContact(solution, solution)}>
      {t.letsTalk} <span aria-hidden="true">→</span>
    </button>
  )
}
