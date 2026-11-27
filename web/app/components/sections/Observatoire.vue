<script setup lang="ts">
import type { BarometreDTO } from '~/types'

const props = defineProps<{ barometres: BarometreDTO[] }>()

const c = useSiteContent()
const locale = useLocale()
const latest = computed(() => props.barometres[0])
const archive = computed(() => props.barometres.slice(1))
</script>

<template>
  <section id="observatoire" class="sec obs" aria-labelledby="obs-title">
    <div class="obs__banner">
      <h2 id="obs-title" class="h2">{{ c.t.eyObs }}</h2>
      <p class="title obs__brand">Big Five Insights</p>
      <p class="lead">{{ c.t.obsSub }}</p>
    </div>
    <div class="obs__main">
      <BaroCard v-if="latest" :baro="latest" />
      <div v-if="archive.length > 0" class="archive">
        <h3 class="label pink">{{ c.t.prevBaros }}</h3>
        <ul class="archive__grid" lang="fr">
          <li v-for="a in archive" :key="a.identifiant">
            <NuxtLink :to="routePath('barometres', locale, `/${a.identifiant}`)" class="archive__item">
              <span class="label pink">{{ parution(a.publishedAt) }}</span>
              <span class="archive__title">{{ a.title }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
      <p class="obs__all">
        <NuxtLink :to="routePath('barometres', locale)">{{ c.t.allBaros }} <span aria-hidden="true">→</span></NuxtLink>
      </p>
      <p class="laveiye">
        {{ c.t.laveiyeLine }}
        <a :href="c.links.laveiye" target="_blank" rel="noopener noreferrer">laveiye.com <span aria-hidden="true">↗</span></a>
      </p>
    </div>
  </section>
</template>
