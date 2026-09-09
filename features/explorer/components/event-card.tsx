import Link from "next/link";
import type { Route } from "next";
import { CalendarDays } from "lucide-react";
import type { EventSummary } from "@/features/explorer/types";
export function EventCard({ event }: { event: EventSummary }) { return <article className="yy-explorer-card"><span className="yy-place-fallback"><CalendarDays aria-hidden="true" /></span><span className="yy-event-card__copy"><strong>{event.title}</strong><small>{new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(event.startAt))}</small><small>{event.registeredCount}{event.capacity !== null ? ` / ${event.capacity}` : ""} participant{event.registeredCount > 1 ? "s" : ""}</small></span><Link href={`/events/${event.id}` as Route}>Voir</Link></article>; }
