# BIG FIVE : prochaines étapes

Point au 27 novembre 2026. Branche `main`.

État : le site est dans `web/` (Nuxt 4 + Nuxt Content + Nuxt Studio). Aucune base de données, aucun CMS serveur : tout le contenu est dans `web/content/`. L'ancienne version Next.js + Payload (`site/`) est supprimée.

## 1. Ce qui est validé et en place

- Site sur plusieurs pages : accueil en une page, une page par solution (4), par offre (17) et par baromètre.
- Mise en page adaptative sur mobile et tablette, zoom du navigateur fonctionnel.
- Version anglaise sous `/en`, plan du site, `robots.txt`, données structurées, redirection des anciennes adresses.
- Administration : **Nuxt Studio** sur `/_studio` (voir `docs/guide-publier-un-barometre.md`).
- Formulaires envoyés à `contact@bigfiveabidjan.com` (Resend). L'équipe gère la liste « Me notifier » à partir des e-mails reçus.
- Mesure d'audience : Google Analytics 4 et Meta Pixel, chargés seulement après accord du visiteur.

## 2. Points tranchés le 27 novembre

| Point | Décision | Où |
|---|---|---|
| Nom de la 3e solution | « Big Five Academy » | `content/2.solutions/*/3.academy.yml` |
| Paris / Cape Town | Cape Town retiré de la description Google. Paris conservé : à confirmer. | `content/1.accueil/` |
| Adresse postale | Treichville, Zone 3, 01 BP 1608, Abidjan | `content/reglages.yml` |
| Horaires | Du lundi au vendredi, de 9h00 à 18h00 | `content/reglages.yml` |
| Lien Google Maps | Lien de l'adresse dans le pied de page, et `hasMap` dans les données structurées | `content/reglages.yml` (`carte`) |
| Menu de Studio | En français, dossiers dans l'ordre du site, textes regroupés par section, libellés clairs, couleurs du site | `web/content.config.ts`, `web/README.md` |
| Textes anglais | Relus le 27/11 : tournures calquées sur le français, orthographe américaine partout, vocabulaire harmonisé | `content/**/2.anglais*` |

Le script `pnpm import:textes` est désactivé : il écraserait l'organisation actuelle de `web/content/` et les corrections de l'anglais.

## 3. À obtenir de BIG FIVE

| Élément | Où il va |
|---|---|
| Numéro de téléphone | `content/reglages.yml` (`telephone`) |
| Paris : garder ou retirer de la description Google | `content/1.accueil/` |
| Liste des personnes qui modifieront le site, avec leur adresse e-mail Google | Variable `STUDIO_GOOGLE_MODERATORS` (Vercel) |
| Photos HD (4 solutions, personnage du Cabinet en PNG transparent) : Yadé | Médiathèque de Studio |
| Image de partage 1200 × 630 : Yadé | `content/reglages.yml` (`ogImage`) |
| Couverture du baromètre d'août 2026 sans lien imprimé | `content/4.barometres/` |
| Identifiants Google Analytics 4 et Meta Pixel | Variables Vercel |
| Validation de la politique de confidentialité mise à jour | `docs/proposition-politique-confidentialite.md` |
| Outil d'envoi des annonces de parution avec désinscription automatique (Brevo recommandé) | `docs/propositions.md` |
| Nom complet de « Cossi, Lead Études & Veille » | `content/2.solutions/*/1.veille.yml` |
| Accès DNS de `bigfive.solutions` et `bigfiveabidjan.com` | Mise en ligne, e-mails |
| Export Search Console | Redirections dans `web/nuxt.config.ts` |

Deux incohérences à corriger avec la politique de confidentialité :

- elle dit qu'aucun cookie de mesure n'est utilisé, alors que le site propose Google Analytics et Meta Pixel ;
- elle promet un lien de désinscription dans chaque e-mail, alors que la désinscription se fait aujourd'hui en répondant à l'e-mail.

## 4. À faire côté développement

1. **Nuxt Studio en production, connexion Google** : créer le client OAuth Google (URI de redirection `https://<domaine>/__nuxt_studio/auth/google`) et un jeton GitHub limité au dépôt, puis renseigner `STUDIO_GOOGLE_CLIENT_ID`, `STUDIO_GOOGLE_CLIENT_SECRET`, `STUDIO_GITHUB_TOKEN` et `STUDIO_GOOGLE_MODERATORS` dans Vercel. Détail dans `web/README.md`.
2. **Formulaires** : `NUXT_RESEND_API_KEY`, `NUXT_TURNSTILE_SECRET_KEY`, `NUXT_PUBLIC_TURNSTILE_SITE_KEY`. Vérifier le domaine dans Resend (SPF, DKIM, DMARC), puis tester la réception.
3. **Parutions programmées** : Deploy Hook Vercel, `NUXT_VERCEL_DEPLOY_HOOK` et `CRON_SECRET`.
4. **Comparer le site à la maquette du 3 novembre** (`docs/maquette/`) et corriger les écarts.
5. **Valider les données structurées** sur https://validator.schema.org et https://search.google.com/test/rich-results.
6. **Lien du PDF interne** : il figure dans l'historique git d'un dépôt public. Faire changer ce lien côté BIG FIVE.

## 5. Mise en ligne

À faire seulement après la validation sur la pré-production (https://bigfive-web-brown.vercel.app).

1. Publier la politique de confidentialité mise à jour.
2. Renseigner les identifiants GA4 et Meta Pixel en production.
3. Ajouter `bigfive.solutions` au projet Vercel et basculer le DNS.
4. Supprimer `NUXT_INDEXABLE=false` dans Vercel, puis redéployer.
5. Vérifier en ligne : `/sitemap.xml`, `/robots.txt`, 301 de `/thank-you`.
6. Déclarer le sitemap dans la Search Console.
7. Garder `redirect/` (301 de bigfive.dev/solutions) tel quel.
8. Retirer le dossier `big-five/` (ancien site Nuxt 3) une fois la bascule confirmée.

Hors périmètre : la fiche Google Business Profile (adresse, horaires et activités à saisir par BIG FIVE).

## 6. Travailler en local

```bash
cd web
pnpm install
pnpm dev        # http://localhost:3000 ; Studio : bouton en bas à gauche
```

- Node 22 obligatoire (`web/.node-version`). Avec Node 20, Nuxt Content échoue (« better-sqlite3 »).
- Après une modification de `content.config.ts`, relancer `pnpm dev`.

## 7. Documents utiles

| Fichier | Contenu |
|---|---|
| `web/README.md` | Pages, contenus, référencement, Vercel |
| `docs/guide-publier-un-barometre.md` | Guide pas à pas pour l'équipe (Nuxt Studio) |
| `docs/propositions.md` | Outil d'envoi des annonces, PDF interne |
| `docs/proposition-politique-confidentialite.md` | Texte proposé, non publié |
| `docs/textes/textes-a-relire/` | Textes validés par le client (source d'origine du contenu) |
| `docs/maquette/` | Maquette du 3 novembre (référence visuelle) |
| `docs/reprise/` | Notes de la première phase (octobre, époque Payload) |
