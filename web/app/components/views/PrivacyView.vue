<script setup lang="ts">
const c = useSiteContent()

usePageSeo(() => ({
  locale: c.value.locale,
  paths: routePaths('privacy'),
  title: `${c.value.t.privacy} | BIG FIVE`,
  description: c.value.t.privacyIntro.slice(0, 158),
}))
</script>

<template>
  <ScrollToTop />
  <Header :alternate="routePaths('privacy')" />
  <main id="contenu" class="page page--text">
    <p class="label pink">BIG FIVE</p>
    <h1 class="h2">{{ c.t.privacy }}</h1>
    <p class="meta">{{ c.t.privacyUpdated }}</p>
    <p class="body-text">{{ c.t.privacyIntro }}</p>
    <section v-for="(p, i) in c.privacy" :key="p.title" class="privacy__sec">
      <h2 class="privacy__title">
        <span class="pink">{{ String(i + 1).padStart(2, '0') }}</span> {{ p.title }}
      </h2>
      <p v-for="para in p.body" :key="para.slice(0, 40)" class="body-text">{{ para }}</p>
    </section>
    <p class="privacy__contact">
      {{ c.t.privacyContact }} <a :href="`mailto:${c.settings.email}`">{{ c.settings.email }}</a>
    </p>
  </main>
  <Footer />
</template>
