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

<style scoped lang="scss">
.section-title {
font-size: 65px;
  font-weight: 400;
  color: white;
  margin-bottom: 2rem;
  text-transform: uppercase;
  font-weight:200;
}
</style>
