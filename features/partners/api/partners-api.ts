import { apiFetch, jsonRequest } from "@/lib/api/client";
import type { LedgerEntry, Partner, PartnerBalance, PartnerDetail, PartnerDocument, PartnerHistory, PartnerPage, PartnerReview, PartnerValidation } from "@/features/partners/types/partner";

type PartnerSummaryDto = Omit<Partner, "name" | "websiteUrl" | "description">;
type PartnerDetailDto = { partner: PartnerSummaryDto; kycDocuments: PartnerDocument[]; validationHistory: PartnerHistory[] };
const mapPartner = (partner: PartnerSummaryDto): Partner => ({ ...partner, name: partner.tradeName || partner.legalName, websiteUrl: null, description: null });

export const partnersApi = {
  list: (search: string, page: number, size: number, sort?: string, status?: string) =>
    apiFetch<Omit<PartnerPage, "content"> & { content: PartnerSummaryDto[] }>(`/api/v1/admin/partners?search=${encodeURIComponent(search)}&page=${page}&size=${size}${status ? `&status=${encodeURIComponent(status)}` : ""}${sort ? `&sort=${encodeURIComponent(sort)}` : ""}`)
      .then((response) => ({ ...response, content: response.content.map(mapPartner) })),
  detail: (id: string) => apiFetch<PartnerDetailDto>(`/api/v1/admin/partners/${id}`)
    .then((response): PartnerDetail => ({ ...mapPartner(response.partner), kycDocuments: response.kycDocuments, validationHistory: response.validationHistory })),
  kyc: (id: string) => apiFetch<PartnerDocument[]>(`/api/v1/admin/partners/${id}/kyc`),
  history: (id: string) => apiFetch<PartnerHistory[]>(`/api/v1/admin/partners/${id}/validation-history`),
  validations: (status?: string) => apiFetch<PartnerValidation[]>(`/api/v1/admin/validations/partners${status ? `?status=${encodeURIComponent(status)}` : ""}`),
  review: (id: string, body: PartnerReview) => apiFetch<PartnerValidation>(`/api/v1/admin/validations/partners/${id}/review`, jsonRequest("PATCH", {
    decision: body.status === "NEEDS_INFO" || body.status === "REQUIRES_CHANGES" ? "CORRECTIONS_REQUIRED" : body.status,
    reason: body.reviewComment,
    comment: body.reviewComment
  })),
  ledger: (partnerId: string) => apiFetch<LedgerEntry[]>(`/api/v1/commerce/admin/ledger/${partnerId}`),
  balance: (partnerId: string, currency: string) => apiFetch<PartnerBalance>(`/api/v1/commerce/admin/ledger/${partnerId}/balance/${currency}`),
  adjustment: (partnerId: string, body: { orderId?: string; amount: number; currency: string; reason: string }) => apiFetch<LedgerEntry>(`/api/v1/commerce/admin/ledger/${partnerId}/adjustments`, jsonRequest("POST", body, { "Idempotency-Key": crypto.randomUUID() })),
  movement: (partnerId: string, body: { orderId?: string; type: string; amount: number; currency: string; reason: string }) => apiFetch<LedgerEntry>(`/api/v1/commerce/admin/ledger/${partnerId}/movements`, jsonRequest("POST", body, { "Idempotency-Key": crypto.randomUUID() }))
};
