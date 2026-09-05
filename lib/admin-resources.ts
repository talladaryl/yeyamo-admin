import type { AdminModule } from "@/lib/admin-config";
import { adminApi } from "@/lib/api/admin-api";
import type { ApiRecord, PageResponse } from "@/lib/api/types";

export type ResourceAction = { label: string; tone?: "danger" | "success"; run: (record: ApiRecord) => Promise<unknown> };
export type AdminResource = { title: string; description: string; load: () => Promise<ApiRecord[] | PageResponse<ApiRecord>>; actions?: ResourceAction[] };
const id = (record: ApiRecord) => String(record.id ?? "");
const comment = (message: string) => window.prompt(message)?.trim();

export function resourceFor(module: AdminModule): AdminResource | undefined {
  const resources: Record<string, AdminResource> = {
    "/admin/users": { title: "Administrateurs", description: "Comptes RBAC gérés par admin-service.", load: adminApi.users.list },
    "/admin/partners": { title: "Validations partenaires", description: "Dossiers KYC et décisions.", load: () => adminApi.validations.partners(), actions: [
      { label: "Approuver", tone: "success", run: (r) => adminApi.validations.reviewPartner(id(r), { status: "APPROVED", reviewComment: comment("Commentaire facultatif") }) },
      { label: "Rejeter", tone: "danger", run: (r) => adminApi.validations.reviewPartner(id(r), { status: "REJECTED", reviewComment: comment("Motif du rejet") ?? "Rejet administratif" }) }
    ] },
    "/admin/places": { title: "Validations de lieux", description: "Soumissions de lieux à contrôler.", load: () => adminApi.validations.places(), actions: [
      { label: "Approuver", tone: "success", run: (r) => adminApi.validations.reviewPlace(id(r), { status: "APPROVED", changesRequested: {} }) },
      { label: "Corrections", tone: "danger", run: (r) => adminApi.validations.reviewPlace(id(r), { status: "REJECTED", reviewComment: comment("Corrections demandées") ?? "Corrections requises", changesRequested: {} }) }
    ] },
    "/admin/places-events": { title: "Validations de lieux", description: "Revue géographique fournie par admin-service.", load: () => adminApi.validations.places() },
    "/admin/reviews": { title: "Signalements administratifs", description: "Signalements historiques de admin-service.", load: () => adminApi.reports.list(), actions: [
      { label: "Résoudre", tone: "success", run: (r) => adminApi.reports.resolve(id(r), { status: "RESOLVED", resolutionComment: comment("Commentaire") ?? "Résolu par l’administration" }) }
    ] },
    "/admin/moderation": { title: "File de modération", description: "File opérationnelle de moderation-trust-service.", load: () => adminApi.moderation.queue(), actions: [
      { label: "Prendre en revue", run: (r) => adminApi.moderation.review(id(r)) },
      { label: "Approuver", tone: "success", run: (r) => adminApi.moderation.decide(id(r), { status: "APPROVED", resolution: comment("Décision") ?? "Approuvé" }) },
      { label: "Rejeter", tone: "danger", run: (r) => adminApi.moderation.decide(id(r), { status: "REJECTED", resolution: comment("Motif") ?? "Rejeté" }) }
    ] },
    "/admin/catalog": { title: "Catalogue national", description: "Assets du catalog-service.", load: () => adminApi.catalog.assets() },
    "/admin/culture": { title: "Contenus culturels", description: "Assets éditoriaux du catalogue.", load: () => adminApi.catalog.assets() },
    "/admin/gamification": { title: "Missions", description: "Catalogue et activation des missions.", load: adminApi.missions.list, actions: [
      { label: "Activer", tone: "success", run: (r) => adminApi.missions.activate(id(r)) },
      { label: "Mettre en pause", tone: "danger", run: (r) => adminApi.missions.pause(id(r)) }
    ] },
    "/admin/campaigns": { title: "Campagnes publicitaires", description: "Campagnes soumises à validation.", load: () => adminApi.campaigns.list(), actions: [
      { label: "Approuver", tone: "success", run: (r) => adminApi.campaigns.approve(id(r), comment("Commentaire")) },
      { label: "Rejeter", tone: "danger", run: (r) => adminApi.campaigns.reject(id(r), comment("Motif") ?? "Campagne rejetée") }
    ] },
    "/admin/analytics": { title: "Indicateurs analytiques", description: "Historique des KPI de la plateforme.", load: adminApi.analytics.kpis },
    "/admin/settings": { title: "Journal d’audit", description: "Traçabilité des opérations administratives.", load: adminApi.auditLogs }
  };
  return resources[module.href];
}
