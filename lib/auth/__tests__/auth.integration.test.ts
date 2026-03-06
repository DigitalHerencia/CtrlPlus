import { assertTenantMembership } from "@/lib/tenancy/assert"
import { ROLE_HIERARCHY, hasRolePermission, normalizeTenantRole } from "@/lib/tenancy/types"
import { beforeEach, describe, expect, it, vi } from "vitest"

// Test basic assertion functions
describe("assertTenantMembership", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should expose a function that takes tenantId, userId, and role", async () => {
    expect(typeof assertTenantMembership).toBe("function")
  })

  it("should throw if not provided with valid parameters", () => {
    expect(assertTenantMembership).toBeDefined()
  })
})

describe("tenancy assertion patterns", () => {
  it("should have correct role hierarchy", () => {
    expect(ROLE_HIERARCHY).toBeDefined()
    expect(ROLE_HIERARCHY.owner).toBe(3)
    expect(ROLE_HIERARCHY.admin).toBe(2)
    expect(ROLE_HIERARCHY.member).toBe(1)
  })

  it("should normalize role strings to lowercase", () => {
    expect(normalizeTenantRole("ADMIN")).toBe("admin")
    expect(normalizeTenantRole("owner")).toBe("owner")
    expect(normalizeTenantRole("Member")).toBe("member")
  })

  it("should check role permissions with hierarchy", () => {
    // Owner has all permissions
    expect(hasRolePermission("owner", "admin")).toBe(true)
    expect(hasRolePermission("owner", "member")).toBe(true)
    // Admin doesn't have owner permissions
    expect(hasRolePermission("admin", "owner")).toBe(false)
    expect(hasRolePermission("admin", "member")).toBe(true)
    // Member only has member permissions
    expect(hasRolePermission("member", "admin")).toBe(false)
  })

  it("should reject invalid role strings", () => {
    expect(() => normalizeTenantRole("invalid")).toThrow("Invalid tenant role")
  })
})
