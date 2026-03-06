import { describe, expect, it, vi } from "vitest"

// ── Mock Prisma to prevent DATABASE_URL error during module initialization ────
// rbac.ts re-exports from lib/tenancy/assert.ts which imports lib/prisma.ts.
// The pure RBAC functions tested here don't use Prisma at all.
vi.mock("@/lib/prisma", () => ({ prisma: {} }))

// ── Mock prisma to prevent DATABASE_URL error (transitive import via tenancy/assert) ──
vi.mock("@/lib/prisma", () => ({ prisma: {} }))

import { PERMISSIONS, hasPermission, type TenantRole } from "../rbac"

// ---------------------------------------------------------------------------
// roleHasPermission
// ---------------------------------------------------------------------------

describe("hasPermission", () => {
  it("grants owner all permissions", () => {
    expect(hasPermission("owner", "catalog:read")).toBe(true)
    expect(hasPermission("owner", "catalog:write")).toBe(true)
    expect(hasPermission("owner", "catalog:delete")).toBe(true)
    expect(hasPermission("owner", "billing:write")).toBe(true)
    expect(hasPermission("owner", "admin:write")).toBe(true)
  })

  it("grants admin elevated but not owner-level permissions", () => {
    expect(hasPermission("admin", "catalog:write")).toBe(true)
    expect(hasPermission("admin", "admin:read")).toBe(true)
    expect(hasPermission("admin", "billing:write")).toBe(false)
    expect(hasPermission("admin", "admin:users")).toBe(false)
    expect(hasPermission("admin", "admin:write")).toBe(false)
  })

  it("grants member read-only catalog and booking access", () => {
    expect(hasPermission("member", "catalog:read")).toBe(true)
    expect(hasPermission("member", "scheduling:read")).toBe(true)
    expect(hasPermission("member", "visualizer:write")).toBe(true)
  })

  it("denies member write access to catalog, billing, and admin", () => {
    expect(hasPermission("member", "catalog:write")).toBe(false)
    expect(hasPermission("member", "catalog:delete")).toBe(false)
    expect(hasPermission("member", "billing:read")).toBe(false)
    expect(hasPermission("member", "admin:users")).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// PERMISSIONS shape
// ---------------------------------------------------------------------------

describe("PERMISSIONS", () => {
  it("has expected permission keys", () => {
    expect(PERMISSIONS.catalog).toBeDefined()
    expect(PERMISSIONS.catalog.read).toBe("catalog:read")
    expect(PERMISSIONS.catalog.write).toBe("catalog:write")
    expect(PERMISSIONS.billing).toBeDefined()
    expect(PERMISSIONS.admin).toBeDefined()
  })

  it("catalog:read is accessible to all roles", () => {
    expect(hasPermission("owner", PERMISSIONS.catalog.read)).toBe(true)
    expect(hasPermission("admin", PERMISSIONS.catalog.read)).toBe(true)
    expect(hasPermission("member", PERMISSIONS.catalog.read)).toBe(true)
  })

  it("billing:write is restricted to owner only", () => {
    expect(hasPermission("owner", PERMISSIONS.billing.write)).toBe(true)
    expect(hasPermission("admin", PERMISSIONS.billing.write)).toBe(false)
    expect(hasPermission("member", PERMISSIONS.billing.write)).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// TenantRole type values
// ---------------------------------------------------------------------------

describe("TenantRole", () => {
  it("accepts all valid TenantRole values", () => {
    const roles: TenantRole[] = ["owner", "admin", "member"]
    for (const role of roles) {
      expect(hasPermission(role, "catalog:read")).toBe(true)
    }
  })
})

describe("PERMISSIONS definition and verification", () => {
  it("defines catalog permissions", () => {
    expect(PERMISSIONS.catalog.read).toBe("catalog:read")
    expect(PERMISSIONS.catalog.write).toBe("catalog:write")
    expect(PERMISSIONS.catalog.delete).toBe("catalog:delete")
  })

  it("defines scheduling permissions", () => {
    expect(PERMISSIONS.scheduling.read).toBe("scheduling:read")
    expect(PERMISSIONS.scheduling.write).toBe("scheduling:write")
  })

  it("defines visualizer permissions", () => {
    expect(PERMISSIONS.visualizer.write).toBe("visualizer:write")
  })

  it("catalog:read is accessible to all roles", () => {
    expect(hasPermission("owner", PERMISSIONS.catalog.read)).toBe(true)
    expect(hasPermission("admin", PERMISSIONS.catalog.read)).toBe(true)
    expect(hasPermission("member", PERMISSIONS.catalog.read)).toBe(true)
  })

  it("billing:write is restricted to owner only", () => {
    expect(hasPermission("owner", PERMISSIONS.billing.write)).toBe(true)
    expect(hasPermission("admin", PERMISSIONS.billing.write)).toBe(false)
    expect(hasPermission("member", PERMISSIONS.billing.write)).toBe(false)
  })
})
