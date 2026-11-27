<script lang="ts">
// Script Cloudflare chargé une seule fois, à la première fenêtre qui en a besoin.
const SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string
  remove: (id: string) => void
}

const api = () => (window as unknown as { turnstile?: TurnstileApi }).turnstile

let loading: Promise<void> | null = null
const load = () =>
  (loading ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = SRC
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('turnstile'))
    document.head.appendChild(s)
  }))
</script>

<script setup lang="ts">
// Protection anti-spam sans gêne (CDC § 4.5) : mode « managed », invisible dans la plupart des cas.
// Sans clé (NUXT_PUBLIC_TURNSTILE_SITE_KEY vide), rien n'est affiché et le serveur l'ignore en local.
const props = defineProps<{ locale: 'fr' | 'en' }>()
const emit = defineEmits<{ token: [value: string] }>()

const siteKey = String(useRuntimeConfig().public.turnstileSiteKey || '')
const box = ref<HTMLDivElement | null>(null)
let id: string | undefined
let cancelled = false

onMounted(() => {
  if (!siteKey || !box.value) return
  load()
    .then(() => {
      const ts = api()
      if (cancelled || !box.value || !ts) return
      id = ts.render(box.value, {
        sitekey: siteKey,
        language: props.locale,
        theme: 'dark',
        appearance: 'interaction-only',
        callback: (t: string) => emit('token', t),
        'expired-callback': () => emit('token', ''),
      })
    })
    .catch(() => emit('token', ''))
})

onBeforeUnmount(() => {
  cancelled = true
  if (id) api()?.remove(id)
})
</script>

<template>
  <div v-if="siteKey" ref="box" class="turnstile" />
</template>
