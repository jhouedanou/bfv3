import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { fr } from '@payloadcms/translations/languages/fr'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Barometres } from './collections/Barometres'
import { Clients } from './collections/Clients'
import { Demandes } from './collections/Demandes'
import { Media } from './collections/Media'
import { Offres } from './collections/Offres'
import { Solutions } from './collections/Solutions'
import { Users } from './collections/Users'
import { Accueil } from './globals/Accueil'
import { Liens } from './globals/Liens'
import { Parametres } from './globals/Parametres'
import { Politique } from './globals/Politique'
import { Seo } from './globals/Seo'
import { TEXTES } from './globals/Textes'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Site et build : pooler Supabase en mode transaction (port 6543), seul adapté aux fonctions
// serverless. Migrations (pnpm payload migrate) : mode session (port 5432), qui garde la session.
const migrating = process.argv.some((a) => a.startsWith('migrate'))

// Supabase Storage (API compatible S3). Obligatoire sur Vercel, dont le disque est en lecture seule.
const s3Enabled = Boolean(process.env.S3_BUCKET)

// E-mails de l'admin (mot de passe oublié) : même expéditeur que les formulaires.
const from = /^(.*)<(.+)>$/.exec(process.env.MAIL_FROM ?? '')
const email = process.env.RESEND_API_KEY
  ? resendAdapter({
      apiKey: process.env.RESEND_API_KEY,
      defaultFromName: from?.[1].trim().replace(/^"|"$/g, '') || 'BIG FIVE',
      defaultFromAddress: from?.[2].trim() || 'onboarding@resend.dev',
    })
  : undefined

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || '',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: { titleSuffix: ' · BIG FIVE' },
  },
  i18n: {
    supportedLanguages: { fr },
    fallbackLanguage: 'fr',
  },
  // Contenu en français et en anglais (sélecteur de langue dans l'admin). Les baromètres restent en français.
  localization: {
    locales: [
      { code: 'fr', label: 'Français' },
      { code: 'en', label: 'English' },
    ],
    defaultLocale: 'fr',
    fallback: true,
  },
  collections: [Solutions, Offres, Clients, Barometres, Media, Demandes, Users],
  globals: [...TEXTES, Accueil, Seo, Liens, Politique, Parametres],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: (migrating && process.env.DATABASE_MIGRATE_URL) || process.env.DATABASE_URL || '',
      // Le pooler Supabase (mode session) n'accepte que 15 clients pour tout le projet :
      // peu de connexions par processus, rendues vite.
      max: Number(process.env.DATABASE_POOL_MAX) || 5,
      idleTimeoutMillis: 10_000,
    },
    // Une seule base pour le développement et la pré-production : le schéma évolue
    // uniquement par migrations (pnpm payload migrate:create puis migrate).
    push: false,
  }),
  email,
  sharp,
  jobs: {
    // Publication programmée des baromètres : Vercel Cron appelle /api/payload-jobs/run
    // avec l'en-tête « Authorization: Bearer CRON_SECRET ».
    access: {
      run: ({ req }) => {
        if (req.user) return true
        const secret = process.env.CRON_SECRET
        return Boolean(secret) && req.headers.get('authorization') === `Bearer ${secret}`
      },
    },
  },
  plugins: [
    s3Storage({
      enabled: s3Enabled,
      collections: { media: true },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION,
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
      },
    }),
  ],
})
