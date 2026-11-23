// Données de départ du seed (extraites de la maquette). Le site lit Payload : modifier le contenu dans l'admin.
import type { Locale } from '@/i18n/dictionaries'

type L<T> = Record<Locale, T>

export type SolutionKey = 'veille' | 'conseil' | 'academy' | 'digitales'

export type Solution = {
  key: SolutionKey
  img: string
  imgPos: string
  pole: L<string>
} & L<{
  name: string
  step: string
  heroSub: string
  tag: string
  promise: string
  does: string[]
  gets: string[]
  lead: string
}>

export const SOLUTIONS: Solution[] = [
  {
    key: 'veille',
    img: '/images/sol-veille-flip.jpg',
    imgPos: '42% center',
    pole: {
      fr: 'Pôle Intelligence & Conseil',
      en: 'Intelligence & Consulting Division',
    },
    fr: {
      name: 'Veille & Intelligence',
      step: 'Collecter · Décrypter',
      heroSub: 'Audit, écoute social media, veille concurrentielle',
      tag: 'Comprendre avant les autres.',
      promise:
        'Transformez le bruit médiatique en signaux faibles exploitables. Comprendre avant les autres.',
      does: [
        'Audit de présence digitale et de réputation',
        'Écoute social media (social listening)',
        'Veille concurrentielle multi-acteurs',
        'Détection des tendances et signaux faibles',
      ],
      gets: [
        'Tableaux de bord de veille',
        "Rapports d'analyse périodiques",
        'Alertes et recommandations',
      ],
      lead: 'Cossi, Lead Études & Veille',
    },
    en: {
      name: 'Monitoring & Intelligence',
      step: 'Collect · Decode',
      heroSub: 'Audit, social media listening, competitive intelligence',
      tag: 'Understand before others do.',
      promise: 'Turn media noise into actionable weak signals. Understand before others do.',
      does: [
        'Digital presence and reputation audit',
        'Social media listening',
        'Multi-player competitive intelligence',
        'Trend and weak-signal detection',
      ],
      gets: ['Monitoring dashboards', 'Periodic analysis reports', 'Alerts and recommendations'],
      lead: 'Cossi, Research & Monitoring Lead',
    },
  },
  {
    key: 'conseil',
    img: '/images/sol-conseil-hd.jpg',
    imgPos: '40% center',
    pole: {
      fr: 'Pôle Intelligence & Conseil',
      en: 'Intelligence & Consulting Division',
    },
    fr: {
      name: 'Conseil & Stratégie',
      step: 'Analyser',
      heroSub: 'Conseil stratégique, accompagnement, feuilles de route',
      tag: 'Aligner votre image sur votre réalité business.',
      promise:
        'Audit de positionnement et feuilles de route pour aligner votre image sur votre réalité business.',
      does: [
        'Audit de positionnement',
        'Stratégie marketing et digitale',
        'Feuilles de route opérationnelles',
        'Accompagnement à la mise en œuvre',
      ],
      gets: ['Diagnostic partagé', "Plan d'action priorisé", 'Indicateurs de pilotage (KPI)'],
      lead: 'Yannick Boka, Directeur Exécutif & Directeur du pôle',
    },
    en: {
      name: 'Consulting & Strategy',
      step: 'Analyze',
      heroSub: 'Strategic consulting, support, roadmaps',
      tag: 'Align your image with your business reality.',
      promise: 'Positioning audits and roadmaps to align your image with your business reality.',
      does: [
        'Positioning audit',
        'Marketing and digital strategy',
        'Operational roadmaps',
        'Implementation support',
      ],
      gets: ['A shared diagnosis', 'A prioritized action plan', 'Performance indicators (KPIs)'],
      lead: 'Yannick Boka, Executive Director & Head of Division',
    },
  },
  {
    key: 'academy',
    img: '/images/sol-academy-hd.jpg',
    imgPos: '55% center',
    pole: {
      fr: 'Pôle Intelligence & Conseil',
      en: 'Intelligence & Consulting Division',
    },
    fr: {
      name: 'Big Five Academy',
      step: 'Activer vos équipes',
      heroSub: 'Formation, renforcement des capacités, transfert de compétences',
      tag: 'Rendre vos équipes autonomes.',
      promise:
        "Renforcement de capacité et transfert de compétences pour l'autonomie de vos équipes.",
      does: [
        'Formations social media et marketing digital',
        'Ateliers sur mesure pour vos équipes',
        'Coaching des équipes marketing',
        'Programmes en ligne (E-Masterclass)',
      ],
      gets: ['Des équipes autonomes', 'Supports et outils réutilisables', 'Évaluation des acquis'],
      lead: 'Yannick Boka, Directeur du pôle',
    },
    en: {
      name: 'Big Five Academy',
      step: 'Activate your teams',
      heroSub: 'Training, capacity building, skills transfer',
      tag: 'Make your teams self-sufficient.',
      promise: 'Capacity building and skills transfer so your teams can work autonomously.',
      does: [
        'Social media and digital marketing training',
        'Tailored workshops for your teams',
        'Marketing team coaching',
        'Online programs (E-Masterclass)',
      ],
      gets: ['Self-sufficient teams', 'Reusable materials and tools', 'Learning assessment'],
      lead: 'Yannick Boka, Head of Division',
    },
  },
  {
    key: 'digitales',
    img: '/images/sol-digitales-hd.jpg',
    imgPos: '48% center',
    pole: {
      fr: 'Pôle Tech & Solutions',
      en: 'Tech & Solutions Division',
    },
    fr: {
      name: 'Solutions Digitales',
      step: 'Activer vos outils',
      heroSub: 'Sites web, CRM, plateformes SaaS : des outils adaptés au terrain',
      tag: 'Du CRM à la plateforme SaaS.',
      promise: 'Développement sur-mesure et IA appliquée. La technologie par la preuve.',
      does: [
        'CRM et collecte de données qualifiées',
        'Applications web et mobile',
        'Plateformes SaaS et marque blanche',
        'IA appliquée',
      ],
      gets: [
        'Une solution déployée et maintenue',
        'Des données exploitables',
        'Des tableaux de bord de pilotage',
      ],
      lead: 'Jean-Luc Houedanou, Directeur des Solutions digitales',
    },
    en: {
      name: 'Digital Solutions',
      step: 'Activate your tools',
      heroSub: 'Websites, CRM, SaaS platforms: tools built for the field',
      tag: 'From CRM to SaaS platform.',
      promise: 'Custom development and applied AI. Technology, proven.',
      does: [
        'CRM and qualified data collection',
        'Web and mobile apps',
        'SaaS and white-label platforms',
        'Applied AI',
      ],
      gets: ['A deployed, maintained solution', 'Actionable data', 'Performance dashboards'],
      lead: 'Jean-Luc Houedanou, Director of Digital Solutions',
    },
  },
]

