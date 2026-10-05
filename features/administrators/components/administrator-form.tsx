"use client";
import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { administratorSchema, type AdministratorFormValues } from "@/features/administrators/schemas/administrator-schema";
import { administratorsApi } from "@/features/administrators/api/administrators-api";
import type { Administrator, AdministratorRole, AdministratorStatus } from "@/features/administrators/types/administrator";
import { queryKeys } from "@/lib/query/query-keys";
import { useAdminToast } from "@/components/admin/ui/admin-toast";
import { AdminErrorState, AdminPageHeader } from "@/components/admin/ui/admin-foundation";
import { AdminCheckboxGroup, AdminRadioGroup } from "@/components/admin/ui/admin-choice-group";

const roles = [{ value: "ADMIN", label: "Administrateur" }, { value: "MODERATOR", label: "Modérateur" }, { value: "SUPER_ADMIN", label: "Super administrateur" }] as const;
const statuses = [{ value: "ACTIVE", label: "Actif" }, { value: "INACTIVE", label: "Inactif" }, { value: "SUSPENDED", label: "Suspendu" }] as const;
const knownPermissions = ["users:read", "users:suspend", "payments:refund"] as const;

export function AdministratorForm({ administrator }: { administrator?: Administrator }) {
  const router = useRouter(); const client = useQueryClient(); const { toast } = useAdminToast();
  const initialPermissions = Object.entries(administrator?.permissions ?? {}).filter(([, enabled]) => Boolean(enabled)).map(([permission]) => permission);
  const permissionOptions = useMemo(() => [...new Set<string>([...knownPermissions, ...Object.keys(administrator?.permissions ?? {})])].sort().map((permission) => ({ value: permission, label: permission })), [administrator?.permissions]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(initialPermissions);
  const [values, setValues] = useState<AdministratorFormValues>({ userId: administrator?.userId ?? "", role: administrator?.role ?? "ADMIN", status: administrator?.status ?? "ACTIVE", permissionsText: JSON.stringify(Object.fromEntries(initialPermissions.map((permission) => [permission, true]))) });
  const [error, setError] = useState<string>();
  const updatePermissions = (permissions: string[]) => { setSelectedPermissions(permissions); setValues((current) => ({ ...current, permissionsText: JSON.stringify(Object.fromEntries(permissions.map((permission) => [permission, true]))) })); };
  const mutation = useMutation({ mutationFn: async () => { const parsed = administratorSchema.safeParse(values); if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Formulaire invalide"); return administrator ? administratorsApi.update(administrator.id, parsed.data) : administratorsApi.create(parsed.data); }, onSuccess: async (result) => { await client.invalidateQueries({ queryKey: queryKeys.administrators.all }); toast({ title: administrator ? "Administrateur modifié" : "Administrateur créé", tone: "success" }); router.push(`/admin/administrators/${result.id}` as never); }, onError: (caught) => setError(caught instanceof Error ? caught.message : "Enregistrement impossible") });
  return <div className="admin-feature"><AdminPageHeader title={administrator ? "Modifier l’administrateur" : "Nouvel administrateur"} description="Le backend lie un compte utilisateur existant par son UUID. L’identité et l’email ne font pas partie de ce contrat."/>{error ? <AdminErrorState error={error}/> : null}<form className="admin-form" onSubmit={(event) => { event.preventDefault(); mutation.mutate(); }}><label>UUID utilisateur<input value={values.userId} onChange={(event) => setValues({ ...values, userId: event.target.value })} required/></label><AdminRadioGroup legend="Rôle" value={values.role} options={roles} onChange={(role: AdministratorRole) => setValues({ ...values, role })}/><AdminRadioGroup legend="Statut" value={values.status} options={statuses} onChange={(status: AdministratorStatus) => setValues({ ...values, status })}/><AdminCheckboxGroup legend="Permissions" values={selectedPermissions} options={permissionOptions} onChange={updatePermissions}/><button className="admin-button" disabled={mutation.isPending}>{mutation.isPending ? "Enregistrement…" : "Enregistrer"}</button></form></div>;
}
