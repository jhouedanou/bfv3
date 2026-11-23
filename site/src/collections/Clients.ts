import type { CollectionConfig } from 'payload'

import { revalidateSite } from '../hooks/revalidate'
import { isLoggedIn } from './access'

// Logos de la section Références (3 bandes défilantes).
export const Clients: CollectionConfig = {
  slug: 'clients',
  labels: { singular: 'Client', plural: 'Clients (références)' },
  admin: {
    group: 'Contenu du site',
    useAsTitle: 'nom',
    defaultColumns: ['nom', 'logo', 'ordre'],
  },
  defaultSort: 'ordre',
  access: {
    read: () => true,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  hooks: { afterChange: [revalidateSite], afterDelete: [revalidateSite] },
  fields: [
    { name: 'nom', label: 'Nom', type: 'text', required: true },
    { name: 'logo', label: 'Logo', type: 'upload', relationTo: 'media', required: true },
    { name: 'ordre', label: 'Ordre', type: 'number', required: true, defaultValue: 100 },
  ],
}
