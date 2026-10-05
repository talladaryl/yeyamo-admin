import { describe, expect, it } from "vitest";
import { can } from "@/features/auth/permissions";
import type { AdminSession } from "@/lib/api/types";
import { adminNavigation } from "@/lib/admin-config";
import { groupVisibleAdminModules } from "@/lib/admin-navigation-groups";

const session: AdminSession = {
  id: 1,
  email: "admin@yeyamo.test",
  roles: ["ADMIN"],
  permissions: ["users:read", "payments:refund"],
  scopes: ["campaign:approve"]
};

describe("RBAC administrateur", () => {
  it("autorise un rôle, une permission et un scope présents", () => {
    expect(can(session, { roles: ["ADMIN"] })).toBe(true);
    expect(can(session, { permissions: ["users:read"] })).toBe(true);
    expect(can(session, { scopes: ["campaign:approve"] })).toBe(true);
  });

  it("masque les actions sans permission ou scope", () => {
    expect(can(session, { permissions: ["users:suspend"] })).toBe(false);
    expect(can(session, { scopes: ["campaign:reject"] })).toBe(false);
    expect(can(null, { roles: ["ADMIN"] })).toBe(false);
  });

  it("exige chaque famille de contraintes déclarée", () => {
    expect(can(session, { roles: ["ADMIN"], permissions: ["payments:refund"], scopes: ["campaign:approve"] })).toBe(true);
    expect(can(session, { roles: ["ADMIN"], permissions: ["payments:refund"], scopes: ["campaign:reject"] })).toBe(false);
  });
  it("regroupe chaque module visible autorisé sans modifier son RBAC", () => {
    const visible = adminNavigation.filter((module) => module.showInSidebar !== false && can(session, module));
    const { dashboard, groups, ungrouped } = groupVisibleAdminModules(visible);
    const grouped = [dashboard, ...groups.flatMap((group) => group.modules), ...ungrouped].filter(Boolean);
    expect(grouped.map((module) => module!.href).sort()).toEqual(visible.map((module) => module.href).sort());
    expect(new Set(grouped.map((module) => module!.href)).size).toBe(grouped.length);
    expect(groups.every((group) => group.modules.length > 0)).toBe(true);
  });

  it.each(["SUPER_ADMIN", "ADMIN", "MODERATOR", "EDITOR", "SUPPORT", "COMMERCIAL"])("préserve les liens visibles pour le rôle %s", (role) => {
    const roleSession = { ...session, roles: [role] };
    const visible = adminNavigation.filter((module) => module.showInSidebar !== false && can(roleSession, module));
    const { dashboard, groups, ungrouped } = groupVisibleAdminModules(visible);
    const groupedHrefs = [dashboard, ...groups.flatMap((group) => group.modules), ...ungrouped].filter(Boolean).map((module) => module!.href);
    expect(groupedHrefs.sort()).toEqual(visible.map((module) => module.href).sort());
  });
});
