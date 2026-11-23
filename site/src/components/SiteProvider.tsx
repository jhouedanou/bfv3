'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from 'react'

import type { BarometreDTO } from '@/lib/barometres'
import type { Links, SolutionDTO, SolutionKey } from '@/lib/content-types'
import { localePath } from '@/lib/site'
import type { Dictionary, Locale } from '@/i18n/dictionaries'

import { BaroGateModal } from './modals/BaroGateModal'
import { ContactModal } from './modals/ContactModal'
import { CoverModal } from './modals/CoverModal'
import { NotifyModal } from './modals/NotifyModal'
import { SolutionModal } from './modals/SolutionModal'

// Source de la demande, reprise dans l'objet de l'e-mail (CDC § 4).
export type ContactSource = 'header' | 'hero' | 'solutions' | 'observatoire' | SolutionKey

export type ContactChoice = SolutionKey | 'multi' | 'unknown'

type Modal =
  | { kind: 'solution'; key: SolutionKey }
  | { kind: 'contact'; source: ContactSource; choice: ContactChoice }
  | { kind: 'gate'; baro: BarometreDTO }
  | { kind: 'notify' }
  | { kind: 'cover'; baro: BarometreDTO }
  | null

type SiteContextValue = {
  locale: Locale
  t: Dictionary
  emailPublic: string
  solutions: SolutionDTO[]
  links: Links
  solutionHref: (s: SolutionDTO) => string
  openSolution: (key: SolutionKey) => void
  openContact: (source: ContactSource, choice?: ContactChoice) => void
  openGate: (baro: BarometreDTO) => void
  openNotify: () => void
  openCover: (baro: BarometreDTO) => void
  close: () => void
  dismiss: () => void
  modalOpen: boolean
  // Défilement plein écran de l'accueil : renvoie true s'il a pris en charge la navigation vers la section.
  sectionNavRef: MutableRefObject<((id: string) => boolean) | null>
  // Section visible de l'accueil (null ailleurs) : menu actif et points de navigation.
  activeSection: string | null
  setActiveSection: (id: string | null) => void
  notified: boolean
  setNotified: (v: boolean) => void
}

const SiteContext = createContext<SiteContextValue | null>(null)

export const useSite = () => {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite doit être utilisé dans <SiteProvider>')
  return ctx
}

export function SiteProvider({
  locale,
  t,
  emailPublic,
  solutions,
  links,
  children,
}: {
  locale: Locale
  t: Dictionary
  emailPublic: string
  solutions: SolutionDTO[]
  links: Links
  children: ReactNode
}) {
  const [modal, setModal] = useState<Modal>(null)
  const [notified, setNotified] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  // La fiche ouverte depuis l'accueil prend l'adresse de sa page (/solutions/<slug>) :
  // elle se partage, et « Retour » la ferme. pushed = une entrée d'historique est à retirer.
  const pushed = useRef(false)
  const sectionNavRef = useRef<((id: string) => boolean) | null>(null)

  const solutionHref = useCallback(
    (s: SolutionDTO) => localePath(locale, `/solutions/${s.slug}`),
    [locale],
  )
  const keyFromPath = useCallback(
    (path: string) =>
      solutions.find((s) => solutionHref(s) === decodeURI(path).replace(/\/$/, ''))?.key,
    [solutions, solutionHref],
  )

  // Ferme sans toucher à l'historique (navigation vers une autre page).
  const dismiss = useCallback(() => {
    pushed.current = false
    setModal(null)
  }, [])

  const close = useCallback(() => {
    if (pushed.current) {
      pushed.current = false
      window.history.back()
    }
    setModal(null)
  }, [])

  const openSolution = useCallback(
    (key: SolutionKey) => {
      const s = solutions.find((x) => x.key === key)
      if (s && !pushed.current) {
        window.history.pushState(null, '', solutionHref(s))
        pushed.current = true
      }
      setModal({ kind: 'solution', key })
    },
    [solutions, solutionHref],
  )

  // Précédent / Suivant, seulement quand l'accueil est affiché derrière la fiche.
  useEffect(() => {
    const onPop = () =>
      window.setTimeout(() => {
        if (!document.getElementById('accueil')) return
        const key = keyFromPath(window.location.pathname)
        if (key) {
          pushed.current = true
          setModal({ kind: 'solution', key })
        } else {
          pushed.current = false
          setModal(null)
        }
      }, 0)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [keyFromPath])

  const value = useMemo<SiteContextValue>(
    () => ({
      locale,
      t,
      emailPublic,
      solutions,
      links,
      solutionHref,
      openSolution,
      openContact: (source, choice = 'unknown') => setModal({ kind: 'contact', source, choice }),
      openGate: (baro) => setModal({ kind: 'gate', baro }),
      openNotify: () => setModal({ kind: 'notify' }),
      openCover: (baro) => setModal({ kind: 'cover', baro }),
      close,
      dismiss,
      modalOpen: modal !== null,
      sectionNavRef,
      activeSection,
      setActiveSection,
      notified,
      setNotified,
    }),
    [
      locale,
      t,
      emailPublic,
      solutions,
      links,
      solutionHref,
      openSolution,
      close,
      dismiss,
      modal,
      activeSection,
      notified,
    ],
  )

  return (
    <SiteContext.Provider value={value}>
      {children}
      {modal?.kind === 'solution' && <SolutionModal solutionKey={modal.key} />}
      {modal?.kind === 'contact' && (
        <ContactModal source={modal.source} initialChoice={modal.choice} />
      )}
      {modal?.kind === 'gate' && <BaroGateModal baro={modal.baro} />}
      {modal?.kind === 'notify' && <NotifyModal />}
      {modal?.kind === 'cover' && <CoverModal baro={modal.baro} />}
    </SiteContext.Provider>
  )
}