export const POLES = [
  {
    pole: {
      fr: 'Pôle Intelligence & Conseil',
      en: 'Intelligence & Consulting Division',
    },
    lead: 'Yannick Boka',
    fr: {
      step: 'Collecter · Décrypter · Analyser',
      promise: 'Comprendre le marché et orienter vos décisions.',
      items: [
        'Audit et écoute social media',
        'Veille concurrentielle',
        'Conseil stratégique',
        'Formation – Big Five Academy',
      ],
      role: 'Directeur Exécutif & Directeur du pôle',
    },
    en: {
      step: 'Collect · Decode · Analyze',
      promise: 'Understand the market and guide your decisions.',
      items: [
        'Social media audit and listening',
        'Competitive intelligence',
        'Strategic consulting',
        'Training – Big Five Academy',
      ],
      role: 'Executive Director & Head of Division',
    },
  },
  {
    pole: {
      fr: 'Pôle Tech & Solutions',
      en: 'Tech & Solutions Division',
    },
    lead: 'Jean-Luc Houedanou',
    fr: {
      step: 'Activer',
      promise: 'Concevoir les outils qui activent votre stratégie.',
      items: [
        'Création de sites web',
        'CRM et collecte de données',
        'Applications web et mobile',
        'Plateformes SaaS',
        'IA appliquée',
      ],
      role: 'Directeur des Solutions digitales',
    },
    en: {
      step: 'Activate',
      promise: 'Build the tools that activate your strategy.',
      items: [
        'Website creation',
        'CRM and data collection',
        'Web and mobile apps',
        'SaaS platforms',
        'Applied AI',
      ],
      role: 'Director of Digital Solutions',
    },
  },
]

