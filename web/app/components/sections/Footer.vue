<script setup lang="ts">
const c = useSiteContent()
const locale = useLocale()
// Hors production, un repère rappelle ce qui manque encore (content/reglages.yml).
const todo = !__INDEXABLE__
const tel = computed(() => c.value.settings.telephone.replace(/[^+\d]/g, ''))
</script>

<template>
  <!-- role explicite : sur l’accueil, le pied de page est dans la dernière section (dans <main>). -->
  <footer class="ftr" role="contentinfo">
    <div class="ftr__top">
      <div>
        <NuxtImg
          src="/images/logo-bigfive.png"
          :alt="c.t.logoAlt"
          :width="1724"
          :height="1286"
          class="ftr__logo"
          sizes="113px"
          format="webp"
          loading="lazy"
        />
        <a :href="`mailto:${c.settings.email}`" class="ftr__mail">{{ c.settings.email }}</a>
        <a v-if="c.settings.telephone" :href="`tel:${tel}`" class="ftr__mail">{{ c.settings.telephone }}</a>
        <p v-else-if="todo" class="ftr__todo">[À COMPLÉTER : téléphone]</p>
        <address v-if="c.settings.adresse" class="ftr__addr">
          <a v-if="c.settings.carte" :href="c.settings.carte" target="_blank" rel="noopener noreferrer">{{
            c.settings.adresse
          }}</a>
          <template v-else>{{ c.settings.adresse }}</template>
        </address>
        <p v-else-if="todo" class="ftr__todo">[À COMPLÉTER : adresse postale]</p>
        <p v-if="c.settings.horaires" class="ftr__addr">{{ c.settings.horaires }}</p>
      </div>
      <ul class="socials">
        <li v-for="s in c.links.socials" :key="s.url">
          <!-- Abréviation visible, nom complet pour les lecteurs d'écran (WCAG 2.5.3). -->
          <a :href="s.url" target="_blank" rel="noopener noreferrer">
            <span aria-hidden="true">{{ s.short }}</span>
            <span class="sr-only">{{ s.label }}</span>
          </a>
        </li>
      </ul>
    </div>
    <hr class="ftr__rule" />
    <div class="ftr__bottom">
      <p>{{ c.t.rights }}</p>
      <ul>
        <li>
          <a :href="c.links.laveiye" target="_blank" rel="noopener noreferrer">Laveiye</a>
        </li>
        <li>
          <NuxtLink :to="routePath('barometres', locale)">{{ c.t.allBaros }}</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="routePath('privacy', locale)">{{ c.t.privacy }}</NuxtLink>
        </li>
        <CookieManage :label="c.t.ckManage" />
      </ul>
    </div>
  </footer>
</template>
