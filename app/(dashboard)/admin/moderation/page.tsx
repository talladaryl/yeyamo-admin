import { AdminShell } from "@/components/admin-shell";
import { DataTable } from "@/components/data-table";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { getReports } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";

export default async function ModerationPage() {
  const reports = await getReports();

  return (
    <AdminShell
      title="Moderation"
      description="Queue unifiee des reports et base du workflow trust & safety."
    >
      <SectionCard
        title="Reports"
        description="Source: /api/v1/admin/reports. La resolution et l'escalade seront reliees aux actions backend."
      >
        <DataTable
          rows={reports}
          columns={[
            { key: "reportType", header: "Type" },
            { key: "targetId", header: "Target" },
            { key: "reason", header: "Motif" },
            {
              key: "status",
              header: "Statut",
              render: (row) => <StatusBadge status={row.status} />
            },
            {
              key: "description",
              header: "Contexte",
              render: (row) => <span className="text-slate-500">{row.description ?? "-"}</span>
            },
            {
              key: "createdAt",
              header: "Creation",
              render: (row) => formatDate(row.createdAt)
            }
          ]}
        />
      </SectionCard>
    </AdminShell>
  );
}
