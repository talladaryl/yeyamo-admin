import {
  ArrowRight,
  Bell,
  BookOpen,
  Compass,
  EyeOff,
  Flag,
  Heart,
  Landmark,
  KeyRound,
  LayoutDashboard,
  LogOut,
  MapPin,
  MessageSquareQuote,
  MoonStar,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  SquareArrowOutUpRight,
  Store,
  Users
} from "lucide-react";
import type {
  AppFeature,
  Destination,
  FaqItem,
  FeatureCard,
  InfoCard,
  NavItem,
  Stat,
  Testimonial
} from "./types";

export const navItems: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Fonctionnalités", href: "/fonctionnalites" },
  { label: "Solutions", href: "/solutions" },
  { label: "Rôles", href: "/profils" },
  { label: "Destinations", href: "/destinations" },
  { label: "Communauté", href: "/communaute" },
  { label: "Sécurité", href: "/securite" },
  { label: "Application", href: "/application" },
  { label: "À propos", href: "/a-propos" },
  { label: "FAQ", href: "/faq" },
  { label: "Télécharger", href: "/telechargement" },
  { label: "Documentation", href: "/documentation" },
  { label: "Politique de confidentialité", href: "/confidentialite" }
];

export const heroBenefits = [
  { title: "Accès sécurisé", text: "Données protégées et permissions claires", icon: ShieldCheck },
  { title: "Lieux sélectionnés", text: "Recommandations utiles et crédibles", icon: MapPin },
  { title: "Communauté vivante", text: "Échanges, contributions et retours", icon: Users },
  { title: "Expérience fluide", text: "Navigation claire et immersive", icon: Sparkles }
] as const;

export const featureCards: FeatureCard[] = [
  {
    title: "Découverte personnalisée",
    description: "Des itinéraires et lieux adaptés à chaque envie, chaque saison et chaque profil.",
    icon: Compass
  },
  {
    title: "Culture et patrimoine",
    description: "Mise en avant des savoir-faire, des traditions et des expériences emblématiques.",
    icon: Landmark
  },
  {
    title: "Communauté locale",
    description: "Des recommandations vivantes, pensées avec et pour les acteurs du terrain.",
    icon: Users
  },
  {
    title: "Expériences authentiques",
    description: "Des moments concrets, utiles et mémorables qui donnent envie de revenir.",
    icon: Sparkles
  }
];

export const solutionItems = [
  { title: "Explorer", description: "Carte, filtres et accès rapide aux lieux remarquables.", icon: LayoutDashboard },
  { title: "Partager", description: "Avis, récits et médias pour enrichir la communauté.", icon: Heart },
  { title: "Découvrir", description: "Suggestions ciblées et parcours inspirants.", icon: Compass },
  { title: "Participer", description: "Engagement local, événements et contribution terrain.", icon: Users }
] as const;

export const rolesCards: InfoCard[] = [
  {
    title: "Voyageur",
    description: "Explore, sauvegarde ses lieux favoris et prépare ses parcours en quelques gestes.",
    icon: Compass
  },
  {
    title: "Créateur de contenu",
    description: "Publie des récits, photos et conseils pour faire vivre les découvertes locales.",
    icon: Heart
  },
  {
    title: "Partenaire local",
    description: "Met à jour ses informations, ses offres et ses disponibilités en toute simplicité.",
    icon: Store
  },
  {
    title: "Admin communauté",
    description: "Modère, valide les contenus et garde un cadre clair pour chaque membre.",
    icon: Users
  }
];

export const securityCards: InfoCard[] = [
  {
    title: "Données protégées",
    description: "Les informations sensibles restent encadrées par des accès limités et des protections adaptées.",
    icon: ShieldCheck
  },
  {
    title: "Paiements fiables",
    description: "Les parcours de paiement sont pensés pour réduire les frictions et sécuriser les transactions.",
    icon: Landmark
  },
  {
    title: "Authentification claire",
    description: "Connexion, gestion de session et permissions sont organisées pour garder le contrôle.",
    icon: LayoutDashboard
  },
  {
    title: "Traçabilité discrète",
    description: "Les actions importantes sont suivies pour soutenir la confiance et la modération.",
    icon: MoonStar
  },
  {
    title: "Protection du compte",
    description: "Choisissez un mot de passe unique et ne partagez jamais vos identifiants ni vos codes de connexion.",
    icon: KeyRound,
    href: "/documentation#account"
  },
  {
    title: "Localisation maîtrisée",
    description: "Vérifiez les autorisations de localisation de votre appareil et adaptez-les aux fonctionnalités que vous utilisez.",
    icon: MapPin,
    href: "/confidentialite#location"
  },
  {
    title: "Vie privée et publications",
    description: "Avant de partager une photo ou un récit, protégez vos informations personnelles et celles des personnes présentes.",
    icon: EyeOff,
    href: "/confidentialite#sharing"
  },
  {
    title: "Vigilance face aux fraudes",
    description: "Vérifiez le destinataire et les conditions avant tout paiement. Méfiez-vous des liens suspects et des demandes urgentes de transfert.",
    icon: ShieldAlert,
    href: "/documentation#bookings"
  },
  {
    title: "Signalement et assistance",
    description: "Un contenu abusif ou une activité suspecte ? Contactez Support@yeyamo.com en décrivant le problème, sans transmettre de mot de passe.",
    icon: Flag,
    href: "mailto:Support@yeyamo.com"
  },
  {
    title: "Appareils partagés",
    description: "Déconnectez-vous après utilisation sur un appareil partagé et évitez d’y enregistrer vos identifiants.",
    icon: LogOut,
    href: "/confidentialite#security"
  }
];

