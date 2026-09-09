import { describe, expect, it } from "vitest";
import { mapComments, mapPublicProfile, normalizeComment } from "@/features/social/mapper";

const userId = "11111111-1111-4111-8111-111111111111";
const postId = "22222222-2222-4222-8222-222222222222";
const commentId = "33333333-3333-4333-8333-333333333333";

describe("Social public mapping", () => {
  it("keeps only the public profile contract", () => { const profile = mapPublicProfile({ id: userId, displayName: "Awa", avatarUrl: null, bio: null, language: "fr", visibility: "PUBLIC", createdAt: "2026-09-09T08:00:00Z", email: "private@yeyamo.test", phone: "+237", roles: ["ADMIN"], kyc: true }); expect(profile).toEqual({ id: userId, displayName: "Awa", avatarUrl: null, bio: null, language: "fr", visibility: "PUBLIC", createdAt: "2026-09-09T08:00:00Z" }); expect(profile).not.toHaveProperty("email"); });
  it("filters non-active comments and validates comment text", () => { expect(mapComments([{ id: commentId, postId, parentId: null, authorId: userId, body: "Bonjour", status: "ACTIVE", createdAt: "2026-09-09T08:00:00Z", updatedAt: null }, { id: "44444444-4444-4444-8444-444444444444", postId, parentId: null, authorId: userId, body: "Hidden", status: "HIDDEN", createdAt: "2026-09-09T08:00:00Z", updatedAt: null }])).toHaveLength(1); expect(normalizeComment(" \u0000 Bonjour ")).toBe("Bonjour"); expect(normalizeComment("   ")).toBe(""); });
});
