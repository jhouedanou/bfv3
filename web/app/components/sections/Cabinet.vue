<script setup lang="ts">
const c = useSiteContent()
</script>

<template>
  <section id="agence" class="sec sec--grad cabinet" aria-labelledby="agence-title">
    <div class="cabinet__disc" aria-hidden="true" />
    <NuxtImg
      v-if="c.personnage"
      :src="c.personnage.url"
      alt=""
      aria-hidden="true"
      :width="c.personnage.width"
      :height="c.personnage.height"
      class="cabinet__perso"
      sizes="lg:34vw xl:34vw 2xl:34vw"
      format="webp"
      loading="lazy"
    />
    <div class="cabinet__intro">
      <h2 id="agence-title" class="h2">{{ c.t.eyFirm }}</h2>
      <p class="title">{{ c.t.firmTitleA }}</p>
      <p class="title lav">{{ c.t.firmTitleB }}</p>
      <p class="lead">{{ c.t.firmP1a }} {{ c.t.firmP1b }}</p>
      <p class="lead">{{ c.t.firmP2a }} {{ c.t.firmP2b }}</p>
    </div>
    <div class="poles">
      <article v-for="p in c.poles" :key="p.pole" class="pole">
        <p class="label">{{ p.step }}</p>
        <h3 class="h3">{{ p.name || (p.pole === 'tech' ? c.t.poleTech : c.t.poleIntel) }}</h3>
        <p class="pole__promise">{{ p.promise }}</p>
        <ul class="dots">
          <li v-for="it in p.items" :key="it">{{ it }}</li>
        </ul>
        <p class="pole__lead">{{ p.lead }}</p>
        <p class="pole__role">{{ p.role }}</p>
      </article>
    </div>
  </section>
</template>
