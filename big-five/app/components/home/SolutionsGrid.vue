<script setup lang="ts">
import { ref } from 'vue'

const { solutions } = useContent()

const selectedIndex = ref<number | null>(null)

function toggleSolution(idx: number) {
  selectedIndex.value = selectedIndex.value === idx ? null : idx
}
</script>

<template>
  <section
    class="solutions-section h-full py-16 lg:py-20 relative overflow-hidden"
  >
    <div class="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
      <UiSectionTitle :title="solutions.sectionTitle" class="parallax-title" />

      <!-- Circles -->
      <div class="circles-wrap">
        <div
          v-for="(item, idx) in solutions.items"
          :key="item.highlight"
          class="solution-item parallax-circle"
          :style="{ '--circle-delay': idx }"
        >
          <!-- bg-section circle -->
          <div
            class="bg-section"
            :class="{ 'bg-section--active': selectedIndex === idx }"
            @click="toggleSolution(idx)"
          >
            <span class="circle-label font-body">{{ item.label }}</span>
            <span class="circle-highlight font-heading">{{ item.highlight }}</span>
          </div>

          <!-- btn-section button -->
          <button
            class="btn-section"
            :class="{ 'btn-section--active': selectedIndex === idx }"
            :aria-label="`${solutions.learnMoreLabel} ${item.highlight}`"
            @click="toggleSolution(idx)"
          >
            <div class="btn-section__circle"></div>
            <div class="btn-section__icon" :class="{ 'btn-section__icon--close': selectedIndex === idx }"></div>
          </button>
        </div>
      </div>

      <!-- Solution detail card — shown on circle click -->
      <!-- Overlay centré — Teleport pour éviter le clipping par Swiper -->
      <Teleport to="body">
        <Transition name="card-reveal">
          <div v-if="selectedIndex !== null" :key="selectedIndex" class="solution-overlay" @click.self="selectedIndex = null">
            <div class="solution-detail-wrapper">
              <button class="overlay-close" aria-label="Fermer" @click="selectedIndex = null">✕</button>
              <HomeSolutionCard
                :title="solutions.items[selectedIndex].title"
                :highlight="solutions.items[selectedIndex].highlight"
                :description="solutions.items[selectedIndex].description"
                :image="solutions.items[selectedIndex].image"
              />
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </section>
</template>

<style scoped lang="scss">
$btn-icon-color: #d7ccff;
$btn-gradient-start: #29358b;
$btn-gradient-end: #80368d;

.circles-wrap {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: flex-start;
  gap: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 2.5rem;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.solution-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  flex: 0 0 296px;
  max-width: 296px;
}

/* === bg-section (cercle principal) === */
.bg-section {
  width: 296px;
  height: 296px;
  border-radius: 50%;
  background-color: #160e44;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    padding: 7px;
    background: linear-gradient(to right, #29358b, #80368d);
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    transition: opacity 0.3s;
  }

  &:hover {
    transform: scale(1.05);
  }

  &--active {
    transform: scale(1.05);

    &::before {
      padding: 3px;
      background: linear-gradient(to right, #80368d, #c23a8e);
    }
  }
}

.circle-label {
  font-size: clamp(0.65rem, 35px, 35px);
  color: var(--color-text-light);
  position: relative;
  font-weight: 100;
  color: white;
  z-index: 1;
}
.circle-highlight {
  font-size: clamp(0.8rem, 35px, 35px);
  font-weight: 100;
  font-family: var(--font-body);
  color: white;
  position: relative;
  z-index: 1;
}

/* === btn-section (bouton +) === */
.btn-section {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(to bottom, $btn-gradient-start, $btn-gradient-end);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.15);
  }

  &__circle {
       position: absolute;
    width: 53px;
    height: 53px;
    border-radius: 50%;
    border: 4.5px solid #d7ccff;
  }

  &__icon {
    position: relative;
    width: 30px;
    height: 30px;

    &::before,
    &::after {
      content: '';
      position: absolute;
      background-color: $btn-icon-color;
      border-radius: 2px;
      transition: transform 0.3s;
    }

    // Barre horizontale
    &::before {
      width: 100%;
      height: 5px;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }

    // Barre verticale
    &::after {
      width: 5px;
      height: 100%;
      left: 50%;
      top: 0;
      transform: translateX(-50%);
    }

    // Rotation en X quand actif
    &--close {
      &::before {
        transform: translateY(-50%) rotate(45deg);
      }
      &::after {
        transform: translateX(-50%) rotate(45deg);
      }
    }
  }

  &--active {
    background: linear-gradient(to bottom, #80368d, #c23a8e);
  }
}

/* Parallax d'entrée */
.parallax-title {
  opacity: 0;
  transform: translateY(60px);
  transition: opacity 0.9s ease, transform 1s ease;
}
.parallax-circle {
  opacity: 0;
  transform: translateY(140px);
  transition: opacity 0.9s ease, transform 1.3s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: calc(var(--circle-delay, 0) * 0.1s + 0.1s);
}
/* Activation via main.scss : #solutions.swiper-slide-active */

@media (max-width: 768px) {
  .circles-wrap {
    max-width: 100%;
    gap: 0.75rem;
    overflow-x: auto;
  }
  .solution-item {
    flex: 0 0 140px;
    max-width: 140px;
  }
  .bg-section {
    width: 140px;
    height: 140px;
  }
  .circle-label {
    font-size: 0.6rem;
  }
  .circle-highlight {
    font-size: 0.75rem;
  }
  .btn-section {
    width: 28px;
    height: 28px;
  }
  .btn-section__circle {
    width: 22px;
    height: 22px;
  }
  .btn-section__icon {
    width: 10px;
    height: 10px;
  }
}
.solutions-section{
  height:100vh;

    display: flex;
    align-items: center;
}
</style>

<!-- Styles non-scoped pour l'overlay téléporté au body -->
<style lang="scss">
.solution-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 6, 30, 0.7);
  padding: 1.5rem;
}

.solution-detail-wrapper {
  position: relative;
  width: 100%;
  max-width:76vw;
  display: flex;
  justify-content: center;
}

.overlay-close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(4px);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, background 0.2s;

  &:hover {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.25);
  }
}

/* Card reveal transition */
.card-reveal-enter-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.card-reveal-leave-active {
  transition: all 0.3s ease;
}
.card-reveal-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.97);
}
.card-reveal-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.97);
}
</style>
