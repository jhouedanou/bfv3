// Pages « offre » de la solution Solutions Digitales (Pôle Tech & Solutions).
import type { OffreSeed } from './types'

export const OFFRES_DIGITALES: OffreSeed[] = [
  // 1. Création de sites web
  {
    solution: 'digitales',
    ordre: 1,
    fr: {
      titre: 'Création de sites web',
      slug: 'creation-de-site-web',
      metaTitle: 'Création de site web à Abidjan | BIG FIVE',
      accroche:
        'Sites vitrines et institutionnels, refonte, versions FR/EN : des sites rapides, accessibles et que vos équipes administrent seules.',
      corps: [
        {
          p: "BIG FIVE conçoit des sites web vitrines et institutionnels pour les entreprises, les marques et les organisations, à Abidjan et en Afrique francophone. Création de site web ou refonte d'un site existant : nous livrons un site rapide, lisible sur mobile, bien référencé et que vos équipes mettent à jour elles-mêmes. Notre Pôle Tech & Solutions s'appuie sur plus de 15 ans d'expérience terrain en marketing digital pour relier votre site à vos objectifs, et pas seulement à une charte graphique.",
        },
        { h2: 'Ce que nous réalisons' },
        {
          p: 'Nous prenons en charge le projet de bout en bout, de la structure des contenus à la mise en ligne. Chaque site est pensé pour vos visiteurs réels, souvent sur smartphone et avec une connexion variable.',
        },
        {
          ul: [
            'Sites vitrines pour présenter une marque, une offre ou un événement',
            'Sites institutionnels pour les entreprises, fondations et organisations',
            'Refonte de site web : reprise des contenus, nouvelle structure, redirections',
            'Sites bilingues français / anglais, avec une gestion claire des deux versions',
            "Outil d'administration pour publier pages, actualités et médias sans développeur",
          ],
        },
        { h2: 'Notre méthode' },
        {
          p: "Tout commence par un échange sur vos objectifs, vos publics et vos contenus. Nous définissons ensuite l'arborescence et les pages clés, puis nous concevons les maquettes avant de développer le site. Le référencement naturel est intégré dès la conception : structure des pages, balises, adresses lisibles, plan du site et temps de chargement. Il ne s'ajoute pas après coup.",
        },
        {
          p: "Nous portons la même attention à la performance et à l'accessibilité : contrastes lisibles, navigation au clavier, textes alternatifs, images allégées. Un site léger s'affiche mieux sur les réseaux mobiles et reste confortable pour tous les visiteurs.",
        },
        { h2: 'Pour qui' },
        {
          p: "Vous cherchez une agence de création de site internet en Côte d'Ivoire capable de penser aussi votre stratégie digitale ? Nous travaillons avec les directions marketing et communication, les PME qui veulent une présence sérieuse en ligne et les institutions qui doivent informer un large public. Si votre site actuel est lent, difficile à mettre à jour ou peu visible sur les moteurs de recherche, une refonte est souvent la bonne réponse.",
        },
        { h2: 'Ce que vous obtenez' },
        {
          p: "Vous recevez un site déployé et maintenu, une prise en main de l'outil d'administration par vos équipes et un suivi d'audience pour piloter vos contenus. Nous assurons l'hébergement, les mises à jour de sécurité et les évolutions, pour que votre site reste fiable dans la durée.",
        },
      ],
      livrables: [
        'Un site vitrine ou institutionnel en ligne, adapté au mobile',
        "Un outil d'administration et la prise en main par vos équipes",
        'Un référencement naturel technique intégré dès la conception',
        'Une version bilingue français / anglais si votre projet le demande',
        "L'hébergement, la maintenance et les mises à jour de sécurité",
      ],
      faq: [
        {
          q: "Combien coûte la création d'un site web, et en combien de temps est-il livré ?",
          r: "Le budget et le délai dépendent du périmètre : nombre de pages, langues, fonctionnalités et reprise de contenus existants. Nous les cadrons lors d'un premier échange, puis nous vous remettons une proposition détaillée.",
        },
        {
          q: 'Pourrons-nous mettre à jour le site nous-mêmes ?',
          r: "Oui. Chaque site est livré avec un outil d'administration qui permet à vos équipes de publier des pages, des actualités et des médias sans développeur. Nous formons les personnes concernées à sa prise en main.",
        },
        {
          q: 'Que devient notre référencement lors d’une refonte ?',
          r: "Nous recensons les pages existantes et mettons en place des redirections vers les nouvelles adresses, pour préserver la visibilité acquise. La structure, les balises et la performance du nouveau site sont pensées pour le référencement naturel dès la conception.",
        },
      ],
    },
    en: {
      titre: 'Website creation',
      slug: 'website-creation',
      metaTitle: "Website creation in Côte d'Ivoire | BIG FIVE",
      accroche:
        'Corporate and showcase websites, redesigns, French/English versions: fast, accessible sites your teams can update on their own.',
      corps: [
        {
          p: "BIG FIVE designs and builds corporate and showcase websites for companies, brands and organisations in Abidjan, Côte d'Ivoire (Ivory Coast), and across French-speaking Africa. Whether you need a new website or a redesign of an existing one, we deliver a site that loads fast, reads well on mobile, ranks properly and can be updated by your own teams. Our Tech & Solutions Division draws on over 15 years of field experience in digital marketing to connect your website to your business goals, not just to a brand guide.",
        },
        { h2: 'What we build' },
        {
          p: 'We handle the project from start to finish, from content structure to launch. Every site is designed for the people who will actually use it, often on a smartphone and on a connection that is not always stable.',
        },
        {
          ul: [
            'Showcase websites for a brand, a product range or an event',
            'Corporate websites for companies, foundations and organisations',
            'Website redesigns: content migration, new structure, redirects',
            'Bilingual French / English websites, with both versions easy to manage',
            'An admin interface so your team can publish pages, news and media without a developer',
          ],
        },
        { h2: 'How we work' },
        {
          p: 'We start with a conversation about your goals, your audiences and your content. We then define the site map and key pages, design the mock-ups and build the site. Search engine optimisation is part of the design from day one: page structure, tags, readable URLs, sitemap and loading speed. It is not bolted on at the end.',
        },
        {
          p: 'Performance and accessibility get the same attention: readable contrast, keyboard navigation, alternative text and lightweight images. A lean site loads better on mobile networks and stays comfortable for every visitor.',
        },
        { h2: 'Who it is for' },
        {
          p: "We work with marketing and communications teams, with SMEs that want a credible online presence, and with institutions that need to inform a broad public. If you are looking for a web design partner in Côte d'Ivoire that also understands digital strategy, we can help. And if your current site is slow, hard to update or hard to find on search engines, a website redesign is often the right answer.",
        },
        { h2: 'What you get' },
        {
          p: 'You get a website that is live and maintained, a hands-on handover of the admin interface to your team, and audience tracking to guide your content decisions. We take care of hosting, security updates and future improvements, so your site stays reliable over time.',
        },
      ],
      livrables: [
        'A live corporate or showcase website, built for mobile',
        'An admin interface and hands-on training for your team',
        'Technical SEO built in from the design stage',
        'A bilingual French / English version when your project needs it',
        'Hosting, maintenance and security updates',
      ],
      faq: [
        {
          q: 'How much does a website cost, and how long does it take?',
          r: 'Budget and timeline depend on the scope: number of pages, languages, features and existing content to migrate. We define them together in a first conversation, then send you a detailed proposal.',
        },
        {
          q: 'Will we be able to update the site ourselves?',
          r: 'Yes. Every site comes with an admin interface that lets your team publish pages, news and media without a developer. We train the people involved so they are comfortable using it.',
        },
        {
          q: 'What happens to our search rankings during a redesign?',
          r: 'We map your existing pages and set up redirects to the new URLs, so you keep the visibility you have already earned. The structure, tags and performance of the new site are designed for search engines from the start.',
        },
      ],
    },
  },

  // 2. CRM et collecte de données qualifiées
  {
    solution: 'digitales',
    ordre: 2,
    fr: {
      titre: 'CRM et collecte de données qualifiées',
      slug: 'crm-collecte-de-donnees',
      metaTitle: 'CRM et collecte de données à Abidjan | BIG FIVE',
      accroche:
        'Un CRM sur mesure et des outils de collecte pensés pour le terrain : des contacts qualifiés, des données fiables et des tableaux de bord utiles.',
      corps: [
        {
          p: "BIG FIVE conçoit des CRM sur mesure et des dispositifs de collecte de données qualifiées pour les marques et les organisations, à Abidjan et en Afrique francophone. L'objectif est simple : savoir qui sont vos prospects et vos clients, d'où ils viennent et comment les suivre. Nos outils sont adaptés aux réalités du terrain, des stands d'animation aux campagnes en ligne, et non calqués sur des usages pensés ailleurs.",
        },
        { h2: 'Ce que nous réalisons' },
        {
          p: "Beaucoup d'entreprises collectent des contacts, mais peu les exploitent. Les données restent dispersées dans des fichiers, des carnets ou des messageries. Nous construisons l'outil qui les réunit et les rend utiles.",
        },
        {
          ul: [
            'CRM sur mesure, organisé autour de votre cycle de vente et de vos équipes',
            'Formulaires et parcours de collecte pour vos campagnes, sites et réseaux sociaux',
            'Outils de collecte pour les opérations terrain, les événements et les animations',
            'Qualification, déduplication et segmentation des contacts',
            'Gestion du consentement et des préférences de contact',
          ],
        },
        { h2: 'Notre méthode' },
        {
          p: "Nous partons de vos usages, pas d'un logiciel. Un premier atelier permet de comprendre qui collecte, quelles informations comptent vraiment et ce que vous voulez en faire. Nous définissons ensuite un modèle de données clair : peu de champs, mais les bons. L'outil est construit par étapes et testé avec les personnes qui l'utiliseront au quotidien, commerciaux, animateurs ou équipes marketing.",
        },
        {
          p: "La qualité de la donnée se joue au moment de la saisie. Nous prévoyons des contrôles simples, des listes de choix et des règles de vérification pour limiter les doublons et les erreurs. La protection des données personnelles est traitée dès le départ : accès par profil, consentement tracé, conservation maîtrisée.",
        },
        { h2: 'Pour qui' },
        {
          p: "Ce service s'adresse aux directions marketing et commerciales qui veulent mesurer l'effet de leurs actions, aux marques qui mènent des opérations terrain, et aux organisations qui gèrent un grand nombre de contacts. Si vous cherchez un CRM à Abidjan adapté à vos méthodes, ou si vos campagnes génèrent des contacts que personne ne suit, nous pouvons vous aider.",
        },
        { h2: 'Ce que vous obtenez' },
        {
          p: "Vous disposez d'une solution déployée et maintenue, de données exploitables et de tableaux de bord de pilotage. Vos équipes savent où en est chaque contact, et vos décisions s'appuient sur des chiffres issus de votre propre activité.",
        },
      ],
      livrables: [
        'Un CRM sur mesure déployé et maintenu',
        'Des formulaires et outils de collecte en ligne et sur le terrain',
        'Une base de contacts qualifiée, dédupliquée et segmentée',
        'Des tableaux de bord de pilotage commercial et marketing',
        'La prise en main de l’outil par vos équipes',
      ],
      faq: [
        {
          q: 'Pourquoi un CRM sur mesure plutôt qu’un logiciel du marché ?',
          r: "Un logiciel du marché convient quand vos processus correspondent à son modèle. Lorsque vos opérations terrain, vos circuits de vente ou vos contraintes de connexion sortent du cadre, un outil sur mesure évite de contourner le logiciel au quotidien. Nous vous aidons à trancher lors du cadrage.",
        },
        {
          q: 'Pouvez-vous reprendre nos fichiers de contacts existants ?',
          r: "Oui. Nous analysons vos fichiers, nettoyons les doublons et les données incomplètes, puis les importons dans le nouvel outil. Ce travail se cadre selon le volume et l'état des données.",
        },
        {
          q: 'Quel est le budget et le délai pour un projet de CRM ?',
          r: "Ils dépendent du périmètre : nombre d'utilisateurs, sources de collecte, reprise de données et tableaux de bord attendus. Nous les précisons lors d'un premier échange avant de vous remettre une proposition.",
        },
      ],
    },
    en: {
      titre: 'CRM and qualified data collection',
      slug: 'crm-data-collection',
      metaTitle: "CRM and data collection in Côte d'Ivoire | BIG FIVE",
      accroche:
        'A custom CRM and data collection tools built for the field: qualified contacts, reliable data and dashboards your team will actually use.',
      corps: [
        {
          p: "BIG FIVE builds custom CRM systems and qualified data collection tools for brands and organisations in Abidjan, Côte d'Ivoire (Ivory Coast), and across French-speaking Africa. The goal is simple: know who your prospects and customers are, where they come from and how to follow up with them. Our tools are designed for conditions on the ground, from brand activation stands to online campaigns, rather than copied from software built for other markets.",
        },
        { h2: 'What we build' },
        {
          p: 'Many companies collect contacts. Far fewer put them to use. The data sits in spreadsheets, notebooks or messaging apps. We build the tool that brings it together and makes it useful.',
        },
        {
          ul: [
            'A custom CRM organised around your sales cycle and your teams',
            'Forms and data capture flows for your campaigns, website and social media',
            'Collection tools for field operations, events and brand activations',
            'Contact qualification, deduplication and segmentation',
            'Consent and contact preference management',
          ],
        },
        { h2: 'How we work' },
        {
          p: 'We start from how your teams work, not from a piece of software. A first workshop helps us understand who collects the data, which information really matters and what you want to do with it. We then define a clear data model: few fields, but the right ones. The tool is built in stages and tested with the people who will use it every day, whether sales reps, field staff or marketing teams.',
        },
        {
          p: 'Data quality is decided at the point of entry. We add simple checks, drop-down lists and validation rules to limit duplicates and errors. Personal data protection is handled from the outset: role-based access, recorded consent and controlled retention.',
        },
        { h2: 'Who it is for' },
        {
          p: "This service is for marketing and sales teams that want to measure the impact of their actions, for brands running field operations, and for organisations managing large contact bases. If you need a CRM in Côte d'Ivoire that fits the way you work, or if your campaigns generate leads that nobody follows up, we can help.",
        },
        { h2: 'What you get' },
        {
          p: 'You get a solution that is deployed and maintained, data you can act on, and dashboards to steer your activity. Your teams know where each contact stands, and your decisions rest on figures drawn from your own operations.',
        },
      ],
      livrables: [
        'A custom CRM, deployed and maintained',
        'Online and field data collection forms and tools',
        'A qualified, deduplicated and segmented contact base',
        'Sales and marketing dashboards',
        'Hands-on training for your teams',
      ],
      faq: [
        {
          q: 'Why a custom CRM rather than off-the-shelf software?',
          r: 'Off-the-shelf software works well when your processes match its model. When your field operations, sales channels or connectivity constraints fall outside that model, a custom tool saves your team from working around the software every day. We help you make that call during scoping.',
        },
        {
          q: 'Can you migrate our existing contact files?',
          r: 'Yes. We review your files, clean up duplicates and incomplete records, then import them into the new tool. The scope of this work depends on the volume and condition of the data.',
        },
        {
          q: 'What budget and timeline should we expect for a CRM project?',
          r: 'Both depend on the scope: number of users, data sources, data migration and the dashboards you need. We clarify them in a first conversation before sending you a proposal.',
        },
      ],
    },
  },

  // 3. Applications web et mobile
  {
    solution: 'digitales',
    ordre: 3,
    fr: {
      titre: 'Applications web et mobile',
      slug: 'applications-web-et-mobile',
      metaTitle: 'Applications web et mobile à Abidjan | BIG FIVE',
      accroche:
        'Des applications web et mobile sur mesure, conçues pour vos utilisateurs et vos contraintes de terrain, puis déployées et maintenues.',
      corps: [
        {
          p: "BIG FIVE développe des applications web et mobile sur mesure pour les entreprises, les marques et les organisations, à Abidjan et en Afrique francophone. Outil interne pour vos équipes, application destinée à vos clients ou à vos partenaires : nous concevons des applications utiles, simples à prendre en main et adaptées aux conditions réelles d'usage. Notre Pôle Tech & Solutions les déploie et les maintient dans la durée.",
        },
        { h2: 'Ce que nous réalisons' },
        {
          p: "Une application se justifie quand elle remplace une tâche lourde, rend un service à vos clients ou donne à vos équipes une information qu'elles n'avaient pas. Nous travaillons sur des projets de ce type :",
        },
        {
          ul: [
            'Applications métier pour vos équipes commerciales, terrain ou administratives',
            'Applications mobiles destinées à vos clients ou à votre communauté',
            'Espaces clients et portails partenaires accessibles depuis un navigateur',
            "Outils de suivi d'opérations, de demandes ou d'activité",
            'Connexion avec vos outils existants : CRM, site web, fichiers et bases de données',
          ],
        },
        { h2: 'Notre méthode' },
        {
          p: "Nous commençons par les utilisateurs. Qui va se servir de l'application, sur quel appareil, avec quelle connexion et à quel moment de la journée ? Ces réponses orientent tout le reste. Nous cadrons ensuite les fonctions indispensables pour une première version, conçons les écrans et les testons avec de vrais utilisateurs avant de développer.",
        },
        {
          p: "Le développement avance par étapes courtes, avec des versions que vous pouvez essayer régulièrement. Nous prêtons une attention particulière à la légèreté, à la lisibilité sur petit écran et aux usages en connexion instable. La sécurité des accès et la protection des données sont prises en compte dès la conception.",
        },
        { h2: 'Pour qui' },
        {
          p: "Nous accompagnons les directions qui veulent digitaliser un processus, les marques qui souhaitent offrir un service à leurs clients et les organisations qui coordonnent des équipes sur le terrain. Si vous cherchez un partenaire pour le développement d'une application mobile à Abidjan ou d'une application web sur mesure en Côte d'Ivoire, nous partons de votre besoin réel, pas d'une liste de fonctionnalités.",
        },
        { h2: 'Ce que vous obtenez' },
        {
          p: "Vous obtenez une application déployée et maintenue, des données exploitables issues de son utilisation et des tableaux de bord pour suivre l'activité. Nous restons à vos côtés après la mise en ligne pour corriger, améliorer et faire évoluer l'outil avec vos besoins.",
        },
      ],
      livrables: [
        'Une application web ou mobile déployée et maintenue',
        'Des maquettes testées avec vos utilisateurs avant développement',
        'Un espace d’administration pour gérer contenus et utilisateurs',
        'Des tableaux de bord de suivi de l’activité',
        'La documentation et la prise en main par vos équipes',
      ],
      faq: [
        {
          q: 'Faut-il une application mobile ou une application web ?',
          r: "Cela dépend de vos utilisateurs et de leurs usages. Une application web s'ouvre depuis un navigateur sans installation, une application mobile s'installe sur le téléphone et peut offrir des fonctions propres à l'appareil. Nous vous recommandons la formule la plus adaptée lors du cadrage.",
        },
        {
          q: 'Combien coûte une application et quel est le délai ?',
          r: "Le budget et le délai dépendent du périmètre : nombre de fonctions, types d'utilisateurs, connexions à d'autres outils. Nous les cadrons lors d'un premier échange, souvent en commençant par une première version ciblée.",
        },
        {
          q: 'Qui assure la maintenance après la mise en ligne ?',
          r: "Notre Pôle Tech & Solutions assure la maintenance, les correctifs et les évolutions. Nous convenons ensemble du niveau de suivi adapté à l'importance de l'application pour votre activité.",
        },
      ],
    },
    en: {
      titre: 'Web and mobile apps',
      slug: 'web-mobile-apps',
      metaTitle: "Web and mobile apps in Côte d'Ivoire | BIG FIVE",
      accroche:
        'Custom web and mobile apps, designed around your users and real-world constraints, then deployed and maintained by our team.',
      corps: [
        {
          p: "BIG FIVE builds custom web and mobile apps for companies, brands and organisations in Abidjan, Côte d'Ivoire (Ivory Coast), and across French-speaking Africa. An internal tool for your teams or an app for your customers and partners: we design apps that are useful, easy to pick up and suited to the way people actually use them. Our Tech & Solutions Division deploys them and maintains them over time.",
        },
        { h2: 'What we build' },
        {
          p: 'An app earns its place when it replaces a tedious task, gives your customers a real service or puts information in your teams’ hands that they did not have before. Typical projects include:',
        },
        {
          ul: [
            'Business apps for sales, field or back-office teams',
            'Mobile apps for your customers or your community',
            'Customer areas and partner portals that run in a browser',
            'Tools to track operations, requests or activity',
            'Connections to your existing tools: CRM, website, files and databases',
          ],
        },
        { h2: 'How we work' },
        {
          p: 'We start with the users. Who will use the app, on which device, with what kind of connection and at what time of day? Those answers shape everything else. We then agree on the features a first version really needs, design the screens and test them with real users before writing code.',
        },
        {
          p: 'Development moves in short steps, with versions you can try regularly. We pay close attention to lightweight design, readability on small screens and use on unstable connections. Access security and data protection are part of the design from the start.',
        },
        { h2: 'Who it is for' },
        {
          p: "We work with teams that want to digitise a process, brands that want to offer a service to their customers, and organisations coordinating staff in the field. If you are looking for a mobile app development partner in Abidjan, or a custom web application in Côte d'Ivoire, we start from your actual need, not from a feature list.",
        },
        { h2: 'What you get' },
        {
          p: 'You get an app that is deployed and maintained, usable data generated by its everyday use, and dashboards to monitor activity. We stay involved after launch to fix, improve and adapt the tool as your needs change.',
        },
      ],
      livrables: [
        'A web or mobile app, deployed and maintained',
        'Mock-ups tested with your users before development',
        'An admin area to manage content and users',
        'Activity dashboards',
        'Documentation and hands-on training for your team',
      ],
      faq: [
        {
          q: 'Do we need a mobile app or a web app?',
          r: 'It depends on your users and how they will use it. A web app opens in a browser with nothing to install, while a mobile app is installed on the phone and can use features specific to the device. We recommend the best fit during scoping.',
        },
        {
          q: 'How much does an app cost, and how long does it take?',
          r: 'Budget and timeline depend on the scope: number of features, types of users and connections to other tools. We define them in a first conversation, often starting with a focused first version.',
        },
        {
          q: 'Who handles maintenance after launch?',
          r: 'Our Tech & Solutions Division handles maintenance, fixes and new features. Together we agree on the level of support that matches how important the app is to your business.',
        },
      ],
    },
  },

  // 4. Plateformes SaaS et marque blanche
  {
    solution: 'digitales',
    ordre: 4,
    fr: {
      titre: 'Plateformes SaaS et marque blanche',
      slug: 'plateformes-saas-marque-blanche',
      metaTitle: 'Plateformes SaaS et marque blanche à Abidjan | BIG FIVE',
      accroche:
        'Nous concevons des plateformes SaaS et des solutions en marque blanche pour transformer votre savoir-faire en service en ligne.',
      corps: [
        {
          p: "BIG FIVE conçoit des plateformes SaaS et des solutions en marque blanche pour les entreprises et les organisations qui veulent proposer un service en ligne, à Abidjan et en Afrique francophone. Une plateforme SaaS est un logiciel accessible par abonnement depuis un navigateur. Une solution en marque blanche est un outil que vous diffusez sous votre propre nom, auprès de vos clients ou de votre réseau. Dans les deux cas, nous construisons la plateforme, nous l'hébergeons et nous la faisons évoluer.",
        },
        { h2: 'Ce que nous réalisons' },
        {
          p: "Nous connaissons ce type de projet de l'intérieur. Laveiye, la bibliothèque des campagnes publicitaires en Afrique, est une plateforme conçue et propulsée par BIG FIVE. Nous appliquons la même démarche aux plateformes de nos clients :",
        },
        {
          ul: [
            'Plateformes SaaS multi-clients, avec comptes, rôles et espaces séparés',
            'Solutions en marque blanche personnalisables aux couleurs de chaque partenaire',
            "Espaces d'administration pour gérer les clients, les contenus et les accès",
            "Tableaux de bord d'usage et d'activité",
            'Connexions avec vos outils et sources de données existants',
          ],
        },
        { h2: 'Notre méthode' },
        {
          p: "Un projet de plateforme commence par une question : qui paie, pour quel service, et comment le mesure-t-on ? Nous clarifions avec vous le modèle, les profils d'utilisateurs et les fonctions indispensables au lancement. Nous concevons ensuite une première version ciblée, que de vrais utilisateurs peuvent essayer rapidement.",
        },
        {
          p: "Nous accordons une attention particulière à ce qui fait tenir une plateforme dans le temps : séparation des données entre clients, gestion des droits, sécurité des accès, sauvegardes et capacité à accueillir de nouveaux utilisateurs. La plateforme évolue ensuite par versions successives, au rythme de vos retours.",
        },
        { h2: 'Pour qui' },
        {
          p: "Cette offre s'adresse aux entreprises qui veulent transformer un savoir-faire en service en ligne, aux groupes et réseaux qui souhaitent équiper leurs filiales ou partenaires d'un même outil, et aux organisations qui ont besoin d'une plateforme SaaS sur mesure en Côte d'Ivoire plutôt que d'un logiciel générique. Elle convient aussi aux structures qui veulent revendre une solution en marque blanche sous leur propre nom.",
        },
        { h2: 'Ce que vous obtenez' },
        {
          p: "Vous obtenez une solution déployée et maintenue, des données exploitables sur l'usage de la plateforme et des tableaux de bord de pilotage. Nous restons responsables de l'hébergement, de la maintenance et des évolutions, pour que vous vous concentriez sur vos clients.",
        },
      ],
      livrables: [
        'Une plateforme SaaS ou en marque blanche déployée et hébergée',
        'Des espaces clients séparés, avec gestion des comptes et des droits',
        'Un espace d’administration pour piloter clients, contenus et accès',
        'Des tableaux de bord d’usage et d’activité',
        'La maintenance et les évolutions par versions successives',
      ],
      faq: [
        {
          q: 'Quelle différence entre une plateforme SaaS et une solution en marque blanche ?',
          r: "Une plateforme SaaS est un service en ligne que vous proposez sous votre marque, souvent par abonnement. Une solution en marque blanche est un outil que d'autres structures diffusent sous leur propre nom. Une même plateforme peut d'ailleurs combiner les deux usages.",
        },
        {
          q: 'Par où commencer un projet de plateforme ?',
          r: "Par un cadrage du modèle et des utilisateurs, puis par une première version limitée aux fonctions essentielles. Elle permet de vérifier l'intérêt du service avant d'investir dans des fonctions plus avancées.",
        },
        {
          q: 'Quel budget et quel délai prévoir ?',
          r: "Ils dépendent du périmètre : nombre de profils d'utilisateurs, niveau de personnalisation, connexions à d'autres outils. Nous les précisons lors d'un premier échange avant de vous remettre une proposition.",
        },
      ],
    },
    en: {
      titre: 'SaaS and white-label platforms',
      slug: 'saas-white-label-platforms',
      metaTitle: "SaaS and white-label platforms in Côte d'Ivoire | BIG FIVE",
      accroche:
        'We design SaaS platforms and white-label solutions that turn your expertise into an online service, then host and maintain them.',
      corps: [
        {
          p: "BIG FIVE designs SaaS platforms and white-label solutions for companies and organisations that want to offer a service online, in Abidjan, Côte d'Ivoire (Ivory Coast), and across French-speaking Africa. A SaaS platform is software people access through a browser, usually on a subscription. A white-label solution is a tool you distribute under your own name to your customers or your network. In both cases, we build the platform, host it and keep it evolving.",
        },
        { h2: 'What we build' },
        {
          p: 'We know this kind of project from the inside. Laveiye, the library of advertising campaigns in Africa, is a platform designed and powered by BIG FIVE. We bring the same approach to our clients’ platforms:',
        },
        {
          ul: [
            'Multi-tenant SaaS platforms with separate accounts, roles and workspaces',
            'White-label solutions that each partner can brand as their own',
            'Admin areas to manage customers, content and access',
            'Usage and activity dashboards',
            'Connections to your existing tools and data sources',
          ],
        },
        { h2: 'How we work' },
        {
          p: 'A platform project starts with one question: who pays, for which service, and how do we measure it? We work with you to clarify the model, the user profiles and the features you need at launch. We then design a focused first version that real users can try early.',
        },
        {
          p: 'We pay close attention to what keeps a platform standing over time: data separation between customers, permissions, access security, backups and the ability to welcome new users. The platform then grows release by release, guided by your feedback.',
        },
        { h2: 'Who it is for' },
        {
          p: "This offer suits companies that want to turn their know-how into an online service, groups and networks that want to equip subsidiaries or partners with a shared tool, and organisations that need a custom SaaS platform in Côte d'Ivoire rather than generic software. It also fits businesses that want to resell a white-label solution under their own name.",
        },
        { h2: 'What you get' },
        {
          p: 'You get a solution that is deployed and maintained, usable data on how the platform is used, and dashboards to steer it. We remain responsible for hosting, maintenance and new features, so you can focus on your customers.',
        },
      ],
      livrables: [
        'A SaaS or white-label platform, deployed and hosted',
        'Separate customer workspaces with account and permission management',
        'An admin area to manage customers, content and access',
        'Usage and activity dashboards',
        'Ongoing maintenance and incremental releases',
      ],
      faq: [
        {
          q: 'What is the difference between a SaaS platform and a white-label solution?',
          r: 'A SaaS platform is an online service you offer under your own brand, often on a subscription. A white-label solution is a tool that other organisations distribute under their own name. A single platform can combine both models.',
        },
        {
          q: 'Where should a platform project start?',
          r: 'With a clear definition of the model and the users, followed by a first version limited to the essential features. That version lets you test demand for the service before investing in more advanced features.',
        },
        {
          q: 'What budget and timeline should we plan for?',
          r: 'Both depend on the scope: number of user profiles, level of customisation and connections to other tools. We clarify them in a first conversation before sending you a proposal.',
        },
      ],
    },
  },

  // 5. IA appliquée
  {
    solution: 'digitales',
    ordre: 5,
    fr: {
      titre: 'IA appliquée',
      slug: 'ia-appliquee',
      metaTitle: 'IA appliquée aux entreprises à Abidjan | BIG FIVE',
      accroche:
        "Automatiser des tâches, analyser textes et conversations, outiller vos équipes : une intelligence artificielle concrète et encadrée.",
      corps: [
        {
          p: "BIG FIVE intègre l'intelligence artificielle dans les outils des entreprises et des organisations, à Abidjan et en Afrique francophone, pour des usages précis et mesurables. Nous ne vendons pas l'IA comme une promesse générale. Nous partons d'une tâche réelle, chronophage ou répétitive, et nous vérifions si l'IA peut la rendre plus simple, plus rapide ou plus fiable. C'est le sens de notre promesse : la technologie par la preuve.",
        },
        { h2: 'Ce que nous réalisons' },
        {
          p: "L'IA appliquée prend tout son intérêt sur des tâches bien délimitées, avec un contrôle humain là où il compte. Nous travaillons notamment sur :",
        },
        {
          ul: [
            "Automatisation de tâches répétitives : tri, classement, extraction d'informations dans des documents",
            'Analyse de textes et de conversations : commentaires, avis, messages clients, retours terrain',
            'Assistants internes qui aident vos équipes à retrouver une information dans vos propres documents',
            'Aide à la rédaction et à la synthèse, toujours relue par vos équipes',
            "Intégration de ces fonctions dans vos outils existants : CRM, applications, plateformes",
          ],
        },
        { h2: 'Notre méthode' },
        {
          p: "Nous commençons par identifier, avec vous, les tâches où l'IA peut réellement aider. Nous réalisons ensuite un essai limité sur vos propres données, pour juger sur pièces de la qualité des résultats. Si l'essai est concluant, nous intégrons la fonction dans vos outils, avec des règles claires sur ce que l'IA fait seule et ce qui reste validé par une personne.",
        },
        {
          p: "La protection des données est au cœur de chaque projet. Nous définissons quelles données peuvent être traitées, par quel service et dans quelles conditions. Nous limitons les accès, évitons d'exposer des informations sensibles et choisissons les outils en fonction du niveau de confidentialité requis. Vos données restent les vôtres.",
        },
        { h2: 'Pour qui' },
        {
          p: "Cette offre s'adresse aux directions qui veulent utiliser l'intelligence artificielle en entreprise en Côte d'Ivoire sans se perdre dans les annonces, aux équipes marketing et relation client qui traitent de gros volumes de messages, et aux organisations qui veulent mieux exploiter leurs documents internes. Elle prolonge naturellement notre travail de veille et d'écoute social media.",
        },
        { h2: 'Ce que vous obtenez' },
        {
          p: "Vous obtenez une solution déployée et maintenue, des données exploitables et des tableaux de bord pour suivre ce que l'IA traite et avec quelle qualité. Vos équipes gardent la main et savent ce que l'outil fait, et ce qu'il ne fait pas.",
        },
      ],
      livrables: [
        'Un cadrage des usages où l’IA apporte un gain réel',
        'Un essai sur vos propres données avant tout déploiement',
        'Une fonction d’IA intégrée à vos outils, déployée et maintenue',
        'Des règles de protection des données et de validation humaine',
        'Des tableaux de bord de suivi des traitements',
      ],
      faq: [
        {
          q: 'Nos données sont-elles protégées ?',
          r: "Oui, c'est un point que nous cadrons avant tout développement. Nous définissons quelles données sont traitées, par quel service et avec quels accès, et nous adaptons le choix des outils au niveau de confidentialité requis. Les informations sensibles ne sont pas exposées sans votre accord.",
        },
        {
          q: "L'IA va-t-elle remplacer nos équipes ?",
          r: "Notre approche vise à libérer vos équipes des tâches répétitives, pas à les remplacer. Les décisions importantes restent validées par une personne. L'outil prépare, trie ou résume, et vos équipes gardent la main.",
        },
        {
          q: 'Quel budget et quel délai pour un projet d’IA ?',
          r: "Ils dépendent de la tâche visée, du volume de données et des outils à connecter. Nous les cadrons lors d'un premier échange, en commençant souvent par un essai limité sur vos propres données.",
        },
      ],
    },
    en: {
      titre: 'Applied AI',
      slug: 'applied-ai',
      metaTitle: "Applied AI for businesses in Côte d'Ivoire | BIG FIVE",
      accroche:
        'Automate tasks, analyse text and conversations, support your teams: practical artificial intelligence, with your data kept under control.',
      corps: [
        {
          p: "BIG FIVE brings artificial intelligence into the tools of companies and organisations in Abidjan, Côte d'Ivoire (Ivory Coast), and across French-speaking Africa, for specific uses you can measure. We do not sell AI as a broad promise. We start from a real task that is time-consuming or repetitive, and we check whether AI can make it simpler, faster or more reliable. That is what our promise means: technology, proven.",
        },
        { h2: 'What we build' },
        {
          p: 'Applied AI is most useful on well-defined tasks, with human review where it matters. Our work includes:',
        },
        {
          ul: [
            'Automating repetitive tasks: sorting, classifying and extracting information from documents',
            'Analysing text and conversations: comments, reviews, customer messages and field reports',
            'Internal assistants that help your teams find information in your own documents',
            'Drafting and summarising support, always reviewed by your teams',
            'Building these features into your existing tools: CRM, apps and platforms',
          ],
        },
        { h2: 'How we work' },
        {
          p: 'We first identify, with you, the tasks where AI can genuinely help. We then run a limited trial on your own data, so the quality of the results can be judged on evidence. If the trial is conclusive, we build the feature into your tools, with clear rules on what the AI does on its own and what a person still approves.',
        },
        {
          p: 'Data protection is central to every project. We define which data can be processed, by which service and under which conditions. We restrict access, avoid exposing sensitive information and choose tools according to the level of confidentiality required. Your data stays yours.',
        },
        { h2: 'Who it is for' },
        {
          p: "This offer is for leadership teams that want to use AI for business in Côte d'Ivoire without getting lost in the hype, for marketing and customer service teams handling large volumes of messages, and for organisations that want to make better use of their internal documents. It follows on naturally from our monitoring and social media listening work.",
        },
        { h2: 'What you get' },
        {
          p: 'You get a solution that is deployed and maintained, data you can act on, and dashboards showing what the AI processes and how well. Your teams stay in control and know what the tool does, and what it does not.',
        },
      ],
      livrables: [
        'A scoping of the use cases where AI brings a real gain',
        'A trial on your own data before any rollout',
        'An AI feature built into your tools, deployed and maintained',
        'Data protection and human review rules',
        'Dashboards to monitor processing',
      ],
      faq: [
        {
          q: 'Is our data protected?',
          r: 'Yes, and we settle this before any development. We define which data is processed, by which service and with which access rights, and we choose tools according to the level of confidentiality required. Sensitive information is not exposed without your agreement.',
        },
        {
          q: 'Will AI replace our teams?',
          r: 'Our approach aims to free your teams from repetitive tasks, not to replace them. Important decisions are still approved by a person. The tool prepares, sorts or summarises, and your teams stay in charge.',
        },
        {
          q: 'What budget and timeline should we expect for an AI project?',
          r: 'Both depend on the task, the volume of data and the tools to connect. We define them in a first conversation, often starting with a limited trial on your own data.',
        },
      ],
    },
  },
]
