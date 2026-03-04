<template>
  <nav class="navbar">
    <div class="navbar__logo">
    <img src="/images/logo.svg" alt="Big Five Solutions Logo" class="navbar__logo-image" />  
    </div>
    <ul class="navbar__links">
      <li
        v-for="(item, index) in items"
        :key="item.label"
        class="navbar__item"
        :class="{ 'navbar__item--active': activeIndex === index }"
        @click="$emit('navigate', index)"
      >
        <span class="navbar__label">{{ item.label }}</span>
        <span class="navbar__indicator"></span>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  activeIndex: number
}>()

defineEmits<{
  navigate: [index: number]
}>()

const items = [
  { label: "L'AGENCE" },
  { label: 'SOLUTIONS' },
  { label: 'OBSERVATOIRE' },
  { label: 'NOUS CONTACTER' },
]
</script>

<style scoped lang="scss">
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 40px;
  background: linear-gradient(180deg, rgba(17, 17, 17, 0.9) 0%, transparent 100%);
  pointer-events: none;
}

.navbar__logo {
  pointer-events: auto;
}

.navbar__logo-text {
  font-size: 1.5rem;
  font-weight: 300;
  letter-spacing: 0.3em;
  color: var(--color-white);
}

.navbar__logo-text strong {
  font-weight: 800;
  color: var(--color-accent);
}

.navbar__links {
  display: flex;
  gap: 32px;
  pointer-events: auto;
}

.navbar__item {
  position: relative;
  cursor: pointer;
  padding: 8px 0;
  transition: color 0.3s ease;
}

.navbar__label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: var(--color-gray-light);
  transition: color 0.3s ease;
}

.navbar__item--active .navbar__label,
.navbar__item:hover .navbar__label {
  color: var(--color-accent);
}

.navbar__indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-accent);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.navbar__item--active .navbar__indicator {
  transform: scaleX(1);
}

@media (max-width: 768px) {
  .navbar {
    padding: 16px 20px;
  }

  .navbar__links {
    gap: 16px;
  }

  .navbar__label {
    font-size: 0.65rem;
    letter-spacing: 0.1em;
  }
}
</style>
