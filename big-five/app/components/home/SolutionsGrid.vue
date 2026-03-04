<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, X } from 'lucide-vue-next'

const { solutions } = useContent()

const sectionRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const selectedIndex = ref<number | null>(null)

function toggleSolution(idx: number) {
  selectedIndex.value = selectedIndex.value === idx ? null : idx
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) isVisible.value = true
    },
    { threshold: 0.1 }
  )
  if (sectionRef.value) observer.observe(sectionRef.value)
})
</script>

<template>
  <section
    ref="sectionRef"
    id="solutions"
    class="solutions-section h-full py-16 lg:py-20"
    :class="{ 'section-visible': isVisible }"
  >
    <div class="max-w-[1440px] mx-auto px-6 lg:px-12">
      <UiSectionTitle :title="solutions.sectionTitle" class="reveal-item" />

      <!-- Circles grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-8 mb-10">
        <div
          v-for="(item, idx) in solutions.items"
          :key="item.highlight"
          class="solution-circle reveal-item"
          :style="{ '--circle-delay': idx }"
        >
          <div
            class="circle-inner"
            :class="{ 'circle-inner--active': selectedIndex === idx }"
            @click="toggleSolution(idx)"
          >
            <span class="circle-label font-body">{{ item.label }}</span>
            <span class="circle-highlight font-heading">{{ item.highlight }}</span>
          </div>
          <button
            class="circle-plus"
            :class="{ 'circle-plus--active': selectedIndex === idx }"
            :aria-label="`${solutions.learnMoreLabel} ${item.highlight}`"
            @click="toggleSolution(idx)"
          >
            <X v-if="selectedIndex === idx" :size="14" />
            <Plus v-else :size="16" />
          </button>
        </div>
      </div>

      <!-- Solution detail card — shown on circle click -->
      <Transition name="card-reveal">
        <div v-if="selectedIndex !== null" :key="selectedIndex" class="solution-detail-wrapper">
          <HomeSolutionCard
            :title="solutions.items[selectedIndex].title"
            :highlight="solutions.items[selectedIndex].highlight"
            :description="solutions.items[selectedIndex].description"
            :image="solutions.items[selectedIndex].image"
          />
        </div>
      </Transition>
    </div>
  </section>
</template>

<style scoped>
.solution-circle {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.circle-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: #0d0b2e;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
}
.circle-inner:hover,
.circle-inner--active {
  transform: scale(1.05);
  box-shadow: 0 8px 40px rgba(123, 63, 160, 0.4);
}
.circle-inner--active {
  background: linear-gradient(135deg, #2d1b69, #7b3fa0);
  box-shadow: 0 8px 40px rgba(194, 58, 142, 0.5);
}

.circle-label {
  font-size: 0.8rem;
  color: var(--color-text-light);
}
.circle-highlight {
  font-size: 1rem;
  font-weight: 700;
  color: white;
}

.circle-plus {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  background: transparent;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}
.circle-plus:hover,
.circle-plus--active {
  background: var(--color-accent-magenta);
  border-color: transparent;
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

.solution-detail-wrapper {
  max-width: 700px;
  margin: 0 auto;
}

/* Reveal animations */
.reveal-item {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.7s ease;
  transition-delay: calc(var(--circle-delay, 0) * 0.1s);
}
.section-visible .reveal-item {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .circle-inner {
    width: 110px;
    height: 110px;
  }
}
</style>
