# BIG FIVE : prochaines étapes

Point au 23 novembre 2026. Branche `refonte-v3`, rien n'est poussé sur GitHub.

État : le site (`site/`, Next.js 16 + Payload 3) passe le build, `tsc`, `lint` et les 14 tests e2e en local.

## 1. Décisions à prendre (bloquent la suite)

### 1.1 Base de données

PocketBase n'est pas compatible avec Payload. Payload accepte seulement Postgres, MongoDB et SQLite.

| Choix | Conséquence |
|---|---|
| **A. Postgres dédié (Neon), Payload gardé** — recommandé | Aucune réécriture. Base séparée de l'autre application. |
| B. SQLite (Turso), Payload gardé | Migrations à régénérer. |
| C. PocketBase à la place de Payload | Plusieurs jours de réécriture. Serveur à louer. Contredit le mail envoyé au client (« Payload »). |

La pré-production Vercel attend ce choix.

### 1.2 Couverture du baromètre d'août 2026

L'image affichée porte le lien du PDF interne, lisible par tout visiteur.

- Demander à BIG FIVE une couverture sans lien imprimé.
- En attendant : garder l'image, ou dépublier ce baromètre ?

### 1.3 Historique git

Le lien du PDF est dans le premier commit d'import (`fb6a696`). Le purger avant le premier push ?

### 1.4 Format de couverture

Le brief demande du 16:9. La maquette du 3 novembre et la version Vercel sont en portrait (1121 × 1403). À confirmer avec Franck. Le site accepte les deux.

## 2. À faire côté développement

Dans cet ordre.

1. **Pré-production Vercel** (après 1.1)
   - Créer la base, renseigner les variables de `site/.env.example`.
   - Importer le dépôt dans Vercel, Root Directory = `site`.
   - Lancer `pnpm seed`, puis `pnpm media:verifier`.
   - Créer le premier compte (il devient administrateur).
   - Envoyer l'adresse à Franck : validation sur ordinateur et sur mobile.
2. **Comparer le site à la maquette du 3 novembre** (`docs/maquette/`). Le site a été construit sur celle du 12 octobre. Corriger les écarts.
3. **Valider les données structurées** sur https://validator.schema.org et sur https://search.google.com/test/rich-results (demande une adresse en ligne).
4. **Mesurer le titre d'accueil à 2560 px** : il doit rester sous 64 px.
5. **Diagnostiquer `pnpm seed`** : le premier lancement sort parfois sans rien écrire ni signaler d'erreur. Le second marche.
6. **PDF du baromètre en stockage privé** avec lien signé de 5 minutes, si BIG FIVE valide la proposition (`docs/propositions.md`, point 2). Environ une journée.
7. **Outil d'envoi des annonces** (Brevo recommandé), si BIG FIVE valide (`docs/propositions.md`, point 1).
8. **Redirections Search Console** : ajouter les adresses dans `site/redirects.ts` quand `docs/search-console-pages.csv` sera fourni.
9. **Tests de réception des e-mails** quand l'adresse `contact@bigfiveabidjan.com` sera confirmée et le domaine vérifié dans Resend (SPF, DKIM, DMARC).

## 3. À obtenir de BIG FIVE

| Élément | Où il va |
|---|---|
| Validation des 17 textes d'offre (Jérémie) | Admin → Offres → cocher « Texte validé ». **Tant que ce n'est pas fait, Google ne voit pas ces 17 pages.** |
| Nom de la 3e solution (« Big Five Academy » ou « Renforcement de capacités ») | Admin → Solutions. L'ancienne adresse sera redirigée. |
| Paris / Cape Town : garder ou retirer | Admin → Référencement |
| Adresse postale et téléphone | Admin → Paramètres |
| Liste des personnes qui auront un compte, avec leur rôle | Admin → Utilisateurs |
| Photos HD (4 solutions, personnage du Cabinet en PNG transparent) | Admin → Solutions, Accueil |
| Image de partage 1200 × 630 | Admin → Référencement |
| Couverture d'août 2026 sans lien imprimé | Admin → Baromètres |
| Relecture des textes anglais | Admin, sélecteur de langue |
| Confirmation de `contact@bigfiveabidjan.com` | Admin → Paramètres |
| Identifiants Google Analytics 4 et Meta Pixel | `.env` |
| Validation de la politique de confidentialité mise à jour | `docs/proposition-politique-confidentialite.md` |
| Engagements d'hébergement et de maintenance (pages Création de sites web, Plateformes SaaS) | Admin → Offres |
| Contenu de la page IA appliquée | Admin → Offres |
| Nom complet de « Cossi, Lead Études & Veille » | Admin → Solutions |
| Accès DNS de `bigfive.solutions` et `bigfiveabidjan.com` | Mise en ligne, e-mails |
| Export Search Console | `docs/search-console-pages.csv` |

Textes nouveaux à faire relire :

- titre anglais de l'accueil ;
- titre de la page « Tous les baromètres » ;
- libellés du bandeau cookies (« Personnaliser » et le détail) ;
- message affiché quand trop de demandes sont envoyées ;
- accusés de réception FR et EN.

## 4. Mise en ligne

À faire seulement après la validation de Franck sur la pré-production.

1. Publier la politique de confidentialité mise à jour.
2. Seulement ensuite : renseigner les identifiants GA4 et Meta Pixel en production.
3. Ajouter `bigfive.solutions` au projet Vercel et basculer le DNS.
4. Vérifier `MAIL_FROM` et le domaine dans Resend.
5. Vérifier en ligne : `/sitemap.xml`, `/robots.txt`, 301 de `/thank-you`.
6. Déclarer le sitemap dans la Search Console.
7. Garder `redirect/` (301 de bigfive.dev/solutions) tel quel.
8. Retirer le dossier `big-five/` (ancien site Nuxt) une fois la bascule confirmée.

Hors périmètre : la fiche Google Business Profile.

## 5. Documents utiles

| Fichier | Contenu |
|---|---|
| `site/README.md` | Lancer en local, base, Vercel, rôles, cookies, adresses |
| `docs/guide-publier-un-barometre.md` | Guide pas à pas pour l'équipe |
| `docs/propositions.md` | Outil d'envoi des annonces, PDF interne |
| `docs/proposition-politique-confidentialite.md` | Texte proposé, non publié |
| `docs/textes/textes-a-relire/` | Textes validés par le client (source du contenu) |
| `docs/maquette/` | Maquette de Franck du 3 novembre (référence visuelle) |
| `docs/reprise/` | Notes de la première phase (octobre) |
