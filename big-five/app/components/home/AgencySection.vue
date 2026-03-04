<script setup lang="ts">
import { ref, onMounted } from 'vue'

const { agency } = useContent()

const sectionRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) isVisible.value = true
      })
    },
    { threshold: 0.2 }
  )
  if (sectionRef.value) observer.observe(sectionRef.value)
})
</script>

<template>
  <section
    ref="sectionRef"
    id="agence"
    class="agency-section relative h-full overflow-hidden"
  >
    <!-- Decorative circle -->
    <div class="deco-circle" aria-hidden="true" />

    <div class="max-w-[1440px] mx-auto px-6 lg:px-12 h-full flex items-center">
      <div
        class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full"
        :class="{ 'section-visible': isVisible }"
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
        <div class="image-col relative">
          <div class="agency-image">
            <img
              :src="agency.image.src"
              :alt="agency.image.alt"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
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
  animation: pulse 8s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.content-col {
  position: relative;
  z-index: 1;
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.8s ease;
}
.section-visible .content-col {
  opacity: 1;
  transform: translateY(0);
}

.image-col {
  position: relative;
  z-index: 1;
  opacity: 0;
  transform: translateX(40px);
  transition: all 0.8s ease 0.3s;
}
.section-visible .image-col {
  opacity: 1;
  transform: translateX(0);
}

.subtitle {
  font-size: clamp(1.15rem, 2.5vw, 1.6rem);
  font-weight: 600;
  color: white;
  line-height: 1.3;
  margin-bottom: 1rem;
}

.description {
  font-size: 0.9rem;
  color: var(--color-text-light);
  line-height: 1.7;
  max-width: 500px;
}

.agency-image {
  width: 100%;
  max-width: 380px;
  aspect-ratio: 3 / 4;
  border-radius: 20px;
  overflow: hidden;
  margin-left: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

@media (max-height: 700px) {
  .agency-image {
    max-width: 280px;
  }
}
</style>
