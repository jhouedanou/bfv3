<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Menu, X } from 'lucide-vue-next'

const { header } = useContent()
const { goToSlide, activeIndex } = useNavigation()
const { locale, setLocale } = useI18n()

type LocaleCode = 'fr' | 'en'

const languages: { code: LocaleCode; label: string }[] = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' }
]

const currentLang = computed(() => languages.find(l => l.code === locale.value)!)
const langDropdownOpen = ref(false)
const langDropdownRef = ref<HTMLElement | null>(null)

function selectLanguage(code: LocaleCode) {
  setLocale(code)
  langDropdownOpen.value = false
}

function toggleLangDropdown() {
  langDropdownOpen.value = !langDropdownOpen.value
}

function handleClickOutside(e: MouseEvent) {
  if (langDropdownRef.value && !langDropdownRef.value.contains(e.target as Node)) {
    langDropdownOpen.value = false
  }
}

const scrolled = ref(false)
const mobileOpen = ref(false)
const contactPopupOpen = ref(false)

let scrollTicking = false
function handleScroll() {
  if (scrollTicking) return
  scrollTicking = true
  requestAnimationFrame(() => {
    scrolled.value = window.scrollY > 50
    scrollTicking = false
  })
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll)
})

function navigateTo(index: number) {
  goToSlide(index)
  mobileOpen.value = false
}
</script>

<template>
  <header
  id="appheader"
    class="fixed top-0 left-0 w-full z-50 transition-all duration-500"
    :class="scrolled || activeIndex > 0 ? 'header--scrolled' : 'header--transparent'"
  >
    <div class="lepiutan max-w-[1440px] mx-auto flex items-center justify-between px-6 lg:px-12 py-4" >
      <!-- Logo -->
      <a
        href="#"
        class="logo-wrapper flex-shrink-0"
        aria-label="Big Five"
        @click.prevent="navigateTo(0)"
      >
        <img src="/images/logo.svg" alt="Big Five Logo" class="logo" />
      </a>

      <!-- Desktop nav -->
      <nav id="havoc" class="hidden lg:flex items-center gap-8" aria-label="Navigation principale">
        <button
          v-for="item in header.nav"
          :key="item.label"
          class="nav-link"
          @click="navigateTo(item.slideIndex)"
        >
          {{ item.label }}
        </button>
        <button class="nav-contact" id="lecharos"  @click="contactPopupOpen = true">{{ header.contactButton }}</button>
        <div ref="langDropdownRef" class="lang-selector">
          <button class="nav-lang" @click.stop="toggleLangDropdown">
            <span>{{ currentLang.code.toUpperCase() }}</span>
            <span class="lang-chevron" :class="{ 'lang-chevron--open': langDropdownOpen }">▾</span>
          </button>
          <Transition name="dropdown">
            <ul v-if="langDropdownOpen" class="lang-dropdown">
              <li
                v-for="lang in languages"
                :key="lang.code"
                class="lang-option"
                :class="{ 'lang-option--active': lang.code === locale }"
                @click="selectLanguage(lang.code)"
              >
                <span>{{ lang.label }}</span>
              </li>
            </ul>
          </Transition>
        </div>
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
        <a href="#" class="mobile-menu-logo" @click.prevent="navigateTo(0)">
          <img src="/images/logo.svg" alt="Big Five" />
        </a>
        <nav class="flex flex-col items-center gap-6 pt-8">
          <button
            v-for="item in header.nav"
            :key="item.label"
            class="mobile-link"
            @click="navigateTo(item.slideIndex)"
          >
            {{ item.label }}
          </button>
          <button class="mobile-contact-link" @click="contactPopupOpen = true; mobileOpen = false">{{ header.contactButton }}</button>
          <div class="mobile-lang-row mt-6">
            <button
              v-for="lang in languages"
              :key="lang.code"
              class="mobile-lang-text"
              :class="{ 'mobile-lang-text--active': lang.code === locale }"
              @click="selectLanguage(lang.code)"
            >
              {{ lang.code.toUpperCase() }}
            </button>
          </div>
        </nav>
      </div>
    </Transition>
  </header>

  <ContactPopup :visible="contactPopupOpen" @close="contactPopupOpen = false" />
</template>

<style scoped lang="scss">
#appheader{
  padding-top: 0px; /* Account for fixed header */
}
.header--transparent {
  background: transparent;
  margin-top:0px
}
.header--scrolled {
  background:rgba(28, 39, 134, 0.92);
  //box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.logo {
  width: 70px;
  height:auto;
}

.nav-link {
  margin-left:50px;
  color:white;
  font-family: var(--font-display);
  font-size: clamp(11px, 1.1vw, 14px);
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
  font-family: var(--font-display);
  font-size: clamp(0.65rem, 1vw, 0.8rem);
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

/* ── Language selector ── */
.lang-selector {
  position: relative;
}

.nav-lang {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.85);
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 0.35rem 0.75rem;
  cursor: pointer;
  transition: all 0.3s;
}
.nav-lang:hover {
  color: white;
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.05);
}

.lang-chevron {
  font-size: 0.7rem;
  transition: transform 0.3s ease;
  display: inline-block;
}
.lang-chevron--open {
  transform: rotate(180deg);
}

.lang-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 150px;
  background: rgba(26, 10, 62, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 6px;
  list-style: none;
  margin: 0;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  overflow: hidden;
}

.lang-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.5rem 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  font-family: var(--font-body);
  font-size: 0.85rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.lang-option:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}
.lang-option--active {
  color: white;
  background: rgba(194, 58, 142, 0.25);
  font-weight: 600;
}

/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
  transform-origin: top right;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scaleY(0.8) translateY(-4px);
}

/* Mobile contact link (plain text, no border) */
.mobile-contact-link {
  color: white;
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.75;
  transition: opacity 0.3s;
}
.mobile-contact-link:hover {
  opacity: 1;
}

/* Mobile language — simple FR / EN texte */
.mobile-lang-row {
  display: flex;
  gap: 20px;
  align-items: center;
}
.mobile-lang-text {
  color: rgba(255, 255, 255, 0.4);
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s;
  padding: 0;
}
.mobile-lang-text:hover {
  color: rgba(255, 255, 255, 0.7);
}
.mobile-lang-text--active {
  color: white;
  font-weight: 600;
}

/* Mobile menu */
.mobile-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    height: 100dvh;
    background: #0000002e;
    padding-top: 80px;
    padding-bottom: env(safe-area-inset-bottom, 0);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(20px);
    display: flex;
    justify-content: center;
    align-items: center;
}

.mobile-menu-logo {
  position: absolute;
  top: 20px;
  left: 24px;
  z-index: 51;

  img {
    width: 75px;
    height: auto;
  }
}

.mobile-link {
  color: white;
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-decoration: none;
  text-transform: uppercase;
  background: none;
  border: none;
  cursor: pointer;
  transition: opacity 0.3s;
}
.mobile-link:hover {
  opacity: 0.7;
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
.lecheckpoint{
  text-transform:uppercase;
}
#rage{
  margin-top:0px;
}
</style>
