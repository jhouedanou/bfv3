<script setup lang="ts">
import { ref } from 'vue'

const { agency } = useContent()

const imageColRef = ref<HTMLElement | null>(null)
const tiltStyle = ref({})

let tiltRaf: number | null = null

function onMouseMove(e: MouseEvent) {
  if (!imageColRef.value) return
  if (tiltRaf) return // skip if a frame is already scheduled
  tiltRaf = requestAnimationFrame(() => {
    tiltRaf = null
    if (!imageColRef.value) return
    const rect = imageColRef.value.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const rotateY = (x - 0.5) * 16
    const rotateX = (0.5 - y) * 12
    tiltStyle.value = {
      transform: `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`,
    }
  })
}

function onMouseLeave() {
  if (tiltRaf) { cancelAnimationFrame(tiltRaf); tiltRaf = null }
  tiltStyle.value = {
    transform: 'perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
  }
}
</script>

<template>
  <section
    class="agency-section relative h-full overflow-hidden"
  >
    <!-- Decorative circle -->
    <div class="deco-circle" aria-hidden="true" />

    <div class="max-w-[1440px] mx-auto px-6 lg:px-12 h-full flex items-center">
      <div
        class="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center w-full"
      >
        <!-- Left content -->
        <div class="content-col">
          <UiSectionTitle :title="agency.sectionTitle" />

          <h3 class="subtitle font-heading">
            {{ agency.subtitleLine1 }}<br>
            {{ agency.subtitleLine2 }}
          </h3>

          <p class="description font-body">
            {{ agency.description }}
          </p>

          <div class="flex flex-wrap gap-6 mt-8">
            <UiCounterUp
              v-for="counter in agency.counters"
              :key="counter.label"
              :target="counter.target"
              :prefix="counter.prefix"
              :suffix="counter.suffix"
            >
              {{ counter.label }}
            </UiCounterUp>
          </div>
        </div>

        <!-- Right image -->
        <div
          ref="imageColRef"
          class="image-col relative"
          :style="tiltStyle"
          @mousemove="onMouseMove"
          @mouseleave="onMouseLeave"
        >
          <div class="image-col-bg" aria-hidden="true" />
          <div class="agency-image">
            <img
              :src="agency.image.src"
              :alt="agency.image.alt"
              class="w-full h-full object-cover agency-img"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.agency-section {
  position: relative;
}

.deco-circle {
  position: absolute;
  top: 10%;
  right: 15%;
  width: 350px;
  height: 350px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(194, 58, 142, 0.25) 0%, transparent 70%);
  z-index: 0;
  opacity: 0.7;
}

/* --- Entrée parallaxe : chaque élément part d'un Y différent --- */

.content-col {
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: 1;
  opacity: 0;
  transform: translateY(60px);
  transition: opacity 0.9s ease, transform 1s ease;
}

/* Image col : tilt 3D au hover, entrée via opacity uniquement */
.image-col {
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: 1;
  opacity: 0;
  transform-style: preserve-3d;
  transition: opacity 0.9s ease 0.1s, transform 0.15s ease-out;
  will-change: transform;
  cursor: pointer;
}

.image-col-bg {
  opacity: 0;
  transform: translateZ(-20px) scale(1.04);
  transition: opacity 0.9s ease 0.05s;
}

.agency-img {
  opacity: 0;
  transform: translateZ(30px);
  transition: opacity 0.9s ease 0.15s;
}

/* L'activation est gérée dans main.scss via .swiper-slide-active #agence */

.subtitle {
      font-size: clamp(1rem, 2.5vw, 32px);
    color: white;
    margin-bottom: 1rem;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.06;
    letter-spacing: -0.64px;
    text-align: left;
    color: #fff;
    font-family: var(--font-body);
    max-width: 286px;
}

.description {
  font-size: clamp(0.8rem, 1.2vw, 16px);
  color:white;
  font-weight: 300;
  font-family: var(--font-body);

  font-stretch: normal;
  font-style: normal;
  line-height: 1.13;
  letter-spacing: 0.23px;
  text-align: left;
  color: #fff;  max-width: 296px;
}

@media (max-height: 700px) {
  .agency-image {
    max-width: 280px;
  }
}
</style>