export const aboutCards: InfoCard[] = [
  {
    title: "Mission",
    description: "Relier voyageurs, acteurs locaux et communautés autour d’expériences utiles et fiables.",
    icon: Sparkles
  },
  {
    title: "Vision",
    description: "Rendre la découverte du Cameroun plus simple, plus humaine et plus inspirante.",
    icon: Compass
  },
  {
    title: "Impact local",
    description: "Donner de la visibilité aux lieux, aux récits et aux initiatives qui font bouger les territoires.",
    icon: Landmark
  },
  {
    title: "Confiance",
    description: "Créer un environnement où l’information reste claire, utile et facile à vérifier.",
    icon: ShieldCheck
  }
];

export const documentationCards: InfoCard[] = [
  {
    title: "Guides de démarrage",
    description: "Comprendre la carte, les parcours et les bonnes pratiques pour démarrer vite.",
    icon: BookOpen,
    href: "/documentation#getting-started"
  },
  {
    title: "Intégrations",
    description: "Demander l’accès et les spécifications nécessaires pour intégrer YeYamo.",
    icon: SquareArrowOutUpRight,
    href: "/documentation#integrations"
  },
  {
    title: "Centre d’aide",
    description: "Retrouver les réponses rapides aux questions fréquentes et aux points bloquants.",
    icon: MessageSquareQuote,
    href: "/documentation#troubleshooting"
  },
  {
    title: "Support équipe",
    description: "Contacter l’équipe pour être accompagné sur un usage, un compte ou une intégration.",
    icon: ArrowRight,
    href: "/documentation#support"
  }
];

export const destinations: Destination[] = [
  {
    title: "Chutes d'Ekom Nkam",
    region: "Ouest",
    category: "Nature",
    rating: "4.8",
    image: "/destinations/chute_ekom.png",
    imageAlt: "Chutes d'Ekom Nkam"
  },
  {
    title: "Kribi",
    region: "Sud",
    category: "Plage",
    rating: "4.6",
    image: "/destinations/kribi.png",
    imageAlt: "Plage de Kribi"
  },
  {
    title: "Palais Royal Bamoun",
    region: "Ouest",
    category: "Culture",
    rating: "4.7",
    image: "/destinations/palais.png",
    imageAlt: "Palais Royal Bamoun"
  },
  {
    title: "Mont Cameroun",
    region: "Sud-Ouest",
    category: "Montagne",
    rating: "4.9",
    image: "/destinations/mont.png",
    imageAlt: "Mont Cameroun"
  }
];

export const communityStats: Stat[] = [
  { value: "+50K", label: "Membres actifs", icon: Users },
  { value: "+200", label: "Destinations", icon: MapPin },
  { value: "+15K", label: "Avis & partages", icon: MessageSquareQuote },
  { value: "24/7", label: "Support disponible", icon: Bell }
];

export const communityTestimonials: Testimonial[] = [
  {
    quote:
      "YeYamo m'a permis de découvrir des endroits incroyables et de rencontrer des gens formidables. Une application incontournable !",
    name: "Christelle M.",
    role: "Voyageuse passionnée",
    avatar: "/community/avatar-1.png",
    avatarAlt: "Portrait de Christelle",
    initials: "CM"
  },
  {
    quote:
      "J'adore la façon dont les parcours mettent en avant les lieux et les histoires locales, c'est vraiment vivant.",
    name: "Paul T.",
    role: "Créateur de contenu",
    avatar: "/community/avatar-2.png",
    avatarAlt: "Portrait de Paul",
    initials: "PT"
  },
  {
    quote:
      "La communauté rend les découvertes plus simples, plus humaines et plus fiables au quotidien.",
    name: "Mireille A.",
    role: "Ambassadrice locale",
    avatar: "/community/avatar-3.png",
    avatarAlt: "Portrait de Mireille",
    initials: "MA"
  }
];

export const appFeatures: AppFeature[] = [
  {
    title: "Interface intuitive",
    description: "Navigation simple et agréable pour aller vite sans perdre la richesse du contenu.",
    icon: LayoutDashboard
  },
  {
    title: "Notifications intelligentes",
    description: "Restez informé en temps réel des nouveautés, suggestions et événements utiles.",
    icon: Bell
  },
  {
    title: "Mode hors ligne",
    description: "Accédez aux contenus utiles quand la connexion est limitée ou instable.",
    icon: SquareArrowOutUpRight
  },
  {
    title: "Sécurité et fiabilité",
    description: "Vos données sont protégées et les échanges restent encadrés.",
    icon: ShieldCheck
  }
];

export const faqItems: FaqItem[] = [
  {
    question: "Comment YeYamo m'aide à découvrir le Cameroun autrement ?",
    answer:
      "YeYamo met en avant des lieux, parcours et expériences sélectionnés pour leur intérêt culturel, touristique et local."
  },
  {
    question: "Les recommandations sont-elles personnalisées ?",
    answer:
      "Oui, la plateforme privilégie des suggestions adaptées aux centres d'intérêt, à la zone géographique et au contexte de découverte."
  },
  {
    question: "YeYamo convient-il aux voyageurs comme aux acteurs locaux ?",
    answer:
      "Absolument. La plateforme est pensée pour les visiteurs, les partenaires, les créateurs de contenu et les communautés locales."
  },
  {
    question: "Où trouver de l’aide pour utiliser YeYamo ?",
    answer:
      "La documentation propose des guides de démarrage, des conseils pratiques et les coordonnées du support. Le lien est disponible dans la navigation et en bas de page."
  }
];

export const socialItems = [
  { label: "Facebook", short: "f" },
  { label: "Instagram", short: "ig" },
  { label: "YouTube", short: "yt" },
  { label: "X", short: "x" },
  { label: "TikTok", short: "tt" }
] as const;
