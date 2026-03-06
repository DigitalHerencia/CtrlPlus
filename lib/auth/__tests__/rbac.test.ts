import { describe, expect, it, vi } from "vitest";

// ── Mock Prisma to prevent DATABASE_URL error during module initialization ────
// rbac.ts re-exports from lib/tenancy/assert.ts which imports lib/prisma.ts.
// The pure RBAC functions tested here don't use Prisma at all.
vi.mock("@/lib/prisma", () => ({ prisma: {} }));

// ── Mock prisma to prevent DATABASE_URL error (transitive import via tenancy/assert) ──
vi.mock("@/lib/prisma", () => ({ prisma: {} }));

import { PERMISSIONS, roleHasPermission, type TenantRole } from "../rbac";

// ---------------------------------------------------------------------------
// roleHasPermission
// ---------------------------------------------------------------------------

describe("roleHasPermission", () => {
  it("grants owner all permissions", () => {
    expect(roleHasPermission("owner", "catalog:view")).toBe(true);
    expect(roleHasPermission("owner", "catalog:create")).toBe(true);
    expect(roleHasPermission("owner", "catalog:delete")).toBe(true);
    expect(roleHasPermission("owner", "billing:manage")).toBe(true);
    expect(roleHasPermission("owner", "settings:update")).toBe(true);
  });

  it("grants admin elevated but not owner-level permissions", () => {
    expect(roleHasPermission("admin", "catalog:create")).toBe(true);
    expect(roleHasPermission("admin", "users:view")).toBe(true);
    expect(roleHasPermission("admin", "billing:manage")).toBe(false);
    expect(roleHasPermission("admin", "users:manage")).toBe(false);
    expect(roleHasPermission("admin", "settings:update")).toBe(false);
  });

  it("grants member read-only catalog and booking access", () => {
    expect(roleHasPermission("member", "catalog:view")).toBe(true);
    expect(roleHasPermission("member", "booking:view")).toBe(true);
    expect(roleHasPermission("member", "booking:create")).toBe(true);
  });

  it("denies member write access to catalog, billing, and admin", () => {
    expect(roleHasPermission("member", "catalog:create")).toBe(false);
    expect(roleHasPermission("member", "catalog:delete")).toBe(false);
    expect(roleHasPermission("member", "billing:view")).toBe(false);
    expect(roleHasPermission("member", "users:invite")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// PERMISSIONS shape
// ---------------------------------------------------------------------------

describe("PERMISSIONS", () => {
  it("has expected permission keys", () => {
    expect(PERMISSIONS).toHaveProperty("catalog:view");
    expect(PERMISSIONS).toHaveProperty("catalog:create");
    expect(PERMISSIONS).toHaveProperty("billing:manage");
    expect(PERMISSIONS).toHaveProperty("settings:update");
  });

  it("catalog:view is accessible to all roles", () => {
    const roles = PERMISSIONS["catalog:view"] as readonly string[];
    expect(roles).toContain("owner");
    expect(roles).toContain("admin");
    expect(roles).toContain("member");
  });

  it("billing:manage is restricted to owner only", () => {
    const roles = PERMISSIONS["billing:manage"] as readonly string[];
    expect(roles).toContain("owner");
    expect(roles).not.toContain("admin");
    expect(roles).not.toContain("member");
  });
});

// ---------------------------------------------------------------------------
// TenantRole type values
// ---------------------------------------------------------------------------

describe("TenantRole", () => {
  it("accepts all valid TenantRole values", () => {
    const roles: TenantRole[] = ["owner", "admin", "member"];
    for (const role of roles) {
      expect(roleHasPermission(role, "catalog:view")).toBe(true);
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
