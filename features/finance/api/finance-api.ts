import { apiFetch, jsonRequest } from "@/lib/api/client";
import type { Balance, Commission, CommissionInput, LedgerEntry, Page, Payment, Promotion, PromotionInput, Refund } from "@/features/finance/types/finance";

const idempotencyKey = () => crypto.randomUUID();

export const financeApi = {
  payments: (params: URLSearchParams) => apiFetch<Page<Payment>>(`/api/v1/payments/admin?${params}`),
  payment: (id: string) => apiFetch<Payment>(`/api/v1/payments/admin/${id}`),
  refunds: (id: string) => apiFetch<Refund[]>(`/api/v1/payments/${id}/refunds`),
  refund: (id: string, amount: number, reason = "Remboursement administrateur") =>
    apiFetch<Refund>(`/api/v1/payments/${id}/refunds`, jsonRequest("POST", { amount, reason }, { "Idempotency-Key": idempotencyKey() })),
  promotions: (page = 0, size = 20, status?: string, partnerId?: string) => apiFetch<Page<Promotion>>(`/api/v1/commerce/admin/promotions?page=${page}&size=${size}${status ? `&status=${status}` : ""}${partnerId ? `&partnerId=${partnerId}` : ""}`),
  promotion: (id: string) => apiFetch<Promotion>(`/api/v1/commerce/admin/promotions/${id}`),
  savePromotion: (body: PromotionInput, id?: string) => apiFetch<Promotion>(`/api/v1/commerce/admin/promotions${id ? `/${id}` : ""}`, jsonRequest(id ? "PUT" : "POST", body)),
  disablePromotion: (id: string) => apiFetch<Promotion>(`/api/v1/commerce/admin/promotions/${id}/disable`, jsonRequest("POST")),
  commission: (body: CommissionInput) => apiFetch<Commission>("/api/v1/commerce/admin/commissions", jsonRequest("POST", body)),
  ledger: (partnerId: string) => apiFetch<LedgerEntry[]>(`/api/v1/commerce/admin/ledger/${partnerId}`),
  balance: (partnerId: string, currency: string) => apiFetch<Balance>(`/api/v1/commerce/admin/ledger/${partnerId}/balance/${currency}`),
  adjustment: (partnerId: string, body: { orderId?: string; amount: number; currency: string; reason: string }) => apiFetch<LedgerEntry>(`/api/v1/commerce/admin/ledger/${partnerId}/adjustments`, jsonRequest("POST", body, { "Idempotency-Key": idempotencyKey() })),
  movement: (partnerId: string, body: { orderId?: string; type: string; amount: number; currency: string; reason: string }) => apiFetch<LedgerEntry>(`/api/v1/commerce/admin/ledger/${partnerId}/movements`, jsonRequest("POST", body, { "Idempotency-Key": idempotencyKey() })),
};
