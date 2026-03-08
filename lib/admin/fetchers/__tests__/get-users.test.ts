import { beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    tenantUserMembership: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("@/lib/admin/rbac", () => ({ assertAdminOrOwner: vi.fn().mockResolvedValue(undefined) }));

import { assertAdminOrOwner } from "@/lib/admin/rbac";
import { getTeamMemberById, getTeamMembers } from "../get-users";

const NOW = new Date("2025-01-15T10:00:00.000Z");

function makeMemberRecord(overrides: Record<string, unknown> = {}) {
  return {
    id: "mem-001",
    userId: "user-internal-001",
    tenantId: "tenant-abc",
    role: "admin",
    createdAt: NOW,
    user: {
      clerkUserId: "clerk-user-001",
    },
    ...overrides,
  };
}

describe("getTeamMembers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(assertAdminOrOwner).mockResolvedValue(undefined);
  });

  it("returns paginated DTO with serialized team member dates", async () => {
    prismaMock.tenantUserMembership.findMany.mockResolvedValue([
      makeMemberRecord(),
      makeMemberRecord({
        id: "mem-002",
        userId: "user-internal-002",
        role: "member",
        user: { clerkUserId: "clerk-user-002" },
      }),
    ]);

    const result = await getTeamMembers("tenant-abc");

    expect(result.total).toBe(2);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(50);
    expect(result.totalPages).toBe(1);
    expect(result.members[0]).toMatchObject({
      userId: "user-internal-001",
      clerkUserId: "clerk-user-001",
      createdAt: NOW.toISOString(),
    });
  });

  it("scopes list query to tenant and active memberships", async () => {
    prismaMock.tenantUserMembership.findMany.mockResolvedValue([]);

    await getTeamMembers("tenant-abc");

    expect(prismaMock.tenantUserMembership.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ tenantId: "tenant-abc", deletedAt: null }),
      }),
    );
  });

  it("throws when DB contains invalid role values", async () => {
    prismaMock.tenantUserMembership.findMany.mockResolvedValue([
      makeMemberRecord({ role: "superadmin" }),
    ]);

    await expect(getTeamMembers("tenant-abc")).rejects.toThrow('Invalid tenant role: "superadmin"');
  });
});

describe("getTeamMemberById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(assertAdminOrOwner).mockResolvedValue(undefined);
  });

  it("returns null when no tenant-scoped membership exists", async () => {
    prismaMock.tenantUserMembership.findFirst.mockResolvedValue(null);

    const result = await getTeamMemberById("tenant-abc", "mem-404");

    expect(result).toBeNull();
    expect(prismaMock.tenantUserMembership.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: "mem-404",
          tenantId: "tenant-abc",
          deletedAt: null,
        }),
      }),
    );
  });
});