export const CLIENTS: { name: string; logo: string }[] = [
  {
    name: 'AIN',
    logo: '/images/clients/AIN.png',
  },
  {
    name: 'Avegott',
    logo: '/images/clients/AVEGOTT.png',
  },
  {
    name: 'BGI',
    logo: '/images/clients/BGI.png',
  },
  {
    name: 'Bracongo',
    logo: '/images/clients/BRACONGO.png',
  },
  {
    name: 'Bralico',
    logo: '/images/clients/BRALICO.png',
  },
  {
    name: 'Bramali',
    logo: '/images/clients/BRAMALI.png',
  },
  {
    name: 'Brasimba',
    logo: '/images/clients/BRASIMBA.png',
  },
  {
    name: 'Canal+',
    logo: '/images/clients/CANALPLUS.png',
  },
  {
    name: 'Groupe Castel',
    logo: '/images/clients/CASTEL.png',
  },
  {
    name: 'Castel Angola',
    logo: '/images/clients/CASTEL_ANGOLA.png',
  },
  {
    name: 'Castel Malawi',
    logo: '/images/clients/CASTEL_MALAWI.png',
  },
  {
    name: 'Cémoi',
    logo: '/images/clients/CEMOI.png',
  },
  {
    name: 'CFAO Mobility',
    logo: '/images/clients/CFAO_MOBILITY.png',
  },
  {
    name: 'Ciprel',
    logo: '/images/clients/CIPREL.png',
  },
  {
    name: 'Eat is Family',
    logo: '/images/clients/EAT_IS_FAMILY.png',
  },
  {
    name: 'FeexPay',
    logo: '/images/clients/FEEXPAY.png',
  },
  {
    name: 'FrieslandCampina',
    logo: '/images/clients/FRIESLANDCAMPINA.png',
  },
  {
    name: 'iCube',
    logo: '/images/clients/ICUBE.png',
  },
  {
    name: 'Koura',
    logo: '/images/clients/KOURA.png',
  },
  {
    name: 'SABC',
    logo: '/images/clients/SABC.png',
  },
  {
    name: 'Sania',
    logo: '/images/clients/SANIA.png',
  },
  {
    name: 'Sobebra',
    logo: '/images/clients/SOBEBRA.png',
  },
  {
    name: 'Soboa',
    logo: '/images/clients/SOBOA.png',
  },
  {
    name: 'Sobraga',
    logo: '/images/clients/SOBRAGA.png',
  },
  {
    name: 'Sobragui',
    logo: '/images/clients/SOBRAGUI.png',
  },
  {
    name: 'Soeguibe',
    logo: '/images/clients/SOEGUIBE.png',
  },
  {
    name: 'Solibra',
    logo: '/images/clients/SOLIBRA.png',
  },
  {
    name: 'Star Madagascar',
    logo: '/images/clients/STAR_MADAGASCAR.png',
  },
  {
    name: 'Sunu',
    logo: '/images/clients/SUNU.png',
  },
  {
    name: 'Zerunorth',
    logo: '/images/clients/ZERUNORTH.png',
  },
]

export const SECTIONS: ({ id: string } & L<string>)[] = [
  {
    id: 'accueil',
    fr: 'Accueil',
    en: 'Home',
  },
  {
    id: 'agence',
    fr: 'Le Cabinet',
    en: 'The Firm',
  },
  {
    id: 'solutions',
    fr: 'Nos solutions',
    en: 'Our solutions',
  },
  {
    id: 'observatoire',
    fr: 'Observatoire',
    en: 'Observatory',
  },
  {
    id: 'references',
    fr: 'Références',
    en: 'References',
  },
]

export const NAV = ['agence', 'solutions', 'observatoire', 'references'] as const

export const HERO_COVERS = ['/images/cover-1.jpg', '/images/cover-2.jpg', '/images/cover-3.jpg']

