import { describe, expect, it, vi } from "vitest";

// ── Mock the Prisma client so this test file doesn't require DATABASE_URL ──
vi.mock("@/lib/prisma", () => ({ prisma: {} }));

import {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission,
  hasRole,
  requireRole,
  type TenantRole,
} from "../rbac";

// ---------------------------------------------------------------------------
// hasRole
// ---------------------------------------------------------------------------

describe("hasRole", () => {
  it("returns true when user role exactly matches required role", () => {
    expect(hasRole("owner", "owner")).toBe(true);
    expect(hasRole("admin", "admin")).toBe(true);
    expect(hasRole("member", "member")).toBe(true);
  });

  it("returns true for higher-privilege roles satisfying lower-privilege requirements", () => {
    expect(hasRole("owner", "admin")).toBe(true);
    expect(hasRole("owner", "member")).toBe(true);
    expect(hasRole("admin", "member")).toBe(true);
  });

  it("returns false for lower-privilege roles against higher-privilege requirements", () => {
    expect(hasRole("member", "admin")).toBe(false);
    expect(hasRole("member", "owner")).toBe(false);
    expect(hasRole("admin", "owner")).toBe(false);
  });

  it("returns true when user role satisfies any role in an array", () => {
    expect(hasRole("admin", ["owner", "admin"])).toBe(true);
    expect(hasRole("owner", ["admin", "member"])).toBe(true);
    expect(hasRole("member", ["member"])).toBe(true);
  });

  it("returns false when user role does not satisfy any role in an array", () => {
    expect(hasRole("member", ["owner", "admin"])).toBe(false);
    expect(hasRole("admin", ["owner"])).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// hasPermission
// ---------------------------------------------------------------------------

describe("hasPermission", () => {
  it("grants OWNER all permissions", () => {
    const ownerPermissions = ROLE_PERMISSIONS["owner"] as string[];
    expect(ownerPermissions).toContain(PERMISSIONS.admin.write);
    expect(ownerPermissions).toContain(PERMISSIONS.admin.users);
    expect(ownerPermissions).toContain(PERMISSIONS.billing.write);
    expect(ownerPermissions).toContain(PERMISSIONS.catalog.delete);
  });

  it("grants ADMIN elevated but not owner-level admin permissions", () => {
    expect(hasPermission("admin", PERMISSIONS.catalog.write)).toBe(true);
    expect(hasPermission("admin", PERMISSIONS.admin.read)).toBe(true);
    expect(hasPermission("admin", PERMISSIONS.admin.write)).toBe(false);
    expect(hasPermission("admin", PERMISSIONS.admin.users)).toBe(false);
  });

  it("grants MEMBER read-only catalog and scheduling access", () => {
    expect(hasPermission("member", PERMISSIONS.catalog.read)).toBe(true);
    expect(hasPermission("member", PERMISSIONS.scheduling.read)).toBe(true);
    expect(hasPermission("member", PERMISSIONS.visualizer.write)).toBe(true);
  });

  it("denies MEMBER write access to catalog, scheduling, and billing", () => {
    expect(hasPermission("member", PERMISSIONS.catalog.write)).toBe(false);
    expect(hasPermission("member", PERMISSIONS.catalog.delete)).toBe(false);
    expect(hasPermission("member", PERMISSIONS.scheduling.write)).toBe(false);
    expect(hasPermission("member", PERMISSIONS.billing.read)).toBe(false);
    expect(hasPermission("member", PERMISSIONS.billing.write)).toBe(false);
  });

  it("returns false for unknown permission strings", () => {
    expect(hasPermission("owner", "unknown:permission")).toBe(false);
    expect(hasPermission("member", "")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// requireRole
// ---------------------------------------------------------------------------

describe("requireRole", () => {
  it("does not throw when the user role satisfies the requirement", () => {
    expect(() => requireRole("owner", "owner")).not.toThrow();
    expect(() => requireRole("owner", "admin")).not.toThrow();
    expect(() => requireRole("owner", "member")).not.toThrow();
    expect(() => requireRole("admin", "admin")).not.toThrow();
    expect(() => requireRole("admin", "member")).not.toThrow();
    expect(() => requireRole("member", "member")).not.toThrow();
  });

  it("throws 'Forbidden: insufficient role' for insufficient roles", () => {
    expect(() => requireRole("member", "admin")).toThrow("Forbidden: insufficient role");
    expect(() => requireRole("member", "owner")).toThrow("Forbidden: insufficient role");
    expect(() => requireRole("admin", "owner")).toThrow("Forbidden: insufficient role");
  });

  it("does not throw when the user role satisfies any role in an array", () => {
    expect(() => requireRole("admin", ["owner", "admin"])).not.toThrow();
    expect(() => requireRole("owner", ["admin", "member"])).not.toThrow();
  });

  it("throws 'Forbidden: insufficient role' when no role in array is satisfied", () => {
    expect(() => requireRole("member", ["owner", "admin"])).toThrow("Forbidden: insufficient role");
  });

  // Type safety: verify the function accepts all valid TenantRole values
  it("accepts all valid TenantRole values without type errors", () => {
    const roles: TenantRole[] = ["owner", "admin", "member"];
    for (const role of roles) {
      expect(() => requireRole(role, "member")).not.toThrow();
    }
  });
});
