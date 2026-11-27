<script setup lang="ts">
// Lien « Gérer les cookies » du pied de page : rouvre le bandeau en mode « Personnaliser ».
// Rien n'est affiché sans identifiant GA4 ni Meta Pixel.
defineProps<{ label: string }>()
const config = useRuntimeConfig().public
const enabled = Boolean(config.gaId || config.metaPixelId)
</script>

<template>
  <li v-if="enabled">
    <button type="button" class="ftr__link" @click="openCookieSettings()">{{ label }}</button>
  </li>
</template>
