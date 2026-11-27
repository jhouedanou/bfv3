// Formulaires du site (contact, baromètre, « Me notifier ») : POST /api/lead.
// Réponse : { ok: true } | { ok: false, error: 'validation', fields: string[] } | { ok: false, error: 'server' | 'rate' }
// Pas de base de données : la demande part par e-mail (Resend) à l'adresse de réception.
import type { H3Event } from 'h3'
import { z } from 'zod'

// ── Schémas (CDC § 4.4 et § 4.5) ────────────────────────────────────────────

const text = (max = 200) => z.string().trim().min(1).max(max)
const optional = (max = 200) => z.string().trim().max(max).optional().default('')

const meta = {
  locale: z.enum(['fr', 'en']),
  page: z.string().max(300),
  website: z.string().max(0).optional().default(''), // champ piège : doit rester vide
  turnstile: z.string().optional().default(''),
}

const contactSchema = z.object({
  type: z.literal('contact'),
  source: z.enum(['header', 'hero', 'solutions', 'observatoire', 'veille', 'conseil', 'academy', 'digitales']),
  name: text(),
  email: z.string().trim().email().max(200),
  phone: text(40),
  company: text(),
  role: text(),
  sector: optional(),
  choice: z.enum(['veille', 'conseil', 'academy', 'digitales', 'multi', 'unknown']),
  need: text(4000),
  consent: z.literal(true),
  optin: z.boolean().default(false),
  ...meta,
})

const gateSchema = z.object({
  type: z.literal('barometre'),
  barometre: text(80),
  name: text(),
  email: z.string().trim().email().max(200),
  company: text(),
  role: text(),
  phone: optional(40),
  optin: z.boolean().default(true),
  ...meta,
})

const notifySchema = z.object({
  type: z.literal('notify'),
  email: z.string().trim().email().max(200),
  ...meta,
})

const leadSchema = z.discriminatedUnion('type', [contactSchema, gateSchema, notifySchema])
type Lead = z.output<typeof leadSchema>

type LeadResult = { ok: true } | { ok: false; error: 'validation'; fields: string[] } | { ok: false; error: 'server' | 'rate' }

// ── Limite de débit : 5 envois par IP en 10 minutes, 3 par adresse e-mail en 1 heure ─────
// En mémoire, par instance de fonction : un frein, pas une garantie (pas de base de données).

// Limites par instance de fonction (mémoire) : un frein, pas une garantie. La protection
// principale contre les envois automatisés est Turnstile, obligatoire sur Vercel.
// « ack » plafonne les accusés de réception envoyés à des adresses saisies par le visiteur.
const RATE = { ip: { max: 5, minutes: 10 }, email: { max: 3, minutes: 60 }, ack: { max: 30, minutes: 60 } }
const hits = new Map<string, number[]>()

// Une même boîte sous plusieurs formes (Nom+tag@, n.o.m@gmail.com) compte pour une seule.
const mailboxKey = (email: string) => {
  const [local = '', domain = ''] = email.trim().toLowerCase().split('@')
  const base = local.split('+')[0] ?? ''
  const gmail = domain === 'gmail.com' || domain === 'googlemail.com'
  return `email:${gmail ? base.replace(/\./g, '') : base}@${gmail ? 'gmail.com' : domain}`
}

const recent = (key: string, minutes: number) => {
  const now = Date.now()
  const list = (hits.get(key) ?? []).filter((t) => now - t < minutes * 60_000)
  hits.set(key, list)
  return list
}
const record = (key: string) => {
  hits.get(key)?.push(Date.now()) ?? hits.set(key, [Date.now()])
  if (hits.size > 5000) for (const k of [...hits.keys()].slice(0, 1000)) hits.delete(k)
}

// ── Services externes ───────────────────────────────────────────────────────

// Sur Vercel (production comme pré-production), Resend et Turnstile sont obligatoires.
const onVercel = Boolean(process.env.VERCEL)

