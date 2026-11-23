import 'server-only'

import { cache } from 'react'

import type { Locale } from '@/i18n/dictionaries'

import { buildContent, buildOffres, fetchRaw as fetchRawWith, solutionSlugs } from './content-core'
import type { SolutionKey } from './content-types'
import { getPayloadClient } from './payload'

export { relativeUrl, type OffreDTO } from './content-core'

// Une lecture de Payload par requête (cache de React), partagée par la page, ses métadonnées et le layout.
const fetchRaw = cache(async () => fetchRawWith(await getPayloadClient()))

export const getSiteContent = cache(async (locale: Locale) => buildContent(await fetchRaw(), locale))

export const getOffres = cache(async (locale: Locale) => buildOffres(await fetchRaw(), await getSiteContent(locale), locale))

export const getOffre = async (locale: Locale, solutionSlug: string, slug: string) =>
  (await getOffres(locale)).find((o) => o.solution.slug === solutionSlug && o.slug === slug) ?? null

export const getSolution = async (locale: Locale, slug: string) =>
  (await getSiteContent(locale)).solutions.find((s) => s.slug === slug) ?? null

// Adresse de la même solution dans l'autre langue (hreflang, bascule FR | EN).
export const getSolutionSlugs = async (key: SolutionKey) => solutionSlugs(await fetchRaw(), key)
