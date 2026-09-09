import type { UserAuthErrorPayload } from "@/lib/user-auth/types";

const knownCodes = new Set([
  "INVALID_CREDENTIALS", "EMAIL_ALREADY_USED", "EMAIL_NOT_VERIFIED", "ACCOUNT_DISABLED",
  "INVALID_REFRESH_TOKEN", "REFRESH_TOKEN_REUSE_DETECTED", "SESSION_NOT_FOUND",
  "TURNSTILE_REQUIRED", "TURNSTILE_VERIFICATION_FAILED", "TURNSTILE_HOSTNAME_MISMATCH",
  "TURNSTILE_ACTION_MISMATCH", "TURNSTILE_PROVIDER_UNAVAILABLE", "OTP_REQUIRED",
  "OTP_INVALID", "OTP_EXPIRED", "EMAIL_DELIVERY_FAILED"
]);

export function normalizeUserAuthError(status: number, value: unknown, correlationId?: string): UserAuthErrorPayload {
  const payload = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const rawCode = typeof payload.code === "string" ? payload.code : "AUTH_ERROR";
  const code = knownCodes.has(rawCode) ? rawCode : status === 429 ? "RATE_LIMITED" : "AUTH_ERROR";
  const safeDefault = status >= 500
    ? "Le service d’authentification est momentanément indisponible."
    : "L’opération d’authentification a échoué.";
  return {
    code,
    message: typeof payload.message === "string" ? payload.message : safeDefault,
    correlationId: typeof payload.correlationId === "string" ? payload.correlationId : correlationId,
    retryable: status === 429 || status >= 500
  };
}
