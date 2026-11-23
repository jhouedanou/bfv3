---
name: BIG FIVE — Site vitrine (maquette v2)
source: "Maquette - Site BIG FIVE.html" (Claude Design), corrigée par tools/fix-fonts.py
reference_width: 1920
direction: inchangée — seule la typographie a été corrigée (consigne : « ne change pas la maquette, juste les polices »)
colors:
  bg-page: "#14162f"          # fond des sections
  bg-deep: "#150a66"          # fiches, fenêtres, cartes pôles
  brand-indigo: "#262a60"     # fond du CDC ; token --brand-indigo présent mais inutilisé dans la maquette
  surface-alt: "#181b3c"
  text: "#e9e9ed"
  text-muted: "rgba(233,233,237,0.82)"
  divider: "rgba(233,233,237,0.16)"
  cta: "#e05aa8"              # rose des boutons principaux
  cta-hover: "#ea6fb6"
  cta-active: "#cf4b97"
  magenta: "#bf4a97"          # --brand-magenta, anneaux et dégradés
  accent: "#9184d9"           # --color-accent, contours et liens secondaires
  accent-light: "#c9bcff"
  violet: "#4b3f9e"
  pink-light: "#ff8fcf"
  gold: "#ffc95e"
gradients:
  hero: "linear-gradient(135deg,#1c1450 0%,#2a1a66 40%,#5a2f8f 72%,#a23d96 100%)"
  ring: "linear-gradient(135deg,#6a45c9,#bf4a97)"
  progress: "linear-gradient(90deg,#4b3f9e,#bf4a97)"
typography:
  heading: { family: "Poppins", fallback: "Inter, system-ui, sans-serif", weights: [500, 600, 700] }
  body: { family: "Inter", fallback: "system-ui, sans-serif", weights: [400, 500, 600, 700] }
  source: Google Fonts (display=swap)
  scale_rule: "taille rendue = clamp(MIN, D × zoom, MAX), zoom = largeur / 1920"
  scale:            # rôle: [D à 1920 px, MIN, MAX] en px rendus
    h1: [60, 40, 64]
    modal-h: [56, 36, 60]
    h2: [36, 28, 38]
    kpi: [36, 28, 38]
    title: [28, 22, 30]
    h3: [25, 19, 27]
    promise: [22, 18, 24]
    sub: [22, 19, 24]
    lead: [19, 17, 20]
    btn: [18, 16, 19]
    body: [17, 16, 18]
    nav: [16, 15, 17]
    small: [14, 14, 15]
    label: [14, 13, 15]
spacing:
  gutter: 72px               # --bf-gutter, marge latérale commune (CDC § 3)
  header_height: 124px
  logo_height: 92px
radius:
  sm: 4px
  md: 8px
  lg: 14px
  pill: 999px
motion:
  default: "0.18s"           # CDC § 3 : transition douce de 0,18 s
---

# DESIGN.md — BIG FIVE

