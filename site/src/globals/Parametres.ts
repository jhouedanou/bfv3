import { revalidatePath } from 'next/cache'
import type { GlobalConfig } from 'payload'

export const Parametres: GlobalConfig = {
  slug: 'parametres',
  label: 'Paramètres',
  admin: { group: 'Réglages' },
  access: {
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        try {
          revalidatePath('/(frontend)/[locale]', 'layout')
        } catch {
          // Hors contexte Next (CLI) : rien à invalider.
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'emailReception',
      label: 'E-mail de réception des demandes',
      type: 'email',
      required: true,
      defaultValue: 'contact@bigfiveabidjan.com',
      admin: { description: 'Toutes les demandes des formulaires arrivent ici (CDC § 5).' },
    },
    {
      name: 'emailPublic',
      label: 'E-mail affiché sur le site',
      type: 'email',
      required: true,
      defaultValue: 'contact@bigfiveabidjan.com',
      admin: { description: 'Pied de page, politique de confidentialité, message d’erreur des formulaires.' },
    },
  ],
}
