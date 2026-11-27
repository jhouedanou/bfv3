# Site BIG FIVE — bigfive.solutions

Nuxt 4 + Nuxt Content + Nuxt Studio, hébergé sur Vercel. Aucune base de données : tout le contenu est dans `content/`, versionné dans Git.

- Pages générées au build : HTML complet pour Google, rapide, sans serveur à maintenir.
- Admin : **Nuxt Studio** sur `/_studio`. Chaque enregistrement crée un commit sur GitHub, puis Vercel redéploie (1 à 2 minutes).

## Pages

| Adresse FR | Adresse EN | Source |
|---|---|---|
| `/` | `/en` | `content/accueil/`, `content/textes/`, `content/reglages.yml` |
| `/solutions/<solution>` | `/en/solutions/<solution>` | `content/solutions/<langue>/*.yml` |
| `/solutions/<solution>/<offre>` (17 offres) | `/en/solutions/<solution>/<offer>` | `content/offres/<langue>/<solution>/*.md` |
| `/barometres`, `/barometres/<id>` | `/en/barometers…` (canonical vers FR) | `content/barometres/*.yml` |
| `/politique-de-confidentialite` | `/en/privacy-policy` | `content/politique/` |

Sur l'accueil, la fiche d'une solution s'ouvre en fenêtre et prend l'adresse `/solutions/<slug>` : on peut la partager, et « Retour » la ferme.

## Ce qui se modifie où (dans Studio ou directement dans les fichiers)

| Contenu | Fichier |
|---|---|
| Libellés : menus, boutons, formulaires, pied de page, titres de l'accueil | `content/textes/fr.yml`, `en.yml` |
| Title et description Google de l'accueil, pôles du Cabinet | `content/accueil/fr.yml`, `en.yml` |
| Les 4 solutions (nom, adresse, promesse, image) | `content/solutions/…` |
| Offres : texte, FAQ, title Google. **`validated: true`** pour les proposer à Google | `content/offres/…` |
| Baromètres : `published`, `publishedAt` (AAAA-MM-JJ), KPI, couverture | `content/barometres/…` |
| E-mail, téléphone, adresse, réseaux, logos clients, image de partage | `content/reglages.yml` |
| Images | `public/images/` (médiathèque de Studio) |

Les textes de départ viennent de `docs/textes/textes-a-relire/` (validés par BIG FIVE). Pour les réimporter après correction : `pnpm import:textes`. Attention, la commande écrase `content/`.

**Le dépôt est public.** Rien de confidentiel dans `content/`, et notamment jamais le lien interne du PDF d'un baromètre.

## Référencement

- title, description, canonical et hreflang FR / EN / x-default sur chaque page ;
- Open Graph et Twitter ;
- JSON-LD :
  - accueil : ProfessionalService avec catalogue, et WebSite ;
  - solutions : Service et BreadcrumbList ;
  - offres : Service, FAQPage et BreadcrumbList ;
  - baromètres : Report et CollectionPage ;
- `/sitemap.xml` avec alternates : les offres n'y entrent qu'avec `validated: true`, et seule la version FR des baromètres y figure ;
- `/robots.txt` ;
- redirections 301 : `/thank-you` → `/`, `/en/thank-you` → `/en`, `/fr/*` → `/*` ;
- pré-production : `noindex` sur tout, et `robots.txt` fermé. Seule la production Vercel est indexable.
- **Avant la bascule DNS**, la production porte la variable `NUXT_INDEXABLE=false`, qui garde le site fermé aux moteurs. Au lancement : supprimer la variable dans Vercel, puis redéployer.

## Lancer en local

```bash
cd web
pnpm install
cp .env.example .env      # facultatif en local
pnpm dev                  # http://localhost:3000 ; Studio local : bouton en bas à gauche
pnpm build && node .output/server/index.mjs   # version de production
```

## Vercel

- Pré-production : https://bigfive-web-brown.vercel.app (noindex, `NUXT_INDEXABLE=false`).
- Projet `bigfive-web`, Root Directory `web`, framework Nuxt.
- Déploiement manuel depuis `web/` : `npx vercel deploy --prod`. `.vercelignore` exclut les sorties locales (`.output`, `.nuxt`), sinon Vercel les reprendrait telles quelles.
- Variables : voir `.env.example`. En production, Resend et Turnstile sont obligatoires : sans eux, les formulaires refusent l'envoi.
- Nuxt Studio :
  1. Créer une OAuth App GitHub. Callback : `https://<domaine>/_studio/auth/github`.
  2. Renseigner `STUDIO_GITHUB_CLIENT_ID` et `STUDIO_GITHUB_CLIENT_SECRET`.
  3. Studio enregistre sur la branche `STUDIO_BRANCH` (par défaut `main`). Elle doit être la branche de production du projet Vercel.
- Publication programmée : créer un Deploy Hook (Settings → Git), puis renseigner `NUXT_VERCEL_DEPLOY_HOOK` et `CRON_SECRET`. Le cron de `vercel.json` passe chaque matin et relance un build s'il y a une parution datée du jour.
