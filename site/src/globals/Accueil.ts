import type { GlobalConfig } from 'payload'

import { revalidateSite } from '../hooks/revalidate'

// Images de l'accueil et cartes des pôles. Les textes courts sont dans « Textes du site ».
export const Accueil: GlobalConfig = {
  slug: 'accueil',
  label: 'Accueil : images et pôles',
  admin: { group: 'Contenu du site' },
  access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  hooks: { afterChange: [revalidateSite] },
  fields: [
    {
      name: 'couvertures',
      label: 'Diaporama de l’accueil',
      type: 'array',
      minRows: 1,
      fields: [{ name: 'image', label: 'Image', type: 'upload', relationTo: 'media', required: true }],
    },
    { name: 'personnage', label: 'Personnage détouré (Le Cabinet)', type: 'upload', relationTo: 'media' },
    {
      name: 'poles',
      label: 'Cartes des pôles (Le Cabinet)',
      type: 'array',
      fields: [
        {
          name: 'pole',
          label: 'Pôle',
          type: 'select',
          required: true,
          options: [
            { label: 'Intelligence & Conseil', value: 'intel' },
            { label: 'Tech & Solutions', value: 'tech' },
          ],
        },
        { name: 'etape', label: 'Étapes', type: 'text', required: true, localized: true },
        { name: 'promesse', label: 'Promesse', type: 'text', required: true, localized: true },
        {
          name: 'items',
          label: 'Offres listées',
          type: 'array',
          localized: true,
          fields: [{ name: 'item', label: 'Élément', type: 'text', required: true }],
        },
        { name: 'responsable', label: 'Responsable', type: 'text', required: true },
        { name: 'role', label: 'Fonction', type: 'text', required: true, localized: true },
      ],
    },
  ],
}
