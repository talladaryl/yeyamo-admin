import { AdminShell } from "@/components/admin-shell";
import { DataTable } from "@/components/data-table";
import { KpiCard } from "@/components/kpi-card";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { getModuleByHref } from "@/lib/admin-config";
import { cn } from "@/lib/utils";

type Metric = {
  title: string;
  value: number;
  change: number;
};

type QueueItem = {
  id: string;
  label: string;
  owner: string;
  priority: "Haute" | "Moyenne" | "Basse";
  status: string;
};

type TableRow = {
  id: string;
  name: string;
  type: string;
  owner: string;
  status: string;
  updatedAt: string;
};

type ModuleView = {
  metrics: Metric[];
  queueTitle: string;
  queueItems: QueueItem[];
  tableTitle: string;
  tableDescription: string;
  rows: TableRow[];
  alertTitle: string;
  alerts: string[];
};

const moduleViews: Record<string, ModuleView> = {
  "/admin/culture": {
    metrics: [
      { title: "Contenus publies", value: 248, change: 4.2 },
      { title: "Corrections en attente", value: 19, change: -1.6 },
      { title: "Langues actives", value: 12, change: 2.4 }
    ],
    queueTitle: "Validation editoriale",
    queueItems: [
      { id: "q1", label: "Ngondo - correction communautaire", owner: "Editeur Ouest", priority: "Haute", status: "PENDING" },
      { id: "q2", label: "Fiche langue Bassa", owner: "Equipe Culture", priority: "Moyenne", status: "IN_REVIEW" },
      { id: "q3", label: "Portrait Ruben Um Nyobe", owner: "Editeur Centre", priority: "Basse", status: "APPROVED" }
    ],
    tableTitle: "Catalogue Culture & Memoire",
    tableDescription: "Personnages, langues, traditions et regions culturelles a relire.",
    rows: [
      { id: "c1", name: "Ngondo", type: "Tradition", owner: "Equipe Culture", status: "PUBLISHED", updatedAt: "22/07/2026" },
      { id: "c2", name: "Beti", type: "Langue", owner: "Editeur Sud", status: "IN_REVIEW", updatedAt: "21/07/2026" },
      { id: "c3", name: "Sultan Njoya", type: "Personnage", owner: "Editeur Ouest", status: "PENDING", updatedAt: "20/07/2026" }
    ],
    alertTitle: "Points de controle",
    alerts: [
      "Afficher l'aperçu editorial avant publication.",
      "Conserver la provenance des sources et l'historique des corrections.",
      "Distinguer contenu officiel, editorial et communautaire."
    ]
  },
  "/admin/trust": {
    metrics: [
      { title: "Cas ouverts", value: 37, change: 7.4 },
      { title: "Sanctions actives", value: 14, change: 3.1 },
      { title: "Appels en attente", value: 5, change: -2.0 }
    ],
    queueTitle: "Cas prioritaires",
    queueItems: [
      { id: "t1", label: "Multi-comptes suspects", owner: "Moderateur 2", priority: "Haute", status: "IN_REVIEW" },
      { id: "t2", label: "Litige partenaire Douala", owner: "Support Lead", priority: "Moyenne", status: "PENDING" },
      { id: "t3", label: "Spam coordonne", owner: "Moderateur 1", priority: "Haute", status: "PENDING" }
    ],
    tableTitle: "Cases Trust & Safety",
    tableDescription: "Sanctions, litiges, anti-fraude et escalades en cours.",
    rows: [
      { id: "t-245", name: "Blocage contenu sensible", type: "Sanction", owner: "Admin Trust", status: "RESOLVED", updatedAt: "22/07/2026" },
      { id: "t-246", name: "Tentative fraude rewards", type: "Fraude", owner: "Risk Analyst", status: "IN_REVIEW", updatedAt: "22/07/2026" },
      { id: "t-247", name: "Recours partenaire", type: "Litige", owner: "Support Lead", status: "PENDING", updatedAt: "21/07/2026" }
    ],
    alertTitle: "Controles requis",
    alerts: [
      "Toute sanction doit exiger un motif et une duree.",
      "Les escalades doivent conserver le score de risque et l'historique.",
      "Les donnees sensibles doivent etre masquees hors roles autorises."
    ]
  },
  "/admin/gamification": {
    metrics: [
      { title: "Missions actives", value: 18, change: 5.7 },
      { title: "Badges en production", value: 42, change: 1.1 },
      { title: "Alertes antifraude", value: 6, change: -3.5 }
    ],
    queueTitle: "Regles a verifier",
    queueItems: [
      { id: "g1", label: "Mission sponsorisee Kribi", owner: "Growth Ops", priority: "Haute", status: "PENDING" },
      { id: "g2", label: "Seuil XP exploration", owner: "Product Admin", priority: "Moyenne", status: "IN_REVIEW" },
      { id: "g3", label: "Reward pool juillet", owner: "Finance Ops", priority: "Basse", status: "APPROVED" }
    ],
    tableTitle: "Missions et rewards",
    tableDescription: "Pilotage XP, badges, reward pools et detection d'abus.",
    rows: [
      { id: "g-01", name: "Explorer le Littoral", type: "Mission", owner: "Growth Ops", status: "PUBLISHED", updatedAt: "22/07/2026" },
      { id: "g-02", name: "Badge Ambassadeur", type: "Badge", owner: "Product Admin", status: "IN_REVIEW", updatedAt: "21/07/2026" },
      { id: "g-03", name: "Pool rewards S29", type: "Reward", owner: "Finance Ops", status: "PENDING", updatedAt: "20/07/2026" }
    ],
    alertTitle: "Verifications",
    alerts: [
      "Appliquer les controles antifraude avant activation des rewards.",
      "Garder une trace des modifications de bareme XP.",
      "Afficher les impacts produits avant publication d'une mission."
    ]
  },
  "/admin/campaigns": {
    metrics: [
      { title: "Campagnes actives", value: 11, change: 6.2 },
      { title: "Segments cibles", value: 24, change: 2.8 },
      { title: "Daily Drops planifies", value: 7, change: 4.4 }
    ],
    queueTitle: "Envois a approuver",
    queueItems: [
      { id: "cp1", label: "Push weekend Douala", owner: "Commercial", priority: "Haute", status: "PENDING" },
      { id: "cp2", label: "Daily Drop culture", owner: "Growth Ops", priority: "Moyenne", status: "IN_REVIEW" },
      { id: "cp3", label: "Relance partenaires", owner: "CRM Admin", priority: "Basse", status: "APPROVED" }
    ],
    tableTitle: "Notifications & campagnes",
    tableDescription: "Push, in-app, Daily Drop et campagnes sponsorisees.",
    rows: [
      { id: "cp-01", name: "Week-end Yaounde", type: "Push", owner: "Commercial", status: "PUBLISHED", updatedAt: "22/07/2026" },
      { id: "cp-02", name: "Daily Drop traditions", type: "Daily Drop", owner: "Growth Ops", status: "IN_REVIEW", updatedAt: "21/07/2026" },
      { id: "cp-03", name: "Partenaires premium", type: "Sponsorise", owner: "CRM Admin", status: "PENDING", updatedAt: "20/07/2026" }
    ],
    alertTitle: "Garde-fous",
    alerts: [
      "Valider les segments avant tout envoi massif.",
      "Afficher la pression marketing et la frequence d'exposition.",
      "Conserver l'historique de publication et de retrait."
    ]
  },
  "/admin/search-discovery": {
    metrics: [
      { title: "Policies actives", value: 9, change: 0.9 },
      { title: "Flags critiques", value: 4, change: 0.0 },
      { title: "Jobs indexation", value: 3, change: -1.2 }
    ],
    queueTitle: "Changements en attente",
    queueItems: [
      { id: "sd1", label: "Ranking policy National Catalog", owner: "Search Admin", priority: "Haute", status: "IN_REVIEW" },
      { id: "sd2", label: "Feature flag Daily Drop", owner: "Product Admin", priority: "Moyenne", status: "PENDING" },
      { id: "sd3", label: "Reason code trending", owner: "Discovery Ops", priority: "Basse", status: "APPROVED" }
    ],
    tableTitle: "Search, ranking et flags",
    tableDescription: "Configuration du moteur de discovery et des politiques de ranking.",
    rows: [
      { id: "sd-01", name: "Ranking local-explore", type: "Policy", owner: "Search Admin", status: "PUBLISHED", updatedAt: "22/07/2026" },
      { id: "sd-02", name: "Feed cold-start", type: "Reason Code", owner: "Discovery Ops", status: "IN_REVIEW", updatedAt: "21/07/2026" },
      { id: "sd-03", name: "Feature flag catalog_boost", type: "Flag", owner: "Product Admin", status: "PENDING", updatedAt: "20/07/2026" }
    ],
    alertTitle: "Verifications",
    alerts: [
      "Toute policy modifiee doit exposer son impact attendu.",
      "Les feature flags critiques doivent etre journalises.",
      "Les jobs d'indexation en erreur doivent remonter en alerte."
    ]
  },
  "/admin/analytics": {
    metrics: [
      { title: "Rapports automatiques", value: 16, change: 3.3 },
      { title: "Exports demandes", value: 8, change: 6.1 },
      { title: "Couverture catalogue", value: 74, change: 4.9 }
    ],
    queueTitle: "Analyses a publier",
    queueItems: [
      { id: "an1", label: "Retention cohort J7", owner: "Data Analyst", priority: "Haute", status: "IN_REVIEW" },
      { id: "an2", label: "Performance partenaires", owner: "Commercial Ops", priority: "Moyenne", status: "PENDING" },
      { id: "an3", label: "Rapport missions rewards", owner: "Growth Ops", priority: "Basse", status: "APPROVED" }
    ],
    tableTitle: "Rapports & exports",
    tableDescription: "Retention, activation, performance partenaires et couverture catalogue.",
    rows: [
      { id: "an-01", name: "Retention J7", type: "Cohorte", owner: "Data Analyst", status: "PUBLISHED", updatedAt: "22/07/2026" },
      { id: "an-02", name: "Activation partenaires", type: "Performance", owner: "Commercial Ops", status: "IN_REVIEW", updatedAt: "21/07/2026" },
      { id: "an-03", name: "Couverture catalogue", type: "Catalogue", owner: "Product Admin", status: "PENDING", updatedAt: "20/07/2026" }
    ],
    alertTitle: "Controles d'usage",
    alerts: [
      "Les exports sensibles doivent respecter les permissions de role.",
      "Conserver les dates, filtres et sources de tout rapport partage.",
      "Afficher les erreurs de calcul et la derniere actualisation."
    ]
  }
};

