import { NextRequest, NextResponse } from "next/server";
import { clearUserSessionCookies, setUserSessionCookies } from "@/lib/user-auth/cookies";
import { rotateCsrf } from "@/lib/user-auth/csrf";
import { refreshUserSession } from "@/lib/user-auth/refresh";
import { mapUserSession } from "@/lib/user-auth/session";
import { noStore, rejectInvalidMutation } from "@/lib/user-auth/route-utils";

export async function POST(request: NextRequest) {
  const rejected = rejectInvalidMutation(request);
  if (rejected) return rejected;
  try {
    const auth = await refreshUserSession(request);
    const response = NextResponse.json(mapUserSession(auth.user));
    setUserSessionCookies(response, auth);
    rotateCsrf(response);
    return noStore(response);
  } catch {
    const response = NextResponse.json({ code: "INVALID_REFRESH_TOKEN", message: "Session expirée.", retryable: false }, { status: 401 });
    clearUserSessionCookies(response);
    return noStore(response);
  }
}
