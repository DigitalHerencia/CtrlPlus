import { beforeEach, describe, expect, it, vi } from "vitest";

// ─── Prisma mock ──────────────────────────────────────────────────────────────

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    tenantUserMembership: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

// ─── Import after mock ────────────────────────────────────────────────────────

import { getUsersForTenant } from "../get-users";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockMember = {
  id: "membership-001",
  userId: "clerk-user-001",
  role: "admin",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("getUsersForTenant", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns an array of TeamMemberDTOs for the tenant", async () => {
    prismaMock.tenantUserMembership.findMany.mockResolvedValue([mockMember]);

    const result = await getUsersForTenant("tenant-abc");

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("membership-001");
    expect(result[0].userId).toBe("clerk-user-001");
    expect(result[0].role).toBe("admin");
  });

  it("scopes the query by tenantId", async () => {
    prismaMock.tenantUserMembership.findMany.mockResolvedValue([]);

    await getUsersForTenant("tenant-abc");

    expect(prismaMock.tenantUserMembership.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ tenantId: "tenant-abc" }),
      }),
    );
  });

  it("filters out soft-deleted memberships", async () => {
    prismaMock.tenantUserMembership.findMany.mockResolvedValue([]);

    await getUsersForTenant("tenant-abc");

    expect(prismaMock.tenantUserMembership.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ deletedAt: null }),
      }),
    );
  });

  it("returns an empty array when no members exist", async () => {
    prismaMock.tenantUserMembership.findMany.mockResolvedValue([]);

    const result = await getUsersForTenant("tenant-abc");

    expect(result).toEqual([]);
  });

  it("returns members in ascending creation order", async () => {
    prismaMock.tenantUserMembership.findMany.mockResolvedValue([mockMember]);

    await getUsersForTenant("tenant-abc");

    expect(prismaMock.tenantUserMembership.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { createdAt: "asc" },
      }),
    );
  });
});
