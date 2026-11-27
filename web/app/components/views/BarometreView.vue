<script setup lang="ts">
const route = useRoute()
const c = useSiteContent()
const siteUrl = useSiteUrl()
const { data: barometres } = await useBarometres()
const slug = String(route.params.slug)
const baro = computed(() => barometres.value?.find((b) => b.identifiant === slug))
if (!baro.value) throw createError({ statusCode: 404, statusMessage: 'Page introuvable', fatal: true })

const frUrl = `${siteUrl}${routePath('barometres', 'fr', `/${slug}`)}`
const listPath = computed(() => routePath('barometres', c.value.locale))

usePageSeo(() => {
  const b = baro.value!
  return {
    locale: c.value.locale,
    paths: routePaths('barometres', `/${slug}`),
    title: b.metaTitle || `${b.title} | BIG FIVE`,
    description: `${b.kpis.map((k) => `${k.value} ${k.label.toLowerCase()}`).join(' · ')}. ${b.takeaway}`.slice(0, 160),
    // Contenu publié en français uniquement (CDC § 1) : la page EN pointe vers la page FR.
    canonicalLocale: 'fr',
    type: 'article',
    image: b.cover,
  }
})

useJsonLd(() => [
  {
    '@context': 'https://schema.org',
    '@type': 'Report',
    name: baro.value!.title,
    inLanguage: 'fr',
    datePublished: baro.value!.publishedAt,
    url: frUrl,
    mainEntityOfPage: frUrl,
    image: baro.value!.cover ? `${siteUrl}${baro.value!.cover.url}` : undefined,
    abstract: baro.value!.takeaway,
    author: { '@type': 'Organization', name: 'BIG FIVE', url: siteUrl },
    publisher: { '@type': 'Organization', name: 'BIG FIVE', url: siteUrl },
  },
  breadcrumbJsonLd([
    { name: 'BIG FIVE', url: absUrl(siteUrl, localePath(c.value.locale)) },
    { name: c.value.t.allBaros, url: `${siteUrl}${listPath.value}` },
    { name: baro.value!.title, url: frUrl },
  ]),
])
</script>

<template>
  <ScrollToTop />
  <Header :alternate="routePaths('barometres', `/${slug}`)" />
  <main id="contenu" class="page page--baro">
    <nav class="crumbs" :aria-label="c.t.crumbs">
      <NuxtLink :to="listPath">← {{ c.t.allBaros }}</NuxtLink>
    </nav>
    <p v-if="c.locale === 'en'" class="note">{{ c.t.frOnly }}</p>
    <BaroCard :baro="baro!" :heading-level="1" :eyebrow="c.t.baroOf" />
  </main>
  <Footer />
</template>
