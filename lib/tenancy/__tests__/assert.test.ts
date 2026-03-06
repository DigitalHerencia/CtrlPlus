import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  assertTenantMembership,
  assertTenantScope,
  getUserTenantRole,
  hasMinimumRole,
} from "../assert";

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

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function membership(role: string) {
  return { role };
}

// ---------------------------------------------------------------------------
// assertTenantMembership
// ---------------------------------------------------------------------------

describe("assertTenantMembership", () => {
  beforeEach(() => {
    prismaMock.tenantUserMembership.findUnique.mockReset();
  });

  it("throws Forbidden when no membership record exists", async () => {
    prismaMock.tenantUserMembership.findUnique.mockResolvedValue(null);

    await expect(assertTenantMembership("tenant-abc", "user-xyz", "member")).rejects.toThrow(
      "Forbidden",
    );
  });

  it("throws Forbidden when role is insufficient (member vs admin)", async () => {
    prismaMock.tenantUserMembership.findUnique.mockResolvedValue(membership("member"));

    await expect(assertTenantMembership("tenant-abc", "user-xyz", "admin")).rejects.toThrow(
      "Forbidden",
    );
  });

  it("throws Forbidden when admin tries to satisfy owner requirement", async () => {
    prismaMock.tenantUserMembership.findUnique.mockResolvedValue(membership("admin"));

    await expect(assertTenantMembership("tenant-abc", "user-xyz", "owner")).rejects.toThrow(
      "Forbidden",
    );
  });

  it("resolves when member satisfies member requirement", async () => {
    prismaMock.tenantUserMembership.findUnique.mockResolvedValue(membership("member"));

    await expect(
      assertTenantMembership("tenant-abc", "user-xyz", "member"),
    ).resolves.toBeUndefined();
  });

  it("resolves when admin satisfies admin requirement", async () => {
    prismaMock.tenantUserMembership.findUnique.mockResolvedValue(membership("admin"));

    await expect(
      assertTenantMembership("tenant-abc", "user-xyz", "admin"),
    ).resolves.toBeUndefined();
  });

  it("resolves when owner satisfies admin requirement (hierarchy)", async () => {
    prismaMock.tenantUserMembership.findUnique.mockResolvedValue(membership("owner"));

    await expect(
      assertTenantMembership("tenant-abc", "user-xyz", "admin"),
    ).resolves.toBeUndefined();
  });

  it("queries by compound tenantId_userId key with deletedAt: null", async () => {
    prismaMock.tenantUserMembership.findUnique.mockResolvedValue(membership("admin"));

    await assertTenantMembership("tenant-abc", "user-xyz", "admin");

    expect(prismaMock.tenantUserMembership.findUnique).toHaveBeenCalledWith(
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

  it("throws Forbidden when tenantIds differ", () => {
    expect(() => assertTenantScope("tenant-abc", "tenant-xyz")).toThrow("Forbidden");
  });

  it("throws when record has empty tenantId and session has valid tenantId", () => {
    expect(() => assertTenantScope("", "tenant-abc")).toThrow("Forbidden");
  });
});

// ---------------------------------------------------------------------------
// getUserTenantRole
// ---------------------------------------------------------------------------

describe("getUserTenantRole", () => {
  beforeEach(() => {
    prismaMock.tenantUserMembership.findUnique.mockReset();
  });

  it("returns the user role when membership exists", async () => {
    prismaMock.tenantUserMembership.findUnique.mockResolvedValue(membership("admin"));

    const role = await getUserTenantRole("tenant-abc", "user-xyz");
    expect(role).toBe("admin");
  });

  it("returns null when membership does not exist", async () => {
    prismaMock.tenantUserMembership.findUnique.mockResolvedValue(null);

    const role = await getUserTenantRole("tenant-abc", "user-xyz");
    expect(role).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// hasMinimumRole
// ---------------------------------------------------------------------------

describe("hasMinimumRole", () => {
  beforeEach(() => {
    prismaMock.tenantUserMembership.findUnique.mockReset();
  });

  it("returns true when user has exactly the required role", async () => {
    prismaMock.tenantUserMembership.findUnique.mockResolvedValue(membership("admin"));
    expect(await hasMinimumRole("tenant-abc", "user-xyz", "admin")).toBe(true);
  });

  it("returns true when user has higher role than required", async () => {
    prismaMock.tenantUserMembership.findUnique.mockResolvedValue(membership("owner"));
    expect(await hasMinimumRole("tenant-abc", "user-xyz", "member")).toBe(true);
  });

  it("returns false when user has insufficient role", async () => {
    prismaMock.tenantUserMembership.findUnique.mockResolvedValue(membership("member"));
    expect(await hasMinimumRole("tenant-abc", "user-xyz", "admin")).toBe(false);
  });

  it("returns false when no membership exists", async () => {
    prismaMock.tenantUserMembership.findUnique.mockResolvedValue(null);
    expect(await hasMinimumRole("tenant-abc", "user-xyz", "member")).toBe(false);
  });
});
