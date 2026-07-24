import { AdminShell } from "@/components/admin-shell";
import { DataTable } from "@/components/data-table";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { getCatalogAssets } from "@/lib/api-client";

export default async function CatalogPage() {
  const assets = await getCatalogAssets();

  return (
    <AdminShell
      title="National Discovery Catalog"
      description="Vue de gestion des assets culturels, touristiques et editoriaux. Cette page sert de base au module catalogue."
    >
      <SectionCard
        title="Assets"
        description="Recherche et edition sur /api/v1/catalog/assets, avec extension future pour lineage, imports et corrections."
      >
        <DataTable
          rows={assets}
          columns={[
            { key: "title", header: "Asset" },
            { key: "type", header: "Type" },
            { key: "region", header: "Region" },
            { key: "category", header: "Categorie" },
            { key: "source", header: "Source" },
            { key: "qualityScore", header: "Qualite" },
            {
              key: "status",
              header: "Statut",
              render: (row) => <StatusBadge status={row.status} />
            }
          ]}
        />
      </SectionCard>
    </AdminShell>
  );
}
