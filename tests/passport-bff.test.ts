import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { POST as claim } from "@/app/api/user/passport/rewards/[id]/claim/route";

const id = "11111111-1111-4111-8111-111111111111";

describe("passport BFF", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("rejette une réclamation sans protection CSRF", async () => { const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock); const response = await claim(new NextRequest(`https://yeyamo.test/api/user/passport/rewards/${id}/claim`, { method: "POST" }), { params: Promise.resolve({ id }) }); expect(response.status).toBe(403); expect(fetchMock).not.toHaveBeenCalled(); });
  it("rejette un identifiant invalide avant tout accès backend", async () => { const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock); const request = new NextRequest("https://yeyamo.test/api/user/passport/rewards/nope/claim", { method: "POST", headers: { origin: "https://yeyamo.test", host: "yeyamo.test", cookie: "yeyamo_user_csrf=token", "x-csrf-token": "token" } }); const response = await claim(request, { params: Promise.resolve({ id: "nope" }) }); expect(response.status).toBe(404); expect(fetchMock).not.toHaveBeenCalled(); });
});
