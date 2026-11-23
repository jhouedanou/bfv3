# Site BIG FIVE — bigfive.solutions

Next.js 16 et Payload 3 dans une seule application, hébergée sur Vercel. Les données sont dans Supabase (Postgres et Storage).
Références : `../DESIGN.md` (charte), `../docs/ANALYSE-CDC-BIG-FIVE.md` (choix techniques), CDC du 9/10/2026.

## Ce qui est géré où

| Contenu | Où le modifier |
|---|---|
Tout le contenu se modifie dans l'admin (`/admin`), en français et en anglais (sélecteur de langue en haut de chaque fiche). Une modification s'affiche sur le site sans redéploiement.

| Contenu | Où le modifier |
|---|---|
| Titres, paragraphes, boutons, menus, formulaires | Contenu du site → Textes : accueil / observatoire / formulaire de contact / baromètre et origine des demandes / pied de page et divers |
| Diaporama de l'accueil, personnage, cartes des pôles | Contenu du site → Accueil : images et pôles |
| Les 4 solutions (pavés, cercles, fiches et leurs pages `/solutions/<adresse>`) | Contenu du site → Solutions |
| Les offres (une page chacune : `/solutions/<solution>/<offre>`) | Contenu du site → Offres. Cocher « Texte validé » pour la proposer à Google |
| Logos des références | Contenu du site → Clients |
| Title et description de l'accueil | Contenu du site → Référencement |
| Réseaux sociaux, adresse de Laveiye | Contenu du site → Réseaux et liens |
| Politique de confidentialité (sections) | Contenu du site → Politique de confidentialité |
| Baromètres de l'Observatoire (CDC § 6) | Observatoire → Baromètres |
| E-mail de réception des demandes (CDC § 5) | Réglages → Paramètres |
| Demandes reçues (copie de secours des e-mails) | Demandes |

Pour une relecture hors de l'admin : `pnpm textes:exporter` écrit le texte de chaque page (FR puis EN) dans `../docs/textes/textes-a-relire/`.

Un texte vidé dans « Textes » reprend sa valeur d'origine (`src/i18n/dictionaries.ts`). Les fichiers de `src/seed/data/` ne servent qu'au premier remplissage (`pnpm seed`). Le logo et le badge restent dans `public/images/`.

## Lancer en local

Prérequis : Node 20 ou plus récent, pnpm 10.

```bash
cd site
pnpm install
cp .env.example .env        # puis remplir DATABASE_URL et PAYLOAD_SECRET
pnpm payload migrate        # crée les tables
pnpm seed                   # tout le contenu de départ (textes, solutions, 17 offres, clients, images) et le baromètre d'août 2026
pnpm media:verifier         # contrôle que chaque image est bien dans le bucket S3 (et la renvoie sinon) : à lancer après le seed
pnpm dev                    # http://localhost:3000
```

Ouvrir http://localhost:3000/admin pour créer le premier utilisateur.

- `PAYLOAD_SECRET` : une chaîne aléatoire (`openssl rand -hex 32`).
- Sans `S3_BUCKET`, les images sont stockées dans `site/media/`.
- Sans `RESEND_API_KEY`, les e-mails des formulaires s'affichent dans la console.
- Sans clés Turnstile, la vérification anti-spam est ignorée.
- Sur Vercel, ces trois services sont obligatoires : sans clé, les formulaires refusent l'envoi.
- Tant que `bigfiveabidjan.com` n'est pas vérifié dans Resend, l'expéditeur de test `onboarding@resend.dev` n'envoie qu'à l'adresse du titulaire du compte Resend. Pour tester en pré-production, mettre provisoirement cette adresse dans Admin → Paramètres → E-mail de réception, et la remettre ensuite. Les accusés de réception aux demandeurs ne partiront qu'une fois le domaine vérifié.

### Base de données

Le schéma n'évolue **que par migrations** (`push: false`), car la même base sert au développement et à la pré-production.

```bash
pnpm payload migrate:create nom-du-changement   # après avoir modifié une collection
pnpm payload migrate                            # applique les migrations en attente
pnpm generate:types && pnpm generate:importmap   # après tout changement de config
```

Sur Vercel, `pnpm run ci` (= `payload migrate && pnpm build`) applique les migrations à chaque déploiement.

- Générer les migrations **avec `S3_BUCKET` renseigné** : le plugin S3 ajoute la colonne `media._objectkey`, absente du schéma quand il est désactivé.
- Toute table créée dans `public` doit avoir le RLS activé (sans règle), sinon l’API REST de Supabase l’expose avec la clé `anon`. Le bloc ne vise que les tables en minuscules (celles de Payload) : les tables en majuscules appartiennent à une autre application. Ajouter à la fin de la migration le bloc `DO $$ … ENABLE ROW LEVEL SECURITY` de `20261012_175527_media_s3_objectkey.ts`.

## Supabase

