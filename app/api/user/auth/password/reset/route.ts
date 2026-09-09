import { NextRequest } from "next/server";
import { forwardPublicAuth } from "@/lib/user-auth/public-auth-route";
import { resetPasswordSchema } from "@/lib/user-auth/validation";
export async function POST(request: NextRequest) { return forwardPublicAuth(request, "/api/v1/auth/password/reset", resetPasswordSchema); }
