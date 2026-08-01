"use client";
import type { ReactNode } from "react";
import type { AdminSession } from "@/lib/api/types";
import { useAdminSession } from "@/features/auth/session-context";

export type AccessRequirement = { roles?: readonly string[]; permissions?: readonly string[]; scopes?: readonly string[] };
export function can(session: AdminSession | null, requirement: AccessRequirement) { if (!session) return false; const some = (required: readonly string[] | undefined, actual: string[]) => !required?.length || required.some((value) => actual.includes(value)); return some(requirement.roles, session.roles) && some(requirement.permissions, session.permissions) && some(requirement.scopes, session.scopes); }
export function useCan(requirement: AccessRequirement) { return can(useAdminSession().session, requirement); }
export function usePermissions() { const { session } = useAdminSession(); return { roles: session?.roles ?? [], permissions: session?.permissions ?? [], scopes: session?.scopes ?? [], can: (requirement: AccessRequirement) => can(session, requirement) }; }
export function Can({ children, fallback = null, ...requirement }: AccessRequirement & { children: ReactNode; fallback?: ReactNode }) { return useCan(requirement) ? children : fallback; }
