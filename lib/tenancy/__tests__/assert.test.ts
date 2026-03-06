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

function membership(role: string = "member") {
  return { role };
}

// ---------------------------------------------------------------------------
// assertTenantMembership
// ---------------------------------------------------------------------------

describe("assertTenantMembership", () => {
  beforeEach(() => {
    mockFindUnique.mockReset();
  });

  // --- Unauthorized (no membership) ----------------------------------------

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

  // --- Forbidden (insufficient role) ---------------------------------------

  it("throws 'Forbidden' when member tries to satisfy admin requirement", async () => {
    mockFindUnique.mockResolvedValue(membership("member") as never);

    await expect(assertTenantMembership("tenant-abc", "user-xyz", "admin")).rejects.toThrow(
      "Forbidden",
    );
  });

  it("throws 'Forbidden' when member tries to satisfy owner requirement", async () => {
    mockFindUnique.mockResolvedValue(membership("member") as never);

    await expect(assertTenantMembership("tenant-abc", "user-xyz", "owner")).rejects.toThrow(
      "Forbidden",
    );
  });

  it("throws 'Forbidden' when admin tries to satisfy owner requirement", async () => {
    mockFindUnique.mockResolvedValue(membership("admin") as never);

    await expect(assertTenantMembership("tenant-abc", "user-xyz", "owner")).rejects.toThrow(
      "Forbidden",
    );
  });

  // --- Authorized (happy path) -----------------------------------------------

  it("resolves when member satisfies member requirement", async () => {
    mockFindUnique.mockResolvedValue(membership("member") as never);

    await expect(
      assertTenantMembership("tenant-abc", "user-xyz", "member"),
    ).resolves.toBeUndefined();
  });

  it("resolves when admin satisfies admin requirement", async () => {
    mockFindUnique.mockResolvedValue(membership("admin") as never);

    await expect(
      assertTenantMembership("tenant-abc", "user-xyz", "admin"),
    ).resolves.toBeUndefined();
  });

  it("resolves when owner satisfies admin requirement (hierarchy)", async () => {
    mockFindUnique.mockResolvedValue(membership("owner") as never);

    await expect(
      assertTenantMembership("tenant-abc", "user-xyz", "admin"),
    ).resolves.toBeUndefined();
  });

  it("resolves when owner satisfies member requirement (hierarchy)", async () => {
    mockFindUnique.mockResolvedValue(membership("owner") as never);

    await expect(
      assertTenantMembership("tenant-abc", "user-xyz", "member"),
    ).resolves.toBeUndefined();
  });

  // --- Membership query scoping --------------------------------------------

  it("queries with tenantId and userId composite key and deletedAt filter", async () => {
    mockFindUnique.mockResolvedValue(membership("admin") as never);

    await assertTenantMembership("tenant-abc", "user-xyz", "admin");

    expect(mockFindUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId_userId: {
            tenantId: "tenant-abc",
            userId: "user-xyz",
          },
          deletedAt: null,
        }),
      }),
    );
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
