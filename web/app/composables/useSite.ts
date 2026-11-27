import type {
  BarometreDTO,
  ContactChoice,
  ContactSource,
  Dictionary,
  Locale,
  Modal,
  SiteContent,
  SolutionDTO,
  SolutionKey,
} from '~/types'

// ── Langue : déduite de l'adresse (FR à la racine, EN sous /en) ─────────────

export const useLocale = () => {
  const route = useRoute()
  return computed<Locale>(() => (route.path === '/en' || route.path.startsWith('/en/') ? 'en' : 'fr'))
}

// ── Contenu commun à toutes les pages (libellés, solutions, réglages) ───────
// Chargé une fois pour les deux langues : changer de langue ne recharge rien.

const STRIP = new Set(['id', 'stem', 'extension', 'meta', 'locale', '__hash__'])

const fetchSiteContent = async (): Promise<Record<Locale, SiteContent>> => {
  const [textes, accueil, solutions, offres, reglages, politique] = await Promise.all([
    queryCollection('textes').all(),
    queryCollection('accueil').all(),
    queryCollection('solutions').order('order', 'ASC').all(),
    queryCollection('offres').select('key', 'locale', 'solution', 'order', 'slug', 'title').order('order', 'ASC').all(),
    queryCollection('reglages').first(),
    queryCollection('politique').all(),
  ])
  if (!reglages) throw createError({ statusCode: 500, statusMessage: 'content/reglages.yml manquant' })

  const build = (locale: Locale): SiteContent => {
    const tRaw = textes.find((x) => x.locale === locale) ?? textes.find((x) => x.locale === 'fr')!
    // Champs hors schéma (tous les libellés) : Nuxt Content les range dans « meta ».
    const merged = { ...((tRaw as { meta?: Record<string, unknown> }).meta ?? {}), ...tRaw }
    const t = Object.fromEntries(Object.entries(merged).filter(([k]) => !STRIP.has(k))) as Dictionary
    const home = accueil.find((x) => x.locale === locale)!
    const sols: SolutionDTO[] = solutions
      .filter((s) => s.locale === locale)
      .map((s) => ({
        key: s.key,
        slug: s.slug,
        name: s.name,
        metaTitle: s.metaTitle,
        step: s.step,
        heroSub: s.heroSub,
        tag: s.tag,
        promise: s.promise,
        gets: s.gets,
        lead: s.lead,
        pole: s.pole,
        img: imageOf(s.image, s.name),
        imgPos: s.imagePosition || 'center',
        offres: offres
          .filter((o) => o.locale === locale && o.solution === s.key)
          .map((o) => ({ key: o.key, slug: o.slug, title: o.title! })),
      }))
    return {
      locale,
      t,
      solutions: sols,
      covers: reglages.covers.map((c) => imageOf(c, '')!).filter(Boolean),
      personnage: imageOf(reglages.personnage, ''),
      poles: home.poles,
      clients: reglages.clients.map((c) => ({ name: c.name, logo: imageOf(c.logo, c.name, [400, 200])! })),
      links: { laveiye: reglages.laveiye, socials: reglages.socials },
      settings: { email: reglages.email, telephone: reglages.telephone, adresse: reglages.adresse, ogImage: reglages.ogImage },
      seo: home.seo,
      privacy: (politique.find((p) => p.locale === locale)?.sections ?? []).map((s) => ({ title: s.title, body: s.paragraphs })),
    }
  }
  return { fr: build('fr'), en: build('en') }
}

// À appeler (avec await) dans le layout : les composants lisent ensuite useSiteContent().
export const loadSiteContent = () => useAsyncData('site-content', fetchSiteContent)

// Contenu de la langue courante. Dans un template : {{ c.t.navHome }}.
export const useSiteContent = () => {
  const locale = useLocale()
  const { data } = useNuxtData<Record<Locale, SiteContent>>('site-content')
  return computed(() => data.value![locale.value])
}

// ── Baromètres publiés (date de parution passée), du plus récent au plus ancien ─

export const fetchBarometres = async (): Promise<BarometreDTO[]> => {
  const today = new Date().toISOString().slice(0, 10)
  const docs = await queryCollection('barometres').where('published', '=', true).order('publishedAt', 'DESC').all()
  return docs
    .filter((d) => d.publishedAt.slice(0, 10) <= today)
    .map((d) => ({
      identifiant: d.identifiant,
      publishedAt: d.publishedAt,
      title: d.title,
      metaTitle: d.metaTitle,
      scope: d.scope,
      kpis: d.kpis,
      takeaway: d.takeaway,
      cover: imageOf(d.cover, d.title, [1121, 1403]),
    }))
}

export const useBarometres = () => useAsyncData('barometres', fetchBarometres)

// ── Fenêtres (fiche solution, contact, baromètre…) ──────────────────────────

// Défilement plein écran de l'accueil : renvoie true s'il a pris en charge la navigation.
// Côté navigateur seulement (rempli par HomeSlider).
export const sectionNav: { go: ((id: string) => boolean) | null } = { go: null }

// La fiche ouverte depuis l'accueil prend l'adresse de sa page (/solutions/<slug>) :
// elle se partage, et « Retour » la ferme. pushed = une entrée d'historique est à retirer.
const pushed = { current: false }

export const useModal = () => {
  const modal = useState<Modal>('modal', () => null)
  const activeSection = useState<string | null>('active-section', () => null)
  const notified = useState<boolean>('notified', () => false)
  const content = useSiteContent()

  const solutionHref = (s: SolutionDTO) => solutionPath(content.value.locale, s.slug)

  const keyFromPath = (path: string): SolutionKey | undefined =>
    content.value.solutions.find((s) => solutionHref(s) === decodeURI(path).replace(/\/$/, ''))?.key

  // Ferme sans toucher à l'historique (navigation vers une autre page).
  const dismiss = () => {
    pushed.current = false
    modal.value = null
  }

  const close = () => {
    if (pushed.current) {
      pushed.current = false
      window.history.back()
    }
    modal.value = null
  }

  const openSolution = (key: SolutionKey) => {
    const s = content.value.solutions.find((x) => x.key === key)
    if (s && !pushed.current) {
      window.history.pushState({ ...window.history.state, bigfiveModal: key }, '', solutionHref(s))
      pushed.current = true
    }
    modal.value = { kind: 'solution', key }
  }

  // Précédent / Suivant, seulement quand l'accueil est affiché derrière la fiche.
  const onPopState = () =>
    window.setTimeout(() => {
      if (!document.getElementById('accueil')) return
      const key = keyFromPath(window.location.pathname)
      if (key) {
        pushed.current = true
        modal.value = { kind: 'solution', key }
      } else {
        pushed.current = false
        modal.value = null
      }
    }, 0)

  return {
    modal,
    activeSection,
    notified,
    modalOpen: computed(() => modal.value !== null),
    solutionHref,
    openSolution,
    openContact: (source: ContactSource, choice: ContactChoice = 'unknown') => {
      modal.value = { kind: 'contact', source, choice }
    },
    openGate: (baro: BarometreDTO) => {
      modal.value = { kind: 'gate', baro }
    },
    openNotify: () => {
      modal.value = { kind: 'notify' }
    },
    openCover: (baro: BarometreDTO) => {
      modal.value = { kind: 'cover', baro }
    },
    close,
    dismiss,
    onPopState,
  }
}
