import { beforeEach, describe, expect, it, vi } from "vitest";

import { assertTenantMembership, assertTenantScope } from "../assert";

// ---------------------------------------------------------------------------
// Mock prisma so tests are fully isolated from the database
// ---------------------------------------------------------------------------

vi.mock("@/lib/prisma", () => ({
  prisma: {
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

type TestMembership = {
  id: string;
  tenantId: string;
  userId: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
};

function membership(overrides: Partial<TestMembership> = {}): TestMembership {
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

  // --- Unauthorized (no membership) ----------------------------------------

  it("throws 'Unauthorized' when no membership record exists", async () => {
    mockFindUnique.mockResolvedValue(null);

    await expect(assertTenantMembership("tenant-abc", "user-xyz", "member")).rejects.toThrow(
      "Unauthorized: not a member of this tenant",
    );
  });

  it("throws 'Unauthorized' for an entirely different tenant", async () => {
    mockFindUnique.mockResolvedValue(null);

    await expect(assertTenantMembership("tenant-other", "user-xyz", "member")).rejects.toThrow(
      "Unauthorized: not a member of this tenant",
    );
  });

  // --- Forbidden (insufficient role) ---------------------------------------

  it("throws 'Forbidden' when MEMBER tries to satisfy ADMIN requirement", async () => {
    mockFindUnique.mockResolvedValue(membership({ role: "member" }));

    await expect(assertTenantMembership("tenant-abc", "user-xyz", "admin")).rejects.toThrow(
      "Forbidden: insufficient role",
    );
  });

  it("throws 'Forbidden' when MEMBER tries to satisfy OWNER requirement", async () => {
    mockFindUnique.mockResolvedValue(membership({ role: "member" }));

    await expect(assertTenantMembership("tenant-abc", "user-xyz", "owner")).rejects.toThrow(
      "Forbidden: insufficient role",
    );
  });

  it("throws 'Forbidden' when ADMIN tries to satisfy OWNER requirement", async () => {
    mockFindUnique.mockResolvedValue(membership({ role: "admin" }));

    await expect(assertTenantMembership("tenant-abc", "user-xyz", "owner")).rejects.toThrow(
      "Forbidden: insufficient role",
    );
  });

  it("throws 'Forbidden' when role does not satisfy any role in an array", async () => {
    mockFindUnique.mockResolvedValue(membership({ role: "member" }));

    await expect(
      assertTenantMembership("tenant-abc", "user-xyz", ["owner", "admin"]),
    ).rejects.toThrow("Forbidden: insufficient role");
  });

  // --- Authorized (happy path) -----------------------------------------------

  it("resolves when MEMBER satisfies MEMBER requirement", async () => {
    mockFindUnique.mockResolvedValue(membership({ role: "member" }));

    await expect(
      assertTenantMembership("tenant-abc", "user-xyz", "member"),
    ).resolves.toBeUndefined();
  });

  it("resolves when ADMIN satisfies ADMIN requirement", async () => {
    mockFindUnique.mockResolvedValue(membership({ role: "admin" }));

    await expect(
      assertTenantMembership("tenant-abc", "user-xyz", "admin"),
    ).resolves.toBeUndefined();
  });

  it("resolves when OWNER satisfies ADMIN requirement (hierarchy)", async () => {
    mockFindUnique.mockResolvedValue(membership({ role: "owner" }));

    await expect(
      assertTenantMembership("tenant-abc", "user-xyz", "admin"),
    ).resolves.toBeUndefined();
  });

  it("resolves when OWNER satisfies MEMBER requirement (hierarchy)", async () => {
    mockFindUnique.mockResolvedValue(membership({ role: "owner" }));

    await expect(
      assertTenantMembership("tenant-abc", "user-xyz", "member"),
    ).resolves.toBeUndefined();
  });

  it("resolves when ADMIN satisfies an array containing ADMIN", async () => {
    mockFindUnique.mockResolvedValue(membership({ role: "admin" }));

    await expect(
      assertTenantMembership("tenant-abc", "user-xyz", ["owner", "admin"]),
    ).resolves.toBeUndefined();
  });

  // --- Membership query scoping --------------------------------------------

  it("queries using tenantId_userId compound key with deletedAt filter", async () => {
    mockFindUnique.mockResolvedValue(membership({ role: "admin" }));

    await assertTenantMembership("tenant-abc", "user-xyz", "admin");

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: {
        tenantId_userId: {
          tenantId: "tenant-abc",
          userId: "user-xyz",
        },
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
