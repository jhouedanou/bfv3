<script setup lang="ts">
// Contenu commun (libellés, solutions, réglages) chargé une fois, pour les deux langues.
await loadSiteContent()
const locale = useLocale()
useHead({ htmlAttrs: { lang: locale } })
</script>

<template>
  <slot />
  <PageTransition />
  <CookieConsent />
  <SiteModals />
</template>
