'use client'

import { useEffect } from 'react'

// À l'ouverture d'une page (solution, offre, baromètre, politique), on part du haut. Next ne le fait
// pas toujours : l'en-tête est collant et la fenêtre de l'accueil fige le défilement pendant la navigation.
export function ScrollToTop() {
  useEffect(() => {
    if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])
  return null
}
