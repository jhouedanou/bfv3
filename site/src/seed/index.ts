// Données de départ : tout le contenu du site (textes, solutions, offres, clients, images,
// politique) et le baromètre d'août 2026. Ensuite, le contenu se modifie dans l'admin.
// Usage : pnpm seed   (idempotent : ne recrée ni n'écrase ce qui existe déjà)
import path from 'path'
import { fileURLToPath } from 'url'

import config from '@payload-config'
import { getPayload } from 'payload'

import { TEXTES_KEYS, TEXTES_SLUGS } from '../globals/Textes'
import { dictionaries } from '../i18n/dictionaries'
import { BAROMETRES_SEED } from './barometres'
import { OFFRES_ACADEMY } from './data/offres/academy'
import { OFFRES_CONSEIL } from './data/offres/conseil'
import { OFFRES_DIGITALES } from './data/offres/digitales'
import type { OffreLocale } from './data/offres/types'
import { OFFRES_VEILLE } from './data/offres/veille'
import {
  CLIENTS,
  HERO_COVERS,
  HOME_META,
  POLES,
  PRIVACY,
  SOCIALS,
  SOLUTION_META_TITLES,
  SOLUTION_SLUGS,
  SOLUTIONS,
} from './data/site'
import { toLexical } from './lexical'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC = path.resolve(dirname, '../../public')
const ctx = { disableRevalidate: true }

// « Août 2026 » → 2026-08-01
const MOIS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
]
const toDate = (label: string) => {
  const [mois, annee] = label.toLowerCase().split(' ')
  return new Date(Date.UTC(Number(annee), MOIS.indexOf(mois), 1)).toISOString()
}

const payload = await getPayload({ config })
const log = (msg: string) => payload.logger.info(msg)

// Image de public/ → collection Media (bucket S3 quand S3_BUCKET est renseigné).
const upload = async (publicPath: string, alt: string) =>
  (
    await payload.create({
      collection: 'media',
      data: { alt },
      filePath: path.join(PUBLIC, publicPath),
      context: ctx,
    })
  ).id

const items = (list: string[]) => list.map((item) => ({ item }))

// ── Paramètres ───────────────────────────────────────────────────────────────

await payload.updateGlobal({
  slug: 'parametres',
  data: { emailReception: 'contact@bigfiveabidjan.com', emailPublic: 'contact@bigfiveabidjan.com' },
  context: ctx,
})

// ── Textes du site ───────────────────────────────────────────────────────────

for (const slug of TEXTES_SLUGS as 'textes-accueil'[]) {
  const keys = TEXTES_KEYS[slug]
  const doc = (await payload.findGlobal({
    slug,
    locale: 'fr',
    fallbackLocale: false,
  })) as unknown as Record<string, unknown>
  if (doc[keys[0]]) continue
  for (const locale of ['fr', 'en'] as const) {
    const data = Object.fromEntries(keys.map((k) => [k, dictionaries[locale][k]]))
    await payload.updateGlobal({ slug, locale, data: data as never, context: ctx })
  }
  log(`${slug} rempli`)
}

// ── Accueil : images et pôles ────────────────────────────────────────────────

const accueil = await payload.findGlobal({ slug: 'accueil', locale: 'fr', depth: 0 })
if (!accueil.couvertures?.length) {
  const couvertures = []
  for (const [i, src] of HERO_COVERS.entries())
    couvertures.push({ image: await upload(src, `BIG FIVE — accueil ${i + 1}`) })
  const personnage = await upload('/images/perso-cabinet.png', 'Personnage BIG FIVE')
  const fr = await payload.updateGlobal({
    slug: 'accueil',
    locale: 'fr',
    data: {
      couvertures,
      personnage,
      poles: POLES.map((p, i) => ({
        pole: (i === 0 ? 'intel' : 'tech') as 'intel' | 'tech',
        etape: p.fr.step,
        promesse: p.fr.promise,
        items: items(p.fr.items),
        responsable: p.lead,
        role: p.fr.role,
      })),
    },
    context: ctx,
  })
  // Les lignes du tableau gardent leur id : la version anglaise complète les mêmes lignes.
  await payload.updateGlobal({
    slug: 'accueil',
    locale: 'en',
    data: {
      poles: (fr.poles ?? []).map((row, i) => ({
        ...row,
        etape: POLES[i].en.step,
        promesse: POLES[i].en.promise,
        items: items(POLES[i].en.items),
        role: POLES[i].en.role,
      })),
    },
    context: ctx,
  })
  log('Accueil : images et pôles remplis')
}

// ── Référencement de l'accueil ───────────────────────────────────────────────

const seo = await payload.findGlobal({ slug: 'seo', locale: 'fr', fallbackLocale: false })
if (!seo.titre) {
  const image = await upload(HERO_COVERS[0], 'BIG FIVE')
  for (const locale of ['fr', 'en'] as const) {
    await payload.updateGlobal({
      slug: 'seo',
      locale,
      data: { ...HOME_META[locale], image },
      context: ctx,
    })
  }
  log('Référencement rempli')
}

// ── Réseaux et liens ─────────────────────────────────────────────────────────

const liens = await payload.findGlobal({ slug: 'liens' })
if (!liens.reseaux?.length) {
  await payload.updateGlobal({
    slug: 'liens',
    data: { laveiye: 'https://laveiye.com/', reseaux: SOCIALS },
    context: ctx,
  })
  log('Réseaux et liens remplis')
}

