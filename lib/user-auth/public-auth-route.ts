import { NextRequest, NextResponse } from "next/server";
import type { ZodType } from "zod";
import { userBackendFetch } from "@/lib/user-auth/backend";
import { noStore, rejectInvalidMutation, unavailableError, upstreamError } from "@/lib/user-auth/route-utils";

export async function forwardPublicAuth(request: NextRequest, path: string, schema: ZodType) {
  const rejected = rejectInvalidMutation(request);
  if (rejected) return rejected;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ code: "AUTH_ERROR", message: parsed.error.issues[0]?.message ?? "Formulaire invalide.", retryable: false }, { status: 400 });
  try {
    const upstream = await userBackendFetch(request, path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
    if (!upstream.ok) return upstreamError(upstream);
    return noStore(NextResponse.json(await upstream.json().catch(() => ({ success: true }))));
  } catch { return unavailableError(); }
}
