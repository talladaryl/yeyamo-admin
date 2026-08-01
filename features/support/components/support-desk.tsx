"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supportApi } from "@/features/support/api/support-api";
import type { SupportPriority, SupportStatus } from "@/features/support/types/support";
import { queryKeys } from "@/lib/query/query-keys";
import { AdminEmptyState, AdminErrorState, AdminPageHeader, AdminSkeleton, AdminStatusBadge } from "@/components/admin/ui/admin-foundation";
import { useAdminToast } from "@/components/admin/ui/admin-toast";

export function SupportDesk({ conversationId }: { conversationId?: string }) {
  const [selectedId, setSelectedId] = useState(conversationId);
  const [status, setStatus] = useState("");
  const [reply, setReply] = useState("");
  const [note, setNote] = useState("");
  const client = useQueryClient();
  const { toast } = useAdminToast();
  const list = useQuery({ queryKey: [...queryKeys.support.all, status], queryFn: () => supportApi.list({ page: 0, size: 50, status }) });
  const detail = useQuery({ queryKey: queryKeys.support.detail(selectedId ?? ""), queryFn: () => supportApi.detail(selectedId!), enabled: Boolean(selectedId) });
  const refresh = async () => { await client.invalidateQueries({ queryKey: queryKeys.support.all }); if (selectedId) await client.invalidateQueries({ queryKey: queryKeys.support.detail(selectedId) }); };
  const send = useMutation({ mutationFn: () => supportApi.reply(selectedId!, reply), onSuccess: async () => { setReply(""); await refresh(); toast({ title: "Réponse envoyée", tone: "success" }); } });
  const addNote = useMutation({ mutationFn: () => supportApi.addNote(selectedId!, note), onSuccess: async () => { setNote(""); await refresh(); toast({ title: "Note interne ajoutée", tone: "success" }); } });
  const setConversationStatus = useMutation({ mutationFn: (value: SupportStatus) => supportApi.status(selectedId!, value), onSuccess: refresh });
  const setPriority = useMutation({ mutationFn: (value: SupportPriority) => supportApi.priority(selectedId!, value), onSuccess: refresh });
  const conversation = detail.data?.conversation;
  return <div className="admin-feature"><AdminPageHeader title="Support YeYamo" description="Console support isolée de la messagerie sociale utilisateur."/><nav className="admin-tabs">{["", "OPEN", "PENDING", "RESOLVED"].map((value) => <button key={value || "ALL"} aria-pressed={status === value} onClick={() => setStatus(value)}>{value || "Toutes"}</button>)}</nav><div className="support-desk"><aside className="support-desk__list">{list.isLoading ? <AdminSkeleton/> : list.error ? <AdminErrorState error={list.error}/> : list.data?.content.length ? list.data.content.map((item) => <button key={item.id} onClick={() => setSelectedId(item.id)} aria-pressed={selectedId === item.id}><strong>{item.subject}</strong><small>{item.userId} · {item.priority}</small><AdminStatusBadge status={item.status}/></button>) : <AdminEmptyState title="Aucune conversation support"/>}</aside><main className="support-desk__messages"><header><strong>{conversation?.subject ?? "Sélectionnez une conversation"}</strong></header>{detail.isLoading ? <AdminSkeleton/> : detail.error ? <AdminErrorState error={detail.error}/> : detail.data ? <>{detail.data.messages.map((message) => <article key={message.id}><strong>{message.senderType}</strong><p>{message.content}</p><small>{new Date(message.createdAt).toLocaleString("fr-FR")}</small></article>)}</> : <AdminEmptyState title="Aucune conversation sélectionnée"/>}<footer><textarea value={reply} onChange={(event) => setReply(event.target.value)} disabled={!selectedId} placeholder="Répondre…"/><button disabled={!selectedId || reply.trim().length === 0 || send.isPending} onClick={() => send.mutate()}>Envoyer</button></footer></main><aside className="support-desk__context"><h3>Contexte</h3>{conversation ? <><Link href={`/admin/users/${conversation.userId}`}>Utilisateur<small>{conversation.userId}</small></Link><h3>Gestion</h3><label>Statut<select value={conversation.status} onChange={(event) => setConversationStatus.mutate(event.target.value as SupportStatus)}><option>OPEN</option><option>PENDING</option><option>RESOLVED</option></select></label><label>Priorité<select value={conversation.priority} onChange={(event) => setPriority.mutate(event.target.value as SupportPriority)}><option>LOW</option><option>NORMAL</option><option>HIGH</option><option>URGENT</option></select></label><label>Note interne<textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Jamais visible par l’utilisateur"/></label><button disabled={note.trim().length === 0 || addNote.isPending} onClick={() => addNote.mutate()}>Ajouter la note</button><h3>SLA</h3><p>Première réponse : {conversation.firstResponseAt ? new Date(conversation.firstResponseAt).toLocaleString("fr-FR") : "En attente"}</p><p>Résolution : {conversation.resolvedAt ? new Date(conversation.resolvedAt).toLocaleString("fr-FR") : "Non résolue"}</p></> : <AdminEmptyState title="Contexte indisponible"/>}</aside></div></div>;
}
