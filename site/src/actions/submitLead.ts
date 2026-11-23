'use server'

import { createHash } from 'crypto'

import { headers } from 'next/headers'

import { getBarometre } from '@/lib/barometres'
import { getSiteContent } from '@/lib/content'
import { leadSchema, type Lead, type LeadInput, type LeadResult } from '@/lib/leads'
import { sendMail } from '@/lib/mail'
import { getPayloadClient } from '@/lib/payload'
import { getSettings } from '@/lib/settings'
import { SITE_URL, localePath } from '@/lib/site'
import { verifyTurnstile } from '@/lib/turnstile'

import type { Where } from 'payload'

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

// Limite de débit : au plus 5 envois par adresse IP en 10 minutes, et 3 par adresse e-mail en 1 heure.
// Les envois sont comptés dans « Demandes » : la limite tient d'une fonction serverless à l'autre.
const RATE = { ip: { max: 5, minutes: 10 }, email: { max: 3, minutes: 60 } }

const hashIp = (ip: string) =>
  createHash('sha256')
    .update(`${process.env.PAYLOAD_SECRET ?? ''}:${ip}`)
    .digest('hex')
    .slice(0, 32)

const since = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString()

type Prepared = { subject: string; text: string; replyTo: string; source: string }

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

  const ipHash = ip ? hashIp(ip) : null
  const count = async (where: Where) =>
    (await payload.count({ collection: 'demandes', overrideAccess: true, where })).totalDocs
  const [byIp, byEmail] = await Promise.all([
    ipHash
      ? count({ and: [{ ipHash: { equals: ipHash } }, { createdAt: { greater_than: since(RATE.ip.minutes) } }] })
      : 0,
    count({ and: [{ email: { equals: lead.email } }, { createdAt: { greater_than: since(RATE.email.minutes) } }] }),
  ])
  if (byIp >= RATE.ip.max || byEmail >= RATE.email.max) {
    console.warn('[lead] limite de débit atteinte')
    return { ok: false, error: 'rate' }
  }

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
      ipHash,
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

  // Accusé de réception, dans la langue de la page. Textes : Admin → Textes : baromètre et origine
  // des demandes → Accusés de réception. Aucun texte saisi par le visiteur n'y figure : l'adresse de
  // destination n'est pas vérifiée, le message ne doit pas pouvoir servir de relais.
  // L'accusé ne doit pas faire échouer la demande.
  const { t } = await getSiteContent(lead.locale)
  const notify = lead.type === 'notify'
  const ack = {
    subject: notify ? t.ackNotifySubject : t.ackSubject,
    body: `${notify ? t.ackNotifyBody : t.ackBody}\n${SITE_URL}${localePath(lead.locale)}`,
  }
  await sendMail({ to: lead.email, subject: ack.subject, text: ack.body }).catch(() => undefined)

  return { ok: true }
}
