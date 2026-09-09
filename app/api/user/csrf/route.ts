import { NextResponse } from "next/server";
import { noStore } from "@/lib/user-auth/route-utils";
import { createCsrfToken } from "@/lib/user-auth/csrf";
import { setUserCsrfCookie } from "@/lib/user-auth/cookies";

export async function GET() {
  const csrfToken = createCsrfToken();
  const response = NextResponse.json({ csrfToken });
  setUserCsrfCookie(response, csrfToken);
  return noStore(response);
}
