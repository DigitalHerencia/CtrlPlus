import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Prisma mock ─────────────────────────────────────────────────────────────

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    tenantUserMembership: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

import { getTeamMembers, getTeamMemberById } from "../get-users";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const NOW = new Date("2025-01-15T10:00:00.000Z");

function makeMemberRecord(overrides: Partial<ReturnType<typeof baseMember>> = {}) {
  return { ...baseMember(), ...overrides };
}

function baseMember() {
  return {
    id: "mem-001",
    userId: "user-clerk-001",
    tenantId: "tenant-abc",
    role: "admin",
    createdAt: NOW,
  };
}

// ─── getTeamMembers ───────────────────────────────────────────────────────────

describe("getTeamMembers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all active members for the tenant", async () => {
    prismaMock.tenantUserMembership.findMany.mockResolvedValue([
      makeMemberRecord(),
      makeMemberRecord({ id: "mem-002", userId: "user-clerk-002", role: "member" }),
    ]);

    const result = await getTeamMembers("tenant-abc");

    expect(result.members).toHaveLength(2);
    expect(result.total).toBe(2);
  });

  it("scopes query by tenantId and deletedAt: null", async () => {
    prismaMock.tenantUserMembership.findMany.mockResolvedValue([]);

    await getTeamMembers("tenant-abc");

    expect(prismaMock.tenantUserMembership.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ tenantId: "tenant-abc", deletedAt: null }),
      }),
    );
  });

  it("orders results by createdAt ascending", async () => {
    prismaMock.tenantUserMembership.findMany.mockResolvedValue([]);

    await getTeamMembers("tenant-abc");

    expect(prismaMock.tenantUserMembership.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { createdAt: "asc" } }),
    );
  });

  it("maps records to TeamMemberDTOs (no deletedAt exposed)", async () => {
    const record = makeMemberRecord();
    prismaMock.tenantUserMembership.findMany.mockResolvedValue([record]);

    const result = await getTeamMembers("tenant-abc");

    const dto = result.members[0];
    expect(dto.id).toBe("mem-001");
    expect(dto.userId).toBe("user-clerk-001");
    expect(dto.tenantId).toBe("tenant-abc");
    expect(dto.role).toBe("admin");
    expect(dto.createdAt).toEqual(NOW);
    expect("deletedAt" in dto).toBe(false);
  });

  it("returns empty list when no members exist", async () => {
    prismaMock.tenantUserMembership.findMany.mockResolvedValue([]);

    const result = await getTeamMembers("tenant-abc");

    expect(result.members).toHaveLength(0);
    expect(result.total).toBe(0);
  });
});

// ─── getTeamMemberById ────────────────────────────────────────────────────────

describe("getTeamMemberById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns TeamMemberDTO when membership exists for the tenant", async () => {
    prismaMock.tenantUserMembership.findFirst.mockResolvedValue(makeMemberRecord());

    const result = await getTeamMemberById("tenant-abc", "mem-001");

    expect(result).not.toBeNull();
    expect(result?.id).toBe("mem-001");
    expect(result?.tenantId).toBe("tenant-abc");
  });

  it("returns null when membership does not exist", async () => {
    prismaMock.tenantUserMembership.findFirst.mockResolvedValue(null);

    const result = await getTeamMemberById("tenant-abc", "mem-999");

    expect(result).toBeNull();
  });

  it("returns null when membership belongs to a different tenant", async () => {
    prismaMock.tenantUserMembership.findFirst.mockResolvedValue(null);

    const result = await getTeamMemberById("tenant-other", "mem-001");

    expect(result).toBeNull();
  });

  it("scopes query by id, tenantId, and deletedAt: null", async () => {
    prismaMock.tenantUserMembership.findFirst.mockResolvedValue(null);

    await getTeamMemberById("tenant-abc", "mem-001");

    expect(prismaMock.tenantUserMembership.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: "mem-001",
          tenantId: "tenant-abc",
          deletedAt: null,
        }),
      }),
    );
  });
});