export const PRIVACY: L<{ title: string; body: string[] }>[] = [
  {
    fr: {
      title: 'Données collectées',
      body: [
        'Nous collectons des données personnelles uniquement lorsque vous nous les transmettez volontairement via les formulaires du site.',
        "Formulaire de contact : nom complet, adresse e-mail professionnelle, entreprise, téléphone / WhatsApp, fonction et, de manière facultative, secteur d'activité, ainsi que l'accompagnement qui vous intéresse et la description de votre besoin.",
        'Formulaire « Obtenir le baromètre » : nom complet, adresse e-mail professionnelle, entreprise, poste et, de manière facultative, téléphone, ainsi que le baromètre demandé.',
        "Commande d'une étude sur mesure : les mêmes données que le formulaire de contact.",
        'Notification des prochaines parutions (bouton « Me notifier » ou case à cocher dans un formulaire) : votre adresse e-mail.',
      ],
    },
    en: {
      title: 'Data we collect',
      body: [
        'We only collect personal data that you voluntarily provide through the forms on this website.',
        'Contact form: full name, work email, company, phone / WhatsApp, job title and, optionally, industry, as well as the service you are interested in and a description of your need.',
        '"Get the barometer" form: full name, work email, company, job title and, optionally, phone, as well as the barometer requested.',
        'Custom study order: the same data as the contact form.',
        'Notification of upcoming releases ("Notify me" button or checkbox in a form): your email address.',
      ],
    },
  },
  {
    fr: {
      title: 'Finalités du traitement',
      body: [
        "Vos données sont utilisées exclusivement pour : répondre à votre demande et vous orienter vers l'accompagnement adapté ; vous recontacter pour vous présenter un baromètre et ses conditions d'accès, ou établir un devis d'étude sur mesure ; assurer le suivi de nos échanges commerciaux ; vous informer par e-mail de la parution de nos prochains baromètres, si vous l'avez demandé.",
        'Elles ne sont en aucun cas cédées, louées ou vendues à des tiers.',
      ],
    },
    en: {
      title: 'Purposes of processing',
      body: [
        'Your data is used exclusively to: respond to your request and point you to the right service; get back to you to present a barometer and its access terms, or to quote a custom study; follow up on our business exchanges; notify you by email when our next barometers are released, if you asked us to.',
        'It is never transferred, rented or sold to third parties.',
      ],
    },
  },
  {
    fr: {
      title: 'Base légale et consentement',
      body: [
        "La collecte repose sur votre consentement explicite, exprimé lors de l'envoi d'un formulaire. Vous pouvez retirer ce consentement à tout moment, notamment via le lien de désinscription présent dans chaque e-mail de notification.",
      ],
    },
    en: {
      title: 'Legal basis and consent',
      body: [
        'Collection is based on your explicit consent, given when you submit a form. You may withdraw this consent at any time, in particular via the unsubscribe link included in every notification email.',
      ],
    },
  },
  {
    fr: {
      title: 'Destinataires des données',
      body: [
        "Vos données sont transmises à la boîte de réception de BIG FIVE et destinées aux seules équipes en charge de votre demande (équipe commerciale et pôle concerné). Elles peuvent être hébergées ou traitées par des prestataires techniques (hébergement du site, outil d'envoi d'e-mails, tableur de suivi) agissant pour notre compte et tenus à la confidentialité.",
        "Aucun paiement n'est effectué sur ce site. Le site Laveiye, accessible par un lien, dispose de sa propre politique de confidentialité.",
      ],
    },
    en: {
      title: 'Who receives your data',
      body: [
        'Your data is sent to the BIG FIVE inbox and intended solely for the teams handling your request (sales team and relevant division). It may be hosted or processed by technical service providers (website hosting, email delivery tool, tracking spreadsheet) acting on our behalf and bound by confidentiality.',
        'No payment is made on this website. The Laveiye website, accessible via a link, has its own privacy policy.',
      ],
    },
  },
  {
    fr: {
      title: 'Durée de conservation',
      body: [
        "Les données issues des formulaires de contact, de demande de baromètre et de commande d'étude sont conservées au maximum 3 ans à compter de notre dernier échange. Votre adresse e-mail de notification est conservée jusqu'à votre désinscription. Au-delà, les données sont supprimées ou anonymisées.",
      ],
    },
    en: {
      title: 'Retention period',
      body: [
        'Data from the contact, barometer request and custom study forms is kept for a maximum of 3 years from our last exchange. Your notification email address is kept until you unsubscribe. After that, data is deleted or anonymized.',
      ],
    },
  },
  {
    fr: {
      title: 'Vos droits',
      body: [
        "Conformément à la réglementation en vigueur, vous disposez d'un droit d'accès, de rectification, d'opposition, de suppression et de portabilité de vos données. Pour les exercer, écrivez-nous à contact@bigfiveabidjan.com ; nous vous répondons dans les meilleurs délais.",
        "Vous pouvez également adresser une réclamation à l'ARTCI (Autorité de Régulation des Télécommunications/TIC de Côte d'Ivoire), autorité de protection des données personnelles.",
      ],
    },
    en: {
      title: 'Your rights',
      body: [
        'In accordance with applicable regulations, you have the right to access, rectify, object to, delete and port your data. To exercise these rights, write to us at contact@bigfiveabidjan.com; we will respond as promptly as possible.',
        "You may also lodge a complaint with ARTCI (Autorité de Régulation des Télécommunications/TIC de Côte d'Ivoire), the personal data protection authority.",
      ],
    },
  },
  {
    fr: {
      title: 'Sécurité des données',
      body: [
        'BIG FIVE met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction. Les échanges avec le site sont chiffrés via le protocole HTTPS.',
      ],
    },
    en: {
      title: 'Data security',
      body: [
        'BIG FIVE implements appropriate technical and organizational measures to protect your data against unauthorized access, alteration, disclosure or destruction. Communications with the website are encrypted via HTTPS.',
      ],
    },
  },
  {
    fr: {
      title: 'Cookies',
      body: [
        "Ce site utilise uniquement des cookies et un stockage local techniques, nécessaires à son bon fonctionnement (par exemple la mémorisation de la langue choisie). Aucun cookie publicitaire ou de pistage n'est utilisé. Vous pouvez configurer votre navigateur pour les refuser.",
      ],
    },
    en: {
      title: 'Cookies',
      body: [
        'This website only uses technical cookies and local storage needed for it to work properly (for example, remembering your chosen language). No advertising or tracking cookies are used. You can set your browser to refuse them.',
      ],
    },
  },
]

