import { apiFetch, jsonRequest } from "@/lib/api/client";
import type { ApiRecord, PageResponse } from "@/lib/api/types";

const query = (values: Record<string, string | number | undefined>) => {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => value !== undefined && params.set(key, String(value)));
  const encoded = params.toString();
  return encoded ? `?${encoded}` : "";
};

export const adminApi = {
  users: {
    list: () => apiFetch<ApiRecord[]>("/api/v1/admin/users"),
    get: (id: string) => apiFetch<ApiRecord>(`/api/v1/admin/users/${id}`),
    create: (payload: ApiRecord) => apiFetch<ApiRecord>("/api/v1/admin/users", jsonRequest("POST", payload)),
    update: (id: string, payload: ApiRecord) => apiFetch<ApiRecord>(`/api/v1/admin/users/${id}`, jsonRequest("PUT", payload))
  },
  auditLogs: () => apiFetch<ApiRecord[]>("/api/v1/admin/audit-logs"),
  reports: {
    list: (status?: string) => apiFetch<ApiRecord[]>(`/api/v1/admin/reports${query({ status })}`),
    resolve: (id: string, payload: ApiRecord) => apiFetch<ApiRecord>(`/api/v1/admin/reports/${id}/resolution`, jsonRequest("PATCH", payload))
  },
  validations: {
    partners: (status?: string) => apiFetch<ApiRecord[]>(`/api/v1/admin/validations/partners${query({ status })}`),
    reviewPartner: (id: string, payload: ApiRecord) => apiFetch<ApiRecord>(`/api/v1/admin/validations/partners/${id}/review`, jsonRequest("PATCH", payload)),
    places: (status?: string) => apiFetch<ApiRecord[]>(`/api/v1/admin/validations/places${query({ status })}`),
    reviewPlace: (id: string, payload: ApiRecord) => apiFetch<ApiRecord>(`/api/v1/admin/validations/places/${id}/review`, jsonRequest("PATCH", payload))
  },
  moderationActions: {
    history: (targetType: string, targetId: string) => apiFetch<ApiRecord[]>(`/api/v1/admin/moderation-actions${query({ targetType, targetId })}`),
    apply: (payload: ApiRecord) => apiFetch<ApiRecord>("/api/v1/admin/moderation-actions", jsonRequest("POST", payload))
  },
  moderation: {
    queue: (status?: string, limit = 100) => apiFetch<ApiRecord[]>(`/api/v1/moderation/reports${query({ status, limit })}`),
    get: (id: string) => apiFetch<ApiRecord>(`/api/v1/moderation/reports/${id}`),
    review: (id: string) => apiFetch<ApiRecord>(`/api/v1/moderation/reports/${id}/review`, jsonRequest("POST")),
    decide: (id: string, payload: ApiRecord) => apiFetch<ApiRecord>(`/api/v1/moderation/reports/${id}/decision`, jsonRequest("POST", payload)),
    audit: (limit = 100) => apiFetch<ApiRecord[]>(`/api/v1/moderation/audit${query({ limit })}`),
    trust: (subjectId: string) => apiFetch<ApiRecord>(`/api/v1/trust/${subjectId}`)
  },
  analytics: {
    dashboard: () => apiFetch<ApiRecord>("/api/v1/analytics/admin/dashboard"),
    kpis: () => apiFetch<ApiRecord[]>("/api/v1/analytics/kpis"),
    events: () => apiFetch<ApiRecord[]>("/api/v1/analytics/event-logs"),
    rebuild: () => apiFetch<ApiRecord>("/api/v1/analytics/business/admin/rebuild", jsonRequest("POST"))
  },
  catalog: {
    assets: (limit = 100) => apiFetch<ApiRecord[]>(`/api/v1/catalog/assets${query({ limit })}`),
    updateStatus: (id: string, status: string) => apiFetch<ApiRecord>(`/api/v1/catalog/assets/${id}/status`, jsonRequest("PATCH", { status })),
    remove: (id: string) => apiFetch<void>(`/api/v1/catalog/assets/${id}`, jsonRequest("DELETE"))
  },
  campaigns: {
    list: (status?: string) => apiFetch<ApiRecord[]>(`/api/v1/admin/campaigns${query({ status })}`),
    approve: (id: string, comment?: string) => apiFetch<ApiRecord>(`/api/v1/admin/campaigns/${id}/approve`, jsonRequest("POST", { comment })),
    reject: (id: string, reason: string) => apiFetch<ApiRecord>(`/api/v1/admin/campaigns/${id}/reject`, jsonRequest("POST", { reason }))
  },
  commerce: {
    promotions: (page = 0, size = 50) => apiFetch<PageResponse<ApiRecord>>(`/api/v1/commerce/admin/promotions${query({ page, size })}`),
    disablePromotion: (id: string) => apiFetch<ApiRecord>(`/api/v1/commerce/admin/promotions/${id}/disable`, jsonRequest("POST")),
    ledger: (partnerId: string) => apiFetch<ApiRecord[]>(`/api/v1/commerce/admin/ledger/${partnerId}`)
  },
  missions: {
    list: () => apiFetch<ApiRecord[]>("/api/v1/missions"),
    activate: (id: string) => apiFetch<ApiRecord>(`/api/v1/mission-management/missions/${id}/activate`, jsonRequest("POST")),
    pause: (id: string) => apiFetch<ApiRecord>(`/api/v1/mission-management/missions/${id}/pause`, jsonRequest("POST"))
  }
};
