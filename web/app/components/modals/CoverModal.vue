<script setup lang="ts">
import type { BarometreDTO } from '~/types'

defineProps<{ baro: BarometreDTO }>()
</script>

<template>
  <Dialog v-if="baro.cover" :label="baro.title" variant="cover">
    <NuxtImg
      :src="baro.cover.url"
      :alt="baro.cover.alt"
      :width="baro.cover.width"
      :height="baro.cover.height"
      class="cover-full"
      sizes="92vw md:60vw"
    />
  </Dialog>
</template>
