import type { AdminRole } from "@/lib/types";

export type AdminModule = {
  label: string;
  href: string;
  roles: AdminRole[];
  domain: "core" | "operations" | "growth" | "governance";
  icon:
    | "dashboard"
    | "users"
    | "partners"
    | "catalog"
    | "culture"
    | "places"
    | "import"
    | "calendar"
    | "reservations"
    | "reviews"
    | "moderation"
    | "trust"
    | "gamification"
    | "campaigns"
    | "alert"
    | "message"
    | "mail"
    | "search"
    | "analytics"
    | "settings";
  badge?: string;
  summary: string;
  highlights: string[];
  primaryAction: string;
  showInSidebar?: boolean;
};

export const currentAdminRole: AdminRole = "SUPER_ADMIN";

export const adminNavigation: AdminModule[] = [
  {
    label: "Dashboard",
    href: "/admin",
    roles: ["SUPER_ADMIN", "ADMIN", "MODERATOR", "EDITOR", "SUPPORT", "COMMERCIAL"],
    domain: "core",
    icon: "dashboard",
    summary: "Vue globale des KPI, files d'attente critiques, alertes et activite recente.",
    highlights: ["KPIs produit", "Queues critiques", "Activite recente", "Alertes systeme"],
    primaryAction: "Exporter un snapshot"
  },
  {
    label: "Utilisateurs",
    href: "/admin/users",
    roles: ["SUPER_ADMIN", "ADMIN", "SUPPORT"],
    domain: "core",
    icon: "users",
    summary: "Gestion des comptes, statuts, activite, confidentialite et workflows de suspension.",
    highlights: ["Recherche avancee", "Statuts compte", "Activity timeline", "Exports et retention"],
    primaryAction: "Lancer une bulk action"
  },
  {
    label: "Lieux",
    href: "/admin/places",
    roles: ["SUPER_ADMIN", "ADMIN", "MODERATOR", "EDITOR"],
    domain: "operations",
    icon: "places",
    summary: "Pilotage des lieux, expériences et validations de contenus géolocalisés.",
    highlights: ["Fiches lieux", "Mise à jour", "Visibilité", "Scores qualité"],
    primaryAction: "Ajouter un lieu"
  },
  {
    label: "Événements",
    href: "/admin/events",
    roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
    domain: "operations",
    icon: "calendar",
    summary: "Gestion des événements, campagnes locales et contenus à venir.",
    highlights: ["Calendrier", "Programmation", "Statuts", "Promotion"],
    primaryAction: "Publier un événement"
  },
  {
    label: "Réservations",
    href: "/admin/reservations",
    roles: ["SUPER_ADMIN", "ADMIN", "SUPPORT"],
    domain: "operations",
    icon: "reservations",
    summary: "Suivi des réservations, confirmations et litiges potentiels.",
    highlights: ["Suivi temps réel", "Paiements", "Statut", "Support"],
    primaryAction: "Voir les réservations"
  },
  {
    label: "Avis & Commentaires",
    href: "/admin/reviews",
    roles: ["SUPER_ADMIN", "ADMIN", "MODERATOR"],
    domain: "operations",
    icon: "reviews",
    summary: "Modération des avis, commentaires et signalements associés.",
    highlights: ["Avis publiés", "Modération", "Réponses", "Signalement"],
    primaryAction: "Ouvrir la modération"
  },
  {
    label: "Partenaires",
    href: "/admin/partners",
    roles: ["SUPER_ADMIN", "ADMIN", "COMMERCIAL"],
    domain: "core",
    icon: "partners",
    badge: "KYC",
    summary: "Validation partenaires, revue documentaire, etablissements et historique de decision.",
    highlights: ["Queue KYC", "Risk score", "Motifs de rejet", "Relances"],
    primaryAction: "Ouvrir la queue KYC"
  },
  {
    label: "Catalogue",
    href: "/admin/catalog",
    roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
    domain: "operations",
    icon: "catalog",
    summary: "National Discovery Catalog, sources, imports, corrections et statuts de publication.",
    highlights: ["Assets nationaux", "Source lineage", "Corrections", "Qualite catalogue"],
    primaryAction: "Lancer une revue d'asset"
  },
  {
    label: "Imports",
    href: "/admin/imports",
    roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
    domain: "operations",
    icon: "import",
    badge: "CSV",
    summary: "Import massif de lieux, événements, partenaires et contenus depuis des fichiers structurés.",
    highlights: ["CSV/Excel", "Mapping", "Validation", "Historique"],
    primaryAction: "Démarrer un import"
  },
  {
    label: "Culture",
    href: "/admin/culture",
    roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
    domain: "operations",
    icon: "culture",
    summary: "Gestion des contenus Culture & Memoire: langues, personnages, traditions et regions.",
    highlights: ["Editorial", "Langues", "Personnages", "Regions culturelles"],
    primaryAction: "Creer un contenu editorial"
  },
  {
    label: "Lieux & Events",
    href: "/admin/places-events",
    roles: ["SUPER_ADMIN", "ADMIN", "MODERATOR", "EDITOR"],
    domain: "operations",
    icon: "places",
    showInSidebar: false,
    summary: "Validation des lieux, evenements, experiences et revue geographique.",
    highlights: ["Map review", "Disponibilite", "Corrections", "Statuts"],
    primaryAction: "Ouvrir la carte de revue"
  },
  {
    label: "Moderation",
    href: "/admin/moderation",
    roles: ["SUPER_ADMIN", "ADMIN", "MODERATOR"],
    domain: "operations",
    icon: "moderation",
    badge: "Queue",
    summary: "Revue des posts, commentaires, stories, medias signales et decisions sensibles.",
    highlights: ["Reports", "Preview media", "Escalades", "Historique de moderation"],
    primaryAction: "Traiter les reports"
  },
  {
    label: "Signalements",
    href: "/admin/reports",
    roles: ["SUPER_ADMIN", "ADMIN", "MODERATOR", "SUPPORT"],
    domain: "operations",
    icon: "alert",
    summary: "Gestion des signalements, priorisation et suivi des dossiers sensibles.",
    highlights: ["Files prioritaires", "Escalades", "Résolutions", "Historique"],
    primaryAction: "Voir les signalements"
  },
  {
    label: "Trust & Safety",
    href: "/admin/trust",
    roles: ["SUPER_ADMIN", "ADMIN", "MODERATOR", "SUPPORT"],
    domain: "operations",
    icon: "trust",
    summary: "Cas sensibles, sanctions, anti-fraude, risk score et litiges.",
    highlights: ["Sanctions", "Risk score", "Cas complexes", "Escalades"],
    primaryAction: "Ouvrir un case review"
  },
  {
    label: "Gamification",
    href: "/admin/gamification",
    roles: ["SUPER_ADMIN", "ADMIN"],
    domain: "growth",
    icon: "gamification",
    summary: "Pilotage des badges, XP, missions, rewards et controles antifraude.",
    highlights: ["XP rules", "Badges", "Missions", "Reward pools"],
    primaryAction: "Ajuster une regle XP"
  },
  {
    label: "Campagnes",
    href: "/admin/campaigns",
    roles: ["SUPER_ADMIN", "ADMIN", "COMMERCIAL"],
    domain: "growth",
    icon: "campaigns",
    summary: "Notifications, Daily Drop, campagnes sponsorisees, segments et ciblage.",
    highlights: ["Push", "In-app", "Segments", "Daily Drop"],
    primaryAction: "Creer une campagne"
  },
  {
    label: "Messages",
    href: "/admin/messages",
    roles: ["SUPER_ADMIN", "ADMIN", "SUPPORT"],
    domain: "growth",
    icon: "message",
    summary: "Messages entrants, réponses rapides et suivi des conversations.",
    highlights: ["Boîte de réception", "Assignation", "Macros", "SLA"],
    primaryAction: "Ouvrir la messagerie"
  },
  {
    label: "Newsletter",
    href: "/admin/newsletter",
    roles: ["SUPER_ADMIN", "ADMIN", "COMMERCIAL"],
    domain: "growth",
    icon: "mail",
    summary: "Campagnes email, segments et suivi des envois.",
    highlights: ["Segments", "Envois", "Ouvertures", "Clics"],
    primaryAction: "Créer une newsletter"
  },
  {
    label: "Search & Discovery",
    href: "/admin/search-discovery",
    roles: ["SUPER_ADMIN", "ADMIN"],
    domain: "growth",
    icon: "search",
    summary: "Configuration de l'index, ranking policies, feature flags et reason codes.",
    highlights: ["Search index", "Ranking policies", "Feature flags", "Reason codes"],
    primaryAction: "Modifier une policy"
  },
  {
    label: "Analytique",
    href: "/admin/analytics",
    roles: ["SUPER_ADMIN", "ADMIN", "COMMERCIAL"],
    domain: "growth",
    icon: "analytics",
    summary: "Retention, activation, couverture catalogue, performance partenaires et exports.",
    highlights: ["Retention", "Funnels", "Catalogue health", "Exports"],
    primaryAction: "Exporter un rapport"
  },
  {
    label: "Parametres",
    href: "/admin/settings",
    roles: ["SUPER_ADMIN", "ADMIN"],
    domain: "governance",
    icon: "settings",
    summary: "Roles, permissions, audit logs, configuration plateforme et securite.",
    highlights: ["RBAC", "Audit log", "Security", "Platform settings"],
    primaryAction: "Consulter l'audit"
  }
];

export const navigationDomains: Record<AdminModule["domain"], string> = {
  core: "Socle",
  operations: "Operations",
  growth: "Croissance",
  governance: "Gouvernance"
};

export function getModuleByHref(href: string) {
  return adminNavigation.find((item) => item.href === href);
}
