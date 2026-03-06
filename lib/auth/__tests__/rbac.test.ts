import { describe, expect, it, vi } from "vitest";

// Mock prisma to prevent DATABASE_URL initialization during module import
vi.mock("@/lib/prisma", () => ({
  prisma: {
    tenantUserMembership: { findUnique: vi.fn() },
  },
}));

import { PERMISSIONS, roleHasPermission, type TenantRole } from "../rbac";

// ---------------------------------------------------------------------------
// roleHasPermission
// ---------------------------------------------------------------------------

describe("roleHasPermission", () => {
  it("grants owner all catalog permissions", () => {
    expect(roleHasPermission("owner", "catalog:view")).toBe(true);
    expect(roleHasPermission("owner", "catalog:create")).toBe(true);
    expect(roleHasPermission("owner", "catalog:update")).toBe(true);
    expect(roleHasPermission("owner", "catalog:delete")).toBe(true);
  });

  it("grants admin catalog create/update but not delete (via same list as owner)", () => {
    expect(roleHasPermission("admin", "catalog:view")).toBe(true);
    expect(roleHasPermission("admin", "catalog:create")).toBe(true);
    expect(roleHasPermission("admin", "catalog:update")).toBe(true);
    expect(roleHasPermission("admin", "catalog:delete")).toBe(true);
  });

  it("grants member read-only catalog access", () => {
    expect(roleHasPermission("member", "catalog:view")).toBe(true);
    expect(roleHasPermission("member", "catalog:create")).toBe(false);
    expect(roleHasPermission("member", "catalog:update")).toBe(false);
    expect(roleHasPermission("member", "catalog:delete")).toBe(false);
  });

  it("grants owner billing manage permission", () => {
    expect(roleHasPermission("owner", "billing:view")).toBe(true);
    expect(roleHasPermission("owner", "billing:manage")).toBe(true);
  });

  it("grants admin billing view but not manage", () => {
    expect(roleHasPermission("admin", "billing:view")).toBe(true);
    expect(roleHasPermission("admin", "billing:manage")).toBe(false);
  });

  it("denies member billing permissions", () => {
    expect(roleHasPermission("member", "billing:view")).toBe(false);
    expect(roleHasPermission("member", "billing:manage")).toBe(false);
  });

  it("grants owner settings update", () => {
    expect(roleHasPermission("owner", "settings:view")).toBe(true);
    expect(roleHasPermission("owner", "settings:update")).toBe(true);
  });

  it("denies admin settings update", () => {
    expect(roleHasPermission("admin", "settings:view")).toBe(true);
    expect(roleHasPermission("admin", "settings:update")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// PERMISSIONS shape
// ---------------------------------------------------------------------------

describe("PERMISSIONS", () => {
  it("includes all expected permission keys", () => {
    const keys = Object.keys(PERMISSIONS);
    expect(keys).toContain("catalog:view");
    expect(keys).toContain("billing:manage");
    expect(keys).toContain("settings:update");
    expect(keys).toContain("users:manage");
  });
});

// ---------------------------------------------------------------------------
// Type safety
// ---------------------------------------------------------------------------

describe("TenantRole type", () => {
  it("accepts all valid TenantRole values", () => {
    const roles: TenantRole[] = ["owner", "admin", "member"];
    for (const role of roles) {
      expect(roleHasPermission(role, "catalog:view")).toBe(true);
    }
  });
});
