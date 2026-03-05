<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'

const { contactForm } = useContent()

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const form = ref({
  name: '',
  email: '',
  company: '',
  message: ''
})

const submitting = ref(false)

async function handleSubmit() {
  submitting.value = true
  try {
    await $fetch('https://public.herotofu.com/v1/437e1480-18cb-11f1-a65c-851e4752d29c', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: {
        name: form.value.name,
        email: form.value.email,
        company: form.value.company,
        message: form.value.message
      }
    })
    emit('close')
    navigateTo('/thank-you')
  } catch (e) {
    // En cas d'erreur réseau, on redirige quand même (HeroTofu renvoie parfois un CORS ok sans JSON)
    emit('close')
    navigateTo('/thank-you')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="contact-fade">
      <div v-if="visible" class="contact-overlay" @click.self="emit('close')">
        <div class="contact-popup">
          <button class="contact-popup__close" aria-label="Fermer" @click="emit('close')">
            <X :size="20" />
          </button>

          <h2 class="contact-popup__title font-heading">{{ contactForm.title }}</h2>
          <p class="contact-popup__subtitle font-body">{{ contactForm.subtitle }}</p>

          <form
            class="contact-popup__form"
            @submit.prevent="handleSubmit"
          >
            <div class="contact-popup__row">
              <div class="contact-popup__field">
                <label for="cf-name">{{ contactForm.nameLabel }}</label>
                <input
                  id="cf-name"
                  v-model="form.name"
                  type="text"
                  :placeholder="contactForm.namePlaceholder"
                  required
                />
              </div>
              <div class="contact-popup__field">
                <label for="cf-email">{{ contactForm.emailLabel }}</label>
                <input
                  id="cf-email"
                  v-model="form.email"
                  type="email"
                  :placeholder="contactForm.emailPlaceholder"
                  required
                />
              </div>
            </div>

            <div class="contact-popup__field">
              <label for="cf-company">{{ contactForm.companyLabel }}</label>
              <input
                id="cf-company"
                v-model="form.company"
                type="text"
                :placeholder="contactForm.companyPlaceholder"
              />
            </div>

            <div class="contact-popup__field">
              <label for="cf-message">{{ contactForm.messageLabel }}</label>
              <textarea
                id="cf-message"
                v-model="form.message"
                :placeholder="contactForm.messagePlaceholder"
                rows="4"
                required
              />
            </div>

            <button type="submit" class="contact-popup__submit" :disabled="submitting">
              {{ submitting ? contactForm.sending : contactForm.submitLabel }}
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
.contact-fade-enter-active {
  transition: opacity 0.3s ease;
}
.contact-fade-leave-active {
  transition: opacity 0.2s ease;
}
.contact-fade-enter-from,
.contact-fade-leave-to {
  opacity: 0;
}

.contact-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 6, 30, 0.75);
  backdrop-filter: blur(4px);
  padding: 1rem;
}

.contact-popup {
  position: relative;
  width: 100%;
  max-width: 560px;
  background: linear-gradient(145deg, #1a1054 0%, #2d1a6e 50%, #7b2d8e 100%);
  border-radius: 24px;
  padding: 2.5rem 2rem;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5);
  max-height: 90vh;
  overflow-y: auto;

  &__close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, transform 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.1);
    }
  }

  &__title {
    font-size: clamp(1.4rem, 3vw, 1.8rem);
    font-weight: 800;
    color: white;
    margin-bottom: 0.5rem;
  }

  &__subtitle {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 1.5rem;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__row {
    display: flex;
    gap: 1rem;

    @media (max-width: 500px) {
      flex-direction: column;
    }
  }

  &__field {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 0.35rem;

    label {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 600;
    }

    input,
    textarea {
      width: 100%;
      padding: 0.7rem 1rem;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      background: rgba(255, 255, 255, 0.08);
      color: white;
      font-size: 0.9rem;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s, background 0.2s;

      &::placeholder {
        color: rgba(255, 255, 255, 0.35);
      }

      &:focus {
        border-color: rgba(255, 255, 255, 0.4);
        background: rgba(255, 255, 255, 0.12);
      }
    }

    textarea {
      resize: vertical;
      min-height: 100px;
    }
  }

  &__submit {
    margin-top: 0.5rem;
    padding: 0.85rem 2rem;
    border: none;
    border-radius: 50px;
    background: linear-gradient(135deg, #c23a8e, #a0369a);
    color: white;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(194, 58, 142, 0.4);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}
</style>
