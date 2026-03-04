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
  transition: opacity 0.3s ease, filter 0.3s ease;
}

.pill-label {
  position: relative;
  z-index: 1;
}

.pill-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(128, 54, 141, 0.4);
}

.pill-button:hover .pill-bg {
  filter: brightness(1.3);
}

.pill-button--filled .pill-bg {
  filter: brightness(1.15);
}

.pill-button--filled:hover {
  box-shadow: 0 6px 30px rgba(128, 54, 141, 0.5);
  transform: translateY(-2px);
}
</style>
