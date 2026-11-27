// Génère content/ à partir des textes validés (docs/textes/textes-a-relire/*.txt) et des
// données de départ de l'ancien site Next (images, logos, liens, libellés d'interface).
// Usage : pnpm import:textes  (écrase les fichiers de content/ qu'il produit)
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import YAML from 'yaml'

import { dictionaries } from '../../site/src/i18n/dictionaries'
import { BAROMETRES_SEED } from '../../site/src/seed/barometres'
import {
  CLIENTS,
  HERO_COVERS,
  HOME_META,
  POLES,
  PRIVACY,
  SOCIALS,
  SOLUTION_META_TITLES,
  SOLUTIONS,
} from '../../site/src/seed/data/site'

type Locale = 'fr' | 'en'
type SolutionKey = 'veille' | 'conseil' | 'academy' | 'digitales'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const TEXTES = path.resolve(root, '../docs/textes/textes-a-relire')
const CONTENT = path.join(root, 'content')

const SOLUTION_BY_PREFIX: Record<string, SolutionKey> = { '1': 'veille', '2': 'conseil', '3': 'academy', '4': 'digitales' }

const write = (rel: string, data: unknown) => {
  const file = path.join(CONTENT, rel)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, typeof data === 'string' ? data : YAML.stringify(data, { lineWidth: 0 }))
}

// Découpe un fichier en blocs FR / EN (séparés par les lignes « ===== »).
const splitLocales = (txt: string): Record<Locale, string[]> => {
  const parts = txt.split(/^=+\n(FRANÇAIS|ENGLISH)\n=+\n/m)
  const out = {} as Record<Locale, string[]>
  for (let i = 1; i < parts.length; i += 2) out[parts[i] === 'FRANÇAIS' ? 'fr' : 'en'] = parts[i + 1].split('\n')
  return out
}

const field = (lines: string[], label: RegExp) => {
  const l = lines.find((x) => label.test(x))
  return l ? l.slice(l.indexOf(' : ') + 3).trim() : ''
}

// Liste « - item » qui suit une ligne d'en-tête.
const listAfter = (lines: string[], header: RegExp) => {
  const i = lines.findIndex((x) => header.test(x))
  if (i < 0) return []
  const out: string[] = []
  for (const l of lines.slice(i + 1)) {
    if (/^\s+- /.test(l)) out.push(l.replace(/^\s+- /, '').trim())
    else if (out.length || l.trim()) break
  }
  return out
}

const between = (lines: string[], start: RegExp, end: RegExp) => {
  const i = lines.findIndex((x) => start.test(x))
  const j = lines.findIndex((x, k) => k > i && end.test(x))
  return lines.slice(i + 1, j < 0 ? undefined : j)
}

// ── Offres ───────────────────────────────────────────────────────────────────

const offreFiles = fs.readdirSync(TEXTES).filter((f) => /^\d-[1-9]-/.test(f)).sort()
const offresBySolution: Record<SolutionKey, { key: string; fr: { slug: string; title: string }; en: { slug: string; title: string } }[]> = {
  veille: [],
  conseil: [],
  academy: [],
  digitales: [],
}

for (const f of offreFiles) {
  const [prefix, order] = f.split('-')
  const solution = SOLUTION_BY_PREFIX[prefix]
  const loc = splitLocales(fs.readFileSync(path.join(TEXTES, f), 'utf8'))
  const key = field(loc.fr, /^Adresse : /).split('/').pop()!
  const entry = { key } as (typeof offresBySolution)[SolutionKey][number]
  for (const locale of ['fr', 'en'] as Locale[]) {
    const lines = loc[locale]
    const getsH = locale === 'fr' ? /^--- Ce que vous obtenez ---/ : /^--- What you get ---/
    const faqH = locale === 'fr' ? /^--- Questions fréquentes ---/ : /^--- Frequently asked questions ---/
    const body = between(lines, /^--- Texte de la page ---/, getsH)
      .map((l) => l.replace(/^\s+- /, '- '))
      .join('\n')
      .trim()
    const gets = between(lines, getsH, faqH)
      .filter((l) => /^\s+- /.test(l))
      .map((l) => l.replace(/^\s+- /, '').trim())
    const faq: { question: string; answer: string }[] = []
    for (const l of between(lines, faqH, /^$a/)) {
      if (l.startsWith('Q : ')) faq.push({ question: l.slice(4).trim(), answer: '' })
      else if (l.startsWith('R : ') && faq.length) faq[faq.length - 1].answer = l.slice(4).trim()
    }
    const slug = field(lines, /^Adresse : /).split('/').pop()!
    const title = field(lines, /^Titre : /)
    entry[locale] = { slug, title }
    const fm = {
      key,
      locale,
      solution,
      order: Number(order),
      slug,
      title,
      metaTitle: field(lines, /^Titre Google/),
      description: field(lines, /^Accroche/),
      gets,
      faq,
      // Textes validés par BIG FIVE (27/11/2026). Mettre false pour retirer une offre de Google.
      validated: true,
    }
    write(`offres/${locale}/${solution}/${order.padStart(2, '0')}-${key}.md`, `---\n${YAML.stringify(fm, { lineWidth: 0 })}---\n\n${body}\n`)
  }
  offresBySolution[solution].push(entry)
}

