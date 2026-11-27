<script setup lang="ts">
// En-tête fixe : menu, Laveiye, « Nous contacter », bascule FR | EN.
// Sous 1024 px, le menu passe dans un bouton (CDC § 3 « Mobile et tablette »).
defineProps<{ alternate: Record<'fr' | 'en', string> }>()

const NAV = ['agence', 'solutions', 'observatoire', 'references'] as const

const c = useSiteContent()
const locale = useLocale()
const { openContact, activeSection } = useModal()

const open = ref(false)
// Section visible de l'accueil, suivie par HomeSlider (Swiper ou défilement normal).
const current = computed(() => activeSection.value)
const active = computed(() => (current.value === 'accueil' ? null : current.value))
const home = computed(() => localePath(locale.value))

const navLabel = (id: string) =>
  ({
    accueil: c.value.t.navHome,
    agence: c.value.t.navAgence,
    solutions: c.value.t.navSolutions,
    observatoire: c.value.t.navObservatoire,
    references: c.value.t.navReferences,
  })[id]

// Accueil en plein écran : le lien fait glisser jusqu'à la section au lieu de sauter.
const onSectionLink = (e: MouseEvent) => {
  open.value = false
  const id = (e.currentTarget as HTMLElement).dataset.section
  if (id && sectionNav.go?.(id)) e.preventDefault()
}

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') open.value = false
}
watch(open, (v) => {
  if (v) document.addEventListener('keydown', onKey)
  else document.removeEventListener('keydown', onKey)
})
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))

const setLang = (l: 'fr' | 'en') => {
  document.cookie = `NUXT_LOCALE=${l}; path=/; max-age=31536000; samesite=lax`
}
</script>

<template>
  <header :class="['hdr', { 'hdr--open': open }]">
    <a href="#contenu" class="skip">{{ c.t.skip }}</a>
    <a :href="`${home}#accueil`" class="hdr__logo" :aria-label="c.t.homeAria" data-section="accueil" @click="onSectionLink">
      <NuxtImg
        src="/images/logo-bigfive.png"
        :alt="c.t.logoAlt"
        :width="1724"
        :height="1286"
        sizes="124px"
        format="webp"
        preload
        loading="eager"
        fetchpriority="high"
      />
    </a>
    <button
      type="button"
      class="hdr__burger"
      :aria-expanded="open"
      aria-controls="main-nav"
      :aria-label="open ? c.t.closeMenu : c.t.openMenu"
      @click="open = !open"
    >
      <span aria-hidden="true" />
    </button>
    <nav id="main-nav" class="hdr__nav" :aria-label="c.t.sectionsAria">
      <ul class="hdr__links">
        <li v-for="id in NAV" :key="id">
          <a
            :href="`${home}#${id}`"
            :class="['hdr__link', { 'is-active': active === id }]"
            :aria-current="active === id ? 'location' : undefined"
            :data-section="id"
            @click="onSectionLink"
          >
            {{ navLabel(id) }}
          </a>
        </li>
        <li>
          <a :href="c.links.laveiye" target="_blank" rel="noopener noreferrer" class="hdr__link hdr__link--lv">
            Laveiye <span aria-hidden="true">↗</span>
          </a>
        </li>
      </ul>
      <button
        type="button"
        class="btn btn--grad btn--nav"
        @click="
          () => {
            open = false
            openContact('header')
          }
        "
      >
        {{ c.t.contactUs }}
      </button>
      <div class="lang" role="group" :aria-label="c.t.langGroup">
        <a
          :href="alternate.fr"
          hreflang="fr"
          lang="fr"
          :aria-current="locale === 'fr' ? 'true' : undefined"
          @click="setLang('fr')"
        >
          FR
        </a>
        <a
          :href="alternate.en"
          hreflang="en"
          lang="en"
          :aria-current="locale === 'en' ? 'true' : undefined"
          @click="setLang('en')"
        >
          EN
        </a>
      </div>
    </nav>
  </header>
  <!-- Points de navigation de la maquette, contre le bord droit (accueil seulement). -->
  <nav v-if="current" class="snapnav" :aria-label="c.t.sectionsAria">
    <a
      v-for="id in ['accueil', ...NAV]"
      :key="id"
      :href="`${home}#${id}`"
      :title="navLabel(id)"
      :aria-label="navLabel(id)"
      :aria-current="current === id ? 'location' : undefined"
      :data-section="id"
      @click="onSectionLink"
    >
      <span aria-hidden="true" />
    </a>
  </nav>
</template>