1. Créer le projet, puis récupérer dans *Connect* :
   - la chaîne **Transaction pooler** (port 6543) → `DATABASE_URL` (site et build) ;
   - la chaîne **Session pooler** (port 5432) → `DATABASE_MIGRATE_URL` (migrations).

   Le mode session n'accepte que 15 clients pour tout le projet : au-delà (build sur plusieurs processus, fonctions Vercel), Supavisor répond `EMAXCONNSESSION`. Ne pas prendre l'hôte direct `db.<ref>.supabase.co` : il n'est joignable qu'en IPv6 et Vercel ne l'atteint pas.
   - Le projet Supabase actuel contient aussi des tables d'une autre application (`User`, `Session`, `Order`, `Contact`…). Payload ne les touche pas.
2. Storage → créer un bucket `media` (privé : Payload sert les images lui-même via `/api/media/file/`).
3. Storage → *S3 Connection* : endpoint, région, puis générer une paire de clés → `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`.

## Vercel

1. Importer le dépôt, **Root Directory = `site`**. Le build utilise `pnpm run ci` (défini dans `vercel.json`).
2. Renseigner toutes les variables de `.env.example`. `NEXT_PUBLIC_SITE_URL` = l'URL publique, sans `/` final.
3. Le cron de `vercel.json` publie chaque matin (6 h UTC) les baromètres programmés. Sur le plan Pro, on peut passer à un passage par heure (`0 * * * *`).
4. Hors production, le site envoie `X-Robots-Tag: noindex` et `robots.txt` interdit l'indexation.

Mise en ligne sur `bigfive.solutions` :
- ajouter le domaine au projet Vercel ;
- vérifier le domaine `bigfiveabidjan.com` dans Resend (SPF, DKIM, DMARC) ;
- vérifier que `MAIL_FROM` utilise ce domaine.

## Publier un baromètre (équipe marketing)

1. Admin → Baromètres → *Créer*.
2. Remplir :
   - l'identifiant (`secteur-pays-année-mois`) ;
   - la date, le titre, les 3 éléments du périmètre et les 3 chiffres clés ;
   - « À retenir » ;
   - la couverture (JPG ou PNG, moins de 500 Ko) ;
   - le lien interne du PDF.
3. *Aperçu* pour vérifier, puis *Publier* ou *Programmer la publication*.
4. Le dernier baromètre publié passe en tête de l'Observatoire, les autres dans « Baromètres précédents ». Chacun a sa page : `/barometres/<identifiant>` (en anglais : `/en/barometers/<identifiant>`). La liste complète est sur `/barometres`.

Guide pas à pas pour l'équipe : `../docs/guide-publier-un-barometre.md`.

Le lien interne du PDF n'est jamais envoyé au navigateur. Le test `tests/e2e/frontend.e2e.spec.ts` le vérifie.

## Formulaires

Chaque demande :
- est contrôlée par validation (zod), champ piège invisible, Cloudflare Turnstile et limite de débit (5 envois par adresse IP en 10 minutes, 3 par adresse e-mail en 1 heure) ;
- est envoyée par e-mail via Resend à l'adresse de réception, avec l'objet du CDC (`[Contact]`, `[Veille]`, `[Baromètre] Nom — Entreprise — Titre`, `[Me notifier] adresse`…) ;
- est copiée dans *Demandes*.

Le demandeur reçoit un accusé de réception dans la langue de la page. Son texte se modifie dans Textes : baromètre et origine des demandes → Accusés de réception. Il ne contient aucun texte saisi par le visiteur. Si la case « prochaines parutions » est cochée, un e-mail `[Me notifier]` part en plus.

## Rôles

- **Administrateur** : tout, y compris les comptes et Réglages → Paramètres.
- **Éditeur** : contenu, baromètres, demandes. Il ne peut ni créer de compte ni modifier les paramètres.

Le premier compte créé est administrateur. Les suivants sont éditeurs par défaut.

## Mesure d'audience et cookies

`NEXT_PUBLIC_GA_ID` (Google Analytics 4) et `NEXT_PUBLIC_META_PIXEL_ID` (Meta Pixel) dans `.env`.

- Vides : aucun bandeau, aucun script.
- Renseignés : bandeau Accepter / Refuser / Personnaliser. Les scripts ne sont ajoutés à la page qu'après accord (Consent Mode v2). « Gérer les cookies » dans le pied de page rouvre le bandeau.
- Une demande envoyée par un formulaire déclenche l'événement `generate_lead` (Google) et `Lead` (Meta).
- Ne pas renseigner les identifiants en production avant la mise à jour de la politique de confidentialité : `../docs/proposition-politique-confidentialite.md`.

## Adresses

| Français | Anglais |
|---|---|
| `/` | `/en` |
| `/solutions/<solution>` | `/en/solutions/<solution>` (adresse traduite dans l'admin) |
| `/solutions/<solution>/<offre>` | `/en/solutions/<solution>/<offre>` |
| `/barometres`, `/barometres/<identifiant>` | `/en/barometers`, `/en/barometers/<identifiant>` |
| `/politique-de-confidentialite` | `/en/privacy-policy` |

Les rubriques traduites sont déclarées dans `src/lib/site.ts` (`ROUTES`). Les redirections 301 sont dans `redirects.ts`.

## Tests

```bash
pnpm exec tsc --noEmit
pnpm lint
BASE_URL=http://localhost:3000 pnpm test:e2e     # serveur lancé au préalable
```
