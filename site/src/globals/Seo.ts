import type { GlobalConfig } from 'payload'

import { revalidateSite } from '../hooks/revalidate'

export const Seo: GlobalConfig = {
  slug: 'seo',
  label: 'Référencement (accueil)',
  admin: {
    group: 'Contenu du site',
    description: 'Titre et description de l’accueil dans Google et sur les réseaux sociaux. Les pages d’offre ont les leurs, dans « Offres ».',
  },
  access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  hooks: { afterChange: [revalidateSite] },
  fields: [
    { name: 'titre', label: 'Titre', type: 'text', required: true, localized: true, maxLength: 70 },
    { name: 'description', label: 'Description', type: 'textarea', required: true, localized: true, maxLength: 200, admin: { description: 'Idéalement 150 à 160 caractères.' } },
    { name: 'image', label: 'Image de partage', type: 'upload', relationTo: 'media', admin: { description: '1200 × 630 px conseillés.' } },
  ],
}
