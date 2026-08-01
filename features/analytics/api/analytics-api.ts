import { apiFetch, jsonRequest } from "@/lib/api/client";
import type { Dashboard, DateRange, EventLog, Kpi, PartnerAnalytics, PlacePopularity, PopularPlace, RegionActivity, UserEngagement } from "@/features/analytics/types/analytics";

const range = (value?: DateRange) => value ? `?from=${value.from}&to=${value.to}` : "";

export const analyticsApi = {
  dashboard: () => apiFetch<Dashboard>("/api/v1/analytics/admin/dashboard"),
  kpis: () => apiFetch<Kpi[]>("/api/v1/analytics/kpis"),
  kpi: (name: string, value: DateRange) => apiFetch<Kpi[]>(`/api/v1/analytics/kpis/${encodeURIComponent(name)}${range(value)}`),
  events: () => apiFetch<EventLog[]>("/api/v1/analytics/event-logs"),
  region: (id: string, value: DateRange) => apiFetch<RegionActivity[]>(`/api/v1/analytics/regions/${encodeURIComponent(id)}/activity${range(value)}`),
  partner: (id: string, value: DateRange) => apiFetch<PartnerAnalytics[]>(`/api/v1/analytics/partners/${id}/dashboard${range(value)}`),
  popular: (value: DateRange) => apiFetch<PopularPlace[]>(`/api/v1/analytics/places/popular${range(value)}&limit=100`),
  place: (id: string, value: DateRange) => apiFetch<PlacePopularity[]>(`/api/v1/analytics/places/${id}/popularity${range(value)}`),
  user: (id: string, value: DateRange) => apiFetch<UserEngagement[]>(`/api/v1/analytics/users/${encodeURIComponent(id)}/engagement${range(value)}`),
  rebuild: () => apiFetch<{ jobId: string; status: string; eventsReplayed?: number }>("/api/v1/analytics/business/admin/rebuild", jsonRequest("POST")),
};
