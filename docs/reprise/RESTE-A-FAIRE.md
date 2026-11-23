# BIG FIVE : reste à faire

Point au 12/10/2026 (mis à jour l'après-midi). Le plan d'origine (`~/.claude/plans/analyse-le-cahier-de-fuzzy-fog.md`) n'existe pas sur ce poste : les livrables ci-dessous ont été reconstitués à partir de ce fichier, du CDC et de la politique de confidentialité.

## Déjà fait

- **Maquette v2 (polices seulement)** : https://maquette-v2-navy.vercel.app
  - Projet Vercel `maquette-v2` (compte jhouedanous-projects), en `noindex`, accessible sans connexion. Le fichier en ligne est identique au local.
  - Généré par `python3 tools/fix-fonts.py` à partir de « Maquette - Site BIG FIVE.html ».
  - Sorties : `maquette-v2/` (déployée) et `Maquette v2 - Site BIG FIVE.html` (un seul fichier, ouvrable hors ligne).
  - Changements :
    - Poppins pour les titres et Inter pour le texte, via Google Fonts.
    - Échelle `--fs-*` bornée : taille rendue = clamp(MIN, D × zoom, MAX).
    - Titres et menu en casse normale, italique retiré.
    - Deux ajustements imposés par les nouvelles tailles : pavés de l'accueil en `min-height`, et ligne « Étude sur mesure » autorisée à passer à la ligne.
  - Contrôles faits à 1024, 1280, 1366, 1440, 1920 et 2560 px : aucun texte sous 13 px, texte courant entre 16 et 18 px, en-tête qui tient. Fiches solution et fenêtre de contact contrôlées.
- **Aperçus locaux** : `.claude/launch.json` (v2 sur le port 4321, fichier unique sur 4323). L'aperçu de l'original (port 4322) pointe vers un scratchpad d'un autre poste (`/private/tmp/claude-501/...`) et `make_v1.py` n'existe pas ici : pour revoir l'original, ouvrir directement « Maquette - Site BIG FIVE.html ».
- **`DESIGN.md`** (12/10) : frontmatter YAML (couleurs réellement utilisées par la maquette, dégradés, échelle `SCALE`, marges, rayons, durée des effets) et 8 sections. Aucune nouvelle direction graphique. Le guide `document.md` d'impeccable n'est pas installé sur ce poste : structure établie sans lui.
- **`docs/ANALYSE-CDC-BIG-FIVE.md`** (12/10) : les 10 problèmes classés, polices, chiffres de lisibilité, audit SEO, incohérences du CDC, CMS Payload 3 et architecture, planning du 12 au 16/10, tableau avant/après.
  - Ajout par rapport à la liste ci-dessous : le CDC se contredit entre homothétie (§ 1, § 3) et empilement + menu repliable (§ 3 « Mobile et tablette ») ; SPF/DKIM concernent `bigfiveabidjan.com`, donc l'accès DNS doit couvrir les deux domaines ; le § 9 nomme mal le fichier de la maquette.
- **`docs/EMAIL-REPONSE-CDC.md`** + **brouillon Gmail** (12/10), objet « Site BIG FIVE — retour sur le cahier des charges et la maquette », sans destinataire, non envoyé. Salutation laissée en « Bonjour [Prénom], » : **compléter le prénom et l'adresse dans Gmail avant envoi.**
- **Mémoire projet** (12/10) : polices seulement, stack Payload, URL Vercel.
- **Constats sur le site actuel revérifiés le 12/10** : `/sitemap.xml` répond 200 en HTML (soft 404), `robots.txt` vide, adresse affichée `contacts@bigfiveabidjan.com`, polices Inter + Poppins.
- **Site `site/` (Next.js 16 + Payload 3.90)**, commencé le 12/10, procédure de lancement dans `site/README.md` :
  - admin Payload en français :
    - collection Baromètres (champs du CDC § 6.2, brouillons, aperçu, publication programmée par cron) ;
    - Demandes (copie de chaque envoi) ;
    - réglage de l'e-mail de réception ;
  - lien interne du PDF réservé aux comptes connectés : absent du HTML, du flux RSC et de l'API publique (vérifié par un test) ;
  - pages en responsive : français à la racine, anglais sous `/en`, une page par baromètre, politique de confidentialité ;
  - polices Poppins + Inter via `next/font` ; échelle `clamp(MIN, D/1920 × 100vw, MAX)`, sans script de zoom ; menu repliable sous 1024 px ;
  - formulaires contact, baromètre et « Me notifier » : zod, champ piège, Turnstile, Resend ; objets du CDC, accusés FR/EN, copie dans Demandes ;
  - SEO :
    - métadonnées, OG, canonical, hreflang, JSON-LD (Organization, Report) ;
    - `sitemap.xml` et `robots.txt` ;
    - 301 depuis `/thank-you` et `/en/thank-you`, les seules routes du site Nuxt actuel ;
    - `noindex` hors production ;
  - CTA en texte `#14162f` sur rose : contraste d'environ 5,2:1 au lieu de 3,4:1.
  - Vérifié en local (Postgres embarqué, build de production) :
    - `tsc` et `lint` propres ; 5/5 tests e2e ;
    - les 3 formulaires fonctionnent de bout en bout ;
    - à 375, 768, 1024, 1366, 1920 et 2560 px : aucun texte sous 13 px, texte courant entre 16 et 18 px, aucun débordement horizontal.
    - parcours éditeur (CDC § 6) :
      - une modification revalide aussitôt l'accueil et les pages FR et EN ;
      - un baromètre publié après le build est servi tout de suite, passe en tête, et le précédent descend dans l'archive ;
      - la publication programmée passe par le cron ;
      - l'aperçu d'un brouillon est réservé à l'admin ;
      - le sitemap se met à jour.
  - Tests du gabarit Payload supprimés : ils créaient un admin `dev@payloadcms.com` / `test` dans la base partagée.

- **Contenu entièrement dans Payload, offres visibles, swiper** (12/10 au soir) :
  - Collections Solutions, Offres et Clients ; globals Textes (5, par partie du site), Accueil, Référencement, Réseaux et liens, Politique. Localisation FR/EN. Le site ne lit plus `content/site.ts` (déplacé dans `src/seed/data/`). Voir `site/README.md`, « Ce qui est géré où ».
  - 17 offres rédigées (FR et EN, de 330 à 400 mots, 3 FAQ chacune, sans chiffre ni client inventé), dont **Création de sites web**. Pages `/solutions/<solution>/<offre>`, en `noindex` tant que « Texte validé » n'est pas coché.
  - La fiche d'une solution prend l'adresse `/solutions/<slug>` à l'ouverture (Retour la ferme), et a aussi sa page rendue par le serveur. Pavés et cercles sont devenus des liens.
  - Données structurées : ProfessionalService et catalogue sur l'accueil ; Service, FAQPage et BreadcrumbList sur les offres. Le sitemap contient les solutions et les offres validées.
  - Swiper entre sections (scroll-snap `proximity`, comme la maquette), à partir de 769 px.
  - Vérifié : tsc, lint, 7/7 e2e, build de production (55 pages), accueil identique à la version précédente à 375, 768, 1024 et 1440 px (seul ajout : la création de sites web), parcours fenêtre → offre → Retour.
  - Base : pooler en mode transaction (6543) pour le site et le build, mode session (5432) pour les migrations (`DATABASE_MIGRATE_URL`). Le mode session plafonne à 15 clients (`EMAXCONNSESSION`).
- **Maquette v2 réparée** (12/10) : le projet Vercel `maquette-v2` avait été relié au dépôt GitHub, et chaque push publiait la racine (404). Root Directory réglé sur `maquette-v2` ; les pushs sur `main` la redéploient désormais.
- **Email refondu** (12/10) : `docs/EMAIL-REPONSE-CDC.md` et brouillon Gmail, toujours sans destinataire. Chaque changement est justifié par la citation du CDC, une vérification faisable par le destinataire (outil de test de Google, survol, zoom) et les règles publiques de Google et du WCAG. Toutes les affirmations ont été contrôlées sur la maquette en ligne.

- **Style de la maquette et plein écran** (12/10, soir) :
  - comparaison côte à côte avec la maquette v2 à 1440 et 1920 px ; corrigé : menu actif en pastille rose, Laveiye en pastille dorée, points de navigation à droite, pied de page sans soulignement, pavés, cercles, fiche et couverture à l'échelle de la maquette (D / 19,2 vw) ;
  - accueil en plein écran avec Swiper 14.3 (une section par diapositive, molette, clavier, adresses #section) seulement avec souris, à partir de 1025 px et sans « réduire les animations » ; sinon défilement normal ;
  - transition entre pages : voile violet et logo BIG FIVE pendant le chargement de la page suivante (`PageTransition`), pas sur l'accueil ; ignorée avec « réduire les animations » ;
  - points de navigation et menu actif mis à jour (suivi de section assuré par l'accueil, en plein écran comme en défilement normal) ;
  - corrigé : les pages s'ouvraient en bas (ancien aimant CSS supprimé, remise en haut à l'ouverture des pages).

- **Dernier passage SEO** (12/10, soir), sur un build de production (adresse réelle, mode production) :
  - exploration des 48 pages : toutes en 200, aucun lien cassé, un seul H1 par page, toutes les images avec texte alternatif, JSON-LD valide, hreflang FR/EN/x-default réciproques, sitemap (13 URL indexables) cohérent avec les canonical ; les 34 pages d'offre en noindex jusqu'à validation ;
  - corrigé : `robots.txt` bloquait `/api/media/` (images de Google Images et aperçu LinkedIn des baromètres, CDC § 6.3) ; titre des baromètres de 115 caractères et titres des solutions sans mot-clé (nouveau champ « Titre pour Google » dans l'admin, baromètres et solutions) ; accueil sans « / » final dans le sitemap ; favicon absent ; libellés accessibles des pavés et des réseaux sociaux (WCAG 2.5.3) ;
  - Lighthouse (accueil, mobile) : SEO 100, accessibilité 100, bonnes pratiques 100, performance 89 (LCP 3,4 s en mobile simulé, 1,0 s sur ordinateur) ; pages d'offre : SEO 100 dès que « Texte validé » est coché ;
  - reste : description de l'accueil (181 caractères en FR, 163 en EN), à raccourcir avec l'accord du client (voir l'email).

## Reste à faire

1. **Supabase** : fait (projet `jqsyxftdargaottivpeh`, eu-west-1). Reste :
   - les 11 tables d'une autre application présentes dans ce projet restent telles quelles (décision du 12/10 : on garde ce qui marche) ;
   - désactiver la Data API (Project Settings → Data API) ;
   - avant la production, changer le mot de passe de la base et la clé S3, passés dans une conversation.
   - si une image manque sur le site : `pnpm media:verifier` (le 12/10, 35 envois du seed n'avaient pas atteint le bucket, sans erreur affichée ; réparé).
2. **Vercel** : projet `bigfive-site` créé et relié à `site/`. Lancer `bash scripts/vercel-env-preview.sh` depuis `site/`, puis premier déploiement de pré-production.
3. **Resend** (clé, domaine `bigfiveabidjan.com` vérifié) et **Turnstile** (clés) : sans eux, les formulaires refusent l'envoi sur Vercel.
4. Recette du CDC § 7.2 en pré-production : réception réelle, indésirables, Gmail et Outlook, iOS et Android. Tester aussi dans l'admin : modifier un texte, une solution, un logo, cocher « Texte validé » sur une offre.
5. Envoyer l'email (brouillon Gmail) : compléter le destinataire et le prénom, **joindre `docs/BIG-FIVE-textes-a-relire.zip`** (texte de chaque page, FR puis EN ; à régénérer avec `pnpm payload run src/seed/export-textes.ts` puis zip si le contenu change), et ajouter le lien de pré-production quand il existe.
6. Attendre les réponses de BIG FIVE :
   - liste des offres et relecture des 17 pages ;
   - title et description (Paris, Cape Town ?) ;
   - adresse, téléphone, fiche Google Business Profile ;
   - responsive ou homothétie ;
   - contact@ ou contacts@ ;
   - outil d'envoi des annonces, ou politique corrigée ;
   - mesure d'audience ;
   - textes des accusés de réception ;
   - images HD ;
   - vues mobile et tablette.
7. Commit (seulement si demandé). `site/.env` et `site/media/` sont ignorés par `site/.gitignore`.

## Chiffres à réutiliser dans l'email et l'analyse

- **Mécanisme** : `zoom = largeur / 1920` sur toute la page, sans plancher ni plafond (exigé par le CDC § 1 et § 3). Le CSS ne contient aucune media query, et les `clamp()` sont figés en px.
- **Original à 1366 px** (portable courant) : 74 blocs de texte sur 119 sous 13 px, dont 35 sous 11 px.
  - Texte courant : 15 px dans la maquette, 10,7 px à l'écran.
  - Pied de page : 13,5 px, soit 9,6 px.
  - Étiquettes : 11 px, soit 7,8 px.
  - H1 : 76,8 px en capitales, soit 54,6 px.
  - Titre de fiche : 80,6 px en graisse 800.
  - À 2560 px, tout est multiplié par 1,33 : H1 à 102 px, titre de fiche à 107 px. Sur téléphone (375 px), le texte courant tombe à 2,9 px.
- **v2** :
  - texte courant entre 16 et 18 px quel que soit l'écran, minimum 13 px pour les libellés ;
  - H1 à 42,7 px sur 1366, 60 px sur 1920, 64 px au maximum sur 2560 ;
  - titre de fiche à 56 px au maximum (graisse 700).
- **Polices** : le CDC § 3 impose celles du site actuel (Poppins + Inter). L'original n'utilisait qu'Inter, et embarquait Outfit et Karla sans les utiliser (restes du design system de présentation « Nocturne »).
- **Zoom du navigateur** : il est annulé par le script, ce qui fait échouer le critère WCAG 1.4.4. La v2 garde l'homothétie (consigne de ne rien changer d'autre), donc ce problème disparaîtra seulement au développement, avec une vraie mise en page responsive.
- **Hors périmètre, à signaler** :
  - contraste : blanc sur rose #E05AA8 à 3,4:1 sur tous les CTA, libellés roses jusqu'à 1,3:1 ; le détecteur impeccable relève 16 contrastes faibles et 4 halos ;
  - aucune version mobile n'est dessinée.
- **SEO** :
  - rendu 100 % JS, une seule URL ;
  - aucune page par baromètre (52 par an) ;
  - version EN en localStorage, sans hreflang ;
  - `<title>Bundled Page`, sans description, OG, canonical ni JSON-LD ;
  - images en `background-image`, sans alt ;
  - Google indexe la version mobile, réduite à 19,5 % ;
  - défilement dans un `div` 100vh ;
  - site actuel : `/sitemap.xml` en soft 404, `robots.txt` vide ;
  - il faut reprendre le title, la description et les balises OG actuels, et prévoir les redirections 301.
- **Incohérences** :
  - contact@ (CDC) contre contacts@ (site actuel) ;
  - la politique promet un lien de désinscription, alors que l'envoi prévu est manuel en copie cachée ;
  - le lien vers le PDF interne (`cutt.ly/telcos-ci-aout26`) est dans le code public ;
  - la chaîne « Payer avec FeexPay » subsiste.
- **CMS** : Strapi ne tourne pas sur Vercel, il lui faut un serveur toujours allumé. D'où Payload 3, intégré à Next.js sur Vercel, avec Supabase Postgres et Storage, brouillons, aperçu, publication programmée (Vercel Cron), FR/EN, droits par champ. Formulaires : Turnstile et Resend.

## Redéployer après modification

```bash
python3 tools/fix-fonts.py
```

Puis pousser sur `main` : le projet Vercel `maquette-v2` (Root Directory `maquette-v2`) se redéploie seul. À la main : `npx vercel@latest redeploy <url-du-dernier-déploiement> --target production` depuis `maquette-v2/` (`vercel deploy` depuis ce dossier échoue à cause du Root Directory).

Si la CLI demande une connexion : `npx vercel@latest login`.
