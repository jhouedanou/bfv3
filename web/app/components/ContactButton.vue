<script setup lang="ts">
import type { SolutionKey } from '~/types'

// « Parlons de votre projet » depuis une page d'offre : formulaire pré-rempli sur la solution
// (objet d'e-mail « [Veille] », « [Solutions digitales] »… du CDC § 4).
withDefaults(defineProps<{ solution: SolutionKey; className?: string }>(), { className: 'btn btn--primary' })

const c = useSiteContent()
const { openContact } = useModal()
</script>

<template>
  <button type="button" :class="className" @click="openContact(solution, solution)">
    {{ c.t.letsTalk }} <span aria-hidden="true">→</span>
  </button>
</template>
