import type { GlobalConfig } from 'payload'

import { revalidateSite } from '../hooks/revalidate'

// Corps de la politique de confidentialité. Titre, date et introduction : « Textes du site ».
export const Politique: GlobalConfig = {
  slug: 'politique',
  label: 'Politique de confidentialité',
  admin: { group: 'Contenu du site' },
  access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  hooks: { afterChange: [revalidateSite] },
  fields: [
    {
      name: 'sections',
      label: 'Sections',
      type: 'array',
      localized: true,
      fields: [
        { name: 'titre', label: 'Titre', type: 'text', required: true },
        {
          name: 'paragraphes',
          label: 'Paragraphes',
          type: 'array',
          fields: [{ name: 'texte', label: 'Texte', type: 'textarea', required: true }],
        },
      ],
    },
  ],
}
