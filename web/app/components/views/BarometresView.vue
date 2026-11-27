<script setup lang="ts">
// Liste de tous les baromètres publiés : une adresse stable que Google explore, qui relie
// chaque parution au reste du site.
const c = useSiteContent()
const siteUrl = useSiteUrl()
const { data: barometres } = await useBarometres()
const list = computed(() => barometres.value ?? [])
const frUrl = `${siteUrl}${routePath('barometres', 'fr')}`

usePageSeo(() => ({
  locale: c.value.locale,
  paths: routePaths('barometres'),
  title: c.value.t.barosMetaTitle,
  description: c.value.t.obsSub,
  // Contenu publié en français : la page EN pointe vers la page FR.
  canonicalLocale: 'fr',
}))

useJsonLd(() => [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: c.value.t.barosH1,
    description: c.value.t.obsSub,
    url: frUrl,
    inLanguage: 'fr',
    isPartOf: { '@type': 'WebSite', '@id': `${siteUrl}/#site`, url: siteUrl, name: 'BIG FIVE' },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: list.value.map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: b.title,
        url: `${siteUrl}${routePath('barometres', 'fr', `/${b.identifiant}`)}`,
      })),
    },
  },
  breadcrumbJsonLd([
    { name: 'BIG FIVE', url: absUrl(siteUrl, localePath(c.value.locale)) },
    { name: c.value.t.allBaros, url: frUrl },
  ]),
])
</script>

<template>
  <ScrollToTop />
  <Header :alternate="routePaths('barometres')" />
  <main id="contenu" class="page page--baros">
    <nav class="crumbs" :aria-label="c.t.crumbs">
      <NuxtLink :to="`${localePath(c.locale)}#observatoire`">← {{ c.t.eyObs }}</NuxtLink>
    </nav>
    <p class="label pink">Big Five Insights</p>
    <h1 class="h2">{{ c.t.barosH1 }}</h1>
    <p class="lead">{{ c.t.obsSub }}</p>
    <p v-if="c.locale === 'en'" class="note">{{ c.t.frOnly }}</p>
    <ul class="archive__grid baros__list" lang="fr">
      <li v-for="b in list" :key="b.identifiant">
        <NuxtLink :to="routePath('barometres', c.locale, `/${b.identifiant}`)" class="archive__item">
          <span class="label pink">{{ parution(b.publishedAt) }}</span>
          <span class="archive__title">{{ b.title }}</span>
        </NuxtLink>
      </li>
    </ul>
  </main>
  <Footer />
</template>
