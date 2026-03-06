import { beforeEach, describe, expect, it, vi } from "vitest";

import { assertTenantMembership, assertTenantScope } from "../assert";

// ---------------------------------------------------------------------------
// Mock prisma so tests are fully isolated from the database
// ---------------------------------------------------------------------------

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    tenantUserMembership: {
      findUnique: vi.fn(),
    },
  },
}));

// Lazily import the mocked module so we can control return values per test
const { prisma } = await import("@/lib/prisma");
const mockFindUnique = vi.mocked(prisma.tenantUserMembership.findUnique);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Typed fixture that mirrors the full Prisma TenantUserMembership row shape.
 * `role` is typed as `string` (not the uppercase `TenantRole`) because the
 * database stores lowercase values ("owner" | "admin" | "member"), which is
 * exactly what Prisma returns. `assertTenantMembership` passes this raw value
 * to `hasRolePermission(membership.role, required)`, which uppercases and
 * checks the role against the permission hierarchy (no `normalizeTenantRole`
 * call is involved).
 */
interface MembershipFixture {
  id: string;
  tenantId: string;
  userId: string;
  role: string; // raw DB value: "owner" | "admin" | "member"
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

function membership(overrides: Partial<MembershipFixture> = {}): MembershipFixture {
  return {
    id: "mem-1",
    tenantId: "tenant-abc",
    userId: "user-xyz",
    role: "member",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// assertTenantMembership
// ---------------------------------------------------------------------------

describe("assertTenantMembership", () => {
  beforeEach(() => {
    mockFindUnique.mockReset();
  });

  it("throws Forbidden when no membership record exists", async () => {
    prismaMock.tenantUserMembership.findUnique.mockResolvedValue(null);

  it("throws 'Forbidden' when no membership record exists", async () => {
    mockFindUnique.mockResolvedValue(null as never);

    await expect(assertTenantMembership("tenant-abc", "user-xyz", "member")).rejects.toThrow(
      "Forbidden",
    );
  });

  it("throws 'Forbidden' for an entirely different tenant", async () => {
    mockFindUnique.mockResolvedValue(null as never);

    await expect(assertTenantMembership("tenant-other", "user-xyz", "member")).rejects.toThrow(
      "Forbidden",
    );
  });

  it("throws Forbidden when admin tries to satisfy owner requirement", async () => {
    prismaMock.tenantUserMembership.findUnique.mockResolvedValue(membership("admin"));

  it("throws 'Forbidden' when MEMBER tries to satisfy ADMIN requirement", async () => {
    mockFindFirst.mockResolvedValue(membership({ role: "member" }));

    await expect(assertTenantMembership("tenant-abc", "user-xyz", "admin")).rejects.toThrow(
      "Forbidden",
    );
  });

  it("throws 'Forbidden' when MEMBER tries to satisfy OWNER requirement", async () => {
    mockFindFirst.mockResolvedValue(membership({ role: "member" }));

    await expect(assertTenantMembership("tenant-abc", "user-xyz", "owner")).rejects.toThrow(
      "Forbidden",
    );
  });

  it("throws 'Forbidden' when ADMIN tries to satisfy OWNER requirement", async () => {
    mockFindFirst.mockResolvedValue(membership({ role: "admin" }));

    await expect(assertTenantMembership("tenant-abc", "user-xyz", "owner")).rejects.toThrow(
      "Forbidden",
    );
  });

  it("throws 'Forbidden' when role does not satisfy any role in an array", async () => {
    mockFindFirst.mockResolvedValue(membership({ role: "member" }));

    await expect(
      assertTenantMembership("tenant-abc", "user-xyz", ["OWNER", "ADMIN"]),
    ).rejects.toThrow("Forbidden: insufficient role");
  });

  // --- Authorized (happy path) -----------------------------------------------

  it("resolves when MEMBER satisfies MEMBER requirement", async () => {
    mockFindFirst.mockResolvedValue(membership({ role: "member" }));

    await expect(
      assertTenantMembership("tenant-abc", "user-xyz", "member"),
    ).resolves.toBeUndefined();
  });

  it("resolves when ADMIN satisfies ADMIN requirement", async () => {
    mockFindFirst.mockResolvedValue(membership({ role: "admin" }));

    await expect(
      assertTenantMembership("tenant-abc", "user-xyz", "admin"),
    ).resolves.toBeUndefined();
  });

  it("resolves when OWNER satisfies ADMIN requirement (hierarchy)", async () => {
    mockFindFirst.mockResolvedValue(membership({ role: "owner" }));

    await expect(
      assertTenantMembership("tenant-abc", "user-xyz", "admin"),
    ).resolves.toBeUndefined();
  });

  it("resolves when OWNER satisfies MEMBER requirement (hierarchy)", async () => {
    mockFindFirst.mockResolvedValue(membership({ role: "owner" }));

    await expect(
      assertTenantMembership("tenant-abc", "user-xyz", "member"),
    ).resolves.toBeUndefined();
  });

  it("resolves when ADMIN satisfies an array containing ADMIN", async () => {
    mockFindFirst.mockResolvedValue(membership({ role: "admin" }));

    await expect(
      assertTenantMembership("tenant-abc", "user-xyz", "member"),
    ).resolves.toBeUndefined();
  });

  // --- Membership query scoping --------------------------------------------

  it("queries with tenantId, userId, and deletedAt filter", async () => {
    mockFindFirst.mockResolvedValue(membership({ role: "admin" }));

    await assertTenantMembership("tenant-abc", "user-xyz", "admin");

    expect(mockFindFirst).toHaveBeenCalledWith({
      where: {
        tenantId: "tenant-abc",
        userId: "user-xyz",
        deletedAt: null,
      },
      select: { role: true },
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

  it("throws 'Forbidden' when tenantIds differ", () => {
    expect(() => assertTenantScope("tenant-abc", "tenant-xyz")).toThrow("Forbidden");
  });

  it("throws when record has an empty tenantId and session has a valid tenantId", () => {
    expect(() => assertTenantScope("", "tenant-abc")).toThrow("Forbidden");
  });

  it("throws when record has a valid tenantId and session has an empty tenantId", () => {
    expect(() => assertTenantScope("tenant-abc", "")).toThrow("Forbidden");
  });
});
