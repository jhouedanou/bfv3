<script setup lang="ts">
import Swiper from 'swiper'
import { A11y, HashNavigation, Keyboard, Mousewheel } from 'swiper/modules'
import 'swiper/css'

// Accueil en plein écran (une section par diapositive) seulement avec une souris ou un pavé tactile,
// à partir de 1025 px et sans réglage « réduire les animations » ; sinon, défilement normal de la page.
// Le contenu de chaque section arrive par un slot nommé d'après son id.
const props = defineProps<{ slides: { id: string }[] }>()

const FULLPAGE =
  '(min-width: 1025px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
const SPEED = 1000
const NO_WHEEL = 'swiper-no-mousewheel'
// En dessous de ce dépassement, la section n'est pas « plus haute que l'écran » : la molette change de section.
const MIN_OVERFLOW = 40

const { modalOpen, activeSection } = useModal()
const fullpage = ref(false)
const root = ref<HTMLElement | null>(null)
const scrollers: (HTMLElement | null)[] = []

let swiper: Swiper | null = null
let mq: MediaQueryList | null = null
let io: IntersectionObserver | null = null
let wheelEls: HTMLElement[] = []

const setScroller = (i: number) => (el: unknown) => {
  scrollers[i] = (el as HTMLElement | null) ?? null
}

// Section plus haute que l'écran : la molette fait défiler son contenu, puis passe à la suivante au bord.
const onWheel = (e: WheelEvent) => {
  const el = e.currentTarget as HTMLElement
  const canScroll = el.scrollHeight - el.clientHeight > MIN_OVERFLOW
  const atTop = el.scrollTop <= 0
  const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1
  el.classList.toggle(NO_WHEEL, canScroll && ((e.deltaY > 0 && !atBottom) || (e.deltaY < 0 && !atTop)))
}

const syncActive = (sw: Swiper) => {
  activeSection.value = props.slides[sw.activeIndex]?.id ?? null
}

const onChangeStart = (sw: Swiper) => {
  // Arrivée par le bas : on montre la fin de la section ; par le haut : son début.
  const el = scrollers[sw.activeIndex]
  if (el) el.scrollTop = sw.activeIndex > sw.previousIndex ? 0 : el.scrollHeight
}

// Fenêtre ouverte : la molette et le clavier ne font plus glisser les sections derrière.
const applyModalLock = () => {
  const sw = swiper
  if (!sw || sw.destroyed) return
  if (modalOpen.value) {
    sw.mousewheel.disable()
    sw.keyboard.disable()
    sw.allowTouchMove = false
  } else {
    sw.mousewheel.enable()
    sw.keyboard.enable()
    sw.allowTouchMove = true
  }
}

const teardown = () => {
  sectionNav.go = null
  io?.disconnect()
  io = null
  wheelEls.forEach((el) => el.removeEventListener('wheel', onWheel))
  wheelEls = []
  if (swiper && !swiper.destroyed) swiper.destroy(true, true)
  swiper = null
}

const initSwiper = () => {
  if (!root.value) return
  swiper = new Swiper(root.value, {
    modules: [Mousewheel, Keyboard, HashNavigation, A11y],
    direction: 'vertical',
    speed: SPEED,
    mousewheel: { thresholdDelta: 20, noMousewheelClass: NO_WHEEL },
    keyboard: { enabled: true, onlyInViewport: true, pageUpDown: true },
    hashNavigation: { watchState: true, replaceState: true },
    a11y: {
      enabled: true,
      scrollOnFocus: true,
      containerMessage: null,
      containerRoleDescriptionMessage: null,
      itemRoleDescriptionMessage: null,
    },
    on: {
      slideChangeTransitionStart: onChangeStart,
      activeIndexChange: syncActive,
      afterInit: syncActive,
    },
  })
  // Menu, points de navigation et liens « #section » : on fait glisser au lieu de sauter.
  sectionNav.go = (id) => {
    const index = props.slides.findIndex((s) => s.id === id)
    if (index < 0 || !swiper) return false
    swiper.slideTo(index)
    return true
  }
  wheelEls = scrollers.filter(Boolean) as HTMLElement[]
  wheelEls.forEach((el) => el.addEventListener('wheel', onWheel, { passive: true }))
  applyModalLock()
}

// Défilement normal : la section au milieu de l'écran est la section active.
const initObserver = () => {
  const els = props.slides.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) activeSection.value = e.target.id
    },
    { rootMargin: '-45% 0px -50% 0px' },
  )
  els.forEach((el) => io!.observe(el))
}

const apply = async () => {
  teardown()
  // La page ne défile plus : chaque diapositive gère son propre défilement.
  document.documentElement.classList.toggle('is-fullpage', fullpage.value)
  await nextTick()
  if (fullpage.value) initSwiper()
  else initObserver()
}

const onMq = () => {
  if (!mq || mq.matches === fullpage.value) return
  fullpage.value = mq.matches
  apply()
}

watch(modalOpen, applyModalLock)

onMounted(() => {
  mq = window.matchMedia(FULLPAGE)
  fullpage.value = mq.matches
  mq.addEventListener('change', onMq)
  apply()
})

onBeforeUnmount(() => {
  mq?.removeEventListener('change', onMq)
  teardown()
  document.documentElement.classList.remove('is-fullpage')
  activeSection.value = null
})
</script>

<template>
  <template v-if="!fullpage">
    <template v-for="s in slides" :key="s.id">
      <slot :name="s.id" />
    </template>
  </template>
  <div v-else ref="root" class="swiper home-swiper">
    <div class="swiper-wrapper">
      <div v-for="(s, i) in slides" :key="s.id" class="swiper-slide" :data-hash="s.id">
        <div :ref="setScroller(i)" class="slide-scroll">
          <slot :name="s.id" />
        </div>
      </div>
    </div>
  </div>
</template>
