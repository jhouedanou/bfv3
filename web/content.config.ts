import { defineCollection, defineContentConfig, z } from '@nuxt/content'

// Tout le contenu du site vit dans content/ : fichiers versionnés dans Git, modifiables dans
// Nuxt Studio (/_studio). Chaque enregistrement dans Studio crée un commit, Vercel redéploie.
//
// Les éditeurs ne sont pas des développeurs. Chaque champ porte donc, via .editor() :
//   - label : le nom affiché dans Studio, en français courant ;
//   - description : une aide courte sous le champ ;
// Les champs techniques (clé, langue, ordre, adresse de page) sont placés en fin de formulaire,
// avec la mention « ne pas modifier » : les changer casserait les liens ou le référencement.
// ATTENTION : ne jamais les masquer avec .editor({ hidden: true }). Studio 1.8 supprime du fichier,
// à l'enregistrement, tout champ masqué au premier niveau (vérifié le 27/11/2026 : « locale »
// disparaissait et le site tombait en erreur).

const localeEnum = ['fr', 'en'] as const
const solutionEnum = ['veille', 'conseil', 'academy', 'digitales'] as const

// Champs techniques : visibles (voir l'avertissement ci-dessus), en fin de formulaire.
const TECH = 'Réglage technique : ne pas modifier.'
const tech = (label: string) => ({ label: `Technique · ${label}`, description: TECH })
const locale = () => z.enum(localeEnum).editor(tech('langue du fichier'))
const solutionKey = () => z.enum(solutionEnum).editor(tech('solution'))
const techString = (label: string) => z.string().editor(tech(label))
const techNumber = (label: string) => z.number().editor(tech(label))

const metaTitle = () =>
  z.string().editor({
    label: 'Titre affiché dans Google',
    description: '60 caractères au maximum. C’est le titre bleu que les internautes voient dans les résultats.',
  })

const image = (label: string, description?: string) => z.string().editor({ input: 'media', label, ...(description ? { description } : {}) })

// ── Textes de la page d'accueil et libellés de l'interface ───────────────────────────────────
// Les dossiers de content/ sont numérotés dans l'ordre du site (1.accueil, 2.solutions…) : Studio
// les affiche dans cet ordre, sans le numéro. Dans chaque fichier, les textes sont regroupés par
// section, dans l'ordre où ils apparaissent à l'écran. Chaque texte : [clé, libellé affiché dans
// Studio, zone de texte longue]. Le site lit ces textes par leur clé (c.t.h1a…), quel que soit
// le groupe : on peut déplacer une clé d'un groupe à l'autre, pas la renommer.
type Field = [key: string, label: string, long?: boolean]
type Group = { key: string; label: string; fields: Field[] }

const textField = ([, label, long]: Field) => z.string().editor({ label, ...(long ? { input: 'textarea' as const } : {}) })
const groupsOf = (list: Group[], extra: Record<string, Record<string, any>> = {}) =>
  Object.fromEntries(
    list.map((g) => [
      g.key,
      z.object({ ...Object.fromEntries(g.fields.map((f) => [f[0], textField(f)])), ...(extra[g.key] ?? {}) }).editor({ label: g.label }),
    ]),
  )

