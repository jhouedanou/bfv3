<script setup lang="ts">
// Frise de méthode : 4 cercles, accolades des 2 pôles, bouton de contact.
const c = useSiteContent()
const { solutionHref, openSolution, openContact } = useModal()
</script>

<template>
  <section id="solutions" class="sec sec--grad solutions" aria-labelledby="solutions-title">
    <div class="rings" aria-hidden="true">
      <span class="ring ring--a" />
      <span class="ring ring--b" />
      <span class="ring ring--c" />
    </div>
    <div class="sec__head">
      <h2 id="solutions-title" class="h2">{{ c.t.eySol }}</h2>
      <p class="sub lav">{{ c.t.solTitle }}</p>
    </div>
    <div class="frise">
      <ol class="frise__grid">
        <li v-for="s in c.solutions" :key="s.key" class="frise__item">
          <span class="label frise__step">{{ s.step }}</span>
          <span class="frise__dot" aria-hidden="true" />
          <a
            :href="solutionHref(s)"
            class="circle"
            data-no-veil
            :aria-label="`${c.t.discover} ${s.name}`"
            @click.prevent="openSolution(s.key)"
          >
            <span class="circle__name">{{ s.name }}</span>
            <span class="circle__plus" aria-hidden="true">+</span>
          </a>
          <p class="frise__tag">{{ s.tag }}</p>
        </li>
      </ol>
      <div class="braces" aria-hidden="true">
        <div class="brace brace--intel">
          <span class="brace__line" />
          <span class="label">{{ c.t.poleIntel }}</span>
        </div>
        <div class="brace brace--tech">
          <span class="brace__line" />
          <span class="label">{{ c.t.poleTech }}</span>
        </div>
      </div>
    </div>
    <div class="center">
      <button type="button" class="btn btn--primary btn--lg" @click="openContact('solutions')">
        {{ c.t.letsTalk }} <span aria-hidden="true">→</span>
      </button>
    </div>
  </section>
</template>
