<script setup lang="ts">
const DELAY = 6000
// Équivalent de next/image « fill » : l'image couvre son conteneur positionné.
const FILL = { position: 'absolute', inset: '0', width: '100%', height: '100%' } as const

const c = useSiteContent()
const { solutionHref, openSolution } = useModal()

const i = ref(0)
const paused = ref(false)
let timer: number | undefined

const stop = () => {
  if (timer) window.clearInterval(timer)
  timer = undefined
}
const start = () => {
  stop()
  if (paused.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  timer = window.setInterval(() => {
    i.value = (i.value + 1) % Math.max(1, c.value.covers.length)
  }, DELAY)
}

watch(paused, start)
onMounted(start)
onBeforeUnmount(stop)

const pick = (k: number) => {
  i.value = k
  paused.value = true
}
</script>

<template>
  <section id="accueil" class="sec hero" aria-labelledby="hero-title">
    <div class="hero__slides" aria-hidden="true">
      <NuxtImg
        v-for="(cover, k) in c.covers"
        :key="cover.url"
        :src="cover.url"
        alt=""
        sizes="sm:100vw md:100vw lg:100vw xl:100vw 2xl:100vw"
        format="webp"
        :class="['hero__slide', { 'is-on': k === i }]"
        :style="FILL"
        :preload="k === 0"
        :loading="k === 0 ? 'eager' : 'lazy'"
        :fetchpriority="k === 0 ? 'high' : undefined"
      />
    </div>
    <div class="hero__shade" aria-hidden="true" />
    <div class="hero__body">
      <h1 id="hero-title" class="h1">
        <span>{{ c.t.h1a }}</span> <span>{{ c.t.h1b }}</span> <span class="lav">{{ c.t.h1c }}</span>{{ ' ' }}<span class="lav">{{ c.t.h1d }}</span>
      </h1>
      <p class="hero__method">
        <span v-for="(m, k) in [c.t.m1, c.t.m2, c.t.m3, c.t.m4]" :key="m">
          <span v-if="k > 0" aria-hidden="true" class="sep">·</span>{{ m }}
        </span>
      </p>
      <ul class="paves">
        <li v-for="s in c.solutions" :key="s.key">
          <!-- Lien vers la page de la solution ; un clic ouvre la fiche par-dessus l'accueil. -->
          <a :href="solutionHref(s)" class="pave" data-no-veil @click.prevent="openSolution(s.key)">
            <span class="pave__txt">
              <span class="pave__name">{{ s.name }}</span>
              <span class="pave__sub">{{ s.heroSub }}</span>
            </span>
            <span class="pave__step">{{ s.step }}</span>
          </a>
        </li>
      </ul>
    </div>
    <div class="hero__dots" role="group" :aria-label="c.t.slideshow">
      <button
        v-for="(cover, k) in c.covers"
        :key="cover.url"
        type="button"
        :aria-label="`${c.t.slide} ${k + 1}`"
        :aria-pressed="k === i"
        @click="pick(k)"
      >
        <span :class="k === i ? 'is-on' : ''" />
      </button>
    </div>
  </section>
</template>