// ── Politique de confidentialité ─────────────────────────────────────────────

const politique = await payload.findGlobal({
  slug: 'politique',
  locale: 'fr',
  fallbackLocale: false,
})
if (!politique.sections?.length) {
  for (const locale of ['fr', 'en'] as const) {
    await payload.updateGlobal({
      slug: 'politique',
      locale,
      data: {
        sections: PRIVACY.map((s) => ({
          titre: s[locale].title,
          paragraphes: s[locale].body.map((texte) => ({ texte })),
        })),
      },
      context: ctx,
    })
  }
  log('Politique de confidentialité remplie')
}

// ── Solutions ────────────────────────────────────────────────────────────────

const solutionIds: Record<string, number> = {}
for (const [i, s] of SOLUTIONS.entries()) {
  const found = await payload.find({
    collection: 'solutions',
    where: { key: { equals: s.key } },
    limit: 1,
    depth: 0,
  })
  if (found.docs[0]) {
    solutionIds[s.key] = found.docs[0].id
    continue
  }
  const loc = (l: 'fr' | 'en') => ({
    nom: s[l].name,
    metaTitle: SOLUTION_META_TITLES[s.key][l],
    slug: SOLUTION_SLUGS[s.key][l],
    etape: s[l].step,
    heroSub: s[l].heroSub,
    tag: s[l].tag,
    promesse: s[l].promise,
    obtenez: items(s[l].gets),
    porteur: s[l].lead,
  })
  const image = await upload(s.img, s.fr.name)
  const doc = await payload.create({
    collection: 'solutions',
    locale: 'fr',
    data: {
      key: s.key,
      ordre: i + 1,
      pole: s.key === 'digitales' ? 'tech' : 'intel',
      image,
      imagePos: s.imgPos,
      ...loc('fr'),
    },
    context: ctx,
  })
  await payload.update({
    collection: 'solutions',
    id: doc.id,
    locale: 'en',
    data: loc('en'),
    context: ctx,
  })
  solutionIds[s.key] = doc.id
  log(`Solution ${s.key} créée`)
}

// ── Offres (textes à valider par BIG FIVE : « valide » reste décoché) ────────

const offreData = (o: OffreLocale) => ({
  titre: o.titre,
  slug: o.slug,
  metaTitle: o.metaTitle,
  accroche: o.accroche,
  corps: toLexical(o.corps),
  livrables: items(o.livrables),
  faq: o.faq.map((f) => ({ question: f.q, reponse: f.r })),
})

for (const o of [...OFFRES_VEILLE, ...OFFRES_CONSEIL, ...OFFRES_ACADEMY, ...OFFRES_DIGITALES]) {
  const found = await payload.find({
    collection: 'offres',
    where: { slug: { equals: o.fr.slug } },
    locale: 'fr',
    limit: 1,
    depth: 0,
    draft: true,
  })
  if (found.totalDocs) continue
  const doc = await payload.create({
    collection: 'offres',
    locale: 'fr',
    data: {
      solution: solutionIds[o.solution],
      ordre: o.ordre,
      valide: false,
      ...offreData(o.fr),
      _status: 'published',
    } as never,
    context: ctx,
  })
  await payload.update({
    collection: 'offres',
    id: doc.id,
    locale: 'en',
    data: { ...offreData(o.en), _status: 'published' } as never,
    context: ctx,
  })
  log(`Offre ${o.fr.slug} créée`)
}

// ── Clients (références) ─────────────────────────────────────────────────────

const clients = await payload.count({ collection: 'clients' })
if (!clients.totalDocs) {
  for (const [i, c] of CLIENTS.entries()) {
    const logo = await upload(c.logo, `Logo ${c.name}`)
    await payload.create({
      collection: 'clients',
      data: { nom: c.name, logo, ordre: (i + 1) * 10 },
      context: ctx,
    })
  }
  log(`${CLIENTS.length} clients créés`)
}

// ── Baromètres ───────────────────────────────────────────────────────────────

for (const b of BAROMETRES_SEED) {
  const exists = await payload.find({
    collection: 'barometres',
    where: { identifiant: { equals: b.identifiant } },
    limit: 1,
    draft: true,
  })
  if (exists.totalDocs) {
    log(`Baromètre ${b.identifiant} déjà présent`)
    continue
  }
  const cover = await payload.create({
    collection: 'media',
    data: { alt: `Couverture du baromètre : ${b.title}` },
    filePath: path.resolve(dirname, 'files', path.basename(b.cover)),
  })
  await payload.create({
    collection: 'barometres',
    context: ctx,
    data: {
      identifiant: b.identifiant,
      publishedAt: toDate(b.date),
      title: b.title,
      metaTitle: b.metaTitle,
      scope: b.scope.map((item) => ({ item })),
      kpis: b.kpis.map((k) => ({ value: k.v, label: k.k, explanation: k.d })),
      takeaway: b.takeaway.charAt(0).toUpperCase() + b.takeaway.slice(1),
      cover: cover.id,
      ressourceInterne: b.ressourceInterne,
      _status: 'published',
    },
  })
  log(`Baromètre ${b.identifiant} créé`)
}

process.exit(0)
