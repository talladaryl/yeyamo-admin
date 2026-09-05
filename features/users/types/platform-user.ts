import type { PageResponse } from "@/lib/api/types";
export type PlatformUserStatus = "ACTIVE" | "SUSPENDED" | "DISABLED" | "BANNED";
export type PlatformUser = { id: string; avatarUrl?: string | null; displayName?: string | null; username?: string | null; email?: string | null; phone?: string | null; roles: string[]; region?: string | null; status: PlatformUserStatus; createdAt: string; lastLoginAt?: string | null };
export type PlatformUserDetail = PlatformUser & { statistics?: Record<string, number>; permissions?: string[]; scopes?: string[] };
export type PlatformUserQuery = { page: number; size: number; search?: string; status?: string; role?: string; region?: string; createdFrom?: string; createdTo?: string; lastLoginFrom?: string; lastLoginTo?: string; sort?: string };
export type PlatformUserPage = PageResponse<PlatformUser>;
export type UpdatePlatformUserStatus = { status: PlatformUserStatus; reason: string };
export type UpdatePlatformUserRoles = { roles: string[]; reason: string };
