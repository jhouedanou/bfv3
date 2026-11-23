import type { CollectionConfig, FieldHook, PayloadRequest } from 'payload'

import { revalidateBarometre } from '../hooks/revalidate'

const isLoggedIn = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

// Identifiant du CDC § 6.2 : secteur-pays-année-mois, ex. telecoms-ci-2026-08.
const IDENTIFIANT = /^[a-z0-9]+(?:-[a-z0-9]+)*-[a-z]{2}-\d{4}-\d{2}$/

const trimHook: FieldHook = ({ value }) => (typeof value === 'string' ? value.trim() : value)

export const Barometres: CollectionConfig = {
  slug: 'barometres',
  labels: { singular: 'Baromètre', plural: 'Baromètres' },
  admin: {
    group: 'Observatoire',
    useAsTitle: 'title',
    defaultColumns: ['title', 'identifiant', 'publishedAt', '_status'],
    description:
      'Un baromètre par parution. Le dernier publié s’affiche en tête de l’Observatoire, les précédents passent automatiquement dans « Baromètres précédents ». Contenu en français uniquement.',
    // Bouton « Aperçu » : active le mode brouillon de Next puis ouvre la page du baromètre.
    preview: (doc) => `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/api/preview?slug=${encodeURIComponent(String(doc?.identifiant ?? ''))}`,
  },
  defaultSort: '-publishedAt',
  versions: {
    drafts: { schedulePublish: true },
    maxPerDoc: 20,
  },
  access: {
    // Le public ne lit que les versions publiées.
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  hooks: {
    afterChange: [revalidateBarometre],
  },
  fields: [
    {
      name: 'identifiant',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'secteur-pays-année-mois, ex. telecoms-ci-2026-08. Sert d’adresse à la page du baromètre.' },
      hooks: { beforeValidate: [trimHook] },
      validate: (value: unknown) =>
        typeof value === 'string' && IDENTIFIANT.test(value)
          ? true
          : 'Format attendu : secteur-pays-année-mois en minuscules, ex. telecoms-ci-2026-08',
    },
    {
      name: 'publishedAt',
      label: 'Date de parution',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'monthOnly', displayFormat: 'MMMM yyyy' } },
    },
    {
      name: 'title',
      label: 'Titre',
      type: 'textarea',
      required: true,
      maxLength: 110,
      admin: { description: 'Une question, 2 lignes maximum (110 caractères).' },
      hooks: { beforeValidate: [trimHook] },
    },
    {
      name: 'metaTitle',
      label: 'Titre pour Google',
      type: 'text',
      maxLength: 70,
      admin: { description: 'Onglet du navigateur et résultats Google, 60 caractères idéalement. Vide : « Titre | BIG FIVE ».' },
      hooks: { beforeValidate: [trimHook] },
    },
    {
      name: 'scope',
      label: 'Périmètre',
      type: 'array',
      minRows: 3,
      maxRows: 3,
      required: true,
      admin: { description: 'Exactement 3 éléments, ex. « 3 opérateurs télécoms ».' },
      fields: [{ name: 'item', label: 'Élément', type: 'text', required: true }],
    },
    {
      name: 'kpis',
      label: 'Chiffres clés',
      type: 'array',
      minRows: 3,
      maxRows: 3,
      required: true,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'value',
              label: 'Valeur',
              type: 'text',
              required: true,
              admin: { width: '25%', description: 'Format français : 76,59 %' },
            },
            { name: 'label', label: 'Libellé court', type: 'text', required: true, admin: { width: '25%' } },
            {
              name: 'explanation',
              label: 'Explication (une ligne)',
              type: 'text',
              required: true,
              maxLength: 90,
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
    {
      name: 'takeaway',
      label: 'À retenir',
      type: 'textarea',
      required: true,
      maxLength: 200,
    },
    {
      name: 'cover',
      label: 'Couverture',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { description: 'JPG ou PNG, 1000 px de large minimum, moins de 500 Ko.' },
      validate: async (value: unknown, { req }: { req: PayloadRequest }) => {
        if (!value) return 'La couverture est obligatoire.'
        const id = typeof value === 'object' && value !== null && 'id' in value ? (value as { id: number }).id : value
        const media = await req.payload.findByID({ collection: 'media', id: id as number, depth: 0, req })
        if (!media) return 'Image introuvable.'
        if (!/^image\/(jpeg|png)$/.test(media.mimeType ?? '')) return 'Format attendu : JPG ou PNG.'
        if ((media.filesize ?? 0) > 500 * 1024) return 'L’image dépasse 500 Ko : optimisez-la avant de l’envoyer.'
        if ((media.width ?? 0) < 1000) return 'L’image doit faire au moins 1000 px de large.'
        return true
      },
    },
    {
      name: 'ressourceInterne',
      label: 'Ressource interne (PDF complet)',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Réservé à l’équipe commerciale. Jamais affiché ni envoyé sur le site public.',
      },
      access: {
        read: isLoggedIn,
        create: isLoggedIn,
        update: isLoggedIn,
      },
    },
  ],
}
