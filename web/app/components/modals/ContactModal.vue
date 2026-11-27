<script setup lang="ts">
import type { ContactChoice, ContactSource } from '~/types'

const props = defineProps<{ source: ContactSource; initialChoice: ContactChoice }>()

const c = useSiteContent()
const locale = useLocale()
const { close } = useModal()
const { state, invalid, rate, send, onToken, retry } = useLead()
const choice = ref<ContactChoice>(props.initialChoice)
const website = ref('')

const options = computed<{ v: ContactChoice; l: string }[]>(() => [
  ...c.value.solutions.map((s) => ({ v: s.key as ContactChoice, l: s.name })),
  { v: 'multi', l: c.value.t.multi! },
  { v: 'unknown', l: c.value.t.unknown! },
])
const choiceLabel = computed(() => options.value.find((o) => o.v === choice.value)?.l ?? '')
const err = (name: string) => invalid.value.includes(name)

const onSubmit = (e: Event) => {
  const f = new FormData(e.currentTarget as HTMLFormElement)
  const get = (k: string) => String(f.get(k) ?? '')
  const missing = ['name', 'email', 'phone', 'company', 'role', 'need'].filter((k) => !get(k).trim())
  if (!f.get('consent')) missing.push('consent')
  if (missing.length) {
    invalid.value = missing
    return
  }
  send({
    type: 'contact',
    source: props.source,
    locale: locale.value,
    name: get('name'),
    email: get('email'),
    phone: get('phone'),
    company: get('company'),
    role: get('role'),
    sector: get('sector'),
    choice: choice.value,
    need: get('need'),
    consent: true,
    optin: Boolean(f.get('optin')),
    website: website.value,
  })
}
</script>

<template>
  <Dialog :label="c.t.contactTitle!" variant="form">
    <FormStates v-if="state === 'success'" kind="success" :title="c.t.okT">
      <p class="dlg-text">{{ c.t.okP }}</p>
      <p class="dlg-text dlg-text--muted">{{ c.t.okRec }} {{ choiceLabel }}.</p>
      <template #actions>
        <a class="btn btn--outline" :href="`${localePath(locale)}#observatoire`" @click="close">{{ c.t.seeBaro }}</a>
      </template>
    </FormStates>
    <FormStates v-else-if="state === 'error'" kind="error" :rate="rate" @retry="retry" />
    <form v-else class="form" novalidate @submit.prevent="onSubmit">
      <h2 class="dlg-title">{{ c.t.contactTitle }}</h2>
      <p class="dlg-intro">{{ c.t.cIntro1 }}</p>
      <p class="dlg-text">{{ c.t.cIntro2 }}</p>
      <p class="dlg-meta">{{ c.t.required }} · {{ c.t.origin }} {{ c.t.sources[source] }}</p>
      <div class="form__grid">
        <Field :label="c.t.fullName!" name="name" autocomplete="name" :placeholder="c.t.phName" required :invalid="err('name')" :error="c.t.invalid" />
        <Field :label="c.t.emailPro!" name="email" type="email" autocomplete="email" :placeholder="c.t.phEmail" required :invalid="err('email')" :error="c.t.invalid" />
        <Field :label="c.t.phone!" name="phone" type="tel" autocomplete="tel" placeholder="+225 …" required :invalid="err('phone')" :error="c.t.invalid" />
        <Field :label="c.t.company!" name="company" autocomplete="organization" :placeholder="c.t.phCompany" required :invalid="err('company')" :error="c.t.invalid" />
        <Field :label="c.t.role!" name="role" autocomplete="organization-title" :placeholder="c.t.phRole" required :invalid="err('role')" :error="c.t.invalid" />
        <Field :label="c.t.sector!" name="sector" :placeholder="c.t.phSector" />
      </div>
      <label class="field" for="f-choice">
        <span class="field__label">{{ c.t.which }}</span>
        <select id="f-choice" v-model="choice" class="field__input">
          <option v-for="o in options" :key="o.v" :value="o.v">{{ o.l }}</option>
        </select>
      </label>
      <label class="field" for="f-need">
        <span class="field__label">{{ c.t.need }}</span>
        <textarea id="f-need" name="need" rows="4" class="field__input" :placeholder="c.t.phNeed" required :aria-invalid="err('need') || undefined" />
        <span v-if="err('need')" class="field__error">{{ c.t.invalid }}</span>
      </label>
      <label class="check">
        <input type="checkbox" name="consent" required :aria-invalid="err('consent') || undefined">
        <span>
          {{ c.t.consent }}
          <a :href="routePath('privacy', locale)" target="_blank" rel="noopener">{{ c.t.privacy }}</a>
        </span>
      </label>
      <p v-if="err('consent')" class="field__error">{{ c.t.invalid }}</p>
      <label class="check check--muted">
        <input type="checkbox" name="optin">
        <span>{{ c.t.optin }}</span>
      </label>
      <Honeypot v-model="website" />
      <Turnstile :locale="locale" @token="onToken" />
      <button type="submit" class="btn btn--grad btn--block" :disabled="state === 'sending'" :aria-busy="state === 'sending'">
        {{ state === 'sending' ? c.t.sending : c.t.submit }}
      </button>
    </form>
  </Dialog>
</template>
