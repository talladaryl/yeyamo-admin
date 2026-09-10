import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GET as artisans } from "@/app/api/public/artisans/route";
import { POST as contact } from "@/app/api/user/artisans/[id]/contact/route";
const artisanId = "11111111-1111-4111-8111-111111111111";
describe("culture market BFF", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("rejects invalid pagination before calling the public backend", async () => { const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock); const response = await artisans(new NextRequest("https://yeyamo.test/api/public/artisans?size=500")); expect(response.status).toBe(400); expect(fetchMock).not.toHaveBeenCalled(); });
  it("never forwards browser credentials through the public BFF", async () => { const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ content: [], number: 0, size: 20, totalPages: 0, totalElements: 0, last: true }), { status: 200 })); vi.stubGlobal("fetch", fetchMock); await artisans(new NextRequest("https://yeyamo.test/api/public/artisans", { headers: { authorization: "Bearer browser", cookie: "admin=x" } })); const options = fetchMock.mock.calls[0][1] as RequestInit; expect(new Headers(options.headers).has("Authorization")).toBe(false); expect(new Headers(options.headers).has("Cookie")).toBe(false); });
  it("rejects artisan contact without CSRF before backend access", async () => { const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock); const response = await contact(new NextRequest(`https://yeyamo.test/api/user/artisans/${artisanId}/contact`, { method: "POST" }), { params: Promise.resolve({ id: artisanId }) }); expect(response.status).toBe(403); expect(fetchMock).not.toHaveBeenCalled(); });
});
