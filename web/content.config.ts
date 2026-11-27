import { defineCollection, defineContentConfig, z } from '@nuxt/content'

// Tout le contenu du site vit dans content/ : fichiers versionnés dans Git, modifiables dans
// Nuxt Studio (/_studio). Chaque enregistrement dans Studio crée un commit, Vercel redéploie.

const locale = z.enum(['fr', 'en'])
const solutionKey = z.enum(['veille', 'conseil', 'academy', 'digitales'])

export default defineContentConfig({
  collections: {
    // Une page par offre : /solutions/<solution>/<offre> (FR) et /en/solutions/<solution>/<offer>.
    offres: defineCollection({
      type: 'page',
      source: 'offres/**/*.md',
      schema: z.object({
        key: z.string(),
        locale,
        solution: solutionKey,
        order: z.number(),
        slug: z.string(),
        metaTitle: z.string(),
        gets: z.array(z.string()),
        faq: z.array(z.object({ question: z.string(), answer: z.string() })),
        // Décoché : page hors index Google et hors sitemap.
        validated: z.boolean().default(false),
      }),
    }),
    solutions: defineCollection({
      type: 'data',
      source: 'solutions/**/*.yml',
      schema: z.object({
        key: solutionKey,
        locale,
        order: z.number(),
        slug: z.string(),
        name: z.string(),
        metaTitle: z.string(),
        step: z.string(),
        heroSub: z.string(),
        tag: z.string(),
        promise: z.string(),
        gets: z.array(z.string()),
        lead: z.string(),
        pole: z.enum(['intel', 'tech']),
        image: z.string().editor({ input: 'media' }),
        imagePosition: z.string().default('center'),
      }),
    }),
    barometres: defineCollection({
      type: 'data',
      source: 'barometres/*.yml',
      schema: z.object({
        identifiant: z.string(),
        published: z.boolean().default(false),
        // Date de parution (AAAA-MM-JJ). Une date future reste masquée jusqu'au jour dit.
        publishedAt: z.string(),
        title: z.string(),
        metaTitle: z.string(),
        cover: z.string().editor({ input: 'media' }),
        scope: z.array(z.string()),
        kpis: z.array(z.object({ value: z.string(), label: z.string(), explanation: z.string() })),
        takeaway: z.string(),
      }),
    }),
    accueil: defineCollection({
      type: 'data',
      source: 'accueil/*.yml',
      schema: z.object({
        locale,
        seo: z.object({ title: z.string(), description: z.string() }),
        poles: z.array(
          z.object({
            pole: z.enum(['intel', 'tech']),
            name: z.string(),
            step: z.string(),
            promise: z.string(),
            items: z.array(z.string()),
            lead: z.string(),
            role: z.string(),
          }),
        ),
      }),
    }),
    // Libellés de l'interface (menus, boutons, formulaires, pied de page).
    textes: defineCollection({
      type: 'data',
      source: 'textes/*.yml',
      schema: z.object({ locale }).passthrough(),
    }),
    politique: defineCollection({
      type: 'data',
      source: 'politique/*.yml',
      schema: z.object({
        locale,
        sections: z.array(z.object({ title: z.string(), paragraphs: z.array(z.string()) })),
      }),
    }),
    reglages: defineCollection({
      type: 'data',
      source: 'reglages.yml',
      schema: z.object({
        email: z.string(),
        telephone: z.string(),
        adresse: z.string(),
        // Lien Google Maps de l'établissement.
        carte: z.string().default(''),
        // Horaires d'ouverture : texte affiché (fr, en) et format schema.org (ex. « Mo-Fr 09:00-18:00 »).
        horaires: z.object({ fr: z.string(), en: z.string(), schema: z.string() }).default({ fr: '', en: '', schema: '' }),
        laveiye: z.string(),
        ogImage: z.string().editor({ input: 'media' }),
        personnage: z.string().editor({ input: 'media' }),
        covers: z.array(z.string()),
        socials: z.array(z.object({ label: z.string(), short: z.string(), url: z.string() })),
        clients: z.array(z.object({ name: z.string(), logo: z.string() })),
      }),
    }),
  },
})
