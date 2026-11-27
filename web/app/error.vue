<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const en = computed(() => useRoute().path.startsWith('/en'))
const notFound = computed(() => props.error.statusCode === 404)
// Connexion à l'éditeur (/_studio) avec une adresse Google qui n'est pas dans la liste autorisée.
const forbidden = computed(() => props.error.statusCode === 403)
useSeoMeta({ title: () => (forbidden.value ? 'Accès refusé' : notFound.value ? (en.value ? 'Page not found' : 'Page introuvable') : 'Erreur') + ' | BIG FIVE', robots: 'noindex' })
</script>

<template>
  <main id="contenu" class="page page--text">
    <template v-if="forbidden">
      <h1 class="h2">Accès refusé</h1>
      <p class="body-text">
        Votre adresse Google n’est pas autorisée à modifier ce site. Vérifiez que vous avez choisi le bon compte Google, ou demandez
        l’accès à l’administrateur du site.
      </p>
      <p><a href="/_studio" class="btn btn--primary">Réessayer avec un autre compte</a></p>
    </template>
    <template v-else>
      <h1 class="h2">{{ notFound ? (en ? 'Page not found' : 'Page introuvable') : en ? 'Something went wrong' : 'Une erreur est survenue' }}</h1>
      <p class="body-text">{{ en ? 'This page does not exist or has moved.' : 'Cette page n’existe pas ou a été déplacée.' }}</p>
    </template>
    <p>
      <a :href="en ? '/en' : '/'" class="btn btn--primary" @click.prevent="clearError({ redirect: en ? '/en' : '/' })">
        {{ en ? 'Back to home' : 'Retour à l’accueil' }}
      </a>
    </p>
  </main>
</template>
