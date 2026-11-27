<script setup lang="ts">
import type { BarometreDTO } from '~/types'

// Fiche d'un baromètre : couverture, titre, périmètre, 3 chiffres clés, « À retenir », CTA.
const props = withDefaults(defineProps<{ baro: BarometreDTO; headingLevel?: 1 | 3; eyebrow?: string }>(), {
  headingLevel: 3,
  eyebrow: undefined,
})

const c = useSiteContent()
const { openCover, openGate, openNotify, openContact, notified } = useModal()
const heading = computed(() => (props.headingLevel === 1 ? 'h1' : 'h3'))
</script>

<template>
  <div class="baro">
    <button v-if="baro.cover" type="button" class="baro__cover" :aria-label="c.t.zoomCover" @click="openCover(baro)">
      <NuxtImg
        :src="baro.cover.url"
        :alt="baro.cover.alt"
        :width="baro.cover.width"
        :height="baro.cover.height"
        sizes="sm:80vw md:80vw lg:460px"
        format="webp"
        :loading="headingLevel === 1 ? 'eager' : 'lazy'"
        :fetchpriority="headingLevel === 1 ? 'high' : undefined"
      />
      <span class="baro__zoom"><span aria-hidden="true">⤢</span> {{ c.t.zoomLabel }}</span>
    </button>
    <div class="baro__body">
      <p class="label pink">
        {{ eyebrow ?? c.t.latestBaro }} <span aria-hidden="true">·</span> {{ parution(baro.publishedAt) }}
      </p>
      <component :is="heading" class="baro__title" lang="fr">{{ baro.title }}</component>
      <ul class="chips" lang="fr">
        <li v-for="s in baro.scope" :key="s">{{ s }}</li>
      </ul>
      <dl class="kpis" lang="fr">
        <div v-for="k in baro.kpis" :key="k.label" class="kpi">
          <dt class="label pink">{{ k.label }}</dt>
          <dd class="kpi__value">{{ k.value }}</dd>
          <dd class="kpi__text">{{ k.explanation }}</dd>
        </div>
      </dl>
      <p class="takeaway">
        <strong>{{ c.t.takeaway }}</strong> <span lang="fr">{{ baro.takeaway }}</span>
      </p>
      <div class="baro__ctas">
        <button type="button" class="btn btn--primary" @click="openGate(baro)">
          {{ c.t.dlBaro }} <span aria-hidden="true">→</span>
        </button>
        <p v-if="notified" class="lav">{{ c.t.nlDone }}</p>
        <button v-else type="button" class="btn btn--outline" @click="openNotify()">{{ c.t.notifyCta }}</button>
      </div>
      <p class="order">
        <span class="label pink">{{ c.t.orderEy }}</span> {{ c.t.orderAsk }}
        <button type="button" class="link-btn" @click="openContact('observatoire', 'veille')">
          {{ c.t.orderCta }} <span aria-hidden="true">→</span>
        </button>
      </p>
    </div>
  </div>
</template>
