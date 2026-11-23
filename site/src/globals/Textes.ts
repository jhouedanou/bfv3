import type { Field, GlobalConfig, Tab } from 'payload'

import { dictionaries } from '../i18n/dictionaries'
import { revalidateSite } from '../hooks/revalidate'

// Tous les textes courts du site (titres, paragraphes, boutons, formulaires), en FR et en EN.
// Les champs sont générés à partir du dictionnaire : un champ vide reprend le texte d'origine.
// Répartis en plusieurs globals : Postgres limite le nombre de champs lus en une requête.
const fr = dictionaries.fr
type Key = keyof typeof fr

type Def = { slug: string; label: string; tabs: [string, Key[]][] }

const DEFS: Def[] = [
  {
    slug: 'textes-accueil',
    label: 'Textes : accueil',
    tabs: [
      ['Menu et en-tête', ['navHome', 'navAgence', 'navSolutions', 'navObservatoire', 'navReferences', 'contactUs', 'logoAlt']],
      ['Accueil', ['h1a', 'h1b', 'h1c', 'h1d', 'm1', 'm2', 'm3', 'm4', 'discover', 'letsTalk', 'slide', 'slideshow']],
      ['Le Cabinet', ['eyFirm', 'firmTitleA', 'firmTitleB', 'firmP1a', 'firmP1b', 'firmP2a', 'firmP2b', 'poleIntel', 'poleTech']],
      ['Nos solutions', ['eySol', 'solTitle', 'weDo', 'youGet', 'ledBy', 'otherOffers', 'faqTitle']],
      ['Références', ['eyRef', 'refTitle', 'refSub', 'clientLogo']],
    ],
  },
  {
    slug: 'textes-observatoire',
    label: 'Textes : observatoire',
    tabs: [
      ['Baromètres', ['eyObs', 'obsSub', 'latestBaro', 'takeaway', 'dlBaro', 'baro', 'baroOf', 'allBaros', 'prevBaros', 'frOnly', 'zoomLabel', 'zoomCover']],
      ['Page « Tous les baromètres »', ['barosH1', 'barosMetaTitle']],
      ['Prochaines parutions', ['notifyCta', 'notifyTitle', 'notifyDesc', 'nlEy', 'nlTitle', 'workEmail', 'signUp', 'nlDone']],
      ['Étude sur mesure et Laveiye', ['orderEy', 'orderTitle', 'orderDesc', 'orderShort', 'orderAsk', 'orderCta', 'freeAccess', 'platform', 'laveiyeDesc', 'goLaveiye', 'poweredBy', 'laveiyeLine']],
    ],
  },
  {
    slug: 'textes-contact',
    label: 'Textes : formulaire de contact',
    tabs: [
      ['Formulaire', ['contactTitle', 'cIntro1', 'cIntro2', 'required', 'origin', 'fullName', 'emailPro', 'phone', 'phoneOpt', 'company', 'role', 'jobTitle', 'sector', 'which', 'need', 'consent', 'optin', 'submit', 'sending', 'invalid']],
      ['Exemples dans les champs', ['phName', 'phEmail', 'phCompany', 'phRole', 'phSector', 'phNeed', 'multi', 'unknown']],
      ['Après l’envoi', ['okT', 'okP', 'okRec', 'seeBaro', 'errT', 'errP', 'errRate', 'retryL']],
    ],
  },
  {
    slug: 'textes-formulaires',
    label: 'Textes : baromètre et origine des demandes',
    tabs: [
      ['Obtenir le baromètre', ['gateIntro', 'gateNl', 'gateCta', 'gateDoneT', 'gateDoneP']],
      ['Origine des demandes', ['sources']],
      ['Accusés de réception (e-mails)', ['ackSubject', 'ackBody', 'ackNotifySubject', 'ackNotifyBody']],
    ],
  },
  {
    slug: 'textes-divers',
    label: 'Textes : pied de page et divers',
    tabs: [
      ['Pied de page et politique', ['rights', 'legal', 'privacy', 'privacyUpdated', 'privacyIntro', 'privacyContact']],
      ['Bandeau cookies', ['ckText', 'ckAccept', 'ckRefuse', 'ckCustom', 'ckMore', 'ckManage', 'ckTitle', 'ckNeeded', 'ckNeededDesc', 'ckAudience', 'ckAudienceDesc', 'ckAds', 'ckAdsDesc', 'ckSave']],
    ],
  },
]

const short = (s: string) => (s.length > 60 ? `${s.slice(0, 57)}…` : s) || '(vide)'

const textField = (name: string, value: string): Field => {
  const common = { name, label: short(value), localized: true, admin: { description: `Clé : ${name}` } }
  return value.length > 90 ? { ...common, type: 'textarea' } : { ...common, type: 'text' }
}

const fieldFor = (key: Key): Field => {
  const value = fr[key]
  if (typeof value === 'string') return textField(key, value)
  return {
    name: key,
    label: 'Origine des demandes (affichée dans le formulaire)',
    type: 'group',
    fields: Object.entries(value).map(([k, v]) => textField(k, v)),
  }
}

// Les clés oubliées dans DEFS vont dans « divers », onglet « Accessibilité et divers ».
const placed = new Set(DEFS.flatMap((d) => d.tabs.flatMap(([, keys]) => keys)))
const rest = (Object.keys(fr) as Key[]).filter((k) => !placed.has(k))
DEFS[DEFS.length - 1].tabs.push(['Accessibilité et divers', rest])

// Clés de chaque global (utilisées par le seed).
export const TEXTES_SLUGS = DEFS.map((d) => d.slug)
export const TEXTES_KEYS: Record<string, Key[]> = Object.fromEntries(DEFS.map((d) => [d.slug, d.tabs.flatMap(([, keys]) => keys)]))

export const TEXTES: GlobalConfig[] = DEFS.map((d) => ({
  slug: d.slug,
  label: d.label,
  admin: {
    group: 'Contenu du site',
    description: 'En français et en anglais (sélecteur de langue en haut). Un champ vide reprend le texte d’origine.',
  },
  access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  hooks: { afterChange: [revalidateSite] },
  fields: [{ type: 'tabs', tabs: d.tabs.map(([label, keys]): Tab => ({ label, fields: keys.map(fieldFor) })) }],
}))
