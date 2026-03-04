<script setup lang="ts">
const props = withDefaults(defineProps<{
  strokeWidth?: number
}>(), {
  strokeWidth: 2,
})
</script>

<template>
  <svg
    class="btn-slider-bg"
    viewBox="0 0 200 50"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="btn-slider-stroke" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="rgb(41,53,139)" />
        <stop offset="1" stop-color="rgb(128,54,141)" />
      </linearGradient>
    </defs>
    <rect
      :x="strokeWidth / 2"
      :y="strokeWidth / 2"
      :width="200 - strokeWidth"
      :height="50 - strokeWidth"
      rx="25"
      ry="25"
      fill="rgb(21,9,104)"
      :stroke="'url(#btn-slider-stroke)'"
      :stroke-width="strokeWidth"
    />
  </svg>
</template>

<style scoped>
.btn-slider-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
