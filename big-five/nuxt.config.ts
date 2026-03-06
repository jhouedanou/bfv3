// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4
  },
  css: ['~/assets/css/main.scss'],
  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Big Five — Conseil en Marketing Stratégique & Digital',
      meta: [
        { name: 'description', content: 'Big Five : agence de conseil en marketing stratégique, digital et solutions digitales sur-mesure. Abidjan, Paris, Cape Town.' },
        { name: 'theme-color', content: '#0a0620' },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Big Five' },
        { property: 'og:title', content: 'Big Five — Conseil en Marketing Stratégique & Digital' },
        { property: 'og:description', content: 'Agence de conseil en marketing stratégique, digital et solutions digitales sur-mesure basée à Abidjan.' },
        { property: 'og:image', content: 'https://bigfiveabidjan.com/images/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:type', content: 'image/png' },
        { property: 'og:url', content: 'https://bigfiveabidjan.com' },
        { property: 'og:locale', content: 'fr_FR' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Big Five' },
        { name: 'twitter:description', content: 'Agence de conseil en marketing stratégique, digital et solutions digitales sur-mesure basée à Abidjan.' },
        { name: 'twitter:image', content: 'https://bigfiveabidjan.com/images/og-image.png' }
      ],
      link: [
        { rel: 'stylesheet', href: 'https://use.typekit.net/rfz7dco.css' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }
      ]
    }
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxt/image'
  ],
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    vueI18n: './i18n.config.ts'
  }
})