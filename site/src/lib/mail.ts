import 'server-only'

import { Resend } from 'resend'

type Mail = { to: string; subject: string; text: string; replyTo?: string }

const FROM = process.env.MAIL_FROM || 'BIG FIVE <onboarding@resend.dev>'

// Sans clé Resend en local, l'e-mail est écrit dans la console. Sur Vercel, la clé est obligatoire.
export async function sendMail(mail: Mail) {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    if (process.env.VERCEL) throw new Error('RESEND_API_KEY manquante')
    console.info(`\n[mail] À : ${mail.to}\n[mail] Objet : ${mail.subject}\n${mail.text}\n`)
    return
  }
  const resend = new Resend(key)
  const { error } = await resend.emails.send({ from: FROM, to: mail.to, subject: mail.subject, text: mail.text, replyTo: mail.replyTo })
  if (error) throw new Error(`${error.name}: ${error.message}`)
}
