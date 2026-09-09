"use client";

import Link from "next/link";
import type { Route } from "next";
import { Bookmark, Heart, MessageCircle, Share2, UserRound } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { FeedItem } from "@/features/feed/types";
import { IconButton } from "@/components/public/ui";
import { useProtectedAction } from "@/features/user-auth/protected-action-context";
import { userAuthFetch } from "@/lib/user-auth/client";

function formatDate(value: string) { return new Intl.DateTimeFormat("fr", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(value)); }
async function mutateInteraction(postId: string, interaction: "like" | "favorite", active: boolean) { return userAuthFetch<void>(`/api/user/feed/posts/${postId}/${interaction}`, { method: active ? "DELETE" : "PUT", headers: { "Idempotency-Key": crypto.randomUUID() } }); }

export function PostCard({ item }: { item: FeedItem }) {
  const protectedAction = useProtectedAction(); const [expanded, setExpanded] = useState(false); const [liked, setLiked] = useState(false); const [saved, setSaved] = useState(false); const [copied, setCopied] = useState(false);
  const like = useMutation({ mutationFn: () => mutateInteraction(item.id, "like", liked), onSuccess: () => setLiked((value) => !value) });
  const favorite = useMutation({ mutationFn: () => mutateInteraction(item.id, "favorite", saved), onSuccess: () => setSaved((value) => !value) });
  const share = async () => { const url = new URL(`/posts/${item.id}`, window.location.origin).toString(); if (navigator.share) await navigator.share({ url, text: item.caption ?? undefined }).catch(() => undefined); else { await navigator.clipboard.writeText(url); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } };
  const long = Boolean(item.caption && item.caption.length > 280);
  return <article className="yy-post-card" aria-labelledby={`post-${item.id}-author`}><header className="yy-post-header"><div className="yy-post-author-icon"><UserRound aria-hidden="true" /></div><div><strong id={`post-${item.id}-author`}>Publication Yeyamo</strong><time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time></div><Link href={`/posts/${item.id}` as Route} className="yy-post-open">Ouvrir</Link></header>{item.caption ? <div className={`yy-post-caption ${long && !expanded ? "is-collapsed" : ""}`}><p>{item.caption}</p>{long ? <button type="button" onClick={() => setExpanded((value) => !value)}>{expanded ? "Voir moins" : "Voir plus"}</button> : null}</div> : null}{item.hashtags.length ? <p className="yy-post-tags">{item.hashtags.map((tag) => <span key={tag}>#{tag} </span>)}</p> : null}{item.mediaIds.length ? <p className="yy-post-media-notice">{item.mediaIds.length} média{item.mediaIds.length > 1 ? "s" : ""} associé{item.mediaIds.length > 1 ? "s" : ""}</p> : null}<div className="yy-post-stats" aria-label="Statistiques"><span>{item.stats.likes} j’aime</span><span>{item.stats.comments} commentaires</span><span>{item.stats.shares} partages</span></div><footer className="yy-post-actions"><IconButton label={liked ? "Ne plus aimer" : "Aimer"} aria-pressed={liked} disabled={like.isPending} onClick={() => protectedAction({ reason: "Connectez-vous pour aimer cette publication", level: "L1", intent: { type: "LIKE", resourceType: "post", resourceId: item.id }, run: () => like.mutate() })}><Heart fill={liked ? "currentColor" : "none"} aria-hidden="true" /></IconButton><Link className="yy-post-action-link" href={`/posts/${item.id}` as Route} aria-label={`Voir les ${item.stats.comments} commentaires`}><MessageCircle aria-hidden="true" /></Link><IconButton label="Partager" onClick={() => void share()}><Share2 aria-hidden="true" /></IconButton><IconButton label={saved ? "Retirer des favoris" : "Ajouter aux favoris"} aria-pressed={saved} disabled={favorite.isPending} onClick={() => protectedAction({ reason: "Connectez-vous pour enregistrer cette publication", level: "L1", intent: { type: "FAVORITE", resourceType: "post", resourceId: item.id }, run: () => favorite.mutate() })}><Bookmark fill={saved ? "currentColor" : "none"} aria-hidden="true" /></IconButton></footer>{like.error || favorite.error ? <p className="yy-post-error" role="alert">L’action n’a pas pu être enregistrée.</p> : null}{copied ? <p className="yy-post-copied" role="status">Lien copié</p> : null}</article>;
}
