import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GET as status } from "@/app/api/user/partner/status/route";
import { POST as create } from "@/app/api/user/partner/profile/route";
import { GET as bookings } from "@/app/api/user/partner/bookings/route";
import { GET as artworks } from "@/app/api/user/partner/artworks/route";
describe("partner portal BFF", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("traduit l’absence backend en état NOT_PARTNER", async () => { vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 404 }))); const request = new NextRequest("https://yeyamo.test/api/user/partner/status", { headers: { cookie: "yeyamo_user_access=token" } }); const response = await status(request); expect(response.status).toBe(200); expect(await response.json()).toMatchObject({ state: "NOT_PARTNER", profile: null }); expect(response.headers.get("cache-control")).toContain("no-store"); });
  it("rejette la création sans CSRF avant le backend", async () => { const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock); const response = await create(new NextRequest("https://yeyamo.test/api/user/partner/profile", { method: "POST", body: "{}" })); expect(response.status).toBe(403); expect(fetchMock).not.toHaveBeenCalled(); });
  it("rejette une pagination Partner non bornée avant le backend", async () => { const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock); const response = await bookings(new NextRequest("https://yeyamo.test/api/user/partner/bookings?page=-1")); expect(response.status).toBe(400); expect(fetchMock).not.toHaveBeenCalled(); });
  it("rejette une pagination Artwork invalide avant le backend", async () => { const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock); const response = await artworks(new NextRequest("https://yeyamo.test/api/user/partner/artworks?page=all")); expect(response.status).toBe(400); expect(fetchMock).not.toHaveBeenCalled(); });
});
