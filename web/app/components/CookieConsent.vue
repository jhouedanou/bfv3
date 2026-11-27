<script setup lang="ts">
import type { Consent } from '~/utils/consent'

// Bandeau cookies : Accepter et Refuser ont le même poids visuel ; Personnaliser ouvre le détail.
// Le lien « Gérer les cookies » du pied de page (<CookieManage>) le rouvre à tout moment.
// Sans identifiant GA4 ni Meta Pixel : aucun bandeau, aucun script.
const c = useSiteContent()
const locale = useLocale()
const route = useRoute()
const config = useRuntimeConfig().public
const GA_ID = String(config.gaId || '')
const META_PIXEL_ID = String(config.metaPixelId || '')
const TRACKING_ENABLED = Boolean(GA_ID || META_PIXEL_ID)

const open = ref(false)
const custom = ref(false)
const choice = ref<Consent>({ analytics: false, ads: false })

const granted = (v: boolean) => (v ? 'granted' : 'denied')

// Consent Mode v2 : les quatre signaux attendus par Google.
const consentSignals = (v: Consent) => ({
  analytics_storage: granted(v.analytics),
  ad_storage: granted(v.ads),
  ad_user_data: granted(v.ads),
  ad_personalization: granted(v.ads),
})

const addScript = (src: string) => {
  const s = document.createElement('script')
  s.async = true
  s.src = src
  document.head.appendChild(s)
}

// Google Analytics 4 : le script n'est ajouté à la page qu'après accord.
const loadGoogle = (v: Consent) => {
  if (!GA_ID || window.gtag) return
  window.dataLayer = window.dataLayer || []
  // gtag attend l'objet « arguments », pas un tableau.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments)
  }
  window.gtag('consent', 'default', consentSignals({ analytics: false, ads: false }))
  window.gtag('consent', 'update', consentSignals(v))
  window.gtag('js', new Date())
  window.gtag('config', GA_ID)
  addScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`)
}

// Meta Pixel : même règle.
const loadMeta = () => {
  if (!META_PIXEL_ID || window.fbq) return
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args)
    else fbq.queue.push(args)
  } as NonNullable<Window['fbq']> & { queue: unknown[] }
  fbq.push = fbq
  fbq.loaded = true
  fbq.version = '2.0'
  fbq.queue = []
  window.fbq = fbq
  window._fbq = fbq
  fbq('init', META_PIXEL_ID)
  fbq('track', 'PageView')
  addScript('https://connect.facebook.net/en_US/fbevents.js')
}

const apply = (v: Consent) => {
  if (v.analytics) loadGoogle(v)
  else window.gtag?.('consent', 'update', consentSignals(v))
  if (v.ads) loadMeta()
}

const reopen = () => {
  choice.value = readConsent() ?? { analytics: false, ads: false }
  custom.value = true
  open.value = true
}

onMounted(() => {
  if (!TRACKING_ENABLED) return
  const saved = readConsent()
  if (saved) {
    // Choix déjà enregistré : on l'applique sans afficher le bandeau.
    choice.value = saved
    apply(saved)
  } else {
    open.value = true
  }
  window.addEventListener(CONSENT_EVENT, reopen)
})

onBeforeUnmount(() => window.removeEventListener(CONSENT_EVENT, reopen))

// Navigation sans rechargement : GA4 suit l'historique lui-même, le Pixel non.
watch(
  () => route.path,
  () => window.fbq?.('track', 'PageView'),
)

const save = (v: Consent) => {
  const before = readConsent()
  writeConsent(v)
  choice.value = v
  open.value = false
  custom.value = false
  // Retrait d'un accord : les scripts déjà chargés ne se déchargent pas, on recharge la page.
  if ((before?.analytics && !v.analytics) || (before?.ads && !v.ads)) {
    window.location.reload()
    return
  }
  apply(v)
}
</script>

<template>
  <div v-if="TRACKING_ENABLED && open" class="ck" role="region" :aria-label="c.t.ckTitle">
    <div class="ck__main">
      <p class="ck__text">
        {{ c.t.ckText }} <NuxtLink :to="routePath('privacy', locale)">{{ c.t.ckMore }}</NuxtLink>
      </p>
      <ul v-if="custom" class="ck__opts">
        <li>
          <label class="ck__opt">
            <input type="checkbox" checked disabled>
            <span>
              <strong>{{ c.t.ckNeeded }}</strong>
              <span class="ck__desc">{{ c.t.ckNeededDesc }}</span>
            </span>
          </label>
        </li>
        <li v-if="GA_ID">
          <label class="ck__opt">
            <input v-model="choice.analytics" type="checkbox">
            <span>
              <strong>{{ c.t.ckAudience }}</strong>
              <span class="ck__desc">{{ c.t.ckAudienceDesc }}</span>
            </span>
          </label>
        </li>
        <li v-if="META_PIXEL_ID">
          <label class="ck__opt">
            <input v-model="choice.ads" type="checkbox">
            <span>
              <strong>{{ c.t.ckAds }}</strong>
              <span class="ck__desc">{{ c.t.ckAdsDesc }}</span>
            </span>
          </label>
        </li>
      </ul>
    </div>
    <div class="ck__actions">
      <button v-if="custom" type="button" class="btn btn--outline" @click="save(choice)">{{ c.t.ckSave }}</button>
      <button v-else type="button" class="btn btn--outline" @click="custom = true">{{ c.t.ckCustom }}</button>
      <button type="button" class="btn btn--primary" @click="save({ analytics: false, ads: false })">{{ c.t.ckRefuse }}</button>
      <button type="button" class="btn btn--primary" @click="save({ analytics: Boolean(GA_ID), ads: Boolean(META_PIXEL_ID) })">
        {{ c.t.ckAccept }}
      </button>
    </div>
  </div>
</template>
