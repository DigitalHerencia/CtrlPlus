import { beforeEach, describe, expect, it, vi } from "vitest";

import type { TenantUserMembership } from "@/lib/prisma";
import { assertTenantMembership, assertTenantScope } from "../assert";

// ---------------------------------------------------------------------------
// Mock prisma so tests are fully isolated from the database
// ---------------------------------------------------------------------------

vi.mock("@/lib/prisma", () => ({
  prisma: {
    tenantUserMembership: {
      findFirst: vi.fn(),
    },
  },
}));

// Lazily import the mocked module so we can control return values per test
const { prisma } = await import("@/lib/prisma");
const mockFindFirst = vi.mocked(prisma.tenantUserMembership.findFirst);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function membership(overrides: Partial<TenantUserMembership> = {}): TenantUserMembership {
  return {
    id: "mem-1",
    tenantId: "tenant-abc",
    userId: "user-xyz",
    role: "MEMBER",
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// assertTenantMembership
// ---------------------------------------------------------------------------

describe("assertTenantMembership", () => {
  beforeEach(() => {
    mockFindFirst.mockReset();
  });

  // --- Unauthorized (no membership) ----------------------------------------

  it("throws 'Unauthorized' when no membership record exists", async () => {
    mockFindFirst.mockResolvedValue(null);

    await expect(assertTenantMembership("tenant-abc", "user-xyz", "MEMBER")).rejects.toThrow(
      "Unauthorized: not a member of this tenant",
    );
  });

  it("throws 'Unauthorized' for an entirely different tenant", async () => {
    mockFindFirst.mockResolvedValue(null);

    await expect(assertTenantMembership("tenant-other", "user-xyz", "MEMBER")).rejects.toThrow(
      "Unauthorized: not a member of this tenant",
    );
  });

  // --- Forbidden (insufficient role) ---------------------------------------

  it("throws 'Forbidden' when MEMBER tries to satisfy ADMIN requirement", async () => {
    mockFindFirst.mockResolvedValue(membership({ role: "MEMBER" }));

    await expect(assertTenantMembership("tenant-abc", "user-xyz", "ADMIN")).rejects.toThrow(
      "Forbidden: insufficient role",
    );
  });

  it("throws 'Forbidden' when MEMBER tries to satisfy OWNER requirement", async () => {
    mockFindFirst.mockResolvedValue(membership({ role: "MEMBER" }));

    await expect(assertTenantMembership("tenant-abc", "user-xyz", "OWNER")).rejects.toThrow(
      "Forbidden: insufficient role",
    );
  });

  it("throws 'Forbidden' when ADMIN tries to satisfy OWNER requirement", async () => {
    mockFindFirst.mockResolvedValue(membership({ role: "ADMIN" }));

    await expect(assertTenantMembership("tenant-abc", "user-xyz", "OWNER")).rejects.toThrow(
      "Forbidden: insufficient role",
    );
  });

  it("throws 'Forbidden' when role does not satisfy any role in an array", async () => {
    mockFindFirst.mockResolvedValue(membership({ role: "MEMBER" }));

    await expect(
      assertTenantMembership("tenant-abc", "user-xyz", ["OWNER", "ADMIN"]),
    ).rejects.toThrow("Forbidden: insufficient role");
  });

  // --- Authorized (happy path) -----------------------------------------------

  it("resolves when MEMBER satisfies MEMBER requirement", async () => {
    mockFindFirst.mockResolvedValue(membership({ role: "MEMBER" }));

    await expect(
      assertTenantMembership("tenant-abc", "user-xyz", "MEMBER"),
    ).resolves.toBeUndefined();
  });

  it("resolves when ADMIN satisfies ADMIN requirement", async () => {
    mockFindFirst.mockResolvedValue(membership({ role: "ADMIN" }));

    await expect(
      assertTenantMembership("tenant-abc", "user-xyz", "ADMIN"),
    ).resolves.toBeUndefined();
  });

  it("resolves when OWNER satisfies ADMIN requirement (hierarchy)", async () => {
    mockFindFirst.mockResolvedValue(membership({ role: "OWNER" }));

    await expect(
      assertTenantMembership("tenant-abc", "user-xyz", "ADMIN"),
    ).resolves.toBeUndefined();
  });

  it("resolves when OWNER satisfies MEMBER requirement (hierarchy)", async () => {
    mockFindFirst.mockResolvedValue(membership({ role: "OWNER" }));

    await expect(
      assertTenantMembership("tenant-abc", "user-xyz", "MEMBER"),
    ).resolves.toBeUndefined();
  });

  it("resolves when ADMIN satisfies an array containing ADMIN", async () => {
    mockFindFirst.mockResolvedValue(membership({ role: "ADMIN" }));

    await expect(
      assertTenantMembership("tenant-abc", "user-xyz", ["OWNER", "ADMIN"]),
    ).resolves.toBeUndefined();
  });

  // --- Membership query scoping --------------------------------------------

  it("queries with tenantId, userId, and ACTIVE status", async () => {
    mockFindFirst.mockResolvedValue(membership({ role: "ADMIN" }));

    await assertTenantMembership("tenant-abc", "user-xyz", "ADMIN");

    expect(mockFindFirst).toHaveBeenCalledWith({
      where: {
        tenantId: "tenant-abc",
        userId: "user-xyz",
        status: "ACTIVE",
      },
    });
  });
});

// ---------------------------------------------------------------------------
// assertTenantScope
// ---------------------------------------------------------------------------

describe("assertTenantScope", () => {
  it("does not throw when tenantIds match", () => {
    expect(() => assertTenantScope("tenant-abc", "tenant-abc")).not.toThrow();
  });

  it("throws 'Forbidden: cross-tenant access detected' when tenantIds differ", () => {
    expect(() => assertTenantScope("tenant-abc", "tenant-xyz")).toThrow(
      "Forbidden: cross-tenant access detected",
    );
  });

  it("throws when record has an empty tenantId and session has a valid tenantId", () => {
    expect(() => assertTenantScope("", "tenant-abc")).toThrow(
      "Forbidden: cross-tenant access detected",
    );
  });

  it("throws when record has a valid tenantId and session has an empty tenantId", () => {
    expect(() => assertTenantScope("tenant-abc", "")).toThrow(
      "Forbidden: cross-tenant access detected",
    );
  });
});
