<script setup lang="ts">
// Champ piège invisible pour les robots (CDC § 4.5).
const model = defineModel<string>({ default: '' })
</script>

<template>
  <div class="hp" aria-hidden="true">
    <label>
      Site web
      <input v-model="model" type="text" name="website" tabindex="-1" autocomplete="off">
    </label>
  </div>
</template>
