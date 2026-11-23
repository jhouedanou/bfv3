import type { CollectionConfig } from 'payload'

// Copie de chaque demande envoyée par les formulaires : filet de sécurité si l'e-mail échoue.
// Lecture réservée à l'équipe connectée ; création uniquement par le serveur (overrideAccess).
export const Demandes: CollectionConfig = {
  slug: 'demandes',
  labels: { singular: 'Demande', plural: 'Demandes' },
  admin: {
    group: 'Demandes',
    useAsTitle: 'subject',
    defaultColumns: ['subject', 'type', 'locale', 'emailStatus', 'createdAt'],
    description: 'Toutes les demandes reçues par le site. Les e-mails restent la référence ; cette liste sert de sauvegarde.',
  },
  defaultSort: '-createdAt',
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'subject', label: 'Objet', type: 'text', required: true },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Contact', value: 'contact' },
        { label: 'Baromètre', value: 'barometre' },
        { label: 'Étude sur mesure', value: 'etude' },
        { label: 'Me notifier', value: 'notify' },
      ],
    },
    { name: 'source', type: 'text' },
    { name: 'email', type: 'email', required: true },
    { name: 'locale', label: 'Langue', type: 'select', options: ['fr', 'en'] },
    { name: 'page', label: 'Page d’origine', type: 'text' },
    { name: 'fields', label: 'Champs', type: 'json' },
    {
      name: 'emailStatus',
      label: 'Envoi',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'En attente', value: 'pending' },
        { label: 'Envoyé', value: 'sent' },
        { label: 'Échec', value: 'failed' },
      ],
    },
    { name: 'emailError', type: 'text', admin: { readOnly: true } },
    // Empreinte de l'adresse IP (jamais l'adresse elle-même) : sert à limiter le nombre d'envois.
    { name: 'ipHash', type: 'text', index: true, admin: { hidden: true } },
  ],
}
