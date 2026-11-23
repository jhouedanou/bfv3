import type { CollectionConfig } from 'payload'

import { revalidateSite } from '../hooks/revalidate'
import { isLoggedIn, publishedOrLoggedIn, validateSlug } from './access'

// Une page par offre : /solutions/<solution>/<offre>, en français et en anglais.
export const Offres: CollectionConfig = {
  slug: 'offres',
  labels: { singular: 'Offre', plural: 'Offres' },
  admin: {
    group: 'Contenu du site',
    useAsTitle: 'titre',
    defaultColumns: ['titre', 'solution', 'ordre', 'valide', '_status'],
    description:
      'Chaque offre a sa page et apparaît dans « Ce que nous faisons » de sa solution. Tant que « Texte validé » n’est pas coché, la page reste hors de Google.',
  },
  defaultSort: 'ordre',
  versions: { drafts: true, maxPerDoc: 20 },
  access: {
    read: publishedOrLoggedIn,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  hooks: { afterChange: [revalidateSite] },
  fields: [
    { name: 'solution', label: 'Solution', type: 'relationship', relationTo: 'solutions', required: true, admin: { position: 'sidebar' } },
    { name: 'ordre', label: 'Ordre', type: 'number', required: true, admin: { position: 'sidebar' } },
    {
      name: 'valide',
      label: 'Texte validé par BIG FIVE',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Coché : la page est proposée à Google (sitemap, indexation).' },
    },
    { name: 'titre', label: 'Titre', type: 'text', required: true, localized: true },
    {
      name: 'slug',
      label: 'Adresse',
      type: 'text',
      required: true,
      localized: true,
      index: true,
      validate: validateSlug,
      admin: { description: 'Partie de l’adresse : /solutions/<solution>/<adresse>. La changer casse les liens existants.' },
    },
    {
      name: 'accroche',
      label: 'Accroche',
      type: 'textarea',
      required: true,
      localized: true,
      maxLength: 160,
      admin: { description: 'Sous le titre, et dans les résultats Google (160 caractères maximum).' },
    },
    { name: 'corps', label: 'Texte de la page', type: 'richText', required: true, localized: true },
    {
      name: 'livrables',
      label: 'Ce que vous obtenez',
      type: 'array',
      localized: true,
      fields: [{ name: 'item', label: 'Élément', type: 'text', required: true }],
    },
    {
      name: 'faq',
      label: 'Questions fréquentes',
      type: 'array',
      localized: true,
      fields: [
        { name: 'question', label: 'Question', type: 'text', required: true },
        { name: 'reponse', label: 'Réponse', type: 'textarea', required: true },
      ],
    },
    {
      name: 'metaTitle',
      label: 'Titre pour Google',
      type: 'text',
      localized: true,
      maxLength: 70,
      admin: { description: 'Onglet du navigateur et résultats Google. Vide : « Titre | BIG FIVE ».' },
    },
  ],
}
