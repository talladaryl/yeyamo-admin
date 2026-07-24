import Link from "next/link";

import { AdminShell } from "@/components/admin-shell";
import { ActiveUsersChart } from "@/components/dashboard/active-users-chart";
import { GenderDonutChart } from "@/components/dashboard/gender-donut-chart";
import { GeoDistributionPanel } from "@/components/dashboard/geo-distribution-panel";
import { KpiCard } from "@/components/kpi-card";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { getDashboardData, getPartnerValidations, getReports } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 2.5V4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M11 2.5V4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M2.5 6H13.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <path d="M8 2.5V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M5.5 6.8L8 9.3L10.5 6.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 12.5H13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <path d="M3 8H13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M9.5 4.5L13 8L9.5 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0 text-rose-600">
      <path d="M9 14.5C11.6 11.4 12.9 9.5 12.9 7.5C12.9 5.35 11.15 3.6 9 3.6C6.85 3.6 5.1 5.35 5.1 7.5C5.1 9.5 6.4 11.4 9 14.5Z" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="9" cy="7.4" r="1.7" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0 text-rose-600">
      <path d="M2.8 5.2C2.8 4.54 3.34 4 4 4H7L8.4 5.4H14C14.66 5.4 15.2 5.94 15.2 6.6V12.8C15.2 13.46 14.66 14 14 14H4C3.34 14 2.8 13.46 2.8 12.8V5.2Z" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

const validationQueues = [
  { label: "Partenaires", value: 18 },
  { label: "Lieux", value: 27 },
  { label: "Contenus", value: 46 },
  { label: "Documents", value: 13 }
];

const missions = [
  { id: "m1", title: "Decouvrir les musees du Cameroun", endsIn: "Fin dans 5 jours", participants: "1,250" },
  { id: "m2", title: "Patrimoine culturel de l'Ouest", endsIn: "Fin dans 12 jours", participants: "890" }
];

const systemAlerts = [
  { id: "a1", title: "Charge elevee sur le service de moderation", when: "Il y a 5 min", tone: "rose" },
  { id: "a2", title: "Espace disque serveur : 85% utilise", when: "Il y a 15 min", tone: "amber" },
  { id: "a3", title: "Sauvegarde quotidienne reussie", when: "Il y a 1 h", tone: "blue" }
];

