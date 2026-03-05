<script setup lang="ts">
const { insights } = useContent()
</script>

<template>
  <section class="insights-section h-full relative">
    <div class="insights-layout">
      <!-- TOP: Hero zone with background image -->
      <div class="insights-hero parallax-hero">
        <div class="insights-hero-bg">
          <img
            :src="insights.hero.image"
            :alt="insights.hero.imageAlt"
            loading="lazy"
          />
          <div class="insights-overlay" />
        </div>
        <div class="insights-hero-content">
          <UiSectionTitle :title="insights.sectionTitle" class="parallax-title insights-title-override" />
          <h3 class="insights-badge font-heading">{{ insights.hero.badge }}</h3>
          <p class="insights-subtitle font-body">{{ insights.hero.subtitle }}</p>
        </div>
      </div>

      <!-- BOTTOM: Two columns + footer -->
      <div class="insights-bottom">
        <div class="insights-columns">
          <!-- Block 1: Souveraineté Numérique -->
          <div class="insight-block reveal-item" style="--block-delay: 0">
            <h4 class="block-title font-heading">{{ insights.blocks[0].title }}</h4>
            <p class="block-subtitle font-heading">{{ insights.blocks[0].subtitle }}</p>
            <p class="block-desc font-body">{{ insights.blocks[0].description }}</p>
            <a
              v-if="insights.blocks[0].ctaLink"
              :href="insights.blocks[0].ctaLink"
              target="_blank"
              rel="noopener noreferrer"
              class="block-cta"
            >
              {{ insights.blocks[0].cta }}
            </a>
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
                  />
                </div>
              </div>
            </div>
            <p class="bar-source font-body">*Source : {{ insights.blocks[1].source }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.insights-section {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #0a0620;
}

.insights-layout {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 100vh;
}

/* ---- HERO TOP ---- */
.insights-hero {
  position: relative;
  flex: 0 0 auto;
  min-height: 50vh;
  display: flex;
  align-items: center;
  padding: 2rem 0;
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

.insights-hero-content {
  position: relative;
  z-index: 1;
  padding: 2rem 3rem;
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
}

.insights-title-override {
  margin-bottom: 0rem;
}

.insights-badge {
  font-size: clamp(2rem, 5vw, 85px);
  font-weight: 800;
  color: white;
  line-height: 1.1;
  margin-bottom: 0.5rem;
}

.insights-subtitle {
  font-size: clamp(0.9rem, 1.5vw, 30px);

  color: white;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #fff;
  font-family: var(--font-display);}

/* ---- BOTTOM SECTION ---- */
.insights-bottom {
  flex: 1;
  background: #0a0620;
  padding: 2.5rem 3rem 1rem;
  max-width: 100vw;
  margin: 0 auto;
  width: 100%;
}

.insights-columns {
  display: flex;
  gap: 3rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
}

.insight-block {
  flex: 1;
  min-width: 0;
  opacity: 0;
  transform: translateY(100px);
  transition: opacity 0.9s ease, transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: calc(var(--block-delay, 0) * 0.15s + 0.2s);
}

.block-title {
  font-size: clamp(1.1rem, 2vw, 42px);
  font-weight: 800;
    font-size: 42px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: #bfb0ff;
  font-family: var(--font-display);
}

.block-subtitle {
  margin-top: 2.25rem;
  font-size: clamp(0.95rem, 1.5vw, 1.15rem);
  font-weight: 700;
  color: white;
  font-size: 27px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.15;
  letter-spacing: normal;
  text-align: left;
  color: #fff;
  font-family: var(--font-display);

}

.block-desc {  margin-top: 2.25rem;
  font-family: var(--font-display);

  font-size: clamp(0.8rem, 1.2vw, 0.95rem);
  font-size: 19px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.16;
  letter-spacing: -0.67px;
  text-align: left;
  color: #bfb0ff;}

.block-cta {
  display: inline-block;
  margin-top: 1.25rem;
  padding: 0.6rem 1.8rem;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.3s, border-color 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.4);
  }
}

/* ---- BAROMETER ---- */
.bars-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.75rem;
}

.bar-header {
  display: flex;
  justify-content: flex-start;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}
.bar-label {
  margin-top: 1.25rem;
  font-size: clamp(0.8rem, 1.2vw, 21px);
  font-weight: 700;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: #bfb0ff;
  margin-bottom:1.25rem;
}
.bar-value {
   margin-top: 1.25rem;
  font-size: clamp(0.8rem, 1.2vw, 21px);
  font-weight: 700;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: #bfb0ff;
  margin-bottom:1.25rem;
}

.bar-track {
  height: 20px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 5px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  width: 0;
  border-radius: 5px;
  background: linear-gradient(to right, #2a3a9e, #c23a8e);
  transition: width 1.2s ease;
  transition-delay: var(--bar-delay, 0s);
}

.bar-source {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.35);
  margin-top: 1rem;
  font-style: italic;
}

/* Parallax d'entrée */
.parallax-title {
  opacity: 0;
  transform: translateY(60px);
  transition: opacity 0.9s ease, transform 1s ease;
}
.parallax-hero {
  opacity: 0;
  transform: translateY(140px);
  transition: opacity 0.9s ease 0.1s, transform 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.1s;
}
/* Activation via main.scss : #observatoire.swiper-slide-active */
</style>
