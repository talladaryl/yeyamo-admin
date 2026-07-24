import { AdminShell } from "@/components/admin-shell";
import { DataTable } from "@/components/data-table";
import { SectionCard } from "@/components/section-card";
import { getUsers } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <AdminShell
      title="Utilisateurs"
      description="Gestion des comptes, visibilite, activite et preparation des workflows de suspension et d'export."
    >
      <SectionCard
        title="Liste utilisateurs"
        description="Source: user-service /api/v1/users. Pagination et filtres serveur a brancher ensuite."
        actions={
          <div className="flex gap-2">
            <button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600">
              Export CSV
            </button>
            <button type="button" className="rounded-lg bg-rose-700 px-3 py-2 text-sm font-semibold text-white">
              Bulk action
            </button>
          </div>
        }
      >
        <DataTable
          rows={users.content}
          columns={[
            { key: "displayName", header: "Utilisateur" },
            { key: "language", header: "Langue" },
            { key: "visibility", header: "Visibilite" },
            {
              key: "bio",
              header: "Bio",
              render: (row) => <span className="line-clamp-2 text-slate-500">{row.bio ?? "-"}</span>
            },
            {
              key: "createdAt",
              header: "Inscription",
              render: (row) => formatDate(row.createdAt)
            }
          ]}
        />
      </SectionCard>
    </AdminShell>
  );
}
