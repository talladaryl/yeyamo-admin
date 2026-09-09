import type { UserAuthUser, UserSessionView } from "@/lib/user-auth/types";

export function mapUserSession(user: UserAuthUser): UserSessionView {
  const capabilities = ["USER_AUTHENTICATED"];
  if (user.emailVerifiedAt) capabilities.push("EMAIL_VERIFIED");
  if (user.roles.includes("PARTNER")) capabilities.push("PARTNER_ROLE");
  return { authenticated: true, user, partner: null, capabilities };
}
