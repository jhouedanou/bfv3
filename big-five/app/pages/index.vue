<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Keyboard, HashNavigation } from 'swiper/modules'
import type SwiperType from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'

const { meta } = useContent()
const { registerSwiper, setActiveIndex } = useNavigation()
const { locale } = useI18n()

const ogImageUrl = `${meta.siteUrl}${meta.ogImage}`

useHead({
  title: meta.title,
  htmlAttrs: { lang: locale.value },
})

useSeoMeta({
  description: meta.description,
  robots: 'index, follow',
  // Open Graph
  ogType: 'website',
  ogTitle: meta.ogTitle,
  ogDescription: meta.ogDescription,
  ogImage: ogImageUrl,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageType: 'image/png',
  ogUrl: meta.siteUrl,
  ogSiteName: meta.ogSiteName,
  ogLocale: meta.locale,
  // Twitter Card
  twitterCard: meta.twitterCard as 'summary_large_image',
  twitterTitle: meta.ogTitle,
  twitterDescription: meta.ogDescription,
  twitterImage: ogImageUrl,
})

const modules = [Pagination, Keyboard, HashNavigation]

const isMobile = ref(false)
if (import.meta.client) {
  isMobile.value = window.innerWidth <= 768
}
const swiperSpeed = computed(() => isMobile.value ? 450 : 900)

let swiperInstance: SwiperType | null = null
let isTransitioning = false
let wheelAccumulator = 0
let wheelTimer: ReturnType<typeof setTimeout> | null = null

const WHEEL_THRESHOLD = 80 // Seuil cumulé avant de déclencher un changement de slide
const WHEEL_DEBOUNCE = 120 // Délai (ms) pour réinitialiser l'accumulateur

function handleWheel(e: WheelEvent) {
  if (!swiperInstance || isTransitioning) {
    e.preventDefault()
    return
  }

  // Vérifier si on est sur un slide scrollable avec du contenu défilable
  const activeSlideEl = swiperInstance.slides[swiperInstance.activeIndex] as HTMLElement
  const scrollableContent = activeSlideEl?.querySelector('.slide-scrollable') as HTMLElement
  if (scrollableContent) {
    const { scrollTop, scrollHeight, clientHeight } = scrollableContent
    const atTop = scrollTop <= 0
    const atBottom = scrollTop + clientHeight >= scrollHeight - 2

    // Laisser le scroll natif si le contenu n'est pas aux extrémités
    if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) {
      return
    }
  }

  e.preventDefault()

  // Accumuler le delta du wheel
  wheelAccumulator += e.deltaY

  // Réinitialiser l'accumulateur après un moment d'inactivité (debounce)
  if (wheelTimer) clearTimeout(wheelTimer)
  wheelTimer = setTimeout(() => {
    wheelAccumulator = 0
  }, WHEEL_DEBOUNCE)

  // Déclencher le changement de slide seulement si le seuil est atteint
  if (Math.abs(wheelAccumulator) >= WHEEL_THRESHOLD) {
    const direction = wheelAccumulator > 0 ? 1 : -1
    wheelAccumulator = 0

    if (direction > 0 && swiperInstance.activeIndex < swiperInstance.slides.length - 1) {
      isTransitioning = true
      swiperInstance.slideNext()
    } else if (direction < 0 && swiperInstance.activeIndex > 0) {
      isTransitioning = true
      swiperInstance.slidePrev()
    }
  }
}

function onSwiper(swiper: SwiperType) {
  swiperInstance = swiper
  registerSwiper((index: number) => swiper.slideTo(index))
}

function onSlideChange(swiper: SwiperType) {
  setActiveIndex(swiper.activeIndex)
}

function onTransitionEnd() {
  setTimeout(() => {
    isTransitioning = false
    wheelAccumulator = 0
  }, isMobile.value ? 50 : 200)
}

