<script setup lang="ts">
// Dit clairement à un éditeur qu'il est connecté à Nuxt Studio.
// Sans cela, la connexion ramène à l'accueil sans aucun message : seul un petit bouton apparaît
// en bas à gauche. Ce composant affiche :
//   - un message « Connexion réussie » juste après la connexion (témoin posé par le serveur,
//     server/plugins/studio-audit.ts) ;
//   - une pastille permanente avec le nom de la personne et un lien de déconnexion.
type StudioUser = { name?: string; email?: string }

const locale = useLocale()
const studio = useRuntimeConfig().public.studio as { dev?: boolean } | undefined
// État rempli par le module nuxt-studio quand une session existe.
const session = useState<StudioUser | null>('studio-session', () => null)
const user = computed<StudioUser | null>(() => {
  if (session.value?.email) return session.value
  // En local (pnpm dev), Studio s'ouvre sans connexion.
  return studio?.dev ? { name: locale.value === 'fr' ? 'mode local, sans connexion' : 'local mode, no sign-in' } : null
})
const who = computed(() => [user.value?.name, user.value?.email && `(${user.value.email})`].filter(Boolean).join(' '))

const welcome = ref(false)
const leaving = ref(false)
const flag = useCookie<string | null>('bf-studio-welcome', { path: '/' })

watch(
  () => session.value?.email,
  (email) => {
    if (!email || !flag.value) return
    welcome.value = true
    flag.value = null
  },
  { immediate: true },
)

const t = computed(() =>
  locale.value === 'fr'
    ? {
        okTitle: 'Connexion réussie',
        okText: 'Vous êtes connecté(e) à l’éditeur du site en tant que',
        okHow: 'Pour modifier le contenu, cliquez sur le bouton en bas à gauche de l’écran.',
        gotIt: 'Compris',
        pill: 'Connecté à l’éditeur :',
        logout: 'Se déconnecter',
      }
    : {
        okTitle: 'You are signed in',
        okText: 'You are signed in to the site editor as',
        okHow: 'To edit content, click the button at the bottom left of the screen.',
        gotIt: 'Got it',
        pill: 'Signed in to the editor:',
        logout: 'Sign out',
      },
)

async function logout() {
  leaving.value = true
  await $fetch('/__nuxt_studio/auth/session', { method: 'DELETE' }).catch(() => {})
  window.location.reload()
}
</script>

<template>
  <div v-if="user" class="stu">
    <div v-if="welcome" class="stu__toast" role="alert">
      <p class="stu__title">{{ t.okTitle }}</p>
      <p>
        {{ t.okText }} <strong>{{ who }}</strong
        >.
      </p>
      <p>{{ t.okHow }}</p>
      <button type="button" class="stu__btn" @click="welcome = false">{{ t.gotIt }}</button>
    </div>
    <p class="stu__pill" role="status">
      <span class="stu__dot" aria-hidden="true" />
      <span
        >{{ t.pill }} <strong>{{ who }}</strong></span
      >
      <button v-if="session?.email" type="button" class="stu__link" :disabled="leaving" @click="logout">{{ t.logout }}</button>
    </p>
  </div>
</template>

<style scoped>
.stu__toast,
.stu__pill {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  font-family: var(--font-body);
  color: #14162f;
  background: #fff;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
}

.stu__toast {
  top: 16px;
  width: min(440px, calc(100vw - 32px));
  padding: 18px 20px;
  border-radius: 14px;
  border-left: 6px solid #1f9d55;
  font-size: 16px;
  line-height: 1.5;
}

.stu__toast p + p {
  margin-top: 6px;
}

.stu__title {
  font-weight: 700;
  font-size: 18px;
}

.stu__btn {
  margin-top: 14px;
  padding: 8px 18px;
  border: 0;
  border-radius: 8px;
  background: #14162f;
  color: #fff;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.stu__pill {
  bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: calc(100vw - 140px);
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 14px;
  line-height: 1.3;
}

.stu__dot {
  flex: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #1f9d55;
}

.stu__link {
  flex: none;
  padding: 0;
  border: 0;
  background: none;
  color: #14162f;
  font: inherit;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
}

.stu__btn:focus-visible,
.stu__link:focus-visible {
  outline: 2px solid #e05aa8;
  outline-offset: 2px;
}
</style>
