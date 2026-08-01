import { apiFetch, jsonRequest } from "@/lib/api/client";
import type { InternalNote, SupportConversation, SupportConversationDetail, SupportFilters, SupportMessage, SupportPage, SupportPriority, SupportStatus } from "@/features/support/types/support";

const query = (filters: SupportFilters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => value !== undefined && value !== "" && params.set(key, String(value)));
  return params.toString();
};

export const supportApi = {
  list: (filters: SupportFilters) => apiFetch<SupportPage>(`/api/v1/admin/support/conversations?${query(filters)}`),
  detail: (id: string) => apiFetch<SupportConversationDetail>(`/api/v1/admin/support/conversations/${id}`),
  reply: (id: string, content: string, attachmentMediaIds: string[] = []) => apiFetch<SupportMessage>(`/api/v1/admin/support/conversations/${id}/messages`, jsonRequest("POST", { content, attachmentMediaIds })),
  addNote: (id: string, content: string) => apiFetch<InternalNote>(`/api/v1/admin/support/conversations/${id}/notes`, jsonRequest("POST", { content })),
  assign: (id: string, assigneeId: string) => apiFetch<SupportConversation>(`/api/v1/admin/support/conversations/${id}/assign`, jsonRequest("PATCH", { assigneeId })),
  status: (id: string, status: SupportStatus, reason?: string) => apiFetch<SupportConversation>(`/api/v1/admin/support/conversations/${id}/status`, jsonRequest("PATCH", { status, reason })),
  priority: (id: string, priority: SupportPriority, reason?: string) => apiFetch<SupportConversation>(`/api/v1/admin/support/conversations/${id}/priority`, jsonRequest("PATCH", { priority, reason }))
};
