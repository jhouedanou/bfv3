<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject } from 'vue'
import { Search, Menu, X } from 'lucide-vue-next'

const { header } = useContent()

const scrolled = ref(false)
const mobileOpen = ref(false)

const goToSlide = inject<(index: number) => void>('goToSlide', () => {})

/* Simulate scroll effect based on active slide */
const activeSlideIndex = inject<{ value: number }>('activeSlideIndex', ref(0))

function handleScroll() {
  scrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  /* Also track active slide for header bg */
  const checkSlide = () => {
    scrolled.value = (activeSlideIndex as any).value > 0
  }
  const interval = setInterval(checkSlide, 300)
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    clearInterval(interval)
  })
})

function navigateTo(index: number) {
  goToSlide(index)
  mobileOpen.value = false
}
</script>

<template>
  <header
    class="fixed top-0 left-0 w-full z-50 transition-all duration-500"
    :class="scrolled || (activeSlideIndex as any).value > 0 ? 'header--scrolled' : 'header--transparent'"
  >
    <div class="max-w-[1440px] mx-auto flex items-center justify-between px-6 lg:px-12 py-4">
      <!-- Logo -->
      <a
        href="#"
        class="logo-wrapper flex-shrink-0"
        aria-label="Big Five Solutions"
        @click.prevent="navigateTo(0)"
      >
        <img src="/images/logo.svg" alt="Big Five Solutions Logo" class="logo" />

      </a>

      <!-- Desktop nav -->
      <nav class="hidden lg:flex items-center gap-8" aria-label="Navigation principale">
        <button
          v-for="item in header.nav"
          :key="item.label"
          class="nav-link"
          @click="navigateTo(item.slideIndex)"
        >
          {{ item.label }}
        </button>
        <button class="nav-contact" @click="navigateTo(4)">{{ header.contactButton }}</button>
        <button class="nav-icon" :aria-label="header.searchLabel">
          <Search :size="18" />
        </button>
        <button class="nav-lang">{{ header.lang }} <span class="text-xs">▾</span></button>
      </nav>

      <!-- Mobile toggle -->
      <button
        class="lg:hidden text-white z-50"
        aria-label="Menu"
        @click="mobileOpen = !mobileOpen"
      >
        <X v-if="mobileOpen" :size="28" />
        <Menu v-else :size="28" />
      </button>
    </div>

    <!-- Mobile menu -->
    <Transition name="slide">
      <div v-if="mobileOpen" class="mobile-menu lg:hidden">
        <nav class="flex flex-col items-center gap-6 pt-8">
          <button
            v-for="item in header.nav"
            :key="item.label"
            class="mobile-link"
            @click="navigateTo(item.slideIndex)"
          >
            {{ item.label }}
          </button>
          <button class="nav-contact" @click="navigateTo(4)">{{ header.contactButton }}</button>
          <button class="nav-lang mt-4">{{ header.lang }} <span class="text-xs">▾</span></button>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.header--transparent {
  background: transparent;
}
.header--scrolled {
  background: rgba(26, 10, 62, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
}

.logo {
  width: 80px;
  height: 60px;
}

.nav-link {
  color: rgba(255, 255, 255, 0.85);
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: color 0.3s;
  text-transform: uppercase;
  background: none;
  border: none;
  cursor: pointer;
}
.nav-link:hover {
  color: white;
}

.nav-contact {
  color: white;
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  padding: 0.5rem 1.25rem;
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  transition: all 0.3s;
  background: none;
  cursor: pointer;
}
.nav-contact:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
}

.nav-icon {
  color: rgba(255, 255, 255, 0.85);
  transition: color 0.3s;
  background: none;
  border: none;
  cursor: pointer;
}
.nav-icon:hover {
  color: white;
}

.nav-lang {
  color: rgba(255, 255, 255, 0.85);
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s;
}
.nav-lang:hover {
  color: white;
}

/* Mobile menu */
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(26, 10, 62, 0.97);
  backdrop-filter: blur(20px);
  padding-top: 80px;
}

.mobile-link {
  color: white;
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-decoration: none;
  text-transform: uppercase;
  background: none;
  border: none;
  cursor: pointer;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.4s ease, opacity 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
