"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/features/notifications/api/notifications-api";
import type { AdminNotification, NotificationCategory } from "@/features/notifications/types/notification";
import { queryKeys } from "@/lib/query/query-keys";
import { AdminDataTable, type AdminColumn } from "@/components/admin/ui/admin-data-table";
import { AdminEmptyState, AdminErrorState, AdminPageHeader, AdminStatusBadge } from "@/components/admin/ui/admin-foundation";

function category(type: string): NotificationCategory {
  const normalized = type.toLowerCase();
  if (normalized.includes("moderation")) return "moderation";
  if (normalized.includes("partner") || normalized.includes("kyc")) return "KYC";
  if (normalized.includes("payment")) return "payment";
  if (normalized.includes("booking")) return "booking";
  if (normalized.includes("campaign")) return "campaign";
  if (normalized.includes("security")) return "security";
  if (normalized.includes("support")) return "support";
  return "system";
}

export function notificationHref(notification: AdminNotification) {
  const id = notification.resourceId;
  if (!id || !/^[a-zA-Z0-9-]+$/.test(id)) return "/admin/notifications";
  switch ((notification.resourceType ?? "").toUpperCase()) {
    case "REPORT": return `/admin/moderation/${id}`;
    case "PARTNER":
    case "KYC": return `/admin/partners/${id}`;
    case "PAYMENT": return `/admin/payments/${id}`;
    case "BOOKING": return `/admin/reservations/${id}`;
    case "CAMPAIGN": return `/admin/campaigns/${id}`;
    case "SUPPORT_CONVERSATION": return `/admin/messages/${id}`;
    default: return "/admin/notifications";
  }
}

export function AdminNotificationBell() {
  const [open, setOpen] = useState(false);
  const count = useQuery({ queryKey: [...queryKeys.notifications.all, "count"], queryFn: notificationsApi.count, refetchInterval: 60000 });
  return <div className="admin-notification-bell"><button type="button" className="admin-topbar__icon-button" aria-label={`Notifications, ${count.data?.count ?? 0} non lues`} aria-expanded={open} onClick={() => setOpen((value) => !value)}><Bell size={18}/>{count.data?.count ? <span>{count.data.count > 99 ? "99+" : count.data.count}</span> : null}</button>{open ? <AdminNotificationDropdown onClose={() => setOpen(false)}/> : null}</div>;
}

export function AdminNotificationDropdown({ onClose }: { onClose: () => void }) {
  const query = useQuery({ queryKey: [...queryKeys.notifications.all, "dropdown"], queryFn: () => notificationsApi.list(0, 8) });
  const unread = query.data?.content.filter((item) => !item.readAt) ?? [];
  return <section className="admin-notification-dropdown" aria-label="Notifications non lues"><header><strong>Notifications</strong><Link href="/admin/notifications" onClick={onClose}>Tout voir</Link></header>{query.isLoading ? <p>Chargement…</p> : query.error ? <AdminErrorState error={query.error}/> : unread.length ? unread.map((item) => <Link key={item.id} href={notificationHref(item) as never} onClick={onClose}><strong>{item.title}</strong><small>{item.message}</small></Link>) : <AdminEmptyState title="Aucune notification non lue"/>}</section>;
}

export function AdminNotificationCenter() {
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState("");
  const client = useQueryClient();
  const query = useQuery({ queryKey: queryKeys.notifications.list({ page, filter }), queryFn: () => notificationsApi.list(page, 20, filter || undefined) });
  const read = useMutation({ mutationFn: (id: string) => notificationsApi.read(id), onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.notifications.all }) });
  const unread = useMutation({ mutationFn: (id: string) => notificationsApi.unread(id), onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.notifications.all }) });
  const all = useMutation({ mutationFn: notificationsApi.readAll, onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.notifications.all }) });
  const columns: AdminColumn<AdminNotification>[] = [
    { id: "category", header: "Catégorie", cell: (item) => <AdminStatusBadge status={category(item.type)}/> },
    { id: "title", header: "Notification", cell: (item) => <><strong>{item.title}</strong><p>{item.message}</p></> },
    { id: "date", header: "Date", cell: (item) => new Date(item.createdAt).toLocaleString("fr-FR") },
    { id: "status", header: "Statut", cell: (item) => item.readAt ? "Lue" : "Non lue" }
  ];
  return <div className="admin-feature"><AdminPageHeader title="Notifications administratives" description="Notifications du compte administrateur authentifié." actions={<button onClick={() => all.mutate()} disabled={all.isPending}>Tout marquer lu</button>}/><select value={filter} onChange={(event) => { setFilter(event.target.value); setPage(0); }}><option value="">Toutes catégories</option>{["moderation", "KYC", "payment", "booking", "campaign", "system", "security", "support"].map((value) => <option key={value}>{value}</option>)}</select><section className="admin-section-card"><AdminDataTable rows={query.data?.content ?? []} columns={columns} rowKey={(item) => item.id} loading={query.isLoading} error={query.error ?? undefined} actions={(item) => <div className="admin-row-actions"><Link href={notificationHref(item) as never}>Ouvrir</Link><button onClick={() => item.readAt ? unread.mutate(item.id) : read.mutate(item.id)}>{item.readAt ? "Marquer non lue" : "Marquer lue"}</button></div>}/></section><nav className="admin-pagination"><button disabled={page === 0} onClick={() => setPage((value) => value - 1)}>Précédent</button><span>Page {page + 1}</span><button disabled={query.data?.last ?? true} onClick={() => setPage((value) => value + 1)}>Suivant</button></nav></div>;
}
