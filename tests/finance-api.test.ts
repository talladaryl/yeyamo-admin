import { beforeEach, describe, expect, it, vi } from "vitest";
import { financeApi } from "@/features/finance/api/finance-api";

describe("sécurité des mutations financières", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: "ok" }), { status: 200, headers: { "Content-Type": "application/json" } })));
    vi.stubGlobal("crypto", { randomUUID: vi.fn().mockReturnValue("idem-123") });
  });

  it("ajoute une clé d’idempotence au remboursement", async () => {
    await financeApi.refund("payment-1", 1200);
    expect(fetch).toHaveBeenCalledWith("/api/backend/api/v1/payments/payment-1/refunds", expect.objectContaining({ headers: expect.objectContaining({ "Idempotency-Key": "idem-123" }) }));
  });

  it("ajoute une clé d’idempotence à l’ajustement ledger", async () => {
    await financeApi.adjustment("partner-1", { amount: 500, currency: "XAF", reason: "Correction" });
    expect(fetch).toHaveBeenCalledWith("/api/backend/api/v1/commerce/admin/ledger/partner-1/adjustments", expect.objectContaining({ headers: expect.objectContaining({ "Idempotency-Key": "idem-123" }) }));
  });
});
