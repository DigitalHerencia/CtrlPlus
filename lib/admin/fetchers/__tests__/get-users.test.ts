import { describe, it, expect, vi, beforeEach } from "vitest";
import { getUsersForTenant, getTeamMemberById } from "../get-users";

vi.mock("@/lib/prisma", () => {
  const findManyMock = vi.fn();
  const findFirstMock = vi.fn();

  return {
    prisma: {
      tenantUserMembership: {
        findMany: findManyMock,
        findFirst: findFirstMock,
      },
    },
  };
});

import { prisma } from "@/lib/prisma";

const mockMembership = {
  id: "membership-1",
  role: "ADMIN",
  status: "ACTIVE",
  createdAt: new Date("2024-01-01"),
  user: {
    id: "user-1",
    clerkUserId: "clerk-1",
    name: "Alice Smith",
    email: "alice@example.com",
  },
};

describe("getUsersForTenant", () => {
  const tenantId = "tenant-123";

  beforeEach(() => vi.clearAllMocks());

  it("maps memberships to TeamMember DTOs correctly", async () => {
    (
      prisma.tenantUserMembership.findMany as ReturnType<typeof vi.fn>
    ).mockResolvedValue([mockMembership]);

    const result = await getUsersForTenant(tenantId);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "membership-1",
      clerkUserId: "clerk-1",
      name: "Alice Smith",
      email: "alice@example.com",
      role: "ADMIN",
      status: "ACTIVE",
    });
  });

  it("queries with tenantId scope and ACTIVE status filter", async () => {
    (
      prisma.tenantUserMembership.findMany as ReturnType<typeof vi.fn>
    ).mockResolvedValue([]);

    await getUsersForTenant(tenantId);

    expect(prisma.tenantUserMembership.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId,
          status: "ACTIVE",
        }),
      })
    );
  });

  it("falls back to email when user name is null", async () => {
    (
      prisma.tenantUserMembership.findMany as ReturnType<typeof vi.fn>
    ).mockResolvedValue([
      { ...mockMembership, user: { ...mockMembership.user, name: null } },
    ]);

    const result = await getUsersForTenant(tenantId);

    expect(result[0].name).toBe("alice@example.com");
  });

  it("returns empty array when there are no members", async () => {
    (
      prisma.tenantUserMembership.findMany as ReturnType<typeof vi.fn>
    ).mockResolvedValue([]);

    const result = await getUsersForTenant(tenantId);

    expect(result).toEqual([]);
  });
});

describe("getTeamMemberById", () => {
  const tenantId = "tenant-123";
  const membershipId = "membership-1";

  beforeEach(() => vi.clearAllMocks());

  it("returns TeamMember DTO when found", async () => {
    (
      prisma.tenantUserMembership.findFirst as ReturnType<typeof vi.fn>
    ).mockResolvedValue(mockMembership);

    const result = await getTeamMemberById(tenantId, membershipId);

    expect(result).not.toBeNull();
    expect(result!.id).toBe("membership-1");
  });

  it("returns null when membership is not found", async () => {
    (
      prisma.tenantUserMembership.findFirst as ReturnType<typeof vi.fn>
    ).mockResolvedValue(null);

    const result = await getTeamMemberById(tenantId, membershipId);

    expect(result).toBeNull();
  });

  it("includes tenantId and membershipId in the query", async () => {
    (
      prisma.tenantUserMembership.findFirst as ReturnType<typeof vi.fn>
    ).mockResolvedValue(null);

    await getTeamMemberById(tenantId, membershipId);

    expect(prisma.tenantUserMembership.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: membershipId,
          tenantId,
        }),
      })
    );
  });
});
