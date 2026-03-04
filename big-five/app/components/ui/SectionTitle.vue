<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <h2 class="section-title font-display">
    {{ title }}
  </h2>
</template>

<style scoped>
.section-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 400;
  color: white;
  letter-spacing: 0.15em;
  margin-bottom: 2rem;
  text-transform: uppercase;
}
</style>