function PriorityPill({ priority }: { priority: QueueItem["priority"] }) {
  const className =
    priority === "Haute"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : priority === "Moyenne"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-emerald-200 bg-emerald-50 text-emerald-700";

  return <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-semibold", className)}>{priority}</span>;
}

export function ModulePage({ href }: { href: string }) {
  const module = getModuleByHref(href);
  const view = moduleViews[href];

  if (!module || !view) {
    return null;
  }

  return (
    <AdminShell title={module.label} description={module.summary}>
      <section className="grid gap-4 md:grid-cols-3">
        {view.metrics.map((metric) => (
          <KpiCard key={metric.title} title={metric.title} value={metric.value} change={metric.change} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.7fr_0.95fr]">
        <SectionCard
          title={view.tableTitle}
          description={view.tableDescription}
          actions={<button className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white">{module.primaryAction}</button>}
        >
          <DataTable
            rows={view.rows}
            columns={[
              { key: "name", header: "Element" },
              { key: "type", header: "Type" },
              { key: "owner", header: "Owner" },
              {
                key: "status",
                header: "Statut",
                render: (row) => <StatusBadge status={row.status} />
              },
              { key: "updatedAt", header: "Maj" }
            ]}
          />
        </SectionCard>

        <SectionCard title={view.queueTitle} description="Elements a traiter en priorite">
          <div className="space-y-3">
            {view.queueItems.map((item) => (
              <div key={item.id} className="rounded-2xl border border-rose-100 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.owner}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                <div className="mt-3">
                  <PriorityPill priority={item.priority} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      <SectionCard title={view.alertTitle} description="Regles de production et garde-fous du module">
        <div className="grid gap-3 md:grid-cols-3">
          {view.alerts.map((alert) => (
            <div key={alert} className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-sm leading-6 text-slate-700">
              {alert}
            </div>
          ))}
        </div>
      </SectionCard>
    </AdminShell>
  );
}
