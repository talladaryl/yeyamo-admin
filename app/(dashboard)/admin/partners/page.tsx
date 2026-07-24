import { AdminShell } from "@/components/admin-shell";
import { DataTable } from "@/components/data-table";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { getPartnerValidations } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";

export default async function PartnersPage() {
  const partners = await getPartnerValidations();

  return (
    <AdminShell
      title="Partenaires & KYC"
      description="Validation des inscriptions partenaires, revue des documents et decisions motivees."
    >
      <SectionCard
        title="Demandes partenaires"
        description="Base branchable sur /api/v1/admin/validations/partners"
        actions={<button className="rounded-lg bg-rose-700 px-3 py-2 text-sm font-semibold text-white">Nouvelle revue</button>}
      >
        <DataTable
          rows={partners}
          columns={[
            { key: "partnerId", header: "Partenaire" },
            {
              key: "status",
              header: "Statut",
              render: (row) => <StatusBadge status={row.status} />
            },
            { key: "riskScore", header: "Risk score" },
            {
              key: "kycDocumentTypes",
              header: "Documents",
              render: (row) => row.kycDocumentTypes.join(", ")
            },
            {
              key: "reviewComment",
              header: "Commentaire",
              render: (row) => <span className="text-slate-500">{row.reviewComment ?? "-"}</span>
            },
            {
              key: "updatedAt",
              header: "Mise a jour",
              render: (row) => formatDate(row.updatedAt)
            }
          ]}
        />
      </SectionCard>
    </AdminShell>
  );
}
