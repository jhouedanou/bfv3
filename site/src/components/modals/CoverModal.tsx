'use client'

import Image from 'next/image'

import type { BarometreDTO } from '@/lib/barometres'

import { Dialog } from './Dialog'

export function CoverModal({ baro }: { baro: BarometreDTO }) {
  if (!baro.cover) return null
  return (
    <Dialog label={baro.title} variant="cover">
      <Image
        src={baro.cover.url}
        alt={baro.cover.alt}
        width={baro.cover.width}
        height={baro.cover.height}
        className="cover-full"
        sizes="(max-width: 768px) 92vw, 70vh"
      />
    </Dialog>
  )
}
