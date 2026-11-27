// « Août 2026 » : les baromètres sont en français, quelle que soit la langue du site (CDC § 1).
export const parution = (iso: string) => {
  const s = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${iso.slice(0, 10)}T12:00:00Z`),
  )
  return s.charAt(0).toUpperCase() + s.slice(1)
}
