import type { PageResponse } from "@/lib/api/types";

export type NewsletterStatus = "DRAFT" | "SCHEDULED" | "SENDING" | "PAUSED" | "SENT" | "CANCELLED";
export type NewsletterSegment = { userTypes: string[]; regionIds: string[]; activityLevels: string[]; partnerStatuses: string[] };
export type NewsletterCampaign = { id: string; name: string; subject: string; preheader?: string | null; content: string; status: NewsletterStatus; audience: NewsletterSegment; scheduledAt?: string | null; createdBy: string; createdAt: string; updatedAt: string };
export type NewsletterCampaignInput = { name: string; subject: string; preheader?: string; content: string; audience: NewsletterSegment };
export type NewsletterStats = { campaignId: string; delivered: number; failed: number; opened: number; clicked: number; unsubscribed: number; updatedAt: string };
export type NewsletterPage = PageResponse<NewsletterCampaign>;
