import type { CollectionConfig } from 'payload'

import { revalidateSite } from '../hooks/revalidate'
import { isLoggedIn, validateSlug } from './access'

// Les 4 solutions de la frise. Leur clé sert aux objets des e-mails (CDC § 4) :
// on ne peut ni en créer ni en supprimer depuis l'admin, seulement modifier leurs textes.
export const Solutions: CollectionConfig = {
  slug: 'solutions',
  labels: { singular: 'Solution', plural: 'Solutions' },
  admin: {
    group: 'Contenu du site',
    useAsTitle: 'nom',
    defaultColumns: ['nom', 'pole', 'ordre'],
    description: 'Pavés de l’accueil, cercles de « Nos solutions » et fiches. Les offres de chaque solution se gèrent dans « Offres ».',
  },
  defaultSort: 'ordre',
  access: {
    read: () => true,
    create: () => false,
    delete: () => false,
    update: isLoggedIn,
  },
  hooks: { afterChange: [revalidateSite] },
  fields: [
    {
      name: 'key',
      label: 'Clé technique',
      type: 'select',
      required: true,
      unique: true,
      options: ['veille', 'conseil', 'academy', 'digitales'],
      admin: { readOnly: true, position: 'sidebar', description: 'Sert aux objets des e-mails ([Veille], [Conseil]…).' },
    },
    { name: 'ordre', label: 'Ordre', type: 'number', required: true, admin: { position: 'sidebar' } },
    {
      name: 'pole',
      label: 'Pôle',
      type: 'select',
      required: true,
      options: [
        { label: 'Intelligence & Conseil', value: 'intel' },
        { label: 'Tech & Solutions', value: 'tech' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'nom', label: 'Nom', type: 'text', required: true, localized: true },
    {
      name: 'metaTitle',
      label: 'Titre pour Google',
      type: 'text',
      localized: true,
      maxLength: 70,
      admin: { description: 'Page /solutions/<adresse> : onglet du navigateur et résultats Google, 60 caractères idéalement. Vide : « Nom | BIG FIVE ».' },
    },
    {
      name: 'slug',
      label: 'Adresse',
      type: 'text',
      required: true,
      localized: true,
      index: true,
      validate: validateSlug,
      admin: { description: 'Partie de l’adresse : /solutions/<adresse>. La changer casse les liens existants.' },
    },
    { name: 'etape', label: 'Étape de la méthode', type: 'text', required: true, localized: true, admin: { description: 'Au-dessus du cercle, ex. « Collecter · Décrypter ».' } },
    { name: 'heroSub', label: 'Sous-titre du pavé (accueil)', type: 'text', required: true, localized: true },
    { name: 'tag', label: 'Phrase sous le cercle', type: 'text', required: true, localized: true },
    { name: 'promesse', label: 'Promesse (fiche)', type: 'textarea', required: true, localized: true },
    {
      name: 'obtenez',
      label: 'Ce que vous obtenez',
      type: 'array',
      localized: true,
      fields: [{ name: 'item', label: 'Élément', type: 'text', required: true }],
    },
    { name: 'porteur', label: 'Porté par (nom et fonction)', type: 'text', required: true, localized: true },
    { name: 'image', label: 'Photo de la fiche', type: 'upload', relationTo: 'media', required: true },
    { name: 'imagePos', label: 'Cadrage de la photo', type: 'text', defaultValue: 'center', admin: { description: 'Position CSS, ex. « 42% center ».' } },
  ],
}
