// BIG FIVE — www.bigfive.solutions (bigfive.solutions y redirige). Nuxt 4 + Nuxt Content (fichiers dans content/) + Nuxt Studio (/_studio).
// Toutes les pages sont générées au build (prerender) : HTML complet pour Google, aucune base à héberger.

const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL || 'https://www.bigfive.solutions').replace(/\/$/, '')
// Pré-production et aperçus Vercel : jamais indexés.
// NUXT_INDEXABLE=false (variable de build) ferme aussi la production : pré-production sur
// bigfive-web.vercel.app avant la bascule du domaine. À retirer au lancement, puis rebuild.
const indexable =
  process.env.NUXT_INDEXABLE === 'false' ? false : process.env.VERCEL_ENV ? process.env.VERCEL_ENV === 'production' : true

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: false },

  modules: ['@nuxt/content', 'nuxt-studio', '@nuxt/fonts', '@nuxt/image'],

  css: ['~/assets/css/site.css'],

  // Composants appelés par leur nom de fichier (<Header>, <ContactModal>…), sans préfixe de dossier.
  components: [{ path: '~/components', pathPrefix: false }],

  app: {
    head: {
      // « dark » : le site est sombre, et Nuxt Studio s'affiche alors en mode sombre (plugins/studio-theme).
      htmlAttrs: { lang: 'fr', class: 'dark' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#101228' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'icon', type: 'image/png', href: '/icon.png' },
        { rel: 'apple-touch-icon', href: '/apple-icon.png' },
      ],
    },
  },

  runtimeConfig: {
    resendApiKey: '',
    mailFrom: 'BIG FIVE <site@bigfiveabidjan.com>',
    // Adresse qui reçoit les demandes des formulaires (sinon : email de content/reglages.yml).
    leadsTo: '',
    // Journal des connexions à Studio : adresse qui reçoit un e-mail à chaque connexion (NUXT_AUDIT_TO).
    auditTo: '',
    turnstileSecretKey: '',
    // Publication programmée : Vercel Cron appelle /api/cron/publish, qui relance un build.
    // Vercel Cron envoie « Authorization: Bearer $CRON_SECRET ».
    cronSecret: process.env.CRON_SECRET || '',
    vercelDeployHook: '',
    public: {
      siteUrl,
      turnstileSiteKey: '',
      gaId: '',
      metaPixelId: '',
    },
  },

  // Indexable ou non : constante littérale remplacée à la compilation (__INDEXABLE__) dans le code
  // de l'app (Vite) et du serveur (Nitro). Aucune configuration relue au prérendu ne peut la changer.
  vite: { define: { __INDEXABLE__: JSON.stringify(indexable) } },

  content: {
    build: { markdown: { toc: { depth: 2 } } },
    // SQLite intégré à Node (22.5+) : pas de module natif à compiler, en local comme sur Vercel.
    experimental: { sqliteConnector: 'native' },
  },

  studio: {
    route: '/_studio',
    // Interface de Studio en français : les éditeurs ne sont pas des développeurs.
    i18n: { defaultLocale: 'fr' },
    repository: {
      provider: 'github',
      owner: 'jhouedanou',
      repo: 'bfv3',
      branch: process.env.STUDIO_BRANCH || 'main',
      rootDir: 'web',
      private: false,
    },
  },

  fonts: {
    families: [
      { name: 'Poppins', provider: 'google', weights: [500, 600, 700] },
      { name: 'Inter', provider: 'google', weights: [400, 500, 600, 700] },
    ],
    defaults: { subsets: ['latin', 'latin-ext'] },
  },

  image: {
    format: ['avif', 'webp'],
    quality: 78,
    // Sur Vercel, l'optimiseur n'accepte que les largeurs déclarées ici : points de rupture,
    // plus les largeurs fixes des composants (logo, badge, logos clients, couvertures) en 1x et 2x.
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      '2xl': 1536,
      fhd: 1920,
      w113: 113,
      w124: 124,
      w180: 180,
      w200: 200,
      w220: 220,
      w226: 226,
      w248: 248,
      w360: 360,
      w400: 400,
      w440: 440,
      w460: 460,
      w920: 920,
    },
  },

  routeRules: {
    // Seules routes de l'ancien site Nuxt : on garde le référencement acquis.
    '/thank-you': { redirect: { to: '/', statusCode: 301 } },
    '/en/thank-you': { redirect: { to: '/en', statusCode: 301 } },
    '/fr': { redirect: { to: '/', statusCode: 301 } },
    '/fr/**': { redirect: { to: '/**', statusCode: 301 } },
    // Une seule adresse par page : rubriques traduites en anglais.
    '/en/barometres': { redirect: { to: '/en/barometers', statusCode: 301 } },
    '/en/barometres/**': { redirect: { to: '/en/barometers/**', statusCode: 301 } },
    '/en/politique-de-confidentialite': { redirect: { to: '/en/privacy-policy', statusCode: 301 } },
    // Première pré-production : les baromètres étaient sous /observatoire.
    '/observatoire': { redirect: { to: '/barometres', statusCode: 301 } },
    '/observatoire/**': { redirect: { to: '/barometres/**', statusCode: 301 } },
    '/en/observatoire': { redirect: { to: '/en/barometers', statusCode: 301 } },
    '/en/observatoire/**': { redirect: { to: '/en/barometers/**', statusCode: 301 } },
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/images/**': { headers: { 'cache-control': 'public, max-age=2592000' } },
    ...(indexable ? {} : { '/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } } }),
  },

  nitro: {
    replace: { __INDEXABLE__: JSON.stringify(indexable) },
    prerender: {
      crawlLinks: true,
      routes: ['/', '/en', '/sitemap.xml', '/robots.txt'],
      failOnError: true,
      // Optimiseur d'images de Vercel : n'existe qu'en ligne, pas pendant le build.
      ignore: ['/_vercel/image', '/_ipx/'],
    },
  },

  experimental: {
    // Données de page incluses dans le HTML (pas de _payload.json : le preset Vercel ne les génère pas).
    // La navigation interne lit le contenu dans le navigateur (dumps statiques de Nuxt Content).
    payloadExtraction: false,
    // Liens vers les pages du site : préchargement au survol plutôt qu'à l'affichage.
    defaults: { nuxtLink: { prefetchOn: { interaction: true, visibility: false } } },
  },
})
