import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, PayloadRequest } from 'payload'

// Après chaque modification d'un baromètre : accueil, pages des baromètres et sitemap, dans les deux langues.
// On cible la route interne, groupe compris : les adresses publiques « / » et « /barometres/x »
// sont des réécritures de /fr/… par src/proxy.ts, une adresse littérale ne suffirait pas.
export const revalidateBarometre: CollectionAfterChangeHook = ({ doc, req }) => {
  if (req.context?.disableRevalidate) return doc
  try {
    revalidatePath('/(frontend)/[locale]', 'layout')
    revalidatePath('/sitemap.xml')
  } catch (err) {
    // Hors contexte Next (seed, CLI) : rien à invalider.
    req.payload.logger.warn({ err }, 'revalidation des baromètres impossible')
  }
  return doc
}

// Même invalidation pour tout le contenu éditable (solutions, offres, clients, globals) :
// il s'affiche sur toutes les pages, dans les deux langues.
export const revalidateSite = <T>({ doc, req }: { doc: T; req: PayloadRequest }): T => {
  if (req.context?.disableRevalidate) return doc
  try {
    revalidatePath('/(frontend)/[locale]', 'layout')
    revalidatePath('/sitemap.xml')
  } catch (err) {
    req.payload.logger.warn({ err }, 'revalidation du contenu impossible')
  }
  return doc
}
