import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/user-auth/validation";
import { userBackendFetch } from "@/lib/user-auth/backend";
import { setUserSessionCookies } from "@/lib/user-auth/cookies";
import { rotateCsrf } from "@/lib/user-auth/csrf";
import { mapUserSession } from "@/lib/user-auth/session";
import { noStore, rejectInvalidMutation, unavailableError, upstreamError } from "@/lib/user-auth/route-utils";
import type { UserAuthResponse } from "@/lib/user-auth/types";

export async function POST(request: NextRequest) {
  const rejected = rejectInvalidMutation(request);
  if (rejected) return rejected;
  const parsed = registerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ code: "AUTH_ERROR", message: parsed.error.issues[0]?.message ?? "Formulaire invalide.", retryable: false }, { status: 400 });
  try {
    const upstream = await userBackendFetch(request, "/api/v1/auth/register", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data)
    });
    if (!upstream.ok) return upstreamError(upstream);
    const auth = await upstream.json() as UserAuthResponse;
    const response = NextResponse.json(mapUserSession(auth.user), { status: 201 });
    setUserSessionCookies(response, auth);
    rotateCsrf(response);
    return noStore(response);
  } catch {
    return unavailableError();
  }
}