export const SOCIALS = [
  { label: 'LinkedIn', court: 'in', url: 'https://www.linkedin.com/company/big-five-solutions/' },
  { label: 'Facebook', court: 'f', url: 'https://www.facebook.com/agencebigfive/' },
  {
    label: 'YouTube',
    court: 'yt',
    url: 'https://www.youtube.com/channel/UCKe6vzOcThB8uzmwZhjK4QQ',
  },
]

// Title et description repris du site actuel bigfive.solutions (relevés le 12/10/2026).
export const HOME_META = {
  fr: {
    titre: 'BIG FIVE | Cabinet de conseil en marketing digital à Abidjan',
    description:
      'Big Five : agence de conseil en marketing stratégique, digital et solutions digitales sur-mesure. Abidjan, Paris, Cape Town. Nous transformons votre ambition en performance durable.',
  },
  en: {
    titre: 'BIG FIVE | Digital marketing consultancy in Abidjan',
    description:
      'Big Five: strategic and digital marketing consultancy and tailor-made digital solutions. Abidjan, Paris, Cape Town. We turn your ambition into lasting performance.',
  },
}

export const SOLUTION_SLUGS: Record<SolutionKey, L<string>> = {
  veille: { fr: 'veille-intelligence', en: 'monitoring-intelligence' },
  conseil: { fr: 'conseil-strategie', en: 'consulting-strategy' },
  academy: { fr: 'big-five-academy', en: 'big-five-academy' },
  digitales: { fr: 'solutions-digitales', en: 'digital-solutions' },
}

// Titres pour Google des pages /solutions/<adresse> (60 caractères maximum).
export const SOLUTION_META_TITLES: Record<SolutionKey, L<string>> = {
  veille: {
    fr: 'Veille & Intelligence à Abidjan | BIG FIVE',
    en: "Monitoring & Intelligence in Côte d'Ivoire | BIG FIVE",
  },
  conseil: {
    fr: 'Conseil & Stratégie à Abidjan | BIG FIVE',
    en: "Consulting & Strategy in Côte d'Ivoire | BIG FIVE",
  },
  academy: {
    fr: 'Big Five Academy : formations à Abidjan | BIG FIVE',
    en: "Big Five Academy: training in Côte d'Ivoire | BIG FIVE",
  },
  digitales: {
    fr: 'Solutions Digitales à Abidjan | BIG FIVE',
    en: "Digital Solutions in Côte d'Ivoire | BIG FIVE",
  },
}
