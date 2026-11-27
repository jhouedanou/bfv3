<script setup lang="ts">
// Page d'une solution : la même fiche que la fenêtre de l'accueil, en HTML complet pour Google
// et pour les liens partagés.
import type { Locale, SiteContent } from '~/types'

const route = useRoute()
const c = useSiteContent()
const siteUrl = useSiteUrl()
const { data: all } = useNuxtData<Record<Locale, SiteContent>>('site-content')

const s = computed(() => c.value.solutions.find((x) => x.slug === route.params.solution))
if (!s.value) throw createError({ statusCode: 404, statusMessage: 'Page introuvable', fatal: true })

const paths = computed(() => {
  const key = s.value!.key
  const slugOf = (l: Locale) => all.value![l].solutions.find((x) => x.key === key)!.slug
  return { fr: solutionPath('fr', slugOf('fr')), en: solutionPath('en', slugOf('en')) }
})
const url = computed(() => `${siteUrl}${paths.value[c.value.locale]}`)
const home = computed(() => localePath(c.value.locale))

usePageSeo(() => {
  const desc = `${s.value!.promise} ${s.value!.offres.map((o) => o.title).join(', ')}.`
  return {
    locale: c.value.locale,
    paths: paths.value,
    title: s.value!.metaTitle || `${s.value!.name} | BIG FIVE`,
    description: desc.length > 160 ? `${desc.slice(0, 157)}…` : desc,
    image: s.value!.img,
  }
})

useJsonLd(() => [
  serviceJsonLd(siteUrl, {
    name: s.value!.name,
    description: s.value!.promise,
    url: url.value,
    category: s.value!.pole === 'tech' ? c.value.t.poleTech : c.value.t.poleIntel,
  }),
  breadcrumbJsonLd([
    { name: 'BIG FIVE', url: absUrl(siteUrl, home.value) },
    { name: c.value.t.eySol, url: `${absUrl(siteUrl, home.value)}#solutions` },
    { name: s.value!.name, url: url.value },
  ]),
])
</script>

<template>
  <ScrollToTop />
  <Header :alternate="paths" />
  <main id="contenu" class="page page--sol">
    <nav class="crumbs" :aria-label="c.t.crumbs">
      <NuxtLink :to="`${home}#solutions`">← {{ c.t.eySol }}</NuxtLink>
    </nav>
    <div class="sol-page">
      <SolutionDetail :s="s!" :heading-level="1" />
    </div>
  </main>
  <Footer />
</template>
