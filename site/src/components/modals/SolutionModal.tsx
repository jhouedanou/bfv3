'use client'

import type { SolutionKey } from '@/lib/content-types'

import { SolutionDetail } from '../SolutionDetail'
import { useSite } from '../SiteProvider'
import { Dialog } from './Dialog'

export function SolutionModal({ solutionKey }: { solutionKey: SolutionKey }) {
  const { solutions } = useSite()
  const s = solutions.find((x) => x.key === solutionKey)
  if (!s) return null

  return (
    <Dialog label={s.name} variant="solution">
      <SolutionDetail s={s} />
    </Dialog>
  )
}
