import { NextRequest, NextResponse } from "next/server";
import { userBackendFetch } from "@/lib/user-auth/backend";
import { clearUserSessionCookies } from "@/lib/user-auth/cookies";
import { noStore, rejectInvalidMutation } from "@/lib/user-auth/route-utils";

export async function POST(request: NextRequest) {
  const rejected = rejectInvalidMutation(request);
  if (rejected) return rejected;
  await userBackendFetch(request, "/api/v1/auth/logout", { method: "POST", authenticated: true }).catch(() => undefined);
  const response = NextResponse.json({ success: true });
  clearUserSessionCookies(response);
  return noStore(response);
}
