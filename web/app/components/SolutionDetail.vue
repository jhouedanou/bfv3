<script setup lang="ts">
import type { SolutionDTO } from '~/types'

// Fiche d'une solution : même rendu dans la fenêtre (accueil) et sur sa page (/solutions/<slug>).
// Chaque offre de « Ce que nous faisons » mène à sa page.
const props = withDefaults(defineProps<{ s: SolutionDTO; headingLevel?: 1 | 2 }>(), { headingLevel: 2 })

const c = useSiteContent()
const locale = useLocale()
const { openContact, dismiss } = useModal()
const heading = computed(() => (props.headingLevel === 1 ? 'h1' : 'h2'))
const imgStyle = computed(() => ({
  position: 'absolute' as const,
  inset: '0',
  width: '100%',
  height: '100%',
  objectFit: 'cover' as const,
  objectPosition: props.s.imgPos,
}))
</script>

<template>
  <div class="sol-modal">
    <div class="sol-modal__media">
      <NuxtImg
        v-if="s.img"
        :src="s.img.url"
        :alt="s.name"
        sizes="sm:100vw md:100vw lg:40vw xl:40vw 2xl:40vw"
        format="webp"
        :loading="headingLevel === 1 ? 'eager' : 'lazy'"
        :fetchpriority="headingLevel === 1 ? 'high' : undefined"
        :style="imgStyle"
      />
    </div>
    <div class="sol-modal__body">
      <component :is="heading" class="sol-modal__title">{{ s.name }}</component>
      <p class="sol-modal__promise">{{ s.promise }}</p>
      <div class="sol-modal__cols">
        <div>
          <div class="label">{{ c.t.weDo }}</div>
          <ul class="dots dots--lead">
            <li v-for="o in s.offres" :key="o.slug">
              <NuxtLink :to="offrePath(locale, s.slug, o.slug)" class="sol-offre" @click="dismiss()">{{ o.title }}</NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <div class="label">{{ c.t.youGet }}</div>
          <ul class="dots dots--lead">
            <li v-for="it in s.gets" :key="it">{{ it }}</li>
          </ul>
        </div>
      </div>
      <div class="sol-modal__foot">
        <div class="sol-modal__lead">
          <hr />
          <p class="sol-modal__pole">
            <span class="label">{{ c.t.ledBy }}</span> <strong>{{ s.pole === 'tech' ? c.t.poleTech : c.t.poleIntel }}</strong>
          </p>
          <p class="sol-modal__person">{{ s.lead }}</p>
          <button type="button" class="btn btn--primary" @click="openContact(s.key, s.key)">
            {{ c.t.letsTalk }} <span aria-hidden="true">→</span>
          </button>
        </div>
        <NuxtImg src="/images/badge-bigfive.png" alt="" :width="200" :height="200" class="sol-modal__badge" format="webp" loading="lazy" />
      </div>
    </div>
  </div>
</template>
