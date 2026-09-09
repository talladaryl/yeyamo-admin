import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { publicBackendFetch } from "@/lib/public/backend";

describe("Public Feed BFF", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("never forwards browser cookies or Authorization", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 })); vi.stubGlobal("fetch", fetchMock);
    const request = new NextRequest("https://yeyamo.test/api/public/feed", { headers: { cookie: "yeyamo_admin_access=admin; yeyamo_user_access=user", authorization: "Bearer hostile" } });
    await publicBackendFetch(request, "/api/v1/public/feed", "?page=0&size=20");
    const init = fetchMock.mock.calls[0][1] as RequestInit; const headers = new Headers(init.headers);
    expect(headers.has("Authorization")).toBe(false); expect(headers.has("Cookie")).toBe(false);
  });
  it("rejects arbitrary upstream URLs", async () => { const request = new NextRequest("https://yeyamo.test/api/public/feed"); await expect(publicBackendFetch(request, "https://evil.test/feed")).rejects.toThrow("PUBLIC_BACKEND_PATH_FORBIDDEN"); });
});
