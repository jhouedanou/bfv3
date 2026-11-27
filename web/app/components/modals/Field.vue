<script setup lang="ts">
// Champ texte avec libellé et message d'erreur. Les autres attributs (type, autocomplete,
// placeholder, required…) vont sur l'<input>.
defineOptions({ inheritAttrs: false })
const props = defineProps<{ label: string; name: string; invalid?: boolean; error?: string }>()
const id = computed(() => `f-${props.name}`)
</script>

<template>
  <label class="field" :for="id">
    <span class="field__label">{{ label }}</span>
    <input
      :id="id"
      class="field__input"
      :name="name"
      :aria-invalid="invalid || undefined"
      :aria-describedby="invalid ? `${id}-err` : undefined"
      v-bind="$attrs"
    >
    <span v-if="invalid && error" :id="`${id}-err`" class="field__error">{{ error }}</span>
  </label>
</template>
