# Site BIG FIVE — www.bigfive.solutions

Nuxt 4 + Nuxt Content + Nuxt Studio, hébergé sur Vercel. Aucune base de données : tout le contenu est dans `content/`, versionné dans Git.

- Pages générées au build : HTML complet pour Google, rapide, sans serveur à maintenir.
- Admin : **Nuxt Studio** sur `/_studio`. Chaque enregistrement crée un commit sur GitHub, puis Vercel redéploie (1 à 2 minutes).

## Pages

| Adresse FR | Adresse EN | Source |
|---|---|---|
| `/` | `/en` | `content/1.accueil/`, `content/6.textes/`, `content/reglages.yml` |
| `/solutions/<solution>` | `/en/solutions/<solution>` | `content/2.solutions/<langue>/*.yml` |
| `/solutions/<solution>/<offre>` (17 offres) | `/en/solutions/<solution>/<offer>` | `content/3.offres/<langue>/<solution>/*.md` |
| `/barometres`, `/barometres/<id>` | `/en/barometers…` (canonical vers FR) | `content/4.barometres/*.yml` |
| `/politique-de-confidentialite` | `/en/privacy-policy` | `content/5.politique/` |

Sur l'accueil, la fiche d'une solution s'ouvre en fenêtre et prend l'adresse `/solutions/<slug>` : on peut la partager, et « Retour » la ferme.

## Ce qui se modifie où (dans Studio ou directement dans les fichiers)

| Contenu | Fichier |
|---|---|
| Page d'accueil : textes de chaque section dans l'ordre de la page, pôles du Cabinet, title et description Google | `content/1.accueil/1.francais.yml`, `2.anglais.yml` |
| Menus, formulaires, e-mails automatiques, bandeau cookies, pied de page | `content/6.textes/1.francais.yml`, `2.anglais.yml` |
| Les 4 solutions (nom, adresse, promesse, image) | `content/2.solutions/…` |
| Offres : texte, FAQ, title Google. **`validated: true`** pour les proposer à Google | `content/3.offres/…` |
| Baromètres : `published`, `publishedAt` (AAAA-MM-JJ), KPI, couverture | `content/4.barometres/…` |
| E-mail, téléphone, adresse, réseaux, logos clients, image de partage | `content/reglages.yml` |
| Images | `public/images/` (médiathèque de Studio) |

Les textes de départ viennent de `docs/textes/textes-a-relire/` (validés par BIG FIVE). Le script `pnpm import:textes` est désormais désactivé : `content/` a été réorganisé et se modifie dans Studio.

### Organisation de `content/` pour Studio

Les éditeurs ne sont pas des développeurs. `content/` est donc organisé pour eux :

- **Dossiers et fichiers numérotés** (`1.accueil`, `2.solutions`…) : Studio les affiche dans l'ordre du site, sans le numéro.
- **Textes regroupés par section**, dans l'ordre où ils apparaissent à l'écran (« 1. Accueil : titre principal », « 2. Le Cabinet »…). Le site lit chaque texte par sa clé (`c.t.h1a`) : on peut déplacer une clé d'un groupe à l'autre dans `content.config.ts`, pas la renommer.
- **Libellés en français** sur chaque champ, via `.editor({ label, description })` dans `content.config.ts`.
- **Champs techniques** (langue, clé, ordre, adresse de page) en fin de formulaire, marqués « Technique · … ne pas modifier ».
- **Ne jamais masquer un champ** avec `.editor({ hidden: true })` : Studio 1.8 supprime du fichier tout champ masqué au premier niveau lors de l'enregistrement, ce qui casse le site.
- **Habillage** : Studio est en français (`studio.i18n`), en mode sombre (`class="dark"` sur `<html>`) et aux couleurs du site (`app/plugins/studio-theme.client.ts`).

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
- Domaine : `www.bigfive.solutions` est l'adresse principale ; `bigfive.solutions` y redirige (308). `NUXT_PUBLIC_SITE_URL=https://www.bigfive.solutions`.
- Variables : voir `.env.example`. En production, Resend et Turnstile sont obligatoires : sans eux, les formulaires refusent l'envoi.
- Formulaires, mise en place :
  1. **Resend** (resend.com) : Domains → le domaine de l'expéditeur doit être « Verified ». Le compte utilise `bigfive.solutions`, donc `NUXT_MAIL_FROM="BIG FIVE <site@bigfive.solutions>"`. Si l'expéditeur est sur un autre domaine que celui de la clé, Resend répond 403 et le formulaire renvoie 502. Ajouter chez l'hébergeur DNS les enregistrements affichés (SPF, DKIM), attendre « Verified ». Puis API Keys → Create API Key, permission « Sending access » → `NUXT_RESEND_API_KEY`.
  2. **Cloudflare Turnstile** (anti-robots) : Turnstile → Add widget, domaines `www.bigfive.solutions`, `bigfive.solutions` et `bigfive-web-brown.vercel.app`, mode « Managed ». Site Key → `NUXT_PUBLIC_TURNSTILE_SITE_KEY`, Secret Key → `NUXT_TURNSTILE_SECRET_KEY`.
  3. Les demandes arrivent à l'e-mail de `content/reglages.yml` (`contact@bigfiveabidjan.com`), ou à `NUXT_LEADS_TO` si elle est renseignée.
  4. Redéployer, puis envoyer une demande de test depuis le site.
