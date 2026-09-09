import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GET as nearby } from "@/app/api/public/places/nearby/route";
import { GET as search } from "@/app/api/public/search/route";

describe("Explorer public BFF", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("rejects an invalid nearby query before reaching upstream", async () => { const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock); const response = await nearby(new NextRequest("https://yeyamo.test/api/public/places/nearby?lat=200&lng=9")); expect(response.status).toBe(400); expect(fetchMock).not.toHaveBeenCalled(); });
  it("forwards a valid query to the certified public endpoint", async () => { const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ page: 0, size: 20, hasNext: false, items: [], generatedAt: "2026-09-09T08:00:00Z" }), { status: 200 })); vi.stubGlobal("fetch", fetchMock); const response = await search(new NextRequest("https://yeyamo.test/api/public/search?q=Douala")); expect(response.status).toBe(200); expect(fetchMock.mock.calls[0][0]).toContain("/api/v1/public/search?q=Douala&page=0&size=20"); });
});
