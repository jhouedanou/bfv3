<script setup lang="ts">
// État après envoi d'un formulaire : succès (kind="success", contenu en slot, boutons en plus dans
// le slot « actions ») ou échec (kind="error", bouton « Réessayer » → événement retry).
defineProps<{ kind: 'success' | 'error'; title?: string; rate?: boolean }>()
defineEmits<{ retry: [] }>()

const c = useSiteContent()
const { close } = useModal()
</script>

<template>
  <div v-if="kind === 'success'" class="state" role="status">
    <div class="state__icon" aria-hidden="true">✓</div>
    <h2 class="dlg-title">{{ title }}</h2>
    <slot />
    <div class="state__actions">
      <button type="button" class="btn btn--grad" @click="close">{{ c.t.closeBtn }}</button>
      <slot name="actions" />
    </div>
  </div>
  <div v-else class="state" role="alert">
    <div class="state__icon state__icon--err" aria-hidden="true">!</div>
    <h2 class="dlg-title">{{ c.t.errT }}</h2>
    <p v-if="rate" class="dlg-text">{{ c.t.errRate }}</p>
    <p v-else class="dlg-text">
      {{ c.t.errP }} <a :href="`mailto:${c.settings.email}`">{{ c.settings.email }}</a>.
    </p>
    <div class="state__actions">
      <button type="button" class="btn btn--grad" @click="$emit('retry')">{{ c.t.retryL }}</button>
    </div>
  </div>
</template>