// ── Solutions ────────────────────────────────────────────────────────────────

const solutionFiles = fs.readdirSync(TEXTES).filter((f) => /^\d-0-/.test(f)).sort()
for (const f of solutionFiles) {
  const key = SOLUTION_BY_PREFIX[f[0]]
  const seed = SOLUTIONS.find((s) => s.key === key)!
  const loc = splitLocales(fs.readFileSync(path.join(TEXTES, f), 'utf8'))
  for (const locale of ['fr', 'en'] as Locale[]) {
    const lines = loc[locale]
    write(`solutions/${locale}/${Number(f[0])}-${key}.yml`, {
      key,
      locale,
      order: Number(f[0]),
      slug: field(lines, /^Adresse : /).split('/').pop(),
      name: field(lines, /^Nom : /),
      metaTitle: SOLUTION_META_TITLES[key][locale],
      step: field(lines, /^Étape : /),
      heroSub: seed[locale].heroSub,
      tag: field(lines, /^Phrase sous le cercle : /),
      promise: field(lines, /^Promesse : /),
      gets: listAfter(lines, locale === 'fr' ? /^Ce que vous obtenez :/ : /^What you get :/),
      lead: field(lines, locale === 'fr' ? /^Porté par : / : /^Led by : /),
      pole: seed.pole.fr.includes('Tech') ? 'tech' : 'intel',
      image: seed.img,
      imagePosition: seed.imgPos,
    })
  }
}

// ── Accueil, textes d'interface, politique ──────────────────────────────────

const accueil = splitLocales(fs.readFileSync(path.join(TEXTES, '00-accueil.txt'), 'utf8'))
for (const locale of ['fr', 'en'] as Locale[]) {
  const lines = accueil[locale]
  const t = dictionaries[locale]
  // Contrôle : chaque phrase du fichier relu doit se retrouver dans les libellés.
  const all = JSON.stringify(t)
  for (const l of between(lines, /^## (Le cabinet|The firm)/, /^Carte/)) {
    for (const sentence of l.split(/(?<=\.) /)) {
      if (sentence.trim() && !all.includes(sentence.trim().replace(/"/g, '\\"'))) console.warn(`[${locale}] texte modifié, à reporter dans content/textes/${locale}.yml : ${sentence}`)
    }
  }
  write(`textes/${locale}.yml`, { locale, ...t })
  write(`accueil/${locale}.yml`, {
    locale,
    seo: { title: HOME_META[locale].titre, description: field(lines, /^Description Google : /) },
    poles: POLES.map((p) => ({
      pole: p.pole.fr.includes('Tech') ? 'tech' : 'intel',
      name: p.pole[locale],
      step: p[locale].step,
      promise: p[locale].promise,
      items: p[locale].items,
      lead: p.lead,
      role: p[locale].role,
    })),
  })
  write(`politique/${locale}.yml`, {
    locale,
    sections: PRIVACY.map((s) => ({ title: s[locale].title, paragraphs: s[locale].body })),
  })
}

// ── Réglages communs aux deux langues ───────────────────────────────────────

write('reglages.yml', {
  email: 'contact@bigfiveabidjan.com',
  telephone: '',
  adresse: '',
  laveiye: 'https://laveiye.com/',
  ogImage: '/images/og-image.png',
  personnage: '/images/perso-cabinet.png',
  covers: HERO_COVERS,
  socials: SOCIALS.map((s) => ({ label: s.label, short: s.court, url: s.url })),
  clients: CLIENTS,
})

// ── Baromètres (en français) ─────────────────────────────────────────────────
// Le lien interne du PDF n'est jamais écrit ici : le dépôt est public.

for (const b of BAROMETRES_SEED) {
  write(`barometres/${b.identifiant}.yml`, {
    identifiant: b.identifiant,
    published: true,
    publishedAt: '2026-08-01',
    title: b.title,
    metaTitle: b.metaTitle,
    cover: `/images/${path.basename(b.cover)}`,
    scope: b.scope,
    kpis: b.kpis.map((k) => ({ value: k.v, label: k.k, explanation: k.d })),
    takeaway: b.takeaway,
  })
}

console.log(`${offreFiles.length} offres, ${solutionFiles.length} solutions, ${BAROMETRES_SEED.length} baromètre(s) écrits dans content/`)