const ACCUEIL: Group[] = [
  { key: 'hero', label: "1. Accueil : titre principal", fields: [
    ['h1a', "Titre : ligne 1"],
    ['h1b', "Titre : ligne 2"],
    ['h1c', "Titre : ligne 3"],
    ['h1d', "Titre : ligne 4"],
    ['m1', "Méthode : mot 1"],
    ['m2', "Méthode : mot 2"],
    ['m3', "Méthode : mot 3"],
    ['m4', "Méthode : mot 4"],
  ] },
  { key: 'cabinet', label: "2. Le Cabinet", fields: [
    ['eyFirm', "Surtitre"],
    ['firmTitleA', "Titre : ligne 1"],
    ['firmTitleB', "Titre : ligne 2"],
    ['firmP1a', "Paragraphe 1 : première phrase", true],
    ['firmP1b', "Paragraphe 1 : deuxième phrase", true],
    ['firmP2a', "Paragraphe 2 : première phrase"],
    ['firmP2b', "Paragraphe 2 : suite", true],
  ] },
  { key: 'solutions', label: "3. Nos solutions", fields: [
    ['eySol', "Surtitre"],
    ['solTitle', "Titre"],
    ['poleIntel', "Nom du pôle Intelligence & Conseil"],
    ['poleTech', "Nom du pôle Tech & Solutions"],
    ['discover', "Bouton d’une solution"],
    ['letsTalk', "Bouton de contact"],
  ] },
  { key: 'observatoire', label: "4. Observatoire", fields: [
    ['eyObs', "Surtitre"],
    ['obsSub', "Texte d’introduction", true],
    ['latestBaro', "Étiquette du dernier baromètre"],
    ['takeaway', "Étiquette « À retenir »"],
    ['dlBaro', "Bouton pour obtenir le baromètre"],
    ['notifyCta', "Bouton pour être notifié"],
    ['prevBaros', "Titre des baromètres précédents"],
  ] },
  { key: 'etude', label: "4. Observatoire : étude sur mesure", fields: [
    ['orderEy', "Surtitre"],
    ['orderTitle', "Titre (facultatif)"],
    ['orderDesc', "Texte", true],
    ['orderShort', "Texte court"],
    ['orderAsk', "Question d’accroche", true],
    ['orderCta', "Bouton"],
  ] },
  { key: 'parutions', label: "4. Observatoire : prochaines parutions", fields: [
    ['nlEy', "Surtitre"],
    ['nlTitle', "Titre"],
    ['workEmail', "Champ e-mail : texte d’exemple"],
    ['signUp', "Bouton"],
    ['nlDone', "Message de confirmation"],
  ] },
  { key: 'laveiye', label: "4. Observatoire : Laveiye", fields: [
    ['platform', "Étiquette"],
    ['laveiyeDesc', "Description", true],
    ['goLaveiye', "Bouton"],
    ['poweredBy', "Mention « propulsée par »"],
    ['freeAccess', "Étiquette « Gratuit »"],
  ] },
  { key: 'references', label: "5. Références", fields: [
    ['eyRef', "Surtitre"],
    ['refTitle', "Titre"],
    ['refSub', "Sous-titre"],
    ['clientLogo', "Texte alternatif des logos"],
  ] },
]

