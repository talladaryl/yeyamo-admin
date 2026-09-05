import { NextRequest, NextResponse } from "next/server";
import type { AdminSession } from "@/lib/api/types";
import { USER_COOKIE } from "@/lib/server/backend";

export async function GET(request: NextRequest) {
  const value = request.cookies.get(USER_COOKIE)?.value;
  if (!value) return NextResponse.json({ code: "UNAUTHENTICATED", message: "Session requise." }, { status: 401 });
  try {
    const stored = JSON.parse(value) as Partial<AdminSession>;
    if (!stored.id || !stored.email || !Array.isArray(stored.roles)) throw new Error("Invalid session");
    const session: AdminSession = { id: stored.id, email: stored.email, firstName: stored.firstName, lastName: stored.lastName, avatar: stored.avatar, roles: stored.roles, permissions: stored.permissions ?? [], scopes: stored.scopes ?? [] };
    return NextResponse.json(session);
  } catch {
    return NextResponse.json({ code: "SESSION_INVALID", message: "Session invalide." }, { status: 401 });
  }
}
