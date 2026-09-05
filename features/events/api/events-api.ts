import { apiFetch, jsonRequest } from "@/lib/api/client";
import type { AnalyticsMetric, EventDetail, EventFilters, EventInput, EventPage, EventParticipant, EventStatus, EventUpdateInput, PageResponse, ScanStatistics } from "@/features/events/types/event";
const query = (filters: EventFilters) => { const params = new URLSearchParams(); Object.entries(filters).forEach(([key, value]) => value !== undefined && value !== "" && params.set(key, String(value))); return params.toString(); };
export const eventsApi = {
  list: (filters: EventFilters) => apiFetch<EventPage>(`/api/v1/admin/events?${query(filters)}`),
  upcoming: () => apiFetch<EventPage>("/api/v1/admin/events?page=0&size=200&sort=startAt,asc").then((page) => page.content),
  detail: (id: string) => apiFetch<EventDetail>(`/api/v1/admin/events/${id}`),
  participants: (id: string) => apiFetch<Array<Omit<EventParticipant, "registrationId" | "registeredAt">>>(`/api/v1/admin/events/${id}/participants`).then((items) => items.map((item) => ({ ...item, registrationId: item.ticketId, registeredAt: item.issuedAt }))),
  create: (body: EventInput) => apiFetch<EventDetail>("/api/v1/admin/events", jsonRequest("POST", body)),
  update: (id: string, body: EventUpdateInput) => apiFetch<EventDetail>(`/api/v1/admin/events/${id}`, jsonRequest("PUT", body)),
  status: (id: string, status: EventStatus, reason = "Mise à jour administrative") => apiFetch<EventDetail>(`/api/v1/admin/events/${id}/status?status=${encodeURIComponent(status)}`, jsonRequest("PATCH", { reason })),
  scans: (id: string) => apiFetch<ScanStatistics>(`/api/v1/tickets/scans/stats/${id}`),
  analytics: (id: string, from: string, to: string) => apiFetch<PageResponse<AnalyticsMetric>>(`/api/v1/analytics/admin/TICKET_EVENT/${id}?from=${from}&to=${to}&size=200`)
};
