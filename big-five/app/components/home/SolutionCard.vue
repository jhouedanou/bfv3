<script setup lang="ts">
defineProps<{
  title: string
  highlight: string
  description: string
  image: string
  reverse?: boolean
}>()
</script>

<template>
  <div class="solution-card-compact">
    <!-- Image side -->
    <div class="card-image">
      <img :src="image" :alt="title" loading="lazy" />
    </div>

    <!-- Content side -->
    <div class="card-content">
      <h4 class="card-title font-heading">{{ title }}</h4>
      <p class="card-desc font-body">{{ description }}</p>
      <div class="card-logo">
        <img src="/images/card-logo.webp" alt="Big Five" class="card-logo-img" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.solution-card-compact {
      display: flex;
    border-radius:80px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    background: linear-gradient(135deg, #1a1054 0%, #2d1a6e 30%, #7b2d8e 70%, #a0369a 100%);
    min-height: 662px;
    max-width: 1174px;
    width: 100vw;
}

.card-image {
  flex: 0 0 42%;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
  max-height: 100vh;
}

.card-content {
  flex: 1;
  padding: 2rem 2.5rem 2rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
}

.card-title {
  font-size: clamp(1.8rem, 4vw, 65px);
  font-weight: 800;
  color: white;
  margin-bottom: 1rem;
  line-height: 1.1;
  letter-spacing: -0.02em;
  font-family:var(--font-display);
}

.card-desc {
  font-size: clamp(0.9rem, 1.5vw, 30px);
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
  //max-width: 320px;
}

.card-logo {
      position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
    width: 180px;
    height: 180px;
}
.card-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}

@media (max-width: 768px) {
  .solution-card-compact {
    flex-direction: column;
    min-height: auto;
    border-radius: 20px;
  }
  .card-image {
    flex: 0 0 auto;
    padding: 1rem 1rem 0;
  }
  .card-image img {
    max-height: 200px;
    border-radius: 16px;
  }
  .card-content {
    padding: 1.25rem 1.5rem 3.5rem;
  }
  .card-title {
    font-size: 1.6rem;
  }
  .card-logo {
    bottom: 1rem;
    right: 1rem;
    width: 45px;
    height: 45px;
  }
}
</style>
