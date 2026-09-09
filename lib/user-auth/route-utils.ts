import { NextRequest, NextResponse } from "next/server";
import { normalizeUserAuthError } from "@/lib/user-auth/errors";
import { validateUserMutation } from "@/lib/user-auth/csrf";

export function rejectInvalidMutation(request: NextRequest) {
  return validateUserMutation(request)
    ? undefined
    : NextResponse.json({ code: "CSRF_VALIDATION_FAILED", message: "Requête de sécurité invalide.", retryable: false }, { status: 403 });
}

export async function upstreamError(response: Response) {
  const correlationId = response.headers.get("x-correlation-id") ?? undefined;
  const payload = await response.json().catch(() => ({}));
  return NextResponse.json(normalizeUserAuthError(response.status, payload, correlationId), { status: response.status });
}

export function unavailableError() {
  return NextResponse.json(
    { code: "AUTH_ERROR", message: "Le service d’authentification est momentanément indisponible.", retryable: true },
    { status: 503 }
  );
}

export function noStore(response: NextResponse) {
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Pragma", "no-cache");
  return response;
}
