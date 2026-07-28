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
    | "moderation"
    | "trust"
    | "gamification"
    | "campaigns"
    | "search"
    | "analytics"
    | "settings";
  badge?: string;
  summary: string;
  highlights: string[];
  primaryAction: string;
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
    label: "Analytics",
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