// Vérification Cloudflare Turnstile. Sans clé secrète : ignorée en local, refusée sur Vercel.
const verifyTurnstile = async (secret: string, token: string, ip: string | undefined) => {
  if (!secret) return !onVercel
  if (!token) return false
  const body = new URLSearchParams({ secret, response: token })
  if (ip) body.set('remoteip', ip)
  const data = await $fetch<{ success?: boolean }>('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  }).catch(() => ({ success: false }))
  return Boolean(data.success)
}

type Mail = { to: string; subject: string; text: string; html?: string; replyTo?: string }

// Sans clé Resend en local, l'e-mail est écrit dans la console. Sur Vercel, la clé est obligatoire.
const sendMail = async (event: H3Event, mail: Mail) => {
  const { resendApiKey, mailFrom } = useRuntimeConfig(event)
  if (!resendApiKey) {
    if (onVercel) throw new Error('NUXT_RESEND_API_KEY manquante')
    console.info(`\n[mail] À : ${mail.to}\n[mail] Objet : ${mail.subject}\n${mail.text}\n`)
    // Aperçu local de la version HTML : MAIL_PREVIEW_DIR=/un/dossier pnpm dev
    if (mail.html && process.env.MAIL_PREVIEW_DIR) {
      const { writeFile } = await import('node:fs/promises')
      await writeFile(`${process.env.MAIL_PREVIEW_DIR}/${Date.now()}-${mail.to.replace(/[^a-z0-9@.-]/gi, '_')}.html`, mail.html)
    }
    return
  }
  await $fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendApiKey}` },
    body: {
      from: mailFrom || 'BIG FIVE <onboarding@resend.dev>',
      to: [mail.to],
      subject: mail.subject,
      text: mail.text,
      ...(mail.html ? { html: mail.html } : {}),
      ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
    },
  })
}

// ── Mise en forme des e-mails ────────────────────────────────────────────────
// Version HTML sobre, toujours accompagnée de la version texte : tableaux et styles en ligne
// (seule mise en forme fiable dans les messageries), aucune image distante, aucun lien de suivi.
// Tout texte saisi par le visiteur est échappé : il ne peut pas injecter de HTML.

type Row = [label: string, value: string | undefined]

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

const htmlMail = (o: { locale: 'fr' | 'en'; title: string; paragraphs?: string[]; rowsTitle?: string; rows?: Row[]; siteUrl: string }) => {
  const rows = (o.rows ?? []).filter(([, v]) => v !== undefined && v.trim() !== '')
  const cell = 'padding:10px 0;border-bottom:1px solid #e6e6ee;vertical-align:top;font-size:15px;line-height:1.5;'
  const table = rows.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:8px 0 0;">${rows
        .map(
          ([k, v]) =>
            `<tr><td style="${cell}width:38%;padding-right:16px;color:#5a5d7a;">${esc(k)}</td><td style="${cell}color:#14162f;white-space:pre-wrap;word-break:break-word;">${esc(v!.trim())}</td></tr>`,
        )
        .join('')}</table>`
    : ''
  const paragraphs = (o.paragraphs ?? [])
    .map((p) => `<p style="margin:0 0 14px;font-size:16px;line-height:1.6;color:#14162f;">${esc(p).replace(/\n/g, '<br>')}</p>`)
    .join('')
  const rowsTitle = o.rowsTitle && rows.length ? `<p style="margin:22px 0 4px;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#5a5d7a;font-weight:bold;">${esc(o.rowsTitle)}</p>` : ''
  const host = o.siteUrl.replace(/^https?:\/\//, '')
  return `<!doctype html><html lang="${o.locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(o.title)}</title></head>
<body style="margin:0;padding:0;background:#f2f2f7;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2f7;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:10px;overflow:hidden;">
<tr><td style="background:#14162f;padding:22px 28px;border-bottom:4px solid #e05aa8;"><span style="font-size:22px;font-weight:bold;letter-spacing:.04em;color:#ffffff;">BIG FIVE</span></td></tr>
<tr><td style="padding:28px;"><h1 style="margin:0 0 18px;font-size:20px;line-height:1.35;color:#14162f;">${esc(o.title)}</h1>${paragraphs}${rowsTitle}${table}</td></tr>
<tr><td style="padding:18px 28px;background:#f7f7fb;font-size:13px;line-height:1.5;color:#5a5d7a;">BIG FIVE · <a href="${esc(o.siteUrl)}" style="color:#14162f;">${esc(host)}</a></td></tr>
</table></td></tr></table></body></html>`
}

// ── Contenu (content/) ──────────────────────────────────────────────────────

// Les libellés sont rangés par groupes (un par section) dans content/1.accueil et content/6.textes :
// on les relit à plat, par leur clé.
const flatten = (doc: Record<string, unknown> | null | undefined) => {
  const out: Record<string, unknown> = {}
  for (const [group, value] of Object.entries(doc ?? {})) {
    if (!value || typeof value !== 'object' || Array.isArray(value) || group === 'seo' || group === 'meta') continue
    if (group === 'sources') out.sources = value
    else for (const [key, text] of Object.entries(value)) if (typeof text === 'string') out[key] = text
  }
  return out
}

const labels = async (event: H3Event, locale: 'fr' | 'en') => {
  const [home, textes] = await Promise.all([
    queryCollection(event, 'accueil').where('locale', '=', locale).first(),
    queryCollection(event, 'textes').where('locale', '=', locale).first(),
  ])
  return { ...flatten(home as Record<string, unknown> | null), ...flatten(textes as Record<string, unknown> | null) } as Record<string, string>
}

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

// Libellés français des solutions, tels que saisis dans content/2.solutions/fr.
const choiceLabel = async (event: H3Event, choice: string, locale: 'fr' | 'en' = 'fr', t: Record<string, string> = {}) => {
  const fixed: Record<string, string> = { multi: t.multi || 'Plusieurs expertises', unknown: t.unknown || 'Je ne sais pas encore' }
  if (fixed[choice]) return fixed[choice]
  const s = await queryCollection(event, 'solutions').where('locale', '=', locale).where('key', '=', choice).first()
  return s?.name ?? choice
}

// Baromètre publié (date de parution passée). Le titre vient du contenu, pas du navigateur.
const publishedBarometre = async (event: H3Event, identifiant: string) => {
  const b = await queryCollection(event, 'barometres').where('identifiant', '=', identifiant).first()
  if (!b || !b.published || b.publishedAt.slice(0, 10) > new Date().toISOString().slice(0, 10)) return null
  return b
}

const stamp = () =>
  new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Africa/Abidjan' }).format(new Date())

const lines = (rows: Row[]) =>
  rows
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k} : ${v}`)
    .join('\n')

type Prepared = { subject: string; rows: Row[]; replyTo: string; source: string }

async function prepare(event: H3Event, lead: Lead): Promise<Prepared | null> {
  const footer: [string, string][] = [
    ['Langue', lead.locale.toUpperCase()],
    ['Date et heure', stamp()],
    ['Page d’origine', lead.page],
  ]

  if (lead.type === 'contact') {
    const tag = SOURCE_TAG[lead.source]!
    return {
      subject: `[${tag}] ${lead.name} — ${lead.company}`,
      source: tag,
      replyTo: lead.email,
      rows: [
        ['Source', tag],
        ['Nom complet', lead.name],
        ['E-mail professionnel', lead.email],
        ['Téléphone / WhatsApp', lead.phone],
        ['Entreprise', lead.company],
        ['Fonction', lead.role],
        ['Secteur d’activité', lead.sector],
        ['Accompagnement souhaité', await choiceLabel(event, lead.choice)],
        ['Besoin', `\n${lead.need}\n`],
        ['Consentement à être recontacté', 'oui'],
        ['Notifié des prochaines parutions', lead.optin ? 'oui' : 'non'],
        ...footer,
      ],
    }
  }

  if (lead.type === 'barometre') {
    const baro = await publishedBarometre(event, lead.barometre)
    if (!baro) return null
    return {
      subject: `[Baromètre] ${lead.name} — ${lead.company} — ${baro.title}`,
      source: 'Baromètre',
      replyTo: lead.email,
      rows: [
        ['Source', 'Baromètre'],
        ['Baromètre', `${baro.title} (${baro.identifiant})`],
        ['Nom complet', lead.name],
        ['E-mail professionnel', lead.email],
        ['Entreprise', lead.company],
        ['Poste', lead.role],
        ['Téléphone', lead.phone],
        ['Notifié des prochaines parutions', lead.optin ? 'oui' : 'non'],
        ...footer,
      ],
    }
  }

  return {
    subject: `[Me notifier] ${lead.email}`,
    source: 'Me notifier',
    replyTo: lead.email,
    rows: [['Source', 'Me notifier'], ['E-mail', lead.email], ...footer],
  }
}

const reply = (event: H3Event, status: number, body: LeadResult) => {
  setResponseStatus(event, status)
  return body
}

export default defineEventHandler(async (event): Promise<LeadResult> => {
  const parsed = leadSchema.safeParse(await readBody(event).catch(() => null))
  if (!parsed.success) {
    // Champ piège rempli : on répond comme un succès sans rien envoyer.
    if (parsed.error.issues.some((i) => i.path[0] === 'website')) return { ok: true }
    return reply(event, 400, {
      ok: false,
      error: 'validation',
      fields: [...new Set(parsed.error.issues.map((i) => String(i.path[0])))],
    })
  }
  const lead = parsed.data
  const config = useRuntimeConfig(event)

  const ip = getRequestIP(event, { xForwardedFor: true })?.split(',')[0]?.trim()
  if (!(await verifyTurnstile(config.turnstileSecretKey, lead.turnstile, ip))) {
    console.warn('[lead] vérification Turnstile refusée')
    return reply(event, 400, { ok: false, error: 'server' })
  }

  const ipKey = ip ? `ip:${ip}` : null
  const emailKey = mailboxKey(lead.email)
  if ((ipKey && recent(ipKey, RATE.ip.minutes).length >= RATE.ip.max) || recent(emailKey, RATE.email.minutes).length >= RATE.email.max) {
    console.warn('[lead] limite de débit atteinte')
    return reply(event, 429, { ok: false, error: 'rate' })
  }
  // Créneaux réservés dès le contrôle, sans await entre les deux : des requêtes simultanées
  // ne peuvent pas toutes passer avant que le compteur augmente.
  if (ipKey) record(ipKey)
  record(emailKey)

  const mail = await prepare(event, lead)
  if (!mail) return reply(event, 400, { ok: false, error: 'validation', fields: ['barometre'] })

  const reglages = await queryCollection(event, 'reglages').first()
  const to = config.leadsTo || reglages?.email || 'contacts@bigfiveabidjan.com'

  try {
    await sendMail(event, {
      to,
      subject: mail.subject,
      text: lines(mail.rows),
      html: htmlMail({ locale: 'fr', title: mail.subject, rows: mail.rows, siteUrl: config.public.siteUrl }),
      replyTo: mail.replyTo,
    })

    // Case « prochaines parutions » cochée : même liste que « Me notifier » (CDC § 4.2).
    if (lead.type !== 'notify' && lead.optin) {
      const optinRows: Row[] = [['Source', `Case « prochaines parutions » (${mail.source})`], ['E-mail', lead.email]]
      await sendMail(event, {
        to,
        subject: `[Me notifier] ${lead.email}`,
        text: lines(optinRows),
        html: htmlMail({ locale: 'fr', title: `[Me notifier] ${lead.email}`, rows: optinRows, siteUrl: config.public.siteUrl }),
        replyTo: lead.email,
      })
    }
  } catch (err) {
    console.error('[lead] envoi impossible', err)
    return reply(event, 502, { ok: false, error: 'server' })
  }

  // Accusé de réception au visiteur, dans la langue de la page (content/6.textes, groupe « emails »),
  // avec une copie de sa demande. L'adresse de destination n'est pas vérifiée : pour que le
  // formulaire ne serve pas de relais, le texte saisi est échappé, l'envoi est protégé par
  // Turnstile et limité (3 demandes par adresse et par heure, 30 accusés par heure au total).
  // L'accusé ne fait pas échouer la demande.
  const t = await labels(event, lead.locale).catch(() => ({}) as Record<string, string>)
  const notify = lead.type === 'notify'
  const subject = notify ? t.ackNotifySubject : t.ackSubject
  const body = notify ? t.ackNotifyBody : t.ackBody
  // Plafond global : au-delà, la demande part quand même chez BIG FIVE, sans accusé.
  if (subject && body && recent('ack', RATE.ack.minutes).length < RATE.ack.max) {
    record('ack')
    const home = `${config.public.siteUrl}${lead.locale === 'en' ? '/en' : ''}`
    // Libellés du formulaire, sans l'astérisque des champs obligatoires.
    const label = (key: string, fallback: string) => (t[key] || fallback).replace(/\s*[*?:]+\s*$/, '')
    let copy: Row[] = []
    if (lead.type === 'contact') {
      copy = [
        [label('fullName', 'Nom complet'), lead.name],
        [label('emailPro', 'E-mail'), lead.email],
        [label('phone', 'Téléphone'), lead.phone],
        [label('company', 'Entreprise'), lead.company],
        [label('role', 'Fonction'), lead.role],
        [label('sector', 'Secteur'), lead.sector],
        [label('which', 'Accompagnement souhaité'), await choiceLabel(event, lead.choice, lead.locale, t)],
        [label('need', 'Votre besoin'), lead.need],
      ]
    } else if (lead.type === 'barometre') {
      const baro = await publishedBarometre(event, lead.barometre)
      copy = [
        [label('baro', 'Baromètre'), baro?.title],
        [label('fullName', 'Nom complet'), lead.name],
        [label('emailPro', 'E-mail'), lead.email],
        [label('company', 'Entreprise'), lead.company],
        [label('jobTitle', 'Poste'), lead.role],
        [label('phoneOpt', 'Téléphone'), lead.phone],
      ]
    }
    const copyTitle = t.ackCopyTitle || (lead.locale === 'en' ? 'A copy of your request' : 'Copie de votre demande')
    const text = [body, ...(copy.length ? [`${copyTitle}\n${lines(copy)}`] : []), home].join('\n\n')
    const html = htmlMail({
      locale: lead.locale,
      title: subject,
      paragraphs: body.split(/\n{2,}/),
      rowsTitle: copyTitle,
      rows: copy,
      siteUrl: home,
    })
    await sendMail(event, { to: lead.email, subject, text, html }).catch(() => undefined)
  }

  return { ok: true }
})
