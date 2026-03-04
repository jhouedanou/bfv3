<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Mousewheel, Pagination, Keyboard, HashNavigation } from 'swiper/modules'
import type { SwiperClass } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'

const { meta } = useContent()

const ogImageUrl = `${meta.siteUrl}${meta.ogImage}`

useHead({
  title: meta.title,
  htmlAttrs: { lang: 'fr' },
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

const modules = [Mousewheel, Pagination, Keyboard, HashNavigation]
const swiperInstance = ref<SwiperClass | null>(null)
const activeIndex = ref(0)

function onSwiper(swiper: SwiperClass) {
  swiperInstance.value = swiper
}

function onSlideChange(swiper: SwiperClass) {
  activeIndex.value = swiper.activeIndex
}

/* Expose navigation for header links */
function goToSlide(index: number) {
  swiperInstance.value?.slideTo(index)
}

provide('goToSlide', goToSlide)
provide('activeSlideIndex', activeIndex)
</script>

<template>
  <div class="fullpage-wrapper">
    <Swiper
      :modules="modules"
      direction="vertical"
      :slides-per-view="1"
      :speed="900"
      :mousewheel="{ sensitivity: 1, thresholdDelta: 40 }"
      :keyboard="{ enabled: true }"
      :pagination="{ clickable: true, el: '.fp-pagination' }"
      :hash-navigation="{ watchState: true }"
      class="fullpage-swiper"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
    >
      <!-- Slide 1: Hero -->
      <SwiperSlide data-hash="hero">
        <div class="slide-content">
          <HomeHeroSlider />
        </div>
      </SwiperSlide>

      <!-- Slide 2: L'Agence -->
      <SwiperSlide data-hash="agence">
        <div class="slide-content slide-gradient">
          <HomeAgencySection />
        </div>
      </SwiperSlide>

      <!-- Slide 3: Équipe -->
      <SwiperSlide data-hash="equipe">
        <div class="slide-content slide-gradient">
          <HomeTeamCarousel />
        </div>
      </SwiperSlide>

      <!-- Slide 4: Solutions -->
      <SwiperSlide data-hash="solutions">
        <div class="slide-content slide-gradient slide-scrollable">
          <HomeSolutionsGrid />
        </div>
      </SwiperSlide>

      <!-- Slide 5: Observations + Contact -->
      <SwiperSlide data-hash="observatoire">
        <div class="slide-content slide-gradient slide-scrollable">
          <HomeInsightsSection />
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
  overflow: hidden;
}

.fullpage-swiper {
  width: 100%;
  height: 100%;
}

.fullpage-swiper .swiper-slide {
  height: 100vh !important;
  overflow: hidden;
}

.slide-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.slide-gradient {
  background: var(--gradient-hero);
}

.slide-footer {
  background: var(--color-footer-bg);
  justify-content: center;
}

/* Allow internal scroll for long sections */
.slide-scrollable {
  overflow-y: auto;
  justify-content: flex-start;
  -ms-overflow-style: none;
  scrollbar-width: none;
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
