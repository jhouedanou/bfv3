<script setup lang="ts">
import type { BarometreDTO } from '~/types'

const props = defineProps<{ baro: BarometreDTO }>()

const c = useSiteContent()
const locale = useLocale()
const { state, invalid, rate, send, onToken, retry } = useLead()
const website = ref('')
const err = (name: string) => invalid.value.includes(name)

const onSubmit = (e: Event) => {
  const f = new FormData(e.currentTarget as HTMLFormElement)
  const get = (k: string) => String(f.get(k) ?? '')
  const missing = ['name', 'email', 'company', 'role'].filter((k) => !get(k).trim())
  if (missing.length) {
    invalid.value = missing
    return
  }
  send({
    type: 'barometre',
    barometre: props.baro.identifiant,
    locale: locale.value,
    name: get('name'),
    email: get('email'),
    company: get('company'),
    role: get('role'),
    phone: get('phone'),
    optin: Boolean(f.get('optin')),
    website: website.value,
  })
}
</script>

<template>
  <Dialog :label="baro.title" variant="form">
    <FormStates v-if="state === 'success'" kind="success" :title="c.t.gateDoneT">
      <p class="dlg-text">{{ c.t.gateDoneP }}</p>
    </FormStates>
    <FormStates v-else-if="state === 'error'" kind="error" :rate="rate" @retry="retry" />
    <form v-else class="form form--narrow" novalidate @submit.prevent="onSubmit">
      <p class="eyebrow">{{ c.t.baro }} · {{ parution(baro.publishedAt) }}</p>
      <h2 class="dlg-title">{{ baro.title }}</h2>
      <p class="dlg-text">{{ c.t.gateIntro }}</p>
      <Field :label="c.t.fullName!" name="name" autocomplete="name" :placeholder="c.t.phName" required :invalid="err('name')" :error="c.t.invalid" />
      <Field :label="c.t.emailPro!" name="email" type="email" autocomplete="email" :placeholder="c.t.phEmail" required :invalid="err('email')" :error="c.t.invalid" />
      <Field :label="c.t.company!" name="company" autocomplete="organization" :placeholder="c.t.phCompany" required :invalid="err('company')" :error="c.t.invalid" />
      <Field :label="c.t.jobTitle!" name="role" autocomplete="organization-title" :placeholder="c.t.phRole" required :invalid="err('role')" :error="c.t.invalid" />
      <Field :label="c.t.phoneOpt!" name="phone" type="tel" autocomplete="tel" placeholder="+225 …" />
      <label class="check">
        <input type="checkbox" name="optin" checked>
        <span>{{ c.t.gateNl }}</span>
      </label>
      <Honeypot v-model="website" />
      <Turnstile :locale="locale" @token="onToken" />
      <button type="submit" class="btn btn--grad btn--block" :disabled="state === 'sending'" :aria-busy="state === 'sending'">
        {{ state === 'sending' ? c.t.sending : c.t.gateCta }}
      </button>
    </form>
  </Dialog>
</template>
