import { AdminShell } from "@/components/admin-shell";
import { DataTable } from "@/components/data-table";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { getPlaceValidations } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";

export default async function PlacesEventsPage() {
  const places = await getPlaceValidations();

  return (
    <AdminShell
      title="Lieux & Evenements"
      description="Base operationnelle pour la validation des lieux. Les evenements et la revue cartographique viendront sur cette meme verticale."
    >
      <SectionCard title="Validations de lieux" description="Source: /api/v1/admin/validations/places">
        <DataTable
          rows={places}
          columns={[
            { key: "placeId", header: "Lieu" },
            { key: "submittedBy", header: "Soumis par" },
            {
              key: "status",
              header: "Statut",
              render: (row) => <StatusBadge status={row.status} />
            },
            {
              key: "changesRequested",
              header: "Changements",
              render: (row) => (
                <span className="text-slate-500">{Object.keys(row.changesRequested).length} champ(s)</span>
              )
            },
            {
              key: "reviewComment",
              header: "Note",
              render: (row) => <span className="text-slate-500">{row.reviewComment ?? "-"}</span>
            },
            {
              key: "updatedAt",
              header: "Maj",
              render: (row) => formatDate(row.updatedAt)
            }
          ]}
        />
      </SectionCard>
    </AdminShell>
  );
}
