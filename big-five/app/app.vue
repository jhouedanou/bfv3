<template>
  <div id="app">
    <NavBar :active-index="activeIndex" @navigate="slideTo" />
    <ClientOnly>
      <Swiper
        direction="vertical"
        :slides-per-view="1"
        :speed="700"
        :mousewheel="true"
        :keyboard="{ enabled: true }"
        :pagination="{ clickable: true }"
        :modules="modules"
        class="main-swiper"
        @swiper="onSwiper"
        @slide-change="onSlideChange"
      >
        <SwiperSlide>
          <SectionAgence />
        </SwiperSlide>
        <SwiperSlide>
          <SectionSolutions />
        </SwiperSlide>
        <SwiperSlide>
          <SectionObservatoire />
        </SwiperSlide>
        <SwiperSlide>
          <SectionContact />
        </SwiperSlide>
      </Swiper>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Mousewheel, Keyboard, Pagination } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

import 'swiper/css'
import 'swiper/css/pagination'

const modules = [Mousewheel, Keyboard, Pagination]
const activeIndex = ref(0)
let swiperInstance: SwiperType | null = null

function onSwiper(swiper: SwiperType) {
  swiperInstance = swiper
}

function onSlideChange(swiper: SwiperType) {
  activeIndex.value = swiper.activeIndex
}

function slideTo(index: number) {
  swiperInstance?.slideTo(index)
}
</script>

<style>
#app {
  height: 100%;
}

.main-swiper {
  width: 100%;
  height: 100vh;
}

.swiper-pagination {
  right: 20px !important;
}
</style>