onMounted(() => {
  const wrapper = document.querySelector('.fullpage-swiper') as HTMLElement
  if (wrapper) {
    wrapper.addEventListener('wheel', handleWheel, { passive: false })
  }
})

onUnmounted(() => {
  const wrapper = document.querySelector('.fullpage-swiper') as HTMLElement
  if (wrapper) {
    wrapper.removeEventListener('wheel', handleWheel)
  }
  if (wheelTimer) clearTimeout(wheelTimer)
  swiperInstance = null
})
</script>

<template>
  <div class="fullpage-wrapper">
    <LayoutAppHeader />
    <Swiper
      :modules="modules"
      direction="vertical"
      :slides-per-view="1"
      :speed="swiperSpeed"
      :keyboard="{ enabled: true }"
      :pagination="{ clickable: true, el: '.fp-pagination' }"
      :hash-navigation="{ watchState: true }"
      :touch-ratio="1.5"
      :short-swipes="true"
      :long-swipes-ratio="0.3"
      :allow-touch-move="true"
      :css-mode="false"
      class="fullpage-swiper"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
      @slideChangeTransitionEnd="onTransitionEnd"
    >
      <!-- Slide 1: Hero -->
      <SwiperSlide data-hash="hero">
        <div class="slide-content">
          <HomeHeroSlider />
        </div>
      </SwiperSlide>

      <!-- Slide 2: L'Agence -->
      <SwiperSlide id="agence" data-hash="agence">
        <div class="slide-content slide-gradient">
          <HomeAgencySection />
        </div>
      </SwiperSlide>

      <!-- Slide 3: Équipe -->
      <SwiperSlide id="equipe" data-hash="equipe">
        <div class="slide-content slide-gradient">
          <HomeTeamCarousel />
        </div>
      </SwiperSlide>

      <!-- Slide 4: Solutions -->
      <SwiperSlide id="solutions" data-hash="solutions">
        <div class="slide-content slide-gradient slide-scrollable">
          <HomeSolutionsGrid />
        </div>
      </SwiperSlide>

      <!-- Slide 5: Observations -->
      <SwiperSlide id="observatoire" data-hash="observatoire">
        <div class="slide-content slide-gradient slide-scrollable">
          <HomeInsightsSection />
        </div>
      </SwiperSlide>

      <!-- Slide 6: Footer -->
      <SwiperSlide id="contact" data-hash="contact">
        <div class="slide-content slide-footer-wrap">
          <LayoutAppFooter />
        </div>
      </SwiperSlide>
    </Swiper>

    <!-- Custom pagination dots -->
    <div class="fp-pagination" />
  </div>
</template>

<style>
/* Swiper fullpage overrides */
.fullpage-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
}

.fullpage-swiper {
  width: 100%;
  height: 100%;
}

.fullpage-swiper .swiper-slide {
  height: 100vh !important;
  height: 100dvh !important;
  overflow: hidden;
}

/* Permettre le scroll interne sur les slides scrollables */
.fullpage-swiper #solutions,
.fullpage-swiper #observatoire {
  overflow: auto !important;
  -webkit-overflow-scrolling: touch;
}
/* Le footer a sa propre slide, observatoire peut scroller partout */
.fullpage-swiper #contact {
  overflow: hidden !important;
}

.slide-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.slide-footer-wrap {
  justify-content: center;
  align-items: stretch;
  background: var(--color-footer-bg);
}

/* Allow internal scroll for long sections */
.slide-scrollable {
  overflow-y: auto;
  justify-content: flex-start;
  height: auto;
  min-height: 100%;
  -ms-overflow-style: none;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.slide-scrollable::-webkit-scrollbar {
  display: none;
}

/* Custom pagination (right side dots) */
.fp-pagination {
  position: fixed !important;
  right: 24px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  z-index: 100 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 12px !important;
}

.fp-pagination .swiper-pagination-bullet {
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.3);
  opacity: 1;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.fp-pagination .swiper-pagination-bullet-active {
  background: white;
  transform: scale(1.3);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
}
</style>