- Nuxt Studio :
  - Connexion des éditeurs avec **Google** (retenue pour l'équipe BIG FIVE) :
    1. Google Cloud Console → APIs & Services → Credentials → Create OAuth client ID (Web application).
       Authorized redirect URI : `https://<domaine>/__nuxt_studio/auth/google`.
    2. GitHub → Settings → Developer settings → Fine-grained tokens : jeton limité au dépôt `bfv3`, permission « Contents : Read and write ». C'est lui qui enregistre les modifications des éditeurs.
    3. Renseigner `STUDIO_GOOGLE_CLIENT_ID`, `STUDIO_GOOGLE_CLIENT_SECRET`, `STUDIO_GITHUB_TOKEN` et `STUDIO_GOOGLE_MODERATORS`.
    4. `STUDIO_GOOGLE_MODERATORS` : adresses e-mail autorisées, séparées par des virgules, **sans espace**. Seules ces adresses entrent dans Studio. Ajouter ou retirer quelqu'un = modifier la variable, puis redéployer.
  - Connexion avec **GitHub** (pour le développeur, facultatif) : OAuth App GitHub, callback `https://<domaine>/__nuxt_studio/auth/github`, puis `STUDIO_GITHUB_CLIENT_ID` et `STUDIO_GITHUB_CLIENT_SECRET`.
  - Studio enregistre sur la branche `STUDIO_BRANCH` (par défaut `main`), lue au build. Elle doit être la branche de production du projet Vercel.
  - Tester en local : voir « Tester Studio en local » ci-dessous.
- Publication programmée : créer un Deploy Hook (Settings → Git), puis renseigner `NUXT_VERCEL_DEPLOY_HOOK` et `CRON_SECRET`. Le cron de `vercel.json` passe chaque matin et relance un build s'il y a une parution datée du jour.

## Tester Studio en local

**Sans connexion (édition directe des fichiers)** : `pnpm dev`, puis le bouton en bas à gauche. Pas de bouton « Publier » : les fichiers de `content/` sont modifiés sur le disque.

**Avec la connexion Google, comme en production** :

1. Dans le client OAuth Google, ajouter l'URI `http://localhost:3000/__nuxt_studio/auth/google`.
2. Créer une branche de test, pour ne rien publier sur `main` : `git switch -c studio-test && git push -u origin studio-test`.
3. Copier `.env.example` en `.env`, remplir les quatre variables Studio et `STUDIO_BRANCH=studio-test`.
4. `STUDIO_BRANCH=studio-test pnpm build && node --env-file=.env .output/server/index.mjs`
5. Ouvrir http://localhost:3000/_studio, se connecter avec Google, modifier un texte, publier : le commit doit arriver sur `studio-test`.
6. Supprimer la branche de test.
