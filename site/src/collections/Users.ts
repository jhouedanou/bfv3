import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminField } from './access'

// Deux rôles : l'administrateur gère aussi les comptes et les réglages ; l'éditeur gère le contenu.
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Utilisateur', plural: 'Utilisateurs' },
  admin: {
    group: 'Réglages',
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role'],
  },
  auth: true,
  access: {
    // Chacun voit et modifie son propre compte ; seul l'administrateur gère ceux des autres.
    read: ({ req }) => (req.user?.role === 'admin' ? true : req.user ? { id: { equals: req.user.id } } : false),
    update: ({ req }) => (req.user?.role === 'admin' ? true : req.user ? { id: { equals: req.user.id } } : false),
    create: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      // Le tout premier compte, créé à l'installation, est administrateur.
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        const { totalDocs } = await req.payload.count({ collection: 'users', overrideAccess: true })
        return totalDocs === 0 ? { ...data, role: 'admin' } : data
      },
    ],
  },
  fields: [
    { name: 'name', label: 'Nom', type: 'text' },
    {
      name: 'role',
      label: 'Rôle',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Administrateur', value: 'admin' },
        { label: 'Éditeur', value: 'editor' },
      ],
      // Seul un administrateur change un rôle (y compris le sien).
      access: { create: isAdminField, update: isAdminField },
      admin: { description: 'Éditeur : contenu, baromètres et demandes. Administrateur : en plus, comptes et paramètres.' },
    },
  ],
}
