import type { GlobalConfig } from 'payload'

import { revalidateSite } from '../hooks/revalidate'

export const Liens: GlobalConfig = {
  slug: 'liens',
  label: 'Réseaux et liens',
  admin: { group: 'Contenu du site' },
  access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  hooks: { afterChange: [revalidateSite] },
  fields: [
    { name: 'laveiye', label: 'Adresse de Laveiye', type: 'text', required: true, defaultValue: 'https://laveiye.com/' },
    {
      name: 'reseaux',
      label: 'Réseaux sociaux (pied de page)',
      type: 'array',
      fields: [
        { name: 'label', label: 'Nom', type: 'text', required: true },
        { name: 'court', label: 'Abréviation affichée', type: 'text', required: true, admin: { description: 'Ex. « in », « f », « yt ».' } },
        { name: 'url', label: 'Adresse', type: 'text', required: true },
      ],
    },
  ],
}
