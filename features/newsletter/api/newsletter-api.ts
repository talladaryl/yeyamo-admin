import { apiFetch, jsonRequest } from "@/lib/api/client";
import type { NewsletterCampaign, NewsletterCampaignInput, NewsletterPage, NewsletterStats } from "@/features/newsletter/types/newsletter";

export const newsletterApi = {
  list: (page = 0, size = 25, search = "", status = "") => apiFetch<NewsletterPage>(`/api/v1/admin/newsletters?page=${page}&size=${size}${search ? `&search=${encodeURIComponent(search)}` : ""}${status ? `&status=${encodeURIComponent(status)}` : ""}`),
  get: (id: string) => apiFetch<NewsletterCampaign>(`/api/v1/admin/newsletters/${id}`),
  create: (input: NewsletterCampaignInput) => apiFetch<NewsletterCampaign>("/api/v1/admin/newsletters", jsonRequest("POST", input)),
  update: (id: string, input: NewsletterCampaignInput) => apiFetch<NewsletterCampaign>(`/api/v1/admin/newsletters/${id}`, jsonRequest("PUT", input)),
  send: (id: string) => apiFetch<NewsletterCampaign>(`/api/v1/admin/newsletters/${id}/send`, jsonRequest("POST")),
  schedule: (id: string, scheduledAt: string) => apiFetch<NewsletterCampaign>(`/api/v1/admin/newsletters/${id}/schedule`, jsonRequest("POST", { scheduledAt })),
  pause: (id: string) => apiFetch<NewsletterCampaign>(`/api/v1/admin/newsletters/${id}/pause`, jsonRequest("POST")),
  cancel: (id: string) => apiFetch<NewsletterCampaign>(`/api/v1/admin/newsletters/${id}/cancel`, jsonRequest("POST")),
  stats: (id: string) => apiFetch<NewsletterStats>(`/api/v1/admin/newsletters/${id}/stats`)
};
