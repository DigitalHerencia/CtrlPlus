import { describe, expect, it } from "vitest";

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
    expect(hasRole("OWNER", "OWNER")).toBe(true);
    expect(hasRole("ADMIN", "ADMIN")).toBe(true);
    expect(hasRole("MEMBER", "MEMBER")).toBe(true);
  });

  it("returns true for higher-privilege roles satisfying lower-privilege requirements", () => {
    expect(hasRole("OWNER", "ADMIN")).toBe(true);
    expect(hasRole("OWNER", "MEMBER")).toBe(true);
    expect(hasRole("ADMIN", "MEMBER")).toBe(true);
  });

  it("returns false for lower-privilege roles against higher-privilege requirements", () => {
    expect(hasRole("MEMBER", "ADMIN")).toBe(false);
    expect(hasRole("MEMBER", "OWNER")).toBe(false);
    expect(hasRole("ADMIN", "OWNER")).toBe(false);
  });

  it("returns true when user role satisfies any role in an array", () => {
    expect(hasRole("ADMIN", ["OWNER", "ADMIN"])).toBe(true);
    expect(hasRole("OWNER", ["ADMIN", "MEMBER"])).toBe(true);
    expect(hasRole("MEMBER", ["MEMBER"])).toBe(true);
  });

  it("returns false when user role does not satisfy any role in an array", () => {
    expect(hasRole("MEMBER", ["OWNER", "ADMIN"])).toBe(false);
    expect(hasRole("ADMIN", ["OWNER"])).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// hasPermission
// ---------------------------------------------------------------------------

describe("hasPermission", () => {
  it("grants OWNER all permissions", () => {
    const ownerPermissions = ROLE_PERMISSIONS["OWNER"] as string[];
    expect(ownerPermissions).toContain(PERMISSIONS.admin.write);
    expect(ownerPermissions).toContain(PERMISSIONS.admin.users);
    expect(ownerPermissions).toContain(PERMISSIONS.billing.write);
    expect(ownerPermissions).toContain(PERMISSIONS.catalog.delete);
  });

  it("grants ADMIN elevated but not owner-level admin permissions", () => {
    expect(hasPermission("ADMIN", PERMISSIONS.catalog.write)).toBe(true);
    expect(hasPermission("ADMIN", PERMISSIONS.admin.read)).toBe(true);
    expect(hasPermission("ADMIN", PERMISSIONS.admin.write)).toBe(false);
    expect(hasPermission("ADMIN", PERMISSIONS.admin.users)).toBe(false);
  });

  it("grants MEMBER read-only catalog and scheduling access", () => {
    expect(hasPermission("MEMBER", PERMISSIONS.catalog.read)).toBe(true);
    expect(hasPermission("MEMBER", PERMISSIONS.scheduling.read)).toBe(true);
    expect(hasPermission("MEMBER", PERMISSIONS.visualizer.write)).toBe(true);
  });

  it("denies MEMBER write access to catalog, scheduling, and billing", () => {
    expect(hasPermission("MEMBER", PERMISSIONS.catalog.write)).toBe(false);
    expect(hasPermission("MEMBER", PERMISSIONS.catalog.delete)).toBe(false);
    expect(hasPermission("MEMBER", PERMISSIONS.scheduling.write)).toBe(false);
    expect(hasPermission("MEMBER", PERMISSIONS.billing.read)).toBe(false);
    expect(hasPermission("MEMBER", PERMISSIONS.billing.write)).toBe(false);
  });

  it("returns false for unknown permission strings", () => {
    expect(hasPermission("OWNER", "unknown:permission")).toBe(false);
    expect(hasPermission("MEMBER", "")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// requireRole
// ---------------------------------------------------------------------------

describe("requireRole", () => {
  it("does not throw when the user role satisfies the requirement", () => {
    expect(() => requireRole("OWNER", "OWNER")).not.toThrow();
    expect(() => requireRole("OWNER", "ADMIN")).not.toThrow();
    expect(() => requireRole("OWNER", "MEMBER")).not.toThrow();
    expect(() => requireRole("ADMIN", "ADMIN")).not.toThrow();
    expect(() => requireRole("ADMIN", "MEMBER")).not.toThrow();
    expect(() => requireRole("MEMBER", "MEMBER")).not.toThrow();
  });

  it("throws 'Forbidden: insufficient role' for insufficient roles", () => {
    expect(() => requireRole("MEMBER", "ADMIN")).toThrow("Forbidden: insufficient role");
    expect(() => requireRole("MEMBER", "OWNER")).toThrow("Forbidden: insufficient role");
    expect(() => requireRole("ADMIN", "OWNER")).toThrow("Forbidden: insufficient role");
  });

  it("does not throw when the user role satisfies any role in an array", () => {
    expect(() => requireRole("ADMIN", ["OWNER", "ADMIN"])).not.toThrow();
    expect(() => requireRole("OWNER", ["ADMIN", "MEMBER"])).not.toThrow();
  });

  it("throws 'Forbidden: insufficient role' when no role in array is satisfied", () => {
    expect(() => requireRole("MEMBER", ["OWNER", "ADMIN"])).toThrow("Forbidden: insufficient role");
  });

  // Type safety: verify the function accepts all valid TenantRole values
  it("accepts all valid TenantRole values without type errors", () => {
    const roles: TenantRole[] = ["OWNER", "ADMIN", "MEMBER"];
    for (const role of roles) {
      expect(() => requireRole(role, "MEMBER")).not.toThrow();
    }
  });
});
