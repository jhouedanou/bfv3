<script setup lang="ts">
// Passage d'une page à l'autre : voile aux couleurs du site et logo BIG FIVE.
// Il apparaît au clic sur un lien interne vers une autre page, et s'efface quand la nouvelle page est là.
// Ignoré : liens qui ouvrent une fiche (data-no-veil), ancres de la même page,
// nouvel onglet, touches de modification, réglage « réduire les animations ».
const MIN_VISIBLE = 450 // ms : le logo a le temps d'apparaître
const SAFETY = 8000 // ms : si la navigation n'aboutit pas, le voile s'efface quand même

const route = useRoute()
const on = ref(false)
let startedAt = 0
let hideTimer: number | undefined
let safetyTimer: number | undefined

const onClick = (e: MouseEvent) => {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
  // data-no-veil : liens qui ouvrent une fenêtre au lieu de changer de page (pavés, cercles).
  // On ne peut pas se fier à defaultPrevented : <NuxtLink> l'active pour toute navigation.
  if (!a || a.target === '_blank' || a.hasAttribute('download') || a.closest('[data-no-veil]')) return
  const url = new URL(a.href, window.location.href)
  if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return
  if (url.pathname.startsWith('/_studio') || url.pathname.startsWith('/api')) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  startedAt = performance.now()
  on.value = true
}

// Nouvelle page affichée : on laisse au logo le temps d'apparaître, puis le voile s'efface.
watch(
  () => route.path,
  () => {
    if (!on.value) return
    window.clearTimeout(hideTimer)
    const wait = Math.max(0, MIN_VISIBLE - (performance.now() - startedAt))
    hideTimer = window.setTimeout(() => {
      on.value = false
    }, wait)
  },
)

watch(on, (v) => {
  window.clearTimeout(safetyTimer)
  if (v)
    safetyTimer = window.setTimeout(() => {
      on.value = false
    }, SAFETY)
})

onMounted(() => document.addEventListener('click', onClick))
onBeforeUnmount(() => {
  document.removeEventListener('click', onClick)
  window.clearTimeout(hideTimer)
  window.clearTimeout(safetyTimer)
})
</script>

<template>
  <div :class="['page-veil', { 'is-on': on }]" aria-hidden="true">
    <NuxtImg
      src="/images/logo-bigfive.png"
      alt=""
      :width="1724"
      :height="1286"
      sizes="180px"
      format="webp"
      class="page-veil__logo"
    />
  </div>
</template>
