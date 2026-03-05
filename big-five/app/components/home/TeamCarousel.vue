<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronRight, ChevronLeft } from 'lucide-vue-next'

const { team } = useContent()

const ITEMS_PER_SLIDE = 4
const currentSlide = ref(0)

const slides = computed(() => {
  const result: typeof team.members[] = []
  for (let i = 0; i < team.members.length; i += ITEMS_PER_SLIDE) {
    result.push(team.members.slice(i, i + ITEMS_PER_SLIDE))
  }
  return result
})

const totalSlides = computed(() => slides.value.length)
const canScrollLeft = computed(() => currentSlide.value > 0)
const canScrollRight = computed(() => currentSlide.value < totalSlides.value - 1)
const scrollProgress = computed(() =>
  totalSlides.value > 1 ? currentSlide.value / (totalSlides.value - 1) : 0
)

function scroll(dir: 'left' | 'right') {
  if (dir === 'right' && canScrollRight.value) {
    currentSlide.value++
  } else if (dir === 'left' && canScrollLeft.value) {
    currentSlide.value--
  }
}
</script>

<template>
  <section
    class="team-section h-full relative flex flex-col justify-center overflow-hidden"
  >
    <div class="max-w-[1440px] mx-auto px-6 lg:px-12 w-full relative z-10">
      <UiSectionTitle :title="team.sectionTitle" class="parallax-title" />

      <div class="relative mt-8">
        <!-- Carousel -->
        <div class="carousel-viewport">
          <div
            class="carousel-track"
            :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
          >
            <div
              v-for="(slide, slideIdx) in slides"
              :key="slideIdx"
              class="carousel-slide"
            >
              <div
                v-for="(member, idx) in slide"
                :key="member.name"
                class="team-card parallax-card"
                :style="{ '--card-delay': slideIdx * ITEMS_PER_SLIDE + idx }"
              >
                <a :href="member.linkedin" target="_blank" rel="noopener noreferrer" class="linkedin-icon" aria-label="LinkedIn">
                  <img src="/images/linkedInIcon.svg" alt="LinkedIn" class="linkedin-img" />
                </a>
                <h4 class="team-name font-heading">{{ member.name }}</h4>
                <p class="team-role font-body">{{ member.role }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation arrows -->
        <button
          v-show="canScrollLeft"
          class="carousel-arrow carousel-arrow--left"
          :aria-label="team.prevLabel"
          @click="scroll('left')"
        >
          <ChevronLeft :size="28" />
        </button>
        <button
          v-show="canScrollRight"
          class="carousel-arrow carousel-arrow--right"
          :aria-label="team.nextLabel"
          @click="scroll('right')"
        >
          <ChevronRight :size="28" />
        </button>
      </div>

      <!-- Progress bar + nav buttons -->
      <div class="carousel-controls">
        <button
          class="ctrl-arrow"
          :disabled="!canScrollLeft"
          aria-label="Précédent"
          @click="scroll('left')"
        >
          <ChevronLeft :size="20" />
        </button>

        <div class="progress-track">
          <div class="progress-fill" :style="{ width: scrollProgress * 100 + '%' }" />
        </div>

        <button
          class="ctrl-arrow"
          :disabled="!canScrollRight"
          aria-label="Suivant"
          @click="scroll('right')"
        >
          <ChevronRight :size="20" />
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.carousel-viewport {
  overflow: clip;
  overflow-y: visible;
  width: 100%;
  padding: 2rem 0;
  margin: -2rem 0;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.carousel-slide {
  display: flex;
  gap: 3rem;
  justify-content: center;
  flex: 0 0 100%;
  min-width: 100%;
  padding: 0 1rem;
  overflow: visible;
}

.team-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #0d0b2e;
  border-radius: 50px;
  padding: clamp(1.5rem, 3vw, 2.5rem) clamp(1.25rem, 2vw, 2rem);
  flex: 1 1 0;
  width:100vw;
  height:100vh;
 max-width: 248px;
  max-height: 341px;
  gap: 0.75rem;
  transition: transform 0.2s ease, filter 0.2s ease;
}
.team-card:hover {
  transform: scale(1.25);
  z-index: 2;
}

.carousel-slide:hover .team-card:not(:hover) {
  filter: brightness(0.35);
}

.linkedin-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  transition: transform 0.3s;
}
.linkedin-icon:hover {
  transform: scale(1.1);
}
.linkedin-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.team-name {
  font-size: clamp(0.9rem, 1.5vw, 30px);
  font-weight: 700;
  color: white;
  text-align: center;
  font-family: var(--font-display);
}

.team-role {
  font-size: clamp(0.75rem, 1.2vw, 0.85rem);
  color: white;
  text-align: center;
   font-size: 20px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.25;
  letter-spacing: -0.5px;
  text-align: center;
  color: #fff;
    font-family: var(--font-display);

}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 2;
}
.carousel-arrow:hover {
  background: rgba(255, 255, 255, 0.2);
}
.carousel-arrow--left {
  left: -20px;
}
.carousel-arrow--right {
  right: -20px;
}

/* Controls: arrows + progress bar */
.carousel-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 1.5rem;
  max-width: 100vw;
}

.ctrl-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  color: white;
  cursor: pointer;
  transition: background 0.3s;
}
.ctrl-arrow:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
}
.ctrl-arrow:disabled {
  opacity: 0.3;
  cursor: default;
}

.progress-track {
  flex: 1;
  height: 3px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(to right, var(--color-accent-purple), var(--color-accent-magenta));
  border-radius: 2px;
  transition: width 0.15s ease-out;
  min-width: 8%;
}

/* Parallax d'entrée */
.parallax-title {
  opacity: 0;
  transform: translateY(60px);
  transition: opacity 0.9s ease, transform 1s ease;
}
.parallax-card {
  opacity: 0;
  transform: translateY(120px);
  transition: opacity 0.9s ease, transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: calc(var(--card-delay, 0) * 0.08s + 0.15s);
}
/* Activation via main.scss : #equipe.swiper-slide-active */
</style>
