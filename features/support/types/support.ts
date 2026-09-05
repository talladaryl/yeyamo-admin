import type { PageResponse } from "@/lib/api/types";

export type SupportStatus = "OPEN" | "PENDING" | "RESOLVED";
export type SupportPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";
export type SupportConversation = {
  id: string;
  userId: string;
  subject: string;
  status: SupportStatus;
  priority: SupportPriority;
  assigneeAdminId?: string | null;
  createdAt: string;
  updatedAt: string;
  firstResponseAt?: string | null;
  resolvedAt?: string | null;
  responseDurationSeconds?: number | null;
  resolutionDurationSeconds?: number | null;
};
export type SupportMessage = { id: string; senderType: string; senderId: string; content: string; attachmentMediaIds: string[]; createdAt: string };
export type InternalNote = { id: string; authorAdminId: string; content: string; createdAt: string };
export type SupportConversationDetail = { conversation: SupportConversation; messages: SupportMessage[]; internalNotes: InternalNote[] };
export type SupportPage = PageResponse<SupportConversation>;
export type SupportFilters = { page: number; size: number; status?: string; priority?: string; assigneeId?: string; userId?: string; search?: string; createdFrom?: string; createdTo?: string };
