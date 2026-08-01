"use client";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AdminModule } from "@/lib/admin-config";
import type { ApiRecord, PageResponse } from "@/lib/api/types";
import { resourceFor, type ResourceAction } from "@/lib/admin-resources";
import { queryKeys } from "@/lib/query/query-keys";
import { AdminDataTable, type AdminColumn } from "@/components/admin/ui/admin-data-table";
import { AdminPageHeader } from "@/components/admin/ui/admin-foundation";
import { useAdminToast } from "@/components/admin/ui/admin-toast";

const display = (value: unknown) => value === null || value === undefined || value === "" ? "—" : typeof value === "object" ? JSON.stringify(value) : String(value);

export function AdminResourcePage({ module }: { module: AdminModule }) {
  const resource = useMemo(() => resourceFor(module), [module]); const queryClient = useQueryClient(); const { toast } = useAdminToast(); const [running, setRunning] = useState<string>();
  const key = queryKeys.settings.list({ route: module.href });
  const query = useQuery({ queryKey: key, queryFn: async () => { if (!resource) return []; const result = await resource.load(); return Array.isArray(result) ? result : (result as PageResponse<ApiRecord>).content ?? []; }, enabled: Boolean(resource) });
  const mutation = useMutation({ mutationFn: async ({ action, record }: { action: ResourceAction; record: ApiRecord }) => action.run(record), onSuccess: async () => { toast({ title: "Action enregistrée", tone: "success" }); await queryClient.invalidateQueries({ queryKey: key }); }, onError: (error) => toast({ title: "Action impossible", message: error instanceof Error ? error.message : undefined, tone: "error" }), onSettled: () => setRunning(undefined) });
  if (!resource) return <section className="admin-section-card admin-resource-empty"><h2>{module.label}</h2><p>Aucune API d’administration exploitable n’existe actuellement pour ce module.</p></section>;
  const records = query.data ?? []; const fields = Array.from(new Set(records.flatMap(Object.keys))).slice(0, 8); const columns: AdminColumn<ApiRecord>[] = fields.map((field) => ({ id: field, header: field, cell: (record) => <span title={display(record[field])}>{display(record[field])}</span> }));
  return <div className="admin-resource"><AdminPageHeader title={resource.title} description={resource.description} actions={<button type="button" onClick={() => void query.refetch()} disabled={query.isFetching}>Actualiser</button>} /><section className="admin-section-card admin-resource__table-wrap"><AdminDataTable rows={records} columns={columns} rowKey={(record) => String(record.id ?? JSON.stringify(record))} loading={query.isLoading} error={query.error ?? undefined} onRetry={() => void query.refetch()} actions={resource.actions ? (record) => <div className="admin-resource__actions">{resource.actions?.map((action) => { const actionKey = `${action.label}-${display(record.id)}`; return <button key={action.label} type="button" data-tone={action.tone} disabled={mutation.isPending} onClick={() => { setRunning(actionKey); mutation.mutate({ action, record }); }}>{running === actionKey ? "…" : action.label}</button>; })}</div> : undefined} /></section></div>;
}
