<script setup lang="ts">
import type { SolutionKey } from '~/types'

const props = defineProps<{ solutionKey: SolutionKey }>()
const c = useSiteContent()
const s = computed(() => c.value.solutions.find((x) => x.key === props.solutionKey))
</script>

<template>
  <Dialog v-if="s" :label="s.name" variant="solution">
    <SolutionDetail :s="s" />
  </Dialog>
</template>
