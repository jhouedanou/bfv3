<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const en = computed(() => useRoute().path.startsWith('/en'))
const notFound = computed(() => props.error.statusCode === 404)
useSeoMeta({ title: () => (notFound.value ? (en.value ? 'Page not found' : 'Page introuvable') : 'Erreur') + ' | BIG FIVE', robots: 'noindex' })
</script>

<template>
  <main id="contenu" class="page page--text">
    <h1 class="h2">{{ notFound ? (en ? 'Page not found' : 'Page introuvable') : en ? 'Something went wrong' : 'Une erreur est survenue' }}</h1>
    <p class="body-text">{{ en ? 'This page does not exist or has moved.' : 'Cette page n’existe pas ou a été déplacée.' }}</p>
    <p>
      <a :href="en ? '/en' : '/'" class="btn btn--primary" @click.prevent="clearError({ redirect: en ? '/en' : '/' })">
        {{ en ? 'Back to home' : 'Retour à l’accueil' }}
      </a>
    </p>
  </main>
</template>
