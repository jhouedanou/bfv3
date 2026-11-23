import type { Access } from 'payload'

export const isLoggedIn: Access = ({ req }) => Boolean(req.user)

// Le public ne lit que les versions publiées ; l'admin voit aussi les brouillons.
export const publishedOrLoggedIn: Access = ({ req }) => (req.user ? true : { _status: { equals: 'published' } })

// Slug d'adresse : minuscules, chiffres et tirets.
export const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const validateSlug = (value: unknown) =>
  typeof value === 'string' && SLUG.test(value) ? true : 'Minuscules, chiffres et tirets uniquement, ex. creation-de-site-web'
