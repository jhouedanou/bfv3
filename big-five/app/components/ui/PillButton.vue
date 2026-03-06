<script setup lang="ts">
defineProps<{
  label?: string
  variant?: 'outline' | 'filled'
  href?: string
}>()
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    class="pill-button"
    :class="{ 'pill-button--filled': variant === 'filled' }"
  >
    <UiBtnSliderBg class="pill-bg" />
    <span class="pill-label"><slot>{{ label }}</slot></span>
  </component>
</template>

<style scoped lang="scss">
.pill-button {
  position: relative;
  display: inline-block;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 9999px;
  color: white;
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 500;
  background: transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  letter-spacing: 0.02em;
  overflow: hidden;
}

.pill-bg {
  z-index: 0;
}

.pill-label {
  position: relative;
  z-index: 1;
}

.pill-button:hover {
  transform: translateY(-1px);
}

.pill-button--filled:hover {
  transform: translateY(-2px);
}
</style>
