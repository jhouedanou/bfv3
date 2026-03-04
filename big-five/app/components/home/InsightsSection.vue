<script setup lang="ts">
import { ref, onMounted } from 'vue'

const { insights } = useContent()

const sectionRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) isVisible.value = true
    },
    { threshold: 0.15 }
  )
  if (sectionRef.value) observer.observe(sectionRef.value)
})
</script>

<template>
  <section
    ref="sectionRef"
    id="observatoire"
    class="insights-section h-full py-16 lg:py-20"
    :class="{ 'section-visible': isVisible }"
  >
    <div class="max-w-[1440px] mx-auto px-6 lg:px-12">
      <UiSectionTitle :title="insights.sectionTitle" class="reveal-item" />

      <!-- Insights Hero -->
      <div class="insights-hero reveal-item mb-10">
        <div class="insights-hero-bg">
          <img
            :src="insights.hero.image"
            :alt="insights.hero.imageAlt"
            loading="lazy"
          />
          <div class="insights-overlay" />
        </div>
        <div class="insights-hero-content">
          <span class="insights-badge font-body">{{ insights.hero.badge }}</span>
          <h3 class="insights-subtitle font-heading">
            {{ insights.hero.subtitle }}
          </h3>
        </div>
      </div>

      <!-- Two columns -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <!-- Block 1: Souveraineté Numérique -->
        <div class="insight-block reveal-item" style="--block-delay: 0">
          <h4 class="block-title font-heading">{{ insights.blocks[0].title }}</h4>
          <p class="block-subtitle font-heading">
            {{ insights.blocks[0].subtitle }}
          </p>
          <p class="block-desc font-body">
            {{ insights.blocks[0].description }}
          </p>
          <UiPillButton :label="insights.blocks[0].cta" class="mt-4" />
        </div>

        <!-- Block 2: Baromètre Digital -->
        <div class="insight-block reveal-item" style="--block-delay: 1">
          <h4 class="block-title font-heading">{{ insights.blocks[1].title }}</h4>

          <div class="bars-wrapper">
            <div
              v-for="(bar, idx) in insights.blocks[1].bars"
              :key="bar.label"
              class="bar-item"
            >
              <div class="bar-header">
                <span class="bar-label font-body">{{ bar.label }}</span>
                <span class="bar-value font-heading">+{{ bar.value }}{{ bar.suffix }}</span>
              </div>
              <div class="bar-track">
                <div
                  class="bar-fill"
                  :style="{
                    '--target-width': bar.value + '%',
                    '--bar-delay': idx * 0.2 + 's'
                  }"
                  :class="{ 'bar-fill--animated': isVisible }"
                />
              </div>
            </div>
          </div>

          <p class="bar-source font-body">{{ insights.blocks[1].source }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.insights-hero {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  min-height: 200px;
  display: flex;
  align-items: flex-end;
}

.insights-hero-bg {
  position: absolute;
  inset: 0;
}
.insights-hero-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.insights-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(26, 10, 62, 0.95) 0%,
    rgba(26, 10, 62, 0.4) 100%
  );
}

.insights-hero-content {
  position: relative;
  z-index: 1;
  padding: 2rem;
}

.insights-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-accent-magenta);
  margin-bottom: 0.5rem;
}

.insights-subtitle {
  font-size: clamp(1.1rem, 2.5vw, 1.5rem);
  font-weight: 600;
  color: white;
}

.insight-block {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.7s ease;
  transition-delay: calc(var(--block-delay, 0) * 0.2s);
}
.section-visible .insight-block {
  opacity: 1;
  transform: translateY(0);
}

.block-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: white;
  letter-spacing: 0.08em;
  margin-bottom: 0.5rem;
}

.block-subtitle {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-accent-magenta);
  margin-bottom: 0.5rem;
}

.block-desc {
  font-size: 0.85rem;
  color: var(--color-text-light);
  line-height: 1.6;
}

.bars-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.75rem;
}

.bar-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.3rem;
}
.bar-label {
  font-size: 0.8rem;
  color: var(--color-text-light);
}
.bar-value {
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
}

.bar-track {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  width: 0;
  border-radius: 4px;
  background: var(--gradient-button);
  transition: width 1.2s ease;
  transition-delay: var(--bar-delay, 0s);
}
.bar-fill--animated {
  width: var(--target-width);
}

.bar-source {
  font-size: 0.7rem;
  color: var(--color-text-muted);
  margin-top: 0.75rem;
  font-style: italic;
}

.reveal-item {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.7s ease;
}
.section-visible .reveal-item {
  opacity: 1;
  transform: translateY(0);
}
</style>
