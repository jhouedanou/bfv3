import { z } from 'zod'

// Schémas partagés entre le navigateur et le serveur (CDC § 4.4 et § 4.5).
const text = (max = 200) => z.string().trim().min(1).max(max)
const optional = (max = 200) => z.string().trim().max(max).optional().default('')

const meta = {
  locale: z.enum(['fr', 'en']),
  page: z.string().max(300),
  website: z.string().max(0).optional().default(''), // champ piège : doit rester vide
  turnstile: z.string().optional().default(''),
}

export const contactSchema = z.object({
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

export const gateSchema = z.object({
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

export const notifySchema = z.object({
  type: z.literal('notify'),
  email: z.string().trim().email().max(200),
  ...meta,
})

export const leadSchema = z.discriminatedUnion('type', [contactSchema, gateSchema, notifySchema])

export type LeadInput = z.input<typeof leadSchema>
export type Lead = z.output<typeof leadSchema>

export type LeadResult = { ok: true } | { ok: false; error: 'validation'; fields: string[] } | { ok: false; error: 'server' }
