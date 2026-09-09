import { NextRequest, NextResponse } from "next/server";
import { userBackendFetch } from "@/lib/user-auth/backend";
import { noStore, rejectInvalidMutation } from "@/lib/user-auth/route-utils";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
async function mutate(request: NextRequest, context: { params: Promise<{ id: string; interaction: string }> }) {
  const rejected = rejectInvalidMutation(request); if (rejected) return rejected;
  const { id, interaction } = await context.params;
  if (!uuidPattern.test(id) || !["like", "favorite"].includes(interaction)) return NextResponse.json({ code: "ACTION_UNAVAILABLE", message: "Action indisponible.", retryable: false }, { status: 404 });
  const upstream = await userBackendFetch(request, `/api/v1/interactions/posts/${id}/${interaction}`, { method: request.method, authenticated: true, headers: { "Idempotency-Key": request.headers.get("idempotency-key") ?? crypto.randomUUID() } }).catch(() => undefined);
  if (!upstream) return NextResponse.json({ code: "INTERACTION_UNAVAILABLE", message: "L’action n’a pas pu être envoyée.", retryable: true }, { status: 503 });
  if (!upstream.ok) { const payload = await upstream.json().catch(() => ({})); return NextResponse.json(payload, { status: upstream.status }); }
  return noStore(new NextResponse(null, { status: 204 }));
}
export const PUT = mutate;
export const DELETE = mutate;
