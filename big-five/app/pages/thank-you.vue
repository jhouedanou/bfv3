<script setup lang="ts">
const { thankYou } = useContent()
</script>

<template>
  <div class="thank-you-page">
    <div class="thank-you-card">
      <div class="thank-you-icon">✓</div>
      <h1 class="thank-you-title font-heading">{{ thankYou.title }}</h1>
      <p class="thank-you-message font-body">{{ thankYou.message }}</p>
      <NuxtLink to="/" class="thank-you-back">
        {{ thankYou.backLabel }}
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.thank-you-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #0d0830 0%, #1a1054 40%, #2d1a6e 70%, #7b2d8e 100%);
  padding: 2rem;
}

.thank-you-card {
  text-align: center;
  max-width: 520px;
  width: 100%;
}

.thank-you-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #c23a8e, #a0369a);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  box-shadow: 0 12px 40px rgba(194, 58, 142, 0.4);
}

.thank-you-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: white;
  margin-bottom: 1rem;
}

.thank-you-message {
  font-size: clamp(1rem, 2vw, 1.15rem);
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.7;
  margin-bottom: 2.5rem;
}

.thank-you-back {
  display: inline-block;
  padding: 0.85rem 2.5rem;
  border-radius: 50px;
  background: linear-gradient(135deg, #c23a8e, #a0369a);
  color: white;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(194, 58, 142, 0.4);
  }
}
</style>
