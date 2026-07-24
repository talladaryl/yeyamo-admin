import { AdminShell } from "@/components/admin-shell";
import { DataTable } from "@/components/data-table";
import { SectionCard } from "@/components/section-card";
import { getAuditLogs } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";

export default async function SettingsPage() {
  const auditLogs = await getAuditLogs();

  return (
    <AdminShell
      title="Parametres & Audit"
      description="Premiere base pour les roles, permissions et la tracabilite des actions sensibles."
    >
      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard title="Permissions" description="Matrice UI provisoire avant branchement complet du RBAC">
          <div className="space-y-3 text-sm">
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="font-semibold text-slate-900">Super Admin</p>
              <p className="mt-1 text-slate-500">Acces complet aux modules, creation d'admins, audit et parametres.</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="font-semibold text-slate-900">Admin</p>
              <p className="mt-1 text-slate-500">Validation, publication, moderation et consultation analytics.</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="font-semibold text-slate-900">Moderateur</p>
              <p className="mt-1 text-slate-500">Reports, moderation de contenus et revue des lieux.</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Audit logs" description="Source: /api/v1/admin/audit-logs">
          <DataTable
            rows={auditLogs}
            columns={[
              { key: "action", header: "Action" },
              { key: "targetType", header: "Cible" },
              { key: "targetId", header: "ID" },
              {
                key: "details",
                header: "Details",
                render: (row) => (
                  <span className="text-slate-500">{Object.entries(row.details).map(([key, value]) => `${key}: ${String(value)}`).join(" | ")}</span>
                )
              },
              {
                key: "createdAt",
                header: "Date",
                render: (row) => formatDate(row.createdAt)
              }
            ]}
          />
        </SectionCard>
      </section>
    </AdminShell>
  );
}