const TEXTES: Group[] = [
  { key: 'navigation', label: "Menu et navigation", fields: [
    ['navHome', "Menu : Accueil"],
    ['navAgence', "Menu : Le Cabinet"],
    ['navSolutions', "Menu : Nos solutions"],
    ['navObservatoire', "Menu : Observatoire"],
    ['navReferences', "Menu : Références"],
    ['contactUs', "Bouton de contact de l’en-tête"],
    ['backHome', "Lien de retour à l’accueil"],
    ['close', "Bouton « Fermer »"],
    ['closeBtn', "Bouton « Fermer » des fenêtres"],
    ['menu', "Mot « Menu »"],
    ['openMenu', "Ouvrir le menu (lecteurs d’écran)"],
    ['closeMenu', "Fermer le menu (lecteurs d’écran)"],
    ['langGroup', "Choix de langue (lecteurs d’écran)"],
    ['skip', "Lien « Aller au contenu »"],
    ['homeAria', "Logo : retour à l’accueil (lecteurs d’écran)"],
    ['sectionsAria', "Navigation par sections (lecteurs d’écran)"],
    ['logoAlt', "Texte alternatif du logo"],
    ['crumbs', "Fil d’Ariane (lecteurs d’écran)"],
    ['slide', "Diaporama : mot « Image »"],
    ['slideshow', "Diaporama : nom"],
  ] },
  { key: 'pagesSolution', label: "Pages solution et offre", fields: [
    ['weDo', "Titre « Ce que nous faisons »"],
    ['youGet', "Titre « Ce que vous obtenez »"],
    ['ledBy', "Mention « Porté par »"],
    ['otherOffers', "Titre des autres offres"],
    ['faqTitle', "Titre des questions fréquentes"],
    ['multi', "Choix « Plusieurs expertises »"],
    ['unknown', "Choix « Je ne sais pas encore »"],
  ] },
  { key: 'pagesBarometre', label: "Pages baromètre", fields: [
    ['barosH1', "Titre de la page « Tous les baromètres »"],
    ['barosMetaTitle', "Titre affiché dans Google"],
    ['allBaros', "Lien « Tous les baromètres »"],
    ['baroOf', "Nom de la collection"],
    ['baro', "Mot « Baromètre »"],
    ['frOnly', "Mention affichée sur le site anglais"],
    ['laveiyeLine', "Mention Laveiye", true],
    ['zoomLabel', "Bouton d’agrandissement"],
    ['zoomCover', "Agrandir la couverture (lecteurs d’écran)"],
    ['seeBaro', "Lien vers le dernier baromètre"],
  ] },
  { key: 'contact', label: "Formulaire de contact", fields: [
    ['contactTitle', "Titre"],
    ['cIntro1', "Introduction : ligne 1"],
    ['cIntro2', "Introduction : ligne 2", true],
    ['required', "Mention des champs obligatoires"],
    ['fullName', "Champ : nom"],
    ['phName', "Champ nom : exemple"],
    ['emailPro', "Champ : e-mail"],
    ['phEmail', "Champ e-mail : exemple"],
    ['company', "Champ : entreprise"],
    ['phCompany', "Champ entreprise : exemple"],
    ['phone', "Champ : téléphone"],
    ['phoneOpt', "Champ : téléphone (facultatif)"],
    ['role', "Champ : fonction"],
    ['jobTitle', "Champ : poste"],
    ['phRole', "Champ fonction : exemple"],
    ['sector', "Champ : secteur"],
    ['phSector', "Champ secteur : exemple"],
    ['which', "Champ : accompagnement souhaité"],
    ['need', "Champ : besoin"],
    ['phNeed', "Champ besoin : exemple"],
    ['consent', "Case d’accord"],
    ['optin', "Case d’inscription aux parutions"],
    ['submit', "Bouton d’envoi"],
    ['sending', "Message pendant l’envoi"],
    ['invalid', "Message de champ invalide"],
    ['origin', "Mention « Origine »"],
    ['okT', "Confirmation : titre"],
    ['okP', "Confirmation : texte"],
    ['okRec', "Confirmation : rappel de la demande"],
    ['errT', "Erreur : titre"],
    ['errP', "Erreur : texte"],
    ['retryL', "Bouton « Réessayer »"],
    ['errRate', "Message quand il y a trop de demandes", true],
  ] },
  { key: 'formulaireBarometre', label: "Formulaire « Obtenir le baromètre »", fields: [
    ['gateIntro', "Introduction", true],
    ['gateNl', "Case d’inscription aux parutions"],
    ['gateCta', "Bouton"],
    ['gateDoneT', "Confirmation : titre"],
    ['gateDoneP', "Confirmation : texte", true],
    ['notifyTitle', "Fenêtre « Me notifier » : titre"],
    ['notifyDesc', "Fenêtre « Me notifier » : texte"],
  ] },
  { key: 'emails', label: "E-mails envoyés automatiquement", fields: [
    ['ackSubject', "Accusé de réception : objet"],
    ['ackBody', "Accusé de réception : message", true],
    ['ackNotifySubject', "Inscription aux parutions : objet"],
    ['ackNotifyBody', "Inscription aux parutions : message", true],
  ] },
  { key: 'cookies', label: "Bandeau cookies", fields: [
    ['ckText', "Texte du bandeau", true],
    ['ckAccept', "Bouton « Accepter »"],
    ['ckRefuse', "Bouton « Refuser »"],
    ['ckCustom', "Bouton « Personnaliser »"],
    ['ckMore', "Lien « En savoir plus »"],
    ['ckManage', "Lien « Gérer les cookies »"],
    ['ckTitle', "Titre de la fenêtre"],
    ['ckNeeded', "Cookies nécessaires : titre"],
    ['ckNeededDesc', "Cookies nécessaires : texte", true],
    ['ckAudience', "Mesure d’audience : titre"],
    ['ckAudienceDesc', "Mesure d’audience : texte"],
    ['ckAds', "Mesure publicitaire : titre"],
    ['ckAdsDesc', "Mesure publicitaire : texte"],
    ['ckSave', "Bouton d’enregistrement"],
  ] },
  { key: 'piedDePage', label: "Pied de page et politique de confidentialité", fields: [
    ['rights', "Mention de droits"],
    ['legal', "Lien « Mentions légales »"],
    ['privacy', "Lien « Politique de confidentialité »"],
    ['privacyUpdated', "Politique : date de mise à jour"],
    ['privacyIntro', "Politique : introduction", true],
    ['privacyContact', "Politique : phrase de contact", true],
  ] },
  { key: 'sources', label: "Origine des demandes (indiquée dans les e-mails reçus)", fields: [
    ['observatoire', "Observatoire"],
    ['header', "En-tête"],
    ['hero', "Accueil"],
    ['solutions', "Nos solutions"],
    ['veille', "Fiche Veille"],
    ['conseil', "Fiche Conseil"],
    ['academy', "Fiche Academy"],
    ['digitales', "Fiche Solutions digitales"],
  ] },
]

