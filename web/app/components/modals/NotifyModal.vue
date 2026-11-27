<script setup lang="ts">
const c = useSiteContent()
const locale = useLocale()
const { notified } = useModal()
const { state, invalid, rate, send, onToken, retry } = useLead()
const website = ref('')

watch(state, (s) => {
  if (s === 'success') notified.value = true
})

const onSubmit = (e: Event) => {
  const email = String(new FormData(e.currentTarget as HTMLFormElement).get('email') ?? '').trim()
  if (!email) {
    invalid.value = ['email']
    return
  }
  send({ type: 'notify', email, locale: locale.value, website: website.value })
}
</script>

<template>
  <Dialog :label="c.t.notifyCta!" variant="form">
    <FormStates v-if="state === 'success'" kind="success" :title="c.t.notifyTitle">
      <p class="dlg-text">{{ c.t.nlDone }}</p>
    </FormStates>
    <FormStates v-else-if="state === 'error'" kind="error" :rate="rate" @retry="retry" />
    <form v-else class="form form--narrow" novalidate @submit.prevent="onSubmit">
      <p class="eyebrow">Big Five Insights</p>
      <h2 class="dlg-title">{{ c.t.notifyTitle }}</h2>
      <p class="dlg-text">{{ c.t.notifyDesc }}</p>
      <Field :label="c.t.emailPro!" name="email" type="email" autocomplete="email" :placeholder="c.t.phEmail" required :invalid="invalid.includes('email')" :error="c.t.invalid" />
      <Honeypot v-model="website" />
      <Turnstile :locale="locale" @token="onToken" />
      <button type="submit" class="btn btn--primary btn--block" :disabled="state === 'sending'" :aria-busy="state === 'sending'">
        {{ state === 'sending' ? c.t.sending : c.t.notifyCta }}
      </button>
    </form>
  </Dialog>
</template>
