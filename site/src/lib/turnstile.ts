import 'server-only'

// Vérification Cloudflare Turnstile. Sans clé secrète, elle est ignorée en local et refusée sur Vercel.
export async function verifyTurnstile(token: string, ip?: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return !process.env.VERCEL
  if (!token) return false
  const body = new URLSearchParams({ secret, response: token })
  if (ip) body.set('remoteip', ip)
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body })
  const data = (await res.json()) as { success?: boolean }
  return Boolean(data.success)
}
