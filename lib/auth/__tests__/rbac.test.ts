import { describe, expect, it, vi } from "vitest";

// Mock Prisma to prevent database initialization when rbac.ts imports tenancy/assert
vi.mock("@/lib/prisma", () => ({ prisma: {} }));

import { PERMISSIONS, ROLES, roleHasPermission, type TenantRole } from "../rbac";

// ---------------------------------------------------------------------------
// ROLES constant
// ---------------------------------------------------------------------------

describe("ROLES", () => {
  it("defines the three expected roles", () => {
    expect(Object.keys(ROLES)).toEqual(expect.arrayContaining(["owner", "admin", "member"]));
  });

  it("each role has a name and description", () => {
    for (const role of Object.values(ROLES)) {
      expect(role).toHaveProperty("name");
      expect(role).toHaveProperty("description");
    }
  });
});

// ---------------------------------------------------------------------------
// PERMISSIONS constant
// ---------------------------------------------------------------------------

describe("PERMISSIONS", () => {
  it("includes catalog permissions", () => {
    expect(PERMISSIONS).toHaveProperty("catalog:view");
    expect(PERMISSIONS).toHaveProperty("catalog:create");
    expect(PERMISSIONS).toHaveProperty("catalog:update");
    expect(PERMISSIONS).toHaveProperty("catalog:delete");
  });

  it("includes booking permissions", () => {
    expect(PERMISSIONS).toHaveProperty("booking:view");
    expect(PERMISSIONS).toHaveProperty("booking:create");
    expect(PERMISSIONS).toHaveProperty("booking:update");
    expect(PERMISSIONS).toHaveProperty("booking:cancel");
  });

  it("includes billing permissions", () => {
    expect(PERMISSIONS).toHaveProperty("billing:view");
    expect(PERMISSIONS).toHaveProperty("billing:manage");
  });

  it("each permission maps to an array of allowed roles", () => {
    for (const allowedRoles of Object.values(PERMISSIONS)) {
      expect(Array.isArray(allowedRoles)).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// roleHasPermission
// ---------------------------------------------------------------------------

describe("roleHasPermission", () => {
  it("grants owner all catalog permissions", () => {
    const owner: TenantRole = "owner";
    expect(roleHasPermission(owner, "catalog:view")).toBe(true);
    expect(roleHasPermission(owner, "catalog:create")).toBe(true);
    expect(roleHasPermission(owner, "catalog:update")).toBe(true);
    expect(roleHasPermission(owner, "catalog:delete")).toBe(true);
  });

  it("grants admin catalog view and write permissions", () => {
    const admin: TenantRole = "admin";
    expect(roleHasPermission(admin, "catalog:view")).toBe(true);
    expect(roleHasPermission(admin, "catalog:create")).toBe(true);
    expect(roleHasPermission(admin, "catalog:update")).toBe(true);
    expect(roleHasPermission(admin, "catalog:delete")).toBe(true);
  });

  it("grants member only catalog:view", () => {
    const member: TenantRole = "member";
    expect(roleHasPermission(member, "catalog:view")).toBe(true);
    expect(roleHasPermission(member, "catalog:create")).toBe(false);
    expect(roleHasPermission(member, "catalog:update")).toBe(false);
    expect(roleHasPermission(member, "catalog:delete")).toBe(false);
  });

  it("only owner can manage billing", () => {
    expect(roleHasPermission("owner", "billing:manage")).toBe(true);
    expect(roleHasPermission("admin", "billing:manage")).toBe(false);
    expect(roleHasPermission("member", "billing:manage")).toBe(false);
  });

  it("owner and admin can view billing", () => {
    expect(roleHasPermission("owner", "billing:view")).toBe(true);
    expect(roleHasPermission("admin", "billing:view")).toBe(true);
    expect(roleHasPermission("member", "billing:view")).toBe(false);
  });

  it("all roles can view and create bookings", () => {
    const roles: TenantRole[] = ["owner", "admin", "member"];
    for (const role of roles) {
      expect(roleHasPermission(role, "booking:view")).toBe(true);
      expect(roleHasPermission(role, "booking:create")).toBe(true);
    }
  });

  it("only owner and admin can update or cancel bookings", () => {
    expect(roleHasPermission("owner", "booking:update")).toBe(true);
    expect(roleHasPermission("admin", "booking:update")).toBe(true);
    expect(roleHasPermission("member", "booking:update")).toBe(false);
    expect(roleHasPermission("owner", "booking:cancel")).toBe(true);
    expect(roleHasPermission("admin", "booking:cancel")).toBe(true);
    expect(roleHasPermission("member", "booking:cancel")).toBe(false);
  });

  it("only owner can update tenant settings", () => {
    expect(roleHasPermission("owner", "settings:update")).toBe(true);
    expect(roleHasPermission("admin", "settings:update")).toBe(false);
    expect(roleHasPermission("member", "settings:update")).toBe(false);
  });
});
