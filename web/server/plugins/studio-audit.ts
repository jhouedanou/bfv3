import type { H3Event } from 'h3'

// Journal des connexions à Nuxt Studio (/_studio).
// Chaque connexion, déconnexion et tentative refusée est :
//   1. écrite dans les journaux du serveur, en JSON (Vercel → Logs, rechercher « studio-auth ») ;
//   2. envoyée par e-mail à NUXT_AUDIT_TO, si cette variable et la clé Resend sont renseignées.
// Il n'y a pas de base de données : l'e-mail est la trace durable, les journaux Vercel sont
// effacés au bout de quelques heures ou jours selon l'offre.

type StudioUser = { name?: string; email?: string; provider?: string }
type Kind = 'connexion' | 'deconnexion' | 'refus'

const LABEL: Record<Kind, string> = {
  connexion: 'Connexion',
  deconnexion: 'Déconnexion',
  refus: 'Connexion refusée',
}

// Témoin lu par le site pour afficher « Connexion réussie » (components/StudioSession.vue).
const WELCOME_COOKIE = 'bf-studio-welcome'

async function notify(event: H3Event | undefined, subject: string, text: string) {
  const { auditTo, resendApiKey, mailFrom } = useRuntimeConfig(event)
  if (!auditTo || !resendApiKey) return
  await $fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendApiKey}` },
    body: { from: mailFrom || 'BIG FIVE <onboarding@resend.dev>', to: [auditTo], subject, text },
  }).catch((error) => console.error(JSON.stringify({ tag: 'studio-auth', type: 'erreur-mail', message: String(error?.message ?? error) })))
}

function record(event: H3Event | undefined, kind: Kind, user?: StudioUser, detail?: string) {
  // Seuls ces champs sont repris : l'objet « user » de Studio contient aussi le jeton GitHub.
  const entry = {
    tag: 'studio-auth',
    type: kind,
    at: new Date().toISOString(),
    email: user?.email ?? null,
    name: user?.name ?? null,
    provider: user?.provider ?? null,
    ip: event ? (getRequestIP(event, { xForwardedFor: true }) ?? null) : null,
    userAgent: event ? (getHeader(event, 'user-agent') ?? null) : null,
    ...(detail ? { detail } : {}),
  }
  console.info(JSON.stringify(entry))

  const who = entry.email ? `${entry.name ?? ''} <${entry.email}>`.trim() : 'adresse inconnue'
  const mail = notify(
    event,
    `[Studio BIG FIVE] ${LABEL[kind]} : ${entry.email ?? 'adresse inconnue'}`,
    [
      `${LABEL[kind]} à l'éditeur du site.`,
      '',
      `Personne : ${who}`,
      `Date (UTC) : ${entry.at}`,
      `Adresse IP : ${entry.ip ?? 'inconnue'}`,
      `Navigateur : ${entry.userAgent ?? 'inconnu'}`,
      ...(detail ? [`Détail : ${detail}`] : []),
    ].join('\n'),
  )
  // L'envoi ne retarde pas la connexion ; sur Vercel, waitUntil le laisse se terminer.
  if (event?.waitUntil) event.waitUntil(mail)
}

export default defineNitroPlugin((nitro) => {
  // Les crochets « studio:auth:* » viennent du module nuxt-studio (non typés côté Nitro).
  const hooks = nitro.hooks as unknown as { hook: (name: string, fn: (...args: any[]) => unknown) => void }

  hooks.hook('studio:auth:login', ({ user, event }: { user: StudioUser; event: H3Event }) => {
    setCookie(event, WELCOME_COOKIE, '1', {
      path: '/',
      maxAge: 300,
      sameSite: 'lax',
      secure: getRequestProtocol(event) === 'https',
    })
    record(event, 'connexion', user)
  })

  hooks.hook('studio:auth:logout', ({ user, event }: { user: StudioUser; event: H3Event }) => {
    record(event, 'deconnexion', user)
  })

  // Tentatives qui échouent : adresse non autorisée (403), refus côté Google (401), configuration.
  hooks.hook('error', (error: { statusCode?: number; message?: string }, context: { event?: H3Event }) => {
    const event = context?.event
    if (!event?.path?.startsWith('/__nuxt_studio/auth/')) return
    record(event, 'refus', undefined, `${error?.statusCode ?? 500} ${error?.message ?? ''}`.trim())
  })
})
