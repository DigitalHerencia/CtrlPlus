import { beforeEach, describe, expect, it, vi } from "vitest";

import { assertTenantMembership, assertTenantScope } from "../assert";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    tenantUserMembership: {
      findFirst: vi.fn(),
    },
  },
}));

const { prisma } = await import("@/lib/prisma");
const mockFindUnique = vi.mocked(prisma.user.findUnique);
const mockFindFirst = vi.mocked(prisma.tenantUserMembership.findFirst);

describe("assertTenantMembership", () => {
  beforeEach(() => {
    mockFindUnique.mockReset();
    mockFindFirst.mockReset();
    mockFindUnique.mockResolvedValue({ id: "db-user-1" } as never);
  });

  it("throws Unauthorized when the Clerk user cannot be resolved locally", async () => {
    mockFindUnique.mockResolvedValue(null);

    await expect(assertTenantMembership("tenant-abc", "user-xyz", "member")).rejects.toThrow(
      "Unauthorized: user not found",
    );
    expect(mockFindFirst).not.toHaveBeenCalled();
  });

  it("throws Unauthorized when no active membership record exists", async () => {
    mockFindFirst.mockResolvedValue(null);

    await expect(assertTenantMembership("tenant-abc", "user-xyz", "member")).rejects.toThrow(
      "Unauthorized: not a member of this tenant",
    );
  });

  it("throws Forbidden when role requirements are not met", async () => {
    mockFindFirst.mockResolvedValue({ role: "member" } as never);

    await expect(assertTenantMembership("tenant-abc", "user-xyz", "admin")).rejects.toThrow(
      "Forbidden: insufficient role",
    );
  });

  it("resolves when the membership satisfies the requested role", async () => {
    mockFindFirst.mockResolvedValue({ role: "admin" } as never);

    await expect(
      assertTenantMembership("tenant-abc", "user-xyz", "admin"),
    ).resolves.toBeUndefined();
  });

  it("resolves when a higher role satisfies a lower requirement", async () => {
    mockFindFirst.mockResolvedValue({ role: "owner" } as never);

    await expect(
      assertTenantMembership("tenant-abc", "user-xyz", "member"),
    ).resolves.toBeUndefined();
  });

  it("queries prisma with the internal user id and active membership filter", async () => {
    mockFindFirst.mockResolvedValue({ role: "admin" } as never);

    await assertTenantMembership("tenant-abc", "clerk-user-1", "admin");

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { clerkUserId: "clerk-user-1" },
      select: { id: true },
    });
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: {
        tenantId: "tenant-abc",
        userId: "db-user-1",
        deletedAt: null,
      },
      select: {
        role: true,
      },
    });
  });
});

describe("assertTenantScope", () => {
  it("does not throw when tenantIds match", () => {
    expect(() => assertTenantScope("tenant-abc", "tenant-abc")).not.toThrow();
  });

  it("throws when tenantIds differ", () => {
    expect(() => assertTenantScope("tenant-abc", "tenant-xyz")).toThrow(
      "Forbidden: cross-tenant access detected",
    );
  });

  it("throws when either tenantId is empty", () => {
    expect(() => assertTenantScope("", "tenant-abc")).toThrow("Forbidden");
    expect(() => assertTenantScope("tenant-abc", "")).toThrow("Forbidden");
  });
});
