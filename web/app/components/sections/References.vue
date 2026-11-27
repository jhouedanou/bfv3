<script setup lang="ts">
// 3 bandes de logos défilantes ; la bande s'arrête au survol (CDC § 3).
const FILL = { position: 'absolute', inset: '0', width: '100%', height: '100%', objectFit: 'contain' } as const

const c = useSiteContent()
const rows = computed(() => [0, 1, 2].map((r) => c.value.clients.filter((_, i) => i % 3 === r)))
</script>

<template>
  <section id="references" class="sec sec--grad refs" aria-labelledby="refs-title">
    <div class="rings" aria-hidden="true">
      <span class="ring ring--d" />
      <span class="ring ring--e" />
    </div>
    <div class="sec__head">
      <h2 id="refs-title" class="h2">{{ c.t.eyRef }}</h2>
      <p class="sub lav">{{ c.t.refTitle }}</p>
    </div>
    <ul class="sr-only">
      <li v-for="cl in c.clients" :key="cl.name">{{ cl.name }}</li>
    </ul>
    <div class="marquees" aria-hidden="true">
      <div v-for="(row, r) in rows" :key="r" class="marquee">
        <div :class="`marquee__track marquee__track--${r}`">
          <div v-for="(cl, i) in [...row, ...row]" :key="`${cl.name}-${i}`" class="logo" :title="cl.name">
            <NuxtImg :src="cl.logo.url" :alt="cl.name" sizes="220px" format="webp" loading="lazy" :style="FILL" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
