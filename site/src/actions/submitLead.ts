'use server'

import { headers } from 'next/headers'

import { getBarometre } from '@/lib/barometres'
import { getSiteContent } from '@/lib/content'
import { leadSchema, type Lead, type LeadInput, type LeadResult } from '@/lib/leads'
import { sendMail } from '@/lib/mail'
import { getPayloadClient } from '@/lib/payload'
import { getSettings } from '@/lib/settings'
import { verifyTurnstile } from '@/lib/turnstile'

// Étiquette de source en tête de l'objet (CDC § 4 et § 5).
const SOURCE_TAG: Record<string, string> = {
  header: 'Contact',
  hero: 'Contact',
  solutions: 'Contact',
  observatoire: 'Étude sur mesure',
  veille: 'Veille',
  conseil: 'Conseil',
  academy: 'Academy',
  digitales: 'Solutions digitales',
}

// Libellés français des solutions, tels que saisis dans l'admin.
const choiceLabel = async (choice: string) => {
  const fixed: Record<string, string> = { multi: 'Plusieurs expertises', unknown: 'Je ne sais pas encore' }
  if (fixed[choice]) return fixed[choice]
  const { solutions } = await getSiteContent('fr')
  return solutions.find((s) => s.key === choice)?.name ?? choice
}

const stamp = () =>
  new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Africa/Abidjan' }).format(new Date())

const lines = (rows: [string, string | undefined][]) =>
  rows
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k} : ${v}`)
    .join('\n')

// Accusés de réception (CDC § 4.5). Textes à faire valider par BIG FIVE (CDC § 8).
const ACK = {
  fr: {
    subject: 'BIG FIVE — Nous avons bien reçu votre demande',
    body: (name: string) =>
      `Bonjour ${name},\n\nMerci pour votre message. Votre demande est bien reçue : un membre de l'équipe BIG FIVE vous recontacte rapidement.\n\nCordialement,\nL'équipe BIG FIVE\nhttps://bigfive.solutions`,
  },
  en: {
    subject: 'BIG FIVE — We have received your request',
    body: (name: string) =>
      `Hello ${name},\n\nThank you for your message. Your request has been received: a member of the BIG FIVE team will get back to you shortly.\n\nBest regards,\nThe BIG FIVE team\nhttps://bigfive.solutions/en`,
  },
}

const ACK_NOTIFY = {
  fr: {
    subject: 'BIG FIVE — Inscription aux prochaines parutions',
    body: `Bonjour,\n\nVotre adresse est bien enregistrée : vous recevrez un e-mail à chaque nouveau baromètre BIG FIVE Insights.\nPour ne plus recevoir ces annonces, répondez simplement à cet e-mail.\n\nCordialement,\nL'équipe BIG FIVE\nhttps://bigfive.solutions`,
  },
  en: {
    subject: 'BIG FIVE — Subscribed to upcoming releases',
    body: `Hello,\n\nYour address has been registered: you will receive an email with each new BIG FIVE Insights barometer.\nTo stop receiving these announcements, simply reply to this email.\n\nBest regards,\nThe BIG FIVE team\nhttps://bigfive.solutions/en`,
  },
}

type Prepared = { subject: string; text: string; replyTo: string; name?: string; source: string }

