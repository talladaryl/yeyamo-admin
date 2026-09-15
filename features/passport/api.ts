import type { Passport, PassportReward } from "@/features/passport/types";
import { userAuthFetch } from "@/lib/user-auth/client";
export const passportApi = { get: () => userAuthFetch<Passport>("/api/user/passport"), claim: (id: string) => userAuthFetch<PassportReward>(`/api/user/passport/rewards/${id}/claim`, { method: "POST" }) };
