// Exporte le texte de chaque page (accueil, solutions, offres), FR puis EN, pour relecture hors de l'admin.
// Usage : pnpm payload run src/seed/export-textes.ts   → ../docs/textes/textes-a-relire/*.txt
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import config from '@payload-config'
import { getPayload } from 'payload'

import { buildContent, fetchRaw } from '../lib/content-core'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(dirname, '../../../docs/textes/textes-a-relire')

type Node = { type: string; tag?: string; text?: string; children?: Node[] }
const plain = (n: Node): string => (n.text ?? '') + (n.children ?? []).map(plain).join('')
const lexical = (state: { root?: Node } | null | undefined) =>
  (state?.root?.children ?? [])
    .map((n) => {
      if (n.type === 'heading') return `\n## ${plain(n)}\n`
      if (n.type === 'list') return (n.children ?? []).map((li) => `  - ${plain(li)}`).join('\n')
      return plain(n)
    })
    .join('\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

const RULE = '='.repeat(72)
const section = (label: string) => `\n${RULE}\n${label}\n${RULE}\n`

const payload = await getPayload({ config })
fs.mkdirSync(OUT, { recursive: true })
for (const f of fs.readdirSync(OUT)) if (f.endsWith('.txt')) fs.unlinkSync(path.join(OUT, f))

const write = (name: string, body: string) => fs.writeFileSync(path.join(OUT, name), body.trim() + '\n', 'utf8')
const header = (title: string, url: string, note = '') =>
  `BIG FIVE — ${title}\nAdresse : https://bigfive.solutions${url}\n${note}\nCorrigez directement dans ce fichier (ou indiquez vos corrections en réponse à l'e-mail).\nNe modifiez pas les lignes « ===== ».\n`

const raw = await fetchRaw(payload)
const content = { fr: buildContent(raw, 'fr'), en: buildContent(raw, 'en') }

// ── Accueil ──
{
  const block = (l: 'fr' | 'en') => {
    const { t, solutions, poles } = content[l]
    return [
      section(l === 'fr' ? 'FRANÇAIS' : 'ENGLISH'),
      `Titre (H1) : ${t.h1a} ${t.h1b} ${t.h1c} ${t.h1d}`,
      `Méthode : ${[t.m1, t.m2, t.m3, t.m4].join(' · ')}`,
      '',
      'Pavés de l’accueil :',
      ...solutions.map((s) => `  - ${s.name} — ${s.heroSub} (${s.step})`),
      '',
      `## ${t.eyFirm}`,
      t.firmTitleA,
      t.firmTitleB,
      `${t.firmP1a} ${t.firmP1b}`,
      `${t.firmP2a} ${t.firmP2b}`,
      '',
      ...poles.flatMap((p) => [
        `Carte « ${p.pole === 'tech' ? t.poleTech : t.poleIntel} » — ${p.step}`,
        `  ${p.promise}`,
        ...p.items.map((it) => `  - ${it}`),
        `  ${p.lead}, ${p.role}`,
        '',
      ]),
      `## ${t.eySol}`,
      t.solTitle,
      ...solutions.map((s) => `  - ${s.name} : ${s.tag}`),
      '',
      `## ${t.eyObs}`,
      t.obsSub,
      `${t.orderEy} : ${t.orderDesc}`,
      '',
      `## ${t.eyRef}`,
      t.refTitle,
      '',
      `Titre Google : ${content[l].seo.title}`,
      `Description Google : ${content[l].seo.description}`,
    ].join('\n')
  }
  write('00-accueil.txt', header('Accueil', '/') + block('fr') + '\n' + block('en'))
}

// ── Solutions (fiches) ──
for (const [i, fr] of content.fr.solutions.entries()) {
  const en = content.en.solutions.find((s) => s.key === fr.key)!
  const block = (s: typeof fr, l: 'fr' | 'en') => {
    const { t } = content[l]
    return [
      section(l === 'fr' ? 'FRANÇAIS' : 'ENGLISH'),
      `Nom : ${s.name}`,
      `Adresse : /${l === 'en' ? 'en/' : ''}solutions/${s.slug}`,
      `Étape : ${s.step}`,
      `Phrase sous le cercle : ${s.tag}`,
      `Promesse : ${s.promise}`,
      '',
      `${t.weDo} (une page par offre, fichiers ${String(i + 1)}-…) :`,
      ...s.offres.map((o) => `  - ${o.title}`),
      '',
      `${t.youGet} :`,
      ...s.gets.map((g) => `  - ${g}`),
      '',
      `${t.ledBy} : ${s.lead}`,
    ].join('\n')
  }
  write(`${i + 1}-0-solution-${fr.slug}.txt`, header(`Solution « ${fr.name} » (fiche et page)`, `/solutions/${fr.slug}`) + block(fr, 'fr') + '\n' + block(en, 'en'))
}

// ── Offres ──
const offres = await payload.find({ collection: 'offres', locale: 'all', sort: 'ordre', limit: 200, depth: 0, draft: true })
for (const o of offres.docs as unknown as Record<string, Record<string, unknown>>[]) {
  const sol = content.fr.solutions.findIndex((s) => s.offres.some((x) => x.slug === (o.slug as Record<string, string>).fr))
  const s = content.fr.solutions[sol]
  if (!s) continue
  const sEn = content.en.solutions.find((x) => x.key === s.key)!
  const block = (l: 'fr' | 'en') => {
    const v = <T>(k: string) => (o[k] as Record<string, T> | undefined)?.[l]
    const livrables = (v<{ item: string }[]>('livrables') ?? []).map((x) => `  - ${x.item}`)
    const faq = (v<{ question: string; reponse: string }[]>('faq') ?? []).map((f) => `Q : ${f.question}\nR : ${f.reponse}`)
    return [
      section(l === 'fr' ? 'FRANÇAIS' : 'ENGLISH'),
      `Titre : ${v<string>('titre')}`,
      `Adresse : /${l === 'en' ? 'en/' : ''}solutions/${l === 'fr' ? s.slug : sEn.slug}/${v<string>('slug')}`,
      `Titre Google (60 caractères max) : ${v<string>('metaTitle') ?? ''}`,
      `Accroche, aussi description Google (160 caractères max) : ${v<string>('accroche')}`,
      '',
      '--- Texte de la page ---',
      lexical(v<{ root?: Node }>('corps')),
      '',
      `--- ${content[l].t.youGet} ---`,
      ...livrables,
      '',
      `--- ${content[l].t.faqTitle} ---`,
      faq.join('\n\n'),
    ].join('\n')
  }
  const fr = (o.slug as Record<string, string>).fr
  write(`${sol + 1}-${o.ordre}-${fr}.txt`, header(`Offre « ${(o.titre as Record<string, string>).fr} » (${s.name})`, `/solutions/${s.slug}/${fr}`, 'Texte rédigé pour BIG FIVE, à valider : aucun chiffre ni client ne doit être ajouté sans source.') + block('fr') + '\n' + block('en'))
}

console.log(fs.readdirSync(OUT).filter((f) => f.endsWith('.txt')).length, 'fichiers dans', OUT)
process.exit(0)
