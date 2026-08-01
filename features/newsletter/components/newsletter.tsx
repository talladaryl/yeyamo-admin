"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { newsletterApi } from "@/features/newsletter/api/newsletter-api";
import type { NewsletterCampaign, NewsletterCampaignInput, NewsletterSegment } from "@/features/newsletter/types/newsletter";
import { queryKeys } from "@/lib/query/query-keys";
import { AdminDataTable, type AdminColumn } from "@/components/admin/ui/admin-data-table";
import { AdminEmptyState, AdminErrorState, AdminPageHeader, AdminSkeleton, AdminStatusBadge, AdminTabs } from "@/components/admin/ui/admin-foundation";
import { useAdminToast } from "@/components/admin/ui/admin-toast";

const emptySegment: NewsletterSegment = { userTypes: [], regionIds: [], activityLevels: [], partnerStatuses: [] };
const emptyInput: NewsletterCampaignInput = { name: "", subject: "", preheader: "", content: "", audience: emptySegment };

export function NewsletterList() {
  const [page, setPage] = useState(0);
  const query = useQuery({ queryKey: [...queryKeys.newsletter.all, page], queryFn: () => newsletterApi.list(page) });
  const columns: AdminColumn<NewsletterCampaign>[] = [
    { id: "name", header: "Campagne", cell: (item) => item.name },
    { id: "subject", header: "Sujet", cell: (item) => item.subject },
    { id: "status", header: "Statut", cell: (item) => <AdminStatusBadge status={item.status}/> },
    { id: "schedule", header: "Programmation", cell: (item) => item.scheduledAt ? new Date(item.scheduledAt).toLocaleString("fr-FR") : "Non programmée" },
    { id: "created", header: "Création", cell: (item) => new Date(item.createdAt).toLocaleString("fr-FR") }
  ];
  return <div className="admin-feature"><AdminPageHeader title="Newsletter & Communication" description="Campagnes email gérées par notification-service." actions={<Link className="admin-button" href="/admin/newsletter/new">Composer</Link>}/><section className="admin-section-card"><AdminDataTable rows={query.data?.content ?? []} columns={columns} rowKey={(item) => item.id} loading={query.isLoading} error={query.error ?? undefined} page={page} size={25} total={query.data?.totalElements} onPageChange={setPage} actions={(item) => <Link href={`/admin/newsletter/${item.id}`}>Ouvrir</Link>}/></section></div>;
}

export function NewsletterEditor({ id }: { id?: string }) {
  const router = useRouter();
  const client = useQueryClient();
  const { toast } = useAdminToast();
  const [values, setValues] = useState<NewsletterCampaignInput>(emptyInput);
  const [preview, setPreview] = useState<"desktop" | "mobile">("desktop");
  const detail = useQuery({ queryKey: queryKeys.newsletter.detail(id ?? "new"), queryFn: () => newsletterApi.get(id!), enabled: Boolean(id) });
  useEffect(() => {
    if (!detail.data) return;
    const campaign = detail.data;
    queueMicrotask(() => setValues({ name: campaign.name, subject: campaign.subject, preheader: campaign.preheader ?? "", content: campaign.content, audience: campaign.audience }));
  }, [detail.data]);
  const save = useMutation({ mutationFn: () => id ? newsletterApi.update(id, values) : newsletterApi.create(values), onSuccess: async (campaign) => { await client.invalidateQueries({ queryKey: queryKeys.newsletter.all }); toast({ title: "Campagne enregistrée", tone: "success" }); router.push(`/admin/newsletter/${campaign.id}`); } });
  const action = useMutation({ mutationFn: (name: "send" | "pause" | "cancel") => newsletterApi[name](id!), onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.newsletter.all }) });
  if (detail.isLoading) return <AdminSkeleton/>;
  return <div className="admin-feature"><AdminPageHeader title={id ? `Newsletter ${values.name}` : "Nouvelle newsletter"} description="Éditeur texte sécurisé : aucun HTML arbitraire n’est exécuté." actions={id ? <div className="admin-row-actions"><button onClick={() => action.mutate("send")}>Envoyer</button><button onClick={() => action.mutate("pause")}>Pause</button><button onClick={() => action.mutate("cancel")}>Annuler</button></div> : undefined}/>{detail.error ? <AdminErrorState error={detail.error}/> : null}<div className="newsletter-editor"><form className="admin-form" onSubmit={(event) => { event.preventDefault(); save.mutate(); }}><label>Nom<input required value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })}/></label><label>Sujet<input required value={values.subject} onChange={(event) => setValues({ ...values, subject: event.target.value })}/></label><label>Preheader<input value={values.preheader} onChange={(event) => setValues({ ...values, preheader: event.target.value })}/></label><label>Contenu texte<textarea required rows={12} value={values.content} onChange={(event) => setValues({ ...values, content: event.target.value })}/></label><label>Régions ciblées<input value={values.audience.regionIds.join(",")} onChange={(event) => setValues({ ...values, audience: { ...values.audience, regionIds: event.target.value.split(",").map((value) => value.trim()).filter(Boolean) } })}/></label><button className="admin-button" disabled={save.isPending}>Enregistrer</button>{save.error ? <AdminErrorState error={save.error}/> : null}</form><section><AdminTabs tabs={[{ id: "desktop", label: "Desktop" }, { id: "mobile", label: "Mobile" }]} active={preview} onChange={(value) => setPreview(value as typeof preview)}/><article className="newsletter-preview" data-mode={preview}><small>{values.preheader || "Preheader"}</small><h2>{values.subject || "Sujet de la campagne"}</h2><div className="newsletter-preview__body">{values.content || "Votre contenu apparaîtra ici."}</div></article></section></div></div>;
}

export function NewsletterDetail({ id }: { id: string }) { return <NewsletterEditor id={id}/>; }
export function NewsletterAudiences() { return <div className="admin-feature"><AdminPageHeader title="Audiences Newsletter"/><section className="admin-section-card"><h3>Segments backend disponibles</h3><ul><li>Types d’utilisateurs</li><li>Régions</li><li>Niveaux d’activité</li><li>Statuts partenaires</li></ul></section><AdminEmptyState title="Les audiences sont intégrées à chaque campagne" description="Le backend ne fournit pas de CRUD séparé de segments enregistrés."/></div>; }
