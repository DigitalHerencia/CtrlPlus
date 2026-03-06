/**
 * Tests for lib/auth/rbac.ts
 *
 * Verifies PERMISSIONS map structure and roleHasPermission logic.
 */
import { describe, expect, it, vi } from "vitest";

// Mock @/lib/prisma to prevent DATABASE_URL initialization error
// (rbac.ts re-exports from lib/tenancy/assert which imports prisma)
vi.mock("@/lib/prisma", () => ({
  prisma: {},
}));

import { PERMISSIONS, roleHasPermission, type Permission, type TenantRole } from "../rbac";

// ---------------------------------------------------------------------------
// PERMISSIONS map structure
// ---------------------------------------------------------------------------

describe("PERMISSIONS map", () => {
  it("defines catalog permissions covering owner, admin and member", () => {
    expect(PERMISSIONS["catalog:view"]).toContain("owner");
    expect(PERMISSIONS["catalog:view"]).toContain("admin");
    expect(PERMISSIONS["catalog:view"]).toContain("member");
  });

  it("restricts catalog:delete to owner and admin only", () => {
    expect(PERMISSIONS["catalog:delete"]).toContain("owner");
    expect(PERMISSIONS["catalog:delete"]).toContain("admin");
    expect(PERMISSIONS["catalog:delete"]).not.toContain("member");
  });

  it("restricts billing:manage to owner only", () => {
    expect(PERMISSIONS["billing:manage"]).toContain("owner");
    expect(PERMISSIONS["billing:manage"]).not.toContain("admin");
    expect(PERMISSIONS["billing:manage"]).not.toContain("member");
  });

  it("restricts settings:update to owner only", () => {
    expect(PERMISSIONS["settings:update"]).toContain("owner");
    expect(PERMISSIONS["settings:update"]).not.toContain("admin");
    expect(PERMISSIONS["settings:update"]).not.toContain("member");
  });
});

// ---------------------------------------------------------------------------
// roleHasPermission
// ---------------------------------------------------------------------------

describe("roleHasPermission", () => {
  it("grants owner all catalog permissions", () => {
    const perms: Permission[] = [
      "catalog:view",
      "catalog:create",
      "catalog:update",
      "catalog:delete",
    ];
    for (const perm of perms) {
      expect(roleHasPermission("owner", perm)).toBe(true);
    }
  });

  it("grants admin all catalog permissions including delete", () => {
    expect(roleHasPermission("admin", "catalog:view")).toBe(true);
    expect(roleHasPermission("admin", "catalog:create")).toBe(true);
    expect(roleHasPermission("admin", "catalog:update")).toBe(true);
    expect(roleHasPermission("admin", "catalog:delete")).toBe(true);
  });

  it("grants member only catalog:view", () => {
    expect(roleHasPermission("member", "catalog:view")).toBe(true);
    expect(roleHasPermission("member", "catalog:create")).toBe(false);
    expect(roleHasPermission("member", "catalog:delete")).toBe(false);
  });

  it("grants owner billing:manage but not admin or member", () => {
    expect(roleHasPermission("owner", "billing:manage")).toBe(true);
    expect(roleHasPermission("admin", "billing:manage")).toBe(false);
    expect(roleHasPermission("member", "billing:manage")).toBe(false);
  });

  it("returns false for member trying to access user management", () => {
    expect(roleHasPermission("member", "users:view")).toBe(false);
    expect(roleHasPermission("member", "users:manage")).toBe(false);
  });

  it("grants admin users:view and users:invite", () => {
    expect(roleHasPermission("admin", "users:view")).toBe(true);
    expect(roleHasPermission("admin", "users:invite")).toBe(true);
    expect(roleHasPermission("admin", "users:manage")).toBe(false);
  });

  it("handles valid TenantRole values without error", () => {
    const roles: TenantRole[] = ["owner", "admin", "member"];
    for (const role of roles) {
      expect(typeof roleHasPermission(role, "catalog:view")).toBe("boolean");
    }
  });
});
