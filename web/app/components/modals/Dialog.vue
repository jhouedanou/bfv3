<script setup lang="ts">
// Fenêtre modale accessible : Échap ferme, clic sur le fond ferme, focus piégé, défilement bloqué.
defineProps<{ label: string; variant: 'form' | 'solution' | 'cover' }>()

const c = useSiteContent()
const { close } = useModal()
const panel = ref<HTMLDivElement | null>(null)

let previous: HTMLElement | null = null
let overflow = ''

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close()
  if (e.key !== 'Tab' || !panel.value) return
  const items = panel.value.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])',
  )
  if (!items.length) return
  const first = items[0]!
  const last = items[items.length - 1]!
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

onMounted(() => {
  previous = document.activeElement as HTMLElement | null
  overflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  // Formulaire : focus sur le premier champ. Sinon sur le panneau, pour ne pas faire défiler la fiche.
  const field = panel.value?.querySelector<HTMLElement>('input:not([tabindex="-1"]), select, textarea')
  if (field) field.focus()
  else panel.value?.focus({ preventScroll: true })
  document.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey)
  document.body.style.overflow = overflow
  previous?.focus?.({ preventScroll: true })
})
</script>

<template>
  <div :class="`dlg dlg--${variant}`" @click="close">
    <div ref="panel" role="dialog" aria-modal="true" :aria-label="label" tabindex="-1" class="dlg-panel" @click.stop>
      <button type="button" class="dlg-close" :aria-label="c.t.close" @click="close">
        <span aria-hidden="true">✕</span>
      </button>
      <slot />
    </div>
  </div>
</template>
