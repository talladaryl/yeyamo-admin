import type { AdminModule } from "@/lib/admin-config";

export const adminNavigationGroupDefinitions = [
  { title: "Contenu & Catalogue", hrefs: ["/admin/places", "/admin/events", "/admin/catalog", "/admin/regions", "/admin/cities", "/admin/place-categories", "/admin/collections", "/admin/culture"] },
  { title: "Utilisateurs & Accès", hrefs: ["/admin/users", "/admin/administrators", "/admin/partners"] },
  { title: "Réservations & Avis", hrefs: ["/admin/reservations", "/admin/reviews"] },
  { title: "Modération & Sécurité", hrefs: ["/admin/moderation", "/admin/reports", "/admin/trust"] },
  { title: "Engagement & Marketing", hrefs: ["/admin/gamification", "/admin/campaigns", "/admin/promotions", "/admin/newsletter"] },
  { title: "Communication", hrefs: ["/admin/messages"] },
  { title: "Finance", hrefs: ["/admin/payments", "/admin/commissions", "/admin/ledger"] },
  { title: "Pilotage & Configuration", hrefs: ["/admin/search-discovery", "/admin/analytics", "/admin/settings"] },
] as const;

export type AdminNavigationGroup = { title: string; modules: AdminModule[] };

export function groupVisibleAdminModules(modules: AdminModule[]) {
  const dashboard = modules.find((module) => module.href === "/admin");
  const groupedHrefs = new Set<string>(adminNavigationGroupDefinitions.flatMap((group) => [...group.hrefs]));
  const groups: AdminNavigationGroup[] = adminNavigationGroupDefinitions
    .map((group) => ({
      title: group.title,
      modules: group.hrefs.map((href) => modules.find((module) => module.href === href)).filter((module): module is AdminModule => Boolean(module)),
    }))
    .filter((group) => group.modules.length > 0);
  const ungrouped = modules.filter((module) => module.href !== "/admin" && !groupedHrefs.has(module.href));
  return { dashboard, groups, ungrouped };
}
