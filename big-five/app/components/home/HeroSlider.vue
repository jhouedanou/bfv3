<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const { hero } = useContent()

const currentSlide = ref(0)

let interval: ReturnType<typeof setInterval>

onMounted(() => {
  interval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % hero.slides.length
  }, 5000)
})

onUnmounted(() => clearInterval(interval))

const heroReady = ref(false)
onMounted(() => {
  setTimeout(() => { heroReady.value = true }, 200)
})
</script>

<template>
  <section class="hero relative h-screen overflow-hidden" id="hero">
    <!-- Slides -->
    <div
      v-for="(slide, i) in hero.slides"
      :key="i"
      class="slide absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
      :class="currentSlide === i ? 'opacity-100 z-[1]' : 'opacity-0 z-0'"
    >
      <div
        class="absolute inset-0 bg-cover bg-center"
        :style="{
          backgroundImage: `url(${slide.image})`,
          transform: currentSlide === i ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 6s ease-out'
        }"
      />
      <!-- Dark overlay for text readability -->
      <div class="absolute inset-0 bg-black/30" />
    </div>

    <!-- Content -->
    <div class="relative z-10 flex flex-col justify-center h-full px-6 md:px-16 lg:px-24 max-w-[1440px] mx-auto">
      <h1
        class="hero-title font-display"
        :class="{ 'hero-title--visible': heroReady }"
      >
        <span
          v-for="(line, idx) in hero.lines"
          :key="idx"
          class="hero-line"
          :style="{ '--delay': idx }"
        >{{ line }}</span>
      </h1>

      <div
        class="flex flex-col gap-3 mt-10"
        :class="{ 'hero-buttons--visible': heroReady }"
      >
        <UiPillButton
          v-for="(service, idx) in hero.services"
          :key="idx"
          :label="service"
          class="w-fit"
          :style="{ '--btn-delay': idx }"
        />
      </div>
    </div>

    <!-- Slide indicators -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
      <button
        v-for="(slide, i) in hero.slides"
        :key="i"
        class="indicator"
        :class="{ 'indicator--active': currentSlide === i }"
        :aria-label="`Slide ${i + 1}`"
        @click="currentSlide = i"
      />
    </div>
  </section>
</template>

<style scoped>
.hero-title {
  font-size: clamp(2rem, 6vw, 5rem);
  font-weight: 300;
  color: white;
  line-height: 1.1;
  letter-spacing: 0.04em;
  display: flex;
  flex-direction: column;
}

.hero-line {
  display: block;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
  transition-delay: calc(var(--delay) * 0.15s + 0.3s);
}

.hero-title--visible .hero-line {
  opacity: 1;
  transform: translateY(0);
}

.hero-buttons--visible :deep(.pill-button) {
  opacity: 0;
  animation: fadeInUp 0.6s ease forwards;
  animation-delay: calc(var(--btn-delay) * 0.12s + 1s);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}
.indicator--active {
  background: white;
  transform: scale(1.2);
}
.indicator:hover {
  background: rgba(255, 255, 255, 0.6);
}
</style>
