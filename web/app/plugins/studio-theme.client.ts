// Habille l'éditeur Nuxt Studio aux couleurs du site (bleu nuit, rose, police Inter), pour que
// les éditeurs retrouvent l'univers BIG FIVE plutôt qu'un outil de développeur.
//
// Studio est un composant <nuxt-studio> isolé (shadow DOM) : ses couleurs sont des variables CSS
// posées sur son conteneur .dark / .light. On ajoute donc une feuille de style dans ce composant.
// Le mode sombre de Studio est activé par la classe « dark » de <html> (nuxt.config.ts).
// Uniquement décoratif : si Studio change de structure, l'éditeur garde son apparence d'origine.
const THEME = `
.dark {
  --ui-primary: #e05aa8;
  --ui-bg: #14162f;
  --ui-bg-muted: #191c3b;
  --ui-bg-elevated: #1f2347;
  --ui-bg-accented: #2a2f5e;
  --ui-bg-inverted: #ffffff;
  --ui-text-dimmed: #8387ab;
  --ui-text-muted: #adb0cc;
  --ui-text-toned: #cbcde0;
  --ui-text: #e9e9ed;
  --ui-text-highlighted: #ffffff;
  --ui-text-inverted: #14162f;
  --ui-border: #2b2f5c;
  --ui-border-muted: #23274f;
  --ui-border-accented: #3b4079;
  --ui-border-inverted: #ffffff;
  --ui-radius: 0.5rem;
  --font-sans: var(--font-body, system-ui, sans-serif);
  font-family: var(--font-body, system-ui, sans-serif);
}
`

const MARK = 'data-bigfive-theme'

function paint(studio: Element) {
  const root = studio.shadowRoot
  if (!root || root.querySelector(`style[${MARK}]`)) return
  const style = document.createElement('style')
  style.setAttribute(MARK, '')
  style.textContent = THEME
  root.appendChild(style)
}

export default defineNuxtPlugin(() => {
  const find = () => {
    const studio = document.querySelector('nuxt-studio')
    if (studio) paint(studio)
    return Boolean(studio)
  }
  if (find()) return
  // Studio n'est ajouté à la page qu'une fois l'éditeur connecté.
  const observer = new MutationObserver(() => {
    if (find()) observer.disconnect()
  })
  observer.observe(document.body, { childList: true })
})
