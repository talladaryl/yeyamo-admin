export type ProtectedActionLevel = "L1" | "L2" | "L3" | "L4";
export type AuthIntent = {
  type: "LIKE" | "FOLLOW" | "FAVORITE";
  resourceType: string;
  resourceId: string;
  next: string;
  expiresAt: number;
  nonce: string;
};

export function createL1Intent(input: Omit<AuthIntent, "expiresAt" | "nonce">): AuthIntent {
  return { ...input, expiresAt: Date.now() + 10 * 60_000, nonce: crypto.randomUUID() };
}

export function isIntentExpired(intent: AuthIntent, now = Date.now()) {
  return intent.expiresAt <= now;
}

export function protectedActionDecision(authenticated: boolean, level: ProtectedActionLevel) {
  if (!authenticated) return "AUTH_REQUIRED" as const;
  return level === "L1" ? "RUN" as const : "CONFIRM_REQUIRED" as const;
}