export default defineContentConfig({
  collections: {
    // Une page par offre : /solutions/<solution>/<offre> (FR) et /en/solutions/<solution>/<offer>.
    offres: defineCollection({
      type: 'page',
      source: '3.offres/**/*.md',
      schema: z.object({
        title: z.string().editor({ label: 'Nom de l’offre', description: 'Titre affiché en haut de la page.' }),
        metaTitle: metaTitle(),
        description: z.string().editor({
          input: 'textarea',
          label: 'Description affichée dans Google',
          description: 'Une ou deux phrases, 160 caractères au maximum.',
        }),
        gets: z.array(z.string()).editor({ label: 'Ce que vous obtenez', description: 'Une ligne par livrable.' }),
        faq: z
          .array(
            z.object({
              question: z.string().editor({ label: 'Question' }),
              answer: z.string().editor({ input: 'textarea', label: 'Réponse' }),
            }),
          )
          .editor({ label: 'Questions fréquentes' }),
        // Décoché : page hors index Google et hors sitemap.
        validated: z.boolean().default(false).editor({
          label: 'Texte validé',
          description: 'Coché : la page est proposée à Google. Décoché : elle reste invisible dans Google.',
        }),
        slug: techString('adresse de la page'),
        key: techString('identifiant de l’offre'),
        solution: solutionKey(),
        order: techNumber('ordre d’affichage'),
        locale: locale(),
      }),
    }),
    solutions: defineCollection({
      type: 'data',
      source: '2.solutions/**/*.yml',
      schema: z.object({
        name: z.string().editor({ label: 'Nom de la solution' }),
        metaTitle: metaTitle(),
        step: z.string().editor({ label: 'Étape de la méthode', description: 'Exemple : « Collecter · Décrypter ».' }),
        heroSub: z.string().editor({ input: 'textarea', label: 'Sous-titre', description: 'Affiché sous le nom, sur l’accueil et sur la page.' }),
        tag: z.string().editor({ label: 'Accroche courte' }),
        promise: z.string().editor({ input: 'textarea', label: 'Promesse', description: 'Une ou deux phrases.' }),
        gets: z.array(z.string()).editor({ label: 'Ce que vous obtenez', description: 'Une ligne par livrable.' }),
        lead: z.string().editor({ label: 'Responsable', description: 'Nom et fonction. Exemple : « Yannick Boka, Directeur du pôle ».' }),
        image: image('Photo de la solution'),
        slug: techString('adresse de la page'),
        imagePosition: z.string().default('center').editor(tech('cadrage de la photo')),
        pole: z.enum(['intel', 'tech']).editor(tech('pôle')),
        key: solutionKey(),
        order: techNumber('ordre d’affichage'),
        locale: locale(),
      }),
    }),
    barometres: defineCollection({
      type: 'data',
      source: '4.barometres/*.yml',
      schema: z.object({
        identifiant: z.string().editor({
          label: 'Identifiant',
          description:
            'Même texte que le nom du fichier : secteur-pays-année-mois, en minuscules et sans accent. Exemple : telecoms-ci-2026-08. Il devient l’adresse de la page : ne plus le changer après publication.',
        }),
        published: z.boolean().default(false).editor({
          label: 'Publié',
          description: 'Coché : le baromètre est visible sur le site. Décoché : il reste un brouillon.',
        }),
        // Date de parution (AAAA-MM-JJ). Une date future reste masquée jusqu'au jour dit.
        publishedAt: z.string().editor({
          label: 'Date de parution',
          description: 'Format AAAA-MM-JJ, par exemple 2026-12-01. Avec une date future, le baromètre n’apparaît que ce jour-là.',
        }),
        title: z.string().editor({ label: 'Titre', description: 'Une question. 110 caractères au maximum.' }),
        metaTitle: metaTitle(),
        cover: image('Image de couverture', 'JPG ou PNG, 500 Ko au maximum. Aucun lien ni QR code imprimé dans l’image.'),
        scope: z.array(z.string()).editor({ label: 'Périmètre', description: '3 éléments courts. Exemple : « 3 opérateurs télécoms ».' }),
        kpis: z
          .array(
            z.object({
              value: z.string().editor({ label: 'Chiffre', description: 'Exemple : 76,59 %' }),
              label: z.string().editor({ label: 'Libellé court' }),
              explanation: z.string().editor({ input: 'textarea', label: 'Explication', description: 'Une phrase.' }),
            }),
          )
          .editor({ label: 'Chiffres clés', description: '3 chiffres.' }),
        takeaway: z.string().editor({ input: 'textarea', label: 'À retenir', description: 'Une phrase. 200 caractères au maximum.' }),
      }),
    }),
    // Page d'accueil : un fichier par langue, sections dans l'ordre de la page.
    accueil: defineCollection({
      type: 'data',
      source: '1.accueil/*.yml',
      schema: z.object({
        ...groupsOf(ACCUEIL, {
          cabinet: {
            poles: z
              .array(
                z.object({
                  pole: z.enum(['intel', 'tech']).editor(tech('pôle')),
                  name: z.string().editor({ label: 'Nom du pôle' }),
                  step: z.string().editor({ label: 'Étapes de la méthode' }),
                  promise: z.string().editor({ input: 'textarea', label: 'Promesse' }),
                  items: z.array(z.string()).editor({ label: 'Expertises', description: 'Une ligne par expertise.' }),
                  lead: z.string().editor({ label: 'Responsable' }),
                  role: z.string().editor({ label: 'Fonction du responsable' }),
                }),
              )
              .editor({ label: 'Pôles du Cabinet' }),
          },
        }),
        seo: z
          .object({
            title: metaTitle(),
            description: z.string().editor({
              input: 'textarea',
              label: 'Description affichée dans Google',
              description: 'Une ou deux phrases, 160 caractères au maximum.',
            }),
          })
          .editor({ label: 'Référencement (Google)' }),
        locale: locale(),
      }),
    }),
    // Libellés de l'interface (menus, boutons, formulaires, pied de page).
    textes: defineCollection({
      type: 'data',
      source: '6.textes/*.yml',
      schema: z.object({ ...groupsOf(TEXTES), locale: locale() }),
    }),
    politique: defineCollection({
      type: 'data',
      source: '5.politique/*.yml',
      schema: z.object({
        sections: z
          .array(
            z.object({
              title: z.string().editor({ label: 'Titre de la section' }),
              paragraphs: z.array(z.string().editor({ input: 'textarea' })).editor({ label: 'Paragraphes' }),
            }),
          )
          .editor({ label: 'Sections de la politique de confidentialité' }),
        locale: locale(),
      }),
    }),
    reglages: defineCollection({
      type: 'data',
      source: 'reglages.yml',
      schema: z.object({
        email: z.string().editor({ label: 'E-mail de contact', description: 'Affiché dans le pied de page. Il reçoit aussi les demandes des formulaires.' }),
        telephone: z.string().editor({ label: 'Téléphone', description: 'Format international conseillé. Exemple : +225 27 00 00 00 00.' }),
        adresse: z.string().editor({ input: 'textarea', label: 'Adresse postale', description: 'Affichée dans le pied de page. Une ligne par ligne d’adresse.' }),
        // Lien Google Maps de l'établissement.
        carte: z.string().default('').editor({ label: 'Lien Google Maps', description: 'Lien « Partager » de la fiche Google Maps. L’adresse du pied de page y renvoie.' }),
        // Horaires d'ouverture : texte affiché (fr, en) et format schema.org (ex. « Mo-Fr 09:00-18:00 »).
        horaires: z
          .object({
            fr: z.string().editor({ label: 'Texte en français', description: 'Exemple : Du lundi au vendredi, de 9h00 à 18h00' }),
            en: z.string().editor({ label: 'Texte en anglais', description: 'Exemple : Monday to Friday, 9:00 am to 6:00 pm' }),
            schema: z.string().editor({ label: 'Format pour Google', description: 'Exemple : Mo-Fr 09:00-18:00. En cas de doute, demander au développeur.' }),
          })
          .default({ fr: '', en: '', schema: '' })
          .editor({ label: 'Horaires d’ouverture' }),
        laveiye: z.string().editor({ label: 'Lien vers Laveiye' }),
        ogImage: image('Image de partage', 'Image affichée quand le site est partagé sur les réseaux sociaux. 1200 × 630 pixels.'),
        personnage: image('Personnage du Cabinet', 'PNG à fond transparent.'),
        covers: z.array(z.string()).editor({ label: 'Images de fond de l’accueil' }),
        socials: z
          .array(
            z.object({
              label: z.string().editor({ label: 'Nom du réseau', description: 'Exemple : LinkedIn' }),
              short: z.string().editor({ label: 'Abréviation', description: 'Affichée dans le pied de page. Exemple : in' }),
              url: z.string().editor({ label: 'Adresse de la page' }),
            }),
          )
          .editor({ label: 'Réseaux sociaux' }),
        clients: z
          .array(
            z.object({
              name: z.string().editor({ label: 'Nom du client' }),
              logo: image('Logo'),
            }),
          )
          .editor({ label: 'Logos clients' }),
      }),
    }),
  },
})
