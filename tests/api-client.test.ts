import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiFetch } from "@/lib/api/client";

const response = (status: number, body?: unknown) => new Response(body === undefined ? undefined : JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

describe("client API et refresh", () => {
  beforeEach(() => vi.stubGlobal("fetch", vi.fn()));

  it("retourne la réponse réelle", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(response(200, { id: 1 }));
    await expect(apiFetch("/api/v1/users/1")).resolves.toEqual({ id: 1 });
    expect(fetch).toHaveBeenCalledWith("/api/backend/api/v1/users/1", expect.objectContaining({ cache: "no-store" }));
  });

  it("rafraîchit puis rejoue une seule fois après 401", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(response(401, {})).mockResolvedValueOnce(response(200, {})).mockResolvedValueOnce(response(200, { ok: true }));
    await expect(apiFetch("/api/v1/users")).resolves.toEqual({ ok: true });
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(fetch).toHaveBeenNthCalledWith(2, "/api/auth/refresh", expect.objectContaining({ method: "POST" }));
  });

  it("conserve le code, le correlationId et les détails backend", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(response(409, { code: "CONFLICT", message: "Conflit", correlationId: "corr-1", details: { field: "email" } }));
    const error = await apiFetch("/api/v1/users").catch((value) => value);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 409, code: "CONFLICT", correlationId: "corr-1", details: { field: "email" } });
  });
});
