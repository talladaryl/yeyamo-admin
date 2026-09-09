import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GET as profile } from "@/app/api/public/users/[id]/route";
import { GET as comments } from "@/app/api/public/posts/[id]/comments/route";

const id = "11111111-1111-4111-8111-111111111111";
describe("Social public BFF", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("rejects non-UUID profile paths before upstream", async () => { const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock); const response = await profile(new NextRequest("https://yeyamo.test/api/public/users/not-an-id"), { params: Promise.resolve({ id: "not-an-id" }) }); expect(response.status).toBe(404); expect(fetchMock).not.toHaveBeenCalled(); });
  it("turns unavailable public comments into an explicit blocker", async () => { vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 503 }))); const response = await comments(new NextRequest(`https://yeyamo.test/api/public/posts/${id}/comments?limit=1`), { params: Promise.resolve({ id }) }); await expect(response.json()).resolves.toMatchObject({ code: "BLOCKED_PUBLIC_COMMENTS_API" }); });
});
