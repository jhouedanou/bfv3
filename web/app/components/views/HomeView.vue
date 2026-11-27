<script setup lang="ts">
// Accueil : sections plein écran (Swiper) sur ordinateur, défilement normal ailleurs.
const c = useSiteContent()
const siteUrl = useSiteUrl()
const { data: barometres } = await useBarometres()

usePageSeo(() => ({
  locale: c.value.locale,
  paths: { fr: '/', en: '/en' },
  title: c.value.seo.title,
  description: c.value.seo.description,
}))

useJsonLd(() => [
  organizationJsonLd({
    siteUrl,
    locale: c.value.locale,
    email: c.value.settings.email,
    telephone: c.value.settings.telephone,
    adresse: c.value.settings.adresse,
    carte: c.value.settings.carte,
    horaires: c.value.settings.horairesSchema,
    description: c.value.seo.description,
    solutions: c.value.solutions,
    links: c.value.links,
  }),
  websiteJsonLd(siteUrl, c.value.locale),
])

const slides = [{ id: 'accueil' }, { id: 'agence' }, { id: 'solutions' }, { id: 'observatoire' }, { id: 'references' }]
</script>

<template>
  <Header :alternate="{ fr: '/', en: '/en' }" />
  <main id="contenu">
    <HomeSlider :slides="slides">
      <template #accueil><Hero /></template>
      <template #agence><Cabinet /></template>
      <template #solutions><Solutions /></template>
      <template #observatoire><Observatoire :barometres="barometres ?? []" /></template>
      <template #references>
        <References />
        <Footer />
      </template>
    </HomeSlider>
  </main>
</template>
