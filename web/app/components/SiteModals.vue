<script setup lang="ts">
// Fenêtre active (fiche solution, contact, baromètre, notification, couverture).
// Précédent / Suivant rouvrent ou ferment la fiche d'une solution sur l'accueil.
const { modal, onPopState } = useModal()

onMounted(() => window.addEventListener('popstate', onPopState))
onBeforeUnmount(() => window.removeEventListener('popstate', onPopState))
</script>

<template>
  <SolutionModal v-if="modal?.kind === 'solution'" :solution-key="modal.key" />
  <ContactModal v-else-if="modal?.kind === 'contact'" :source="modal.source" :initial-choice="modal.choice" />
  <BaroGateModal v-else-if="modal?.kind === 'gate'" :baro="modal.baro" />
  <NotifyModal v-else-if="modal?.kind === 'notify'" />
  <CoverModal v-else-if="modal?.kind === 'cover'" :baro="modal.baro" />
</template>
