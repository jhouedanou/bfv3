<script setup lang="ts">
// À l'ouverture d'une page (solution, offre, baromètre, politique), on part du haut : l'en-tête est
// collant et la fenêtre de l'accueil peut figer le défilement pendant la navigation.
onMounted(() => {
  if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
})
</script>

<template>
  <span v-if="false" />
</template>