Ce document décrit le système visuel de la maquette v2 (https://maquette-v2-navy.vercel.app). Il sert de référence au développement. Il ne propose **aucune nouvelle direction graphique** : la v2 reprend la maquette d'origine à l'identique, à l'exception des polices et de leurs tailles.

## 1. Principes

- **Fidélité à la maquette.** Structure, textes, couleurs, alignements et effets viennent de « Maquette - Site BIG FIVE.html ». Toute évolution passe par une validation explicite.
- **Charte du site actuel.** Le CDC § 3 impose les polices, les couleurs et le logo de bigfive.solutions : Poppins pour les titres, Inter pour le texte.
- **Lisibilité d'abord.** Aucun texte sous 13 px, texte courant entre 16 et 18 px, quelle que soit la largeur d'écran.
- **Sombre et contrasté.** Fond indigo nuit, texte clair, un seul accent chaud (rose) réservé aux actions.

## 2. Couleurs

| Rôle | Valeur | Usage |
|---|---|---|
| Fond de page | `#14162f` | Fond des sections plein écran |
| Fond profond | `#150a66` | Fiches solution, fenêtres, cartes pôles |
| Indigo de marque | `#262a60` | Fond du CDC ; token `--brand-indigo` déclaré mais inutilisé dans la maquette |
| Texte | `#e9e9ed` | Texte principal |
| Texte atténué | `rgba(233,233,237,0.82)` | Paragraphes secondaires, méta |
| Séparateur | `rgba(233,233,237,0.16)` | Filets, contours discrets |
| CTA | `#e05aa8` → survol `#ea6fb6` → appui `#cf4b97` | Boutons principaux uniquement |
| Magenta | `#bf4a97` | Anneaux, dégradés, halos |
| Accent | `#9184d9` (et nuancier `--color-accent-100…900`) | Contours, liens secondaires, puces |
| Lavande | `#c9bcff` | Étiquettes et numéros d'étape |
| Or | `#ffc95e` | Mise en valeur ponctuelle (chiffres) |

Dégradés : voir le frontmatter (`hero`, `ring`, `progress`). Ils portent l'identité de la maquette et ne doivent pas être simplifiés.

**Point de vigilance (hors périmètre de la v2, à corriger au développement)** : le blanc sur `#e05aa8` donne un contraste de 3,4:1 (WCAG AA exige 4,5:1 pour le texte des boutons), et certains libellés roses descendent à 1,3:1. Piste sans changer la teinte perçue : texte du bouton en `#14162f`, ou rose assombri pour les libellés sur fond clair.

## 3. Typographie

- **Titres** : Poppins. H1 d'accueil en 500, titres courants en 600 (`--font-heading-weight`), titre de fiche, titres de section et chiffres en 700. Casse normale, interlettrage resserré (`-0.015em` à `-0.02em`).
- **Texte** : Inter 400/500. Interligne 1,45 à 1,5.
- **Chiffres clés** : Poppins 700, `font-variant-numeric: tabular-nums`.
- **Libellés** : Poppins 700 en capitales, 13 à 15 px, seul endroit où les capitales sont admises.
- **Pas d'italique** sur le texte suivi.

Échelle : chaque taille est un rôle `--fs-*` (voir frontmatter). La taille rendue vaut `clamp(MIN, D × zoom, MAX)`. Exemples mesurés : H1 à 42,7 px sur 1366 px, 60 px sur 1920 px, 64 px au maximum sur 2560 px ; texte courant entre 16 et 18 px partout.

Chargement : Google Fonts, `Inter:wght@400;500;600;700` et `Poppins:wght@500;600;700`, `display=swap`. En production, auto-héberger les fichiers (`next/font`) pour éviter l'appel tiers.

## 4. Mise en page et échelle

- Grille de référence : 1920 px de large, sections plein écran, défilement vertical.
- Marge latérale commune : 72 px (`--bf-gutter`) pour le logo et tous les contenus.
- En-tête fixe de 124 px, logo de 92 px, fond légèrement transparent.
- Observatoire : la colonne de droite démarre à l'aplomb de l'entrée « Le Cabinet » du menu.
- **Maquette** : homothétie `zoom = largeur / 1920`. **Développement** : vraie mise en page responsive (empilement des colonnes, menu dans un bouton sous 1024 px), comme le demande le CDC § 3 « Mobile et tablette ». Aucune version mobile n'est dessinée : à produire avant l'intégration.

## 5. Composants

- **Bouton principal** : pilule (`999px`), fond `#e05aa8`, texte Poppins 600 ou 700 en `--fs-btn`, flèche « → » en fin de libellé.
- **Bouton secondaire** : pilule, contour `--color-accent`, fond transparent ou `rgba(145,132,217,0.18)`.
- **Pavés solutions (accueil)** : 4 pavés de même taille, `min-height` (et non `height`) pour suivre la taille du texte.
- **Cercles « Nos solutions »** : anneau en dégradé `ring`, numéro d'étape, nom, « + ».
- **Fiche solution** : plein écran, photo, titre `--fs-modal-h`, promesse, « Ce que nous faisons », « Ce que vous obtenez », « Porté par », bouton de contact.
- **Carte baromètre** : couverture 16:9, titre-question (2 lignes au maximum), 3 chiffres clés (valeur, libellé, explication), « À retenir ».
- **Fenêtres de formulaire** : rayon `--radius-md`, états envoi en cours, succès, erreur avec « Réessayer ».
- **Bande de logos** : PNG transparents, sans cadre, défilement continu.

## 6. Effets et mouvement

Durée commune : 0,18 s (`background, box-shadow, transform, filter, color, border-color`).

- CTA : léger éclaircissement au survol.
- Menu : soulignement au survol et sur l'entrée active.
- Pavés de l'accueil : glissement vers la droite, contour qui s'illumine.
- Cercles : `translateY(-6px) scale(1.03)` et anneau lumineux.
- Couverture du baromètre : se soulève, s'agrandit au clic.
- Logos : la bande s'arrête au survol, le logo survolé grossit légèrement.
- Liens texte : soulignés au survol.
- Respecter `prefers-reduced-motion` au développement (couper la bande de logos et les déplacements).

## 7. Images

- Photos des 4 solutions, personnage détouré du Cabinet, bandeau Observatoire, couvertures de baromètres.
- Les visuels de la maquette sont en basse définition : sources HD à fournir par BIG FIVE (CDC § 8).
- Couverture de baromètre : 16:9, 1920 × 1080 px minimum, moins de 500 Ko.
- Au développement : balises `<img>` avec `alt` (aujourd'hui des `background-image` sans texte alternatif), formats AVIF/WebP via `next/image`.

## 8. À faire / à éviter

**À faire**
- Utiliser uniquement les rôles `--fs-*` pour les tailles de texte.
- Réserver le rose aux actions.
- Garder la marge de 72 px et l'alignement sur le menu.

**À éviter**
- Ajouter une police (Outfit et Karla, restes du design system « Nocturne », ont été retirées).
- Repasser les titres ou le menu en capitales.
- Fixer une hauteur sur un bloc de texte (utiliser `min-height`).
- Laisser une taille de texte suivre le zoom sans plancher ni plafond.
