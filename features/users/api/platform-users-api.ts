import { apiFetch, jsonRequest } from "@/lib/api/client";
import type { PlatformUserDetail, PlatformUserPage, PlatformUserQuery, UpdatePlatformUserRoles, UpdatePlatformUserStatus } from "@/features/users/types/platform-user";
const params = (query: PlatformUserQuery) => { const value = new URLSearchParams(); Object.entries(query).forEach(([key, item]) => item !== undefined && item !== "" && value.set(key, String(item))); return value.toString(); };
export const platformUsersApi = {
  list: (query: PlatformUserQuery) => apiFetch<PlatformUserPage>(`/api/v1/admin/platform-users?${params(query)}`),
  detail: (id: string) => apiFetch<PlatformUserDetail>(`/api/v1/admin/platform-users/${id}`),
  status: (id: string, payload: UpdatePlatformUserStatus) => apiFetch<PlatformUserDetail>(`/api/v1/admin/platform-users/${id}/status`, jsonRequest("PATCH", payload)),
  roles: (id: string, payload: UpdatePlatformUserRoles) => apiFetch<PlatformUserDetail>(`/api/v1/admin/platform-users/${id}/roles`, jsonRequest("PATCH", payload)),
  sessions: (id: string) => apiFetch<unknown[]>(`/api/v1/admin/platform-users/${id}/sessions`),
  revokeSessions: (id: string) => apiFetch<void>(`/api/v1/admin/platform-users/${id}/sessions/revoke`, jsonRequest("POST")),
  exportUrl: "/api/backend/api/v1/admin/platform-users/export"
};
