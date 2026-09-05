import { describe, expect, it } from "vitest";
import { can } from "@/features/auth/permissions";
import type { AdminSession } from "@/lib/api/types";

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
});
