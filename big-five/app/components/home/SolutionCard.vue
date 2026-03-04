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
    </div>
  </div>
</template>

<style scoped>
.solution-card-compact {
  display: flex;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  max-height: 180px;
}
.solution-card-compact:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.4);
}

.card-image {
  flex: 0 0 40%;
  min-height: 120px;
}
.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  flex: 1;
  background: var(--gradient-card);
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.card-desc {
  font-size: 0.8rem;
  color: var(--color-text-light);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .solution-card-compact {
    flex-direction: column;
    max-height: none;
  }
  .card-image {
    min-height: 100px;
    flex: 0 0 auto;
  }
}
</style>
