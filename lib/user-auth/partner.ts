export const partnerStatuses = ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "NEEDS_INFO", "REQUIRES_CHANGES", "APPROVED", "REJECTED", "SUSPENDED", "DELETED"] as const;
export type PartnerStatus = typeof partnerStatuses[number];
export function partnerAccess(status: PartnerStatus | null) {
  if (!status) return "APPLICATION_REQUIRED" as const;
  if (status === "APPROVED") return "ALLOWED" as const;
  if (status === "SUSPENDED" || status === "DELETED") return "BLOCKED" as const;
  return "STATUS_VIEW" as const;
}
