import { NextRequest, NextResponse } from "next/server";
import { describe, expect, it } from "vitest";
import { clearUserSessionCookies, setUserSessionCookies, USER_ACCESS_COOKIE, USER_REFRESH_COOKIE } from "@/lib/user-auth/cookies";
import { createCsrfToken, validateUserMutation } from "@/lib/user-auth/csrf";
import { normalizeUserAuthError } from "@/lib/user-auth/errors";
import { createL1Intent, isIntentExpired, protectedActionDecision } from "@/lib/user-auth/intents";
import { validateNextPath } from "@/lib/user-auth/next-path";
import { mapUserSession } from "@/lib/user-auth/session";

describe("User Auth security foundation", () => {
  it.each(["https://evil.test", "//evil.test", "\\evil.test", "javascript:alert(1)", "%2F%2Fevil.test", "data:text/html,test"])("rejects unsafe next path %s", (value) => expect(validateNextPath(value)).toBe("/"));
  it("keeps a local next path", () => expect(validateNextPath("/explorer?q=ville#top")).toBe("/explorer?q=ville#top"));

  it("sets isolated HttpOnly User cookies", () => {
    const response = NextResponse.json({});
    setUserSessionCookies(response, { accessToken: "access", refreshToken: "refresh", tokenType: "Bearer", expiresIn: 60, user: { id: 1, email: "a@yeyamo.test", phone: null, status: "ACTIVE", roles: ["USER"], permissions: [], scopes: [], createdAt: "2026-01-01", emailVerifiedAt: null } });
    expect(response.cookies.get(USER_ACCESS_COOKIE)?.value).toBe("access");
    expect(response.cookies.get(USER_REFRESH_COOKIE)?.value).toBe("refresh");
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
    expect(response.headers.get("set-cookie")).not.toContain("yeyamo_admin");
    clearUserSessionCookies(response);
    expect(response.cookies.get(USER_ACCESS_COOKIE)?.value).toBe("");
  });

  it("validates same-origin double-submit CSRF", () => {
    const token = createCsrfToken();
    const request = new NextRequest("https://yeyamo.test/api/user/auth/login", { headers: { origin: "https://yeyamo.test", host: "yeyamo.test", "x-forwarded-proto": "https", "sec-fetch-site": "same-origin", "x-csrf-token": token, cookie: `yeyamo_user_csrf=${token}` } });
    expect(validateUserMutation(request)).toBe(true);
    const crossSite = new NextRequest("https://yeyamo.test/api/user/auth/login", { headers: { origin: "https://evil.test", host: "yeyamo.test", "x-forwarded-proto": "https", "x-csrf-token": token, cookie: `yeyamo_user_csrf=${token}` } });
    expect(validateUserMutation(crossSite)).toBe(false);
  });

  it("normalizes known and unknown errors", () => {
    expect(normalizeUserAuthError(401, { code: "INVALID_CREDENTIALS", message: "Non" }).code).toBe("INVALID_CREDENTIALS");
    expect(normalizeUserAuthError(400, { code: "INTERNAL_DETAIL", message: "Non" }).code).toBe("AUTH_ERROR");
  });

  it("maps a token-free session and capabilities", () => {
    const session = mapUserSession({ id: 1, email: "a@yeyamo.test", phone: null, status: "ACTIVE", roles: ["USER", "PARTNER"], permissions: [], scopes: [], createdAt: "2026-01-01", emailVerifiedAt: "2026-01-02" });
    expect(session.authenticated && session.capabilities).toEqual(["USER_AUTHENTICATED", "EMAIL_VERIFIED", "PARTNER_ROLE"]);
    expect(JSON.stringify(session)).not.toContain("Token");
  });

  it("expires intents and decides protected actions", () => {
    const intent = createL1Intent({ type: "LIKE", resourceType: "post", resourceId: "42", next: "/" });
    expect(isIntentExpired(intent, intent.expiresAt - 1)).toBe(false);
    expect(isIntentExpired(intent, intent.expiresAt)).toBe(true);
    expect(protectedActionDecision(false, "L1")).toBe("AUTH_REQUIRED");
    expect(protectedActionDecision(true, "L1")).toBe("RUN");
  });
});