export default async function DashboardPage() {
  const [dashboard, partners, reports] = await Promise.all([
    getDashboardData(),
    getPartnerValidations(),
    getReports()
  ]);

  const pendingPartners = partners.filter((item) => item.status === "PENDING").length;
  const openReports = reports.filter((item) => item.status !== "RESOLVED").length;

  const kpis = [
    ...dashboard.latestKpis.slice(0, 3),
    { kpiName: "Signalements ouverts", kpiValue: openReports || 320, variation: -5.1 },
    { kpiName: "Taux de retention J7", kpiValue: 39, variation: 2.7 }
  ];

  return (
    <AdminShell
      title="Dashboard"
      description="Bienvenue sur le tableau de bord administrateur YeYamo"
      headerVariant="plain"
    >
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div />
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/analytics" className="inline-flex items-center gap-2 rounded-xl border border-rose-100 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">
            <CalendarIcon />
            30 derniers jours
          </Link>
          <Link href="/admin/analytics" className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white">
            <DownloadIcon />
            Exporter le rapport
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {kpis.map((kpi) => (
          <KpiCard
            key={kpi.kpiName}
            title={kpi.kpiName}
            value={kpi.kpiName === "Taux de retention J7" ? 38.6 : kpi.kpiValue}
            change={kpi.variation}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.55fr_0.8fr_0.95fr]">
        <SectionCard
          title="Evolution des utilisateurs actifs"
          actions={<Link href="/admin/analytics" className="rounded-lg border border-rose-100 bg-white px-3 py-2 text-sm font-medium text-slate-700">30 derniers jours</Link>}
        >
          <ActiveUsersChart />
        </SectionCard>

        <SectionCard title="Repartition par genre">
          <GenderDonutChart />
        </SectionCard>

        <SectionCard title="Activites recentes">
          <div className="space-y-4">
            {[
              { id: "r1", title: "Nouveau partenaire a valider", detail: "Hotel Mont Febe", when: "Il y a 10 min" },
              { id: "r2", title: "Signalement a traiter", detail: "Contenu inapproprie", when: "Il y a 25 min" },
              { id: "r3", title: "Element du catalogue ajoute", detail: "Chutes d'Ekom", when: "Il y a 1 h" },
              { id: "r4", title: "Mission sponsorisee creee", detail: "Decouvrir les musees", when: "Il y a 2 h" }
            ].map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-3 border-b border-rose-50 pb-4 last:border-b-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
                </div>
                <div className="shrink-0 text-xs text-slate-400">{item.when}</div>
              </div>
            ))}
            <Link href="/admin/moderation" className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600">
              Voir toutes les activites
              <ArrowRightIcon />
            </Link>
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <SectionCard
          title="Signalements recents"
          actions={<Link href="/admin/moderation" className="rounded-lg border border-rose-100 bg-white px-3 py-2 text-sm font-medium text-rose-600">Voir tous</Link>}
        >
          <div className="overflow-hidden rounded-2xl border border-rose-100 bg-white">
            <div className="grid grid-cols-[1fr_1fr_1.2fr_0.9fr_0.9fr_0.9fr_1fr_1fr] gap-3 border-b border-rose-100 bg-rose-50/50 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              <div>ID</div>
              <div>Type</div>
              <div>Contenu</div>
              <div>Auteur</div>
              <div>Statut</div>
              <div>Priorite</div>
              <div>Assigne a</div>
              <div>Date</div>
            </div>
            <div className="divide-y divide-rose-50">
              {reports.map((report, index) => (
                <div key={report.id} className="grid grid-cols-[1fr_1fr_1.2fr_0.9fr_0.9fr_0.9fr_1fr_1fr] gap-3 px-4 py-3 text-sm text-slate-700">
                  <div>#{`SR-245${index + 2}`}</div>
                  <div>{report.reportType}</div>
                  <div>{report.reason}</div>
                  <div>{["Jean K.", "Marie L.", "Paul D."][index] ?? "Sophie M."}</div>
                  <div><StatusBadge status={index === 1 ? "IN_REVIEW" : report.status} /></div>
                  <div><StatusBadge status={index === 1 ? "PENDING" : "REJECTED"} /></div>
                  <div>{`Moderateur ${index + 1}`}</div>
                  <div>{formatDate(report.createdAt)}</div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Repartition geographique"
          actions={<Link href="/admin/places-events" className="rounded-lg border border-rose-100 bg-white px-3 py-2 text-sm font-medium text-slate-700">Voir la carte complete</Link>}
        >
          <GeoDistributionPanel />
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.95fr_0.8fr]">
        <SectionCard title="Files de validation">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {validationQueues.map((item) => (
              <div key={item.label} className="rounded-2xl border border-rose-100 bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  {item.label === "Lieux" ? <MapPinIcon /> : <FolderIcon />}
                  {item.label}
                </div>
                <div className="mt-3 text-[32px] font-semibold tracking-tight text-slate-950">{item.value}</div>
                <div className="mt-1 text-sm text-slate-500">A valider</div>
                <Link
                  href={item.label === "Partenaires" ? "/admin/partners" : item.label === "Lieux" ? "/admin/places-events" : item.label === "Contenus" ? "/admin/moderation" : "/admin/settings"}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-rose-600"
                >
                  Voir la file
                  <ArrowRightIcon />
                </Link>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Missions actives">
          <div className="space-y-3">
            {missions.map((mission) => (
              <div key={mission.id} className="flex items-center justify-between gap-3 rounded-2xl border border-rose-100 bg-white p-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{mission.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{mission.endsIn}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-slate-950">{mission.participants}</div>
                  <div className="text-xs text-slate-400">Participants</div>
                </div>
              </div>
            ))}
            <Link href="/admin/gamification" className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600">
              Voir toutes les missions
              <ArrowRightIcon />
            </Link>
          </div>
        </SectionCard>

        <SectionCard
          title="Alertes systeme"
          actions={<Link href="/admin/settings" className="rounded-lg border border-rose-100 bg-white px-3 py-2 text-sm font-medium text-slate-700">Voir toutes</Link>}
        >
          <div className="space-y-3">
            {systemAlerts.map((alert) => (
              <div
                key={alert.id}
                className={
                  alert.tone === "rose"
                    ? "rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3"
                    : alert.tone === "amber"
                      ? "rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3"
                      : "rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3"
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm font-medium text-slate-800">{alert.title}</div>
                  <div className="text-xs text-slate-400">{alert.when}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>
    </AdminShell>
  );
}
