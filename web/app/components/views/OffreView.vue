<script setup lang="ts">
// Page d'une offre (content/offres/<langue>/<solution>/*.md). Hors de Google tant que
// « validated » n'est pas coché dans Studio.
const route = useRoute()
const c = useSiteContent()
const siteUrl = useSiteUrl()

const s = computed(() => c.value.solutions.find((x) => x.slug === route.params.solution))
const { data: o } = await useAsyncData(`offre-${route.path}`, () =>
  s.value
    ? queryCollection('offres').where('locale', '=', c.value.locale).where('solution', '=', s.value.key).where('slug', '=', String(route.params.offre)).first()
    : Promise.resolve(null),
)
if (!s.value || !o.value) throw createError({ statusCode: 404, statusMessage: 'Page introuvable', fatal: true })

// Adresse de l'autre langue (hreflang, sélecteur de langue).
const { data: alt } = await useAsyncData(`offre-alt-${route.path}`, () =>
  queryCollection('offres').where('key', '=', o.value!.key).where('locale', '=', c.value.locale === 'fr' ? 'en' : 'fr').select('slug', 'solution').first(),
)
const { data: all } = useNuxtData<Record<'fr' | 'en', import('~/types').SiteContent>>('site-content')

const paths = computed(() => {
  const loc = c.value.locale
  const other = loc === 'fr' ? 'en' : 'fr'
  const otherSol = all.value![other].solutions.find((x) => x.key === s.value!.key)!
  const mine = offrePath(loc, s.value!.slug, o.value!.slug)
  const theirs = alt.value ? offrePath(other, otherSol.slug, alt.value.slug) : solutionPath(other, otherSol.slug)
  return (loc === 'fr' ? { fr: mine, en: theirs } : { fr: theirs, en: mine }) as Record<'fr' | 'en', string>
})
const home = computed(() => localePath(c.value.locale))
const solutionUrl = computed(() => solutionPath(c.value.locale, s.value!.slug))
const url = computed(() => `${siteUrl}${paths.value[c.value.locale]}`)
const others = computed(() => s.value!.offres.filter((x) => x.slug !== o.value!.slug))

usePageSeo(() => ({
  locale: c.value.locale,
  paths: paths.value,
  title: o.value!.metaTitle || `${o.value!.title} | BIG FIVE`,
  description: o.value!.description,
  image: s.value!.img,
  noindex: !o.value!.validated,
}))

useJsonLd(() => [
  serviceJsonLd(siteUrl, { name: o.value!.title, description: o.value!.description, url: url.value, category: s.value!.name }),
  o.value!.faq.length ? faqJsonLd(o.value!.faq) : null,
  breadcrumbJsonLd([
    { name: 'BIG FIVE', url: absUrl(siteUrl, home.value) },
    { name: s.value!.name, url: `${siteUrl}${solutionUrl.value}` },
    { name: o.value!.title, url: url.value },
  ]),
])
</script>

<template>
  <ScrollToTop />
  <Header :alternate="paths" />
  <main id="contenu" class="page page--offre">
    <nav class="crumbs" :aria-label="c.t.crumbs">
      <ol class="crumbs__list">
        <li><NuxtLink :to="home">BIG FIVE</NuxtLink></li>
        <li><NuxtLink :to="solutionUrl">{{ s!.name }}</NuxtLink></li>
        <li aria-current="page">{{ o!.title }}</li>
      </ol>
    </nav>

    <article class="offre">
      <header class="offre__head">
        <p class="label pink">{{ s!.name }}</p>
        <h1 class="h2 offre__title">{{ o!.title }}</h1>
        <p class="lead offre__accroche">{{ o!.description }}</p>
      </header>

      <div class="offre__grid">
        <ContentRenderer :value="o!" class="offre__body" tag="div" />
        <aside class="offre__aside">
          <template v-if="o!.gets.length">
            <h2 class="label">{{ c.t.youGet }}</h2>
            <ul class="dots dots--lead">
              <li v-for="it in o!.gets" :key="it">{{ it }}</li>
            </ul>
          </template>
          <p class="offre__lead">
            <span class="label">{{ c.t.ledBy }}</span> {{ s!.lead }}
          </p>
          <ContactButton :solution="s!.key" />
        </aside>
      </div>

      <section v-if="o!.faq.length" class="offre__faq" aria-labelledby="faq-title">
        <h2 id="faq-title" class="h3">{{ c.t.faqTitle }}</h2>
        <details v-for="f in o!.faq" :key="f.question" class="faq">
          <summary>{{ f.question }}</summary>
          <p>{{ f.answer }}</p>
        </details>
      </section>

      <nav v-if="others.length" class="offre__others" :aria-label="c.t.otherOffers">
        <h2 class="label">{{ c.t.otherOffers }} · {{ s!.name }}</h2>
        <ul>
          <li v-for="x in others" :key="x.slug">
            <NuxtLink :to="offrePath(c.locale, s!.slug, x.slug)">{{ x.title }}</NuxtLink>
          </li>
        </ul>
      </nav>
    </article>
  </main>
  <Footer />
</template>