async function prepare(lead: Lead): Promise<Prepared | null> {
  const footer: [string, string][] = [
    ['Langue', lead.locale.toUpperCase()],
    ['Date et heure', stamp()],
    ['Page d’origine', lead.page],
  ]

  if (lead.type === 'contact') {
    const tag = SOURCE_TAG[lead.source]
    return {
      subject: `[${tag}] ${lead.name} — ${lead.company}`,
      source: tag,
      replyTo: lead.email,
      name: lead.name,
      text: lines([
        ['Source', tag],
        ['Nom complet', lead.name],
        ['E-mail professionnel', lead.email],
        ['Téléphone / WhatsApp', lead.phone],
        ['Entreprise', lead.company],
        ['Fonction', lead.role],
        ['Secteur d’activité', lead.sector],
        ['Accompagnement souhaité', await choiceLabel(lead.choice)],
        ['Besoin', `\n${lead.need}\n`],
        ['Consentement à être recontacté', 'oui'],
        ['Notifié des prochaines parutions', lead.optin ? 'oui' : 'non'],
        ...footer,
      ]),
    }
  }

  if (lead.type === 'barometre') {
    // Le titre vient de la base, pas du navigateur.
    const baro = await getBarometre(lead.barometre)
    if (!baro) return null
    return {
      subject: `[Baromètre] ${lead.name} — ${lead.company} — ${baro.title}`,
      source: 'Baromètre',
      replyTo: lead.email,
      name: lead.name,
      text: lines([
        ['Source', 'Baromètre'],
        ['Baromètre', `${baro.title} (${baro.identifiant})`],
        ['Nom complet', lead.name],
        ['E-mail professionnel', lead.email],
        ['Entreprise', lead.company],
        ['Poste', lead.role],
        ['Téléphone', lead.phone],
        ['Notifié des prochaines parutions', lead.optin ? 'oui' : 'non'],
        ...footer,
      ]),
    }
  }

  return {
    subject: `[Me notifier] ${lead.email}`,
    source: 'Me notifier',
    replyTo: lead.email,
    text: lines([['Source', 'Me notifier'], ['E-mail', lead.email], ...footer]),
  }
}

export async function submitLead(input: LeadInput): Promise<LeadResult> {
  const parsed = leadSchema.safeParse(input)
  if (!parsed.success) {
    // Champ piège rempli : on répond comme un succès sans rien envoyer.
    if (parsed.error.issues.some((i) => i.path[0] === 'website')) return { ok: true }
    return { ok: false, error: 'validation', fields: [...new Set(parsed.error.issues.map((i) => String(i.path[0])))] }
  }
  const lead = parsed.data

  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
  if (!(await verifyTurnstile(lead.turnstile, ip))) {
    console.warn('[lead] vérification Turnstile refusée')
    return { ok: false, error: 'server' }
  }

  const mail = await prepare(lead)
  if (!mail) return { ok: false, error: 'validation', fields: ['barometre'] }

  const { emailReception } = await getSettings()
  const payload = await getPayloadClient()
  const { turnstile: _t, website: _w, ...fields } = lead

  const record = await payload.create({
    collection: 'demandes',
    overrideAccess: true,
    data: {
      subject: mail.subject,
      type: lead.type === 'contact' && lead.source === 'observatoire' ? 'etude' : lead.type,
      source: mail.source,
      email: lead.email,
      locale: lead.locale,
      page: lead.page,
      fields,
      emailStatus: 'pending',
    },
  })

  try {
    await sendMail({ to: emailReception, subject: mail.subject, text: mail.text, replyTo: mail.replyTo })

    // Case « prochaines parutions » cochée : même liste que « Me notifier » (CDC § 4.2).
    if (lead.type !== 'notify' && lead.optin) {
      await sendMail({
        to: emailReception,
        subject: `[Me notifier] ${lead.email}`,
        text: lines([['Source', `Case « prochaines parutions » (${mail.source})`], ['E-mail', lead.email]]),
        replyTo: lead.email,
      })
    }

    await payload.update({ collection: 'demandes', id: record.id, overrideAccess: true, data: { emailStatus: 'sent' } })
  } catch (err) {
    console.error('[lead] envoi impossible', err)
    await payload.update({
      collection: 'demandes',
      id: record.id,
      overrideAccess: true,
      data: { emailStatus: 'failed', emailError: String(err).slice(0, 500) },
    })
    return { ok: false, error: 'server' }
  }

  // L'accusé de réception ne doit pas faire échouer la demande.
  const ack =
    lead.type === 'notify' || !mail.name
      ? ACK_NOTIFY[lead.locale]
      : { subject: ACK[lead.locale].subject, body: ACK[lead.locale].body(mail.name) }
  await sendMail({ to: lead.email, subject: ack.subject, text: ack.body }).catch(() => undefined)

  return { ok: true }
}
