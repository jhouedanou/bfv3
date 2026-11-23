'use client'

import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import { A11y, HashNavigation, Keyboard, Mousewheel } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'

import { useSite } from './SiteProvider'

export type HomeSlide = { id: string; content: ReactNode }

// Plein écran (une section par diapositive) seulement avec une souris ou un pavé tactile, à partir de
// 1025 px et sans réglage « réduire les animations » ; sinon, défilement normal de la page.
const FULLPAGE =
  '(min-width: 1025px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
const SPEED = 1000
const NO_WHEEL = 'swiper-no-mousewheel'
// En dessous de ce dépassement, la section n'est pas « plus haute que l'écran » : la molette change de section.
const MIN_OVERFLOW = 40

export function HomeSlider({ slides }: { slides: HomeSlide[] }) {
  const { modalOpen, sectionNavRef, setActiveSection } = useSite()
  const [fullpage, setFullpage] = useState(false)
  const [ready, setReady] = useState(false)
  const swiperRef = useRef<SwiperType | null>(null)
  const scrollers = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const mq = window.matchMedia(FULLPAGE)
    const update = () => {
      setFullpage(mq.matches)
      if (!mq.matches) setReady(false)
    }
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // La page ne défile plus : chaque diapositive gère son propre défilement.
  useEffect(() => {
    document.documentElement.classList.toggle('is-fullpage', fullpage)
    return () => document.documentElement.classList.remove('is-fullpage')
  }, [fullpage])

  // Menu, points de navigation et liens « #section » : on fait glisser au lieu de sauter.
  useEffect(() => {
    if (!fullpage) return
    sectionNavRef.current = (id) => {
      const index = slides.findIndex((s) => s.id === id)
      if (index < 0 || !swiperRef.current) return false
      swiperRef.current.slideTo(index)
      return true
    }
    return () => {
      sectionNavRef.current = null
    }
  }, [fullpage, slides, sectionNavRef])

  // Section visible (menu actif, points de navigation). Plein écran : la diapositive active ;
  // défilement normal : la section au milieu de l'écran. Hors de l'accueil : aucune.
  useEffect(() => {
    if (fullpage) return
    const els = slides.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActiveSection(e.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [fullpage, slides, setActiveSection])

  useEffect(() => () => setActiveSection(null), [setActiveSection])

  const syncActive = (sw: SwiperType) => setActiveSection(slides[sw.activeIndex]?.id ?? null)

  // Fenêtre ouverte : la molette et le clavier ne font plus glisser les sections derrière.
  useEffect(() => {
    const sw = swiperRef.current
    if (!fullpage || !sw || sw.destroyed) return
    if (modalOpen) {
      sw.mousewheel.disable()
      sw.keyboard.disable()
      sw.allowTouchMove = false
    } else {
      sw.mousewheel.enable()
      sw.keyboard.enable()
      sw.allowTouchMove = true
    }
  }, [modalOpen, fullpage])

  // Section plus haute que l'écran : la molette fait défiler son contenu, puis passe à la suivante au bord.
  useEffect(() => {
    if (!fullpage || !ready) return
    const els = scrollers.current.filter(Boolean) as HTMLDivElement[]
    const onWheel = (e: WheelEvent) => {
      const el = e.currentTarget as HTMLDivElement
      const canScroll = el.scrollHeight - el.clientHeight > MIN_OVERFLOW
      const atTop = el.scrollTop <= 0
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1
      el.classList.toggle(
        NO_WHEEL,
        canScroll && ((e.deltaY > 0 && !atBottom) || (e.deltaY < 0 && !atTop)),
      )
    }
    els.forEach((el) => el.addEventListener('wheel', onWheel, { passive: true }))
    return () => els.forEach((el) => el.removeEventListener('wheel', onWheel))
  }, [fullpage, ready])

  const onChangeStart = (sw: SwiperType) => {
    // Arrivée par le bas : on montre la fin de la section ; par le haut : son début.
    const el = scrollers.current[sw.activeIndex]
    if (el) el.scrollTop = sw.activeIndex > sw.previousIndex ? 0 : el.scrollHeight
  }

  if (!fullpage) {
    return (
      <>
        {slides.map((s) => (
          <Fragment key={s.id}>{s.content}</Fragment>
        ))}
      </>
    )
  }

  return (
    <>
      <Swiper
        className="home-swiper"
        direction="vertical"
        speed={SPEED}
        modules={[Mousewheel, Keyboard, HashNavigation, A11y]}
        mousewheel={{ thresholdDelta: 20, noMousewheelClass: NO_WHEEL }}
        keyboard={{ enabled: true, onlyInViewport: true, pageUpDown: true }}
        hashNavigation={{ watchState: true, replaceState: true }}
        a11y={{
          enabled: true,
          scrollOnFocus: true,
          containerMessage: null,
          containerRoleDescriptionMessage: null,
          itemRoleDescriptionMessage: null,
        }}
        onSwiper={(sw) => {
          swiperRef.current = sw
          setReady(true)
        }}
        onSlideChangeTransitionStart={onChangeStart}
        onActiveIndexChange={syncActive}
        onAfterInit={syncActive}
      >
        {slides.map((s, i) => (
          <SwiperSlide key={s.id} data-hash={s.id}>
            <div
              ref={(el) => {
                scrollers.current[i] = el
              }}
              className="slide-scroll"
            >
              {s.content}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}
