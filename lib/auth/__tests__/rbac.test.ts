import { describe, expect, it, vi } from "vitest";

// Mock prisma to prevent DATABASE_URL requirement during import
vi.mock("@/lib/prisma", () => ({
  prisma: {
    tenantUserMembership: { findUnique: vi.fn() },
  },
}));

import { PERMISSIONS, ROLES, roleHasPermission, type TenantRole } from "../rbac";

// ---------------------------------------------------------------------------
// ROLES constant
// ---------------------------------------------------------------------------

describe("ROLES", () => {
  it("defines owner, admin, and member roles", () => {
    expect(ROLES.owner).toBeDefined();
    expect(ROLES.admin).toBeDefined();
    expect(ROLES.member).toBeDefined();
  });

  it("each role has a name and description", () => {
    for (const role of Object.values(ROLES)) {
      expect(role.name).toBeTruthy();
      expect(role.description).toBeTruthy();
    }
  });
});

// ---------------------------------------------------------------------------
// PERMISSIONS constant
// ---------------------------------------------------------------------------

describe("PERMISSIONS", () => {
  it("defines catalog permissions", () => {
    expect(PERMISSIONS["catalog:view"]).toBeDefined();
    expect(PERMISSIONS["catalog:create"]).toBeDefined();
    expect(PERMISSIONS["catalog:update"]).toBeDefined();
    expect(PERMISSIONS["catalog:delete"]).toBeDefined();
  });

  it("defines booking permissions", () => {
    expect(PERMISSIONS["booking:view"]).toBeDefined();
    expect(PERMISSIONS["booking:create"]).toBeDefined();
  });

  it("defines settings permissions", () => {
    expect(PERMISSIONS["settings:view"]).toBeDefined();
    expect(PERMISSIONS["settings:update"]).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// roleHasPermission
// ---------------------------------------------------------------------------

describe("roleHasPermission", () => {
  it("grants owner all permissions", () => {
    const ownerRole: TenantRole = "owner";
    expect(roleHasPermission(ownerRole, "catalog:view")).toBe(true);
    expect(roleHasPermission(ownerRole, "catalog:create")).toBe(true);
    expect(roleHasPermission(ownerRole, "catalog:delete")).toBe(true);
    expect(roleHasPermission(ownerRole, "settings:update")).toBe(true);
    expect(roleHasPermission(ownerRole, "users:manage")).toBe(true);
  });

  it("grants admin elevated but not owner-only permissions", () => {
    const adminRole: TenantRole = "admin";
    expect(roleHasPermission(adminRole, "catalog:create")).toBe(true);
    expect(roleHasPermission(adminRole, "catalog:delete")).toBe(true);
    expect(roleHasPermission(adminRole, "settings:view")).toBe(true);
    expect(roleHasPermission(adminRole, "settings:update")).toBe(false);
    expect(roleHasPermission(adminRole, "users:manage")).toBe(false);
  });

  it("grants member read-only catalog and booking access", () => {
    const memberRole: TenantRole = "member";
    expect(roleHasPermission(memberRole, "catalog:view")).toBe(true);
    expect(roleHasPermission(memberRole, "booking:view")).toBe(true);
    expect(roleHasPermission(memberRole, "booking:create")).toBe(true);
  });

  it("denies member write access to catalog, billing, and settings", () => {
    const memberRole: TenantRole = "member";
    expect(roleHasPermission(memberRole, "catalog:create")).toBe(false);
    expect(roleHasPermission(memberRole, "catalog:delete")).toBe(false);
    expect(roleHasPermission(memberRole, "billing:view")).toBe(false);
    expect(roleHasPermission(memberRole, "settings:view")).toBe(false);
  });
});
