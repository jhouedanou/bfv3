import { revalidatePath } from 'next/cache'
import type { GlobalConfig } from 'payload'

export const Parametres: GlobalConfig = {
  slug: 'parametres',
  label: 'Paramètres',
  admin: { group: 'Réglages' },
  access: {
    read: ({ req }) => Boolean(req.user),
    // Réglages (adresse de réception des demandes, coordonnées) : administrateur seulement.
    update: ({ req }) => req.user?.role === 'admin',
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
    {
      name: 'telephone',
      label: 'Téléphone',
      type: 'text',
      admin: { description: 'Format international, ex. +225 … Affiché dans le pied de page et transmis à Google. Vide : non affiché.' },
    },
    {
      name: 'adresse',
      label: 'Adresse postale',
      type: 'textarea',
      admin: { description: 'Rue, quartier, boîte postale. Affichée dans le pied de page et transmise à Google. Vide : non affichée.' },
    },
  ],
}
