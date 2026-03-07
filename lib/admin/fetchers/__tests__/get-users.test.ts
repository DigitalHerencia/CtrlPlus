import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mocks ────────────────────────────────────────────────────────────────────

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
    vi.mocked(assertAdminOrOwner).mockResolvedValue(undefined);
  });

  it("calls assertAdminOrOwner before querying", async () => {
    prismaMock.tenantUserMembership.findMany.mockResolvedValue([]);

    await getTeamMembers("tenant-abc", "user-admin");

    expect(assertAdminOrOwner).toHaveBeenCalledWith("tenant-abc", "user-admin");
  });

  it("throws when assertAdminOrOwner rejects (member role)", async () => {
    vi.mocked(assertAdminOrOwner).mockRejectedValue(new Error("Forbidden"));

    await expect(getTeamMembers("tenant-abc", "user-member")).rejects.toThrow("Forbidden");

    expect(prismaMock.tenantUserMembership.findMany).not.toHaveBeenCalled();
  });

  it("returns all active members for the tenant", async () => {
    prismaMock.tenantUserMembership.findMany.mockResolvedValue([
      makeMemberRecord(),
      makeMemberRecord({ id: "mem-002", userId: "user-clerk-002", role: "member" }),
    ]);

    const result = await getTeamMembers("tenant-abc", "user-admin");

    expect(result.members).toHaveLength(2);
    expect(result.total).toBe(2);
  });

  it("scopes query by tenantId and deletedAt: null", async () => {
    prismaMock.tenantUserMembership.findMany.mockResolvedValue([]);

    await getTeamMembers("tenant-abc", "user-admin");

    expect(prismaMock.tenantUserMembership.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ tenantId: "tenant-abc", deletedAt: null }),
      }),
    );
  });

  it("orders results by createdAt ascending", async () => {
    prismaMock.tenantUserMembership.findMany.mockResolvedValue([]);

    await getTeamMembers("tenant-abc", "user-admin");

    expect(prismaMock.tenantUserMembership.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { createdAt: "asc" } }),
    );
  });

  it("maps records to TeamMemberDTOs (no deletedAt exposed)", async () => {
    const record = makeMemberRecord();
    prismaMock.tenantUserMembership.findMany.mockResolvedValue([record]);

    const result = await getTeamMembers("tenant-abc", "user-admin");

    const dto = result.members[0];
    expect(dto.id).toBe("mem-001");
    expect(dto.userId).toBe("user-clerk-001");
    expect(dto.tenantId).toBe("tenant-abc");
    expect(dto.role).toBe("admin");
    expect(dto.createdAt).toEqual(NOW);
    expect("deletedAt" in dto).toBe(false);
  });

  it("throws when a record contains an unrecognized role value", async () => {
    prismaMock.tenantUserMembership.findMany.mockResolvedValue([
      makeMemberRecord({ role: "superadmin" }),
    ]);

    await expect(getTeamMembers("tenant-abc", "user-admin")).rejects.toThrow(
      'Invalid role value in database: "superadmin"',
    );
  });

  it("returns empty list when no members exist", async () => {
    prismaMock.tenantUserMembership.findMany.mockResolvedValue([]);

    const result = await getTeamMembers("tenant-abc", "user-admin");

    expect(result.members).toHaveLength(0);
    expect(result.total).toBe(0);
  });
});

// ─── getTeamMemberById ────────────────────────────────────────────────────────

describe("getTeamMemberById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(assertAdminOrOwner).mockResolvedValue(undefined);
  });

  it("calls assertAdminOrOwner before querying", async () => {
    prismaMock.tenantUserMembership.findFirst.mockResolvedValue(null);

    await getTeamMemberById("tenant-abc", "mem-001", "user-admin");

    expect(assertAdminOrOwner).toHaveBeenCalledWith("tenant-abc", "user-admin");
  });

  it("throws when assertAdminOrOwner rejects (member role)", async () => {
    vi.mocked(assertAdminOrOwner).mockRejectedValue(new Error("Forbidden"));

    await expect(getTeamMemberById("tenant-abc", "mem-001", "user-member")).rejects.toThrow(
      "Forbidden",
    );

    expect(prismaMock.tenantUserMembership.findFirst).not.toHaveBeenCalled();
  });

  it("returns TeamMemberDTO when membership exists for the tenant", async () => {
    prismaMock.tenantUserMembership.findFirst.mockResolvedValue(makeMemberRecord());

    const result = await getTeamMemberById("tenant-abc", "mem-001", "user-admin");

    expect(result).not.toBeNull();
    expect(result?.id).toBe("mem-001");
    expect(result?.tenantId).toBe("tenant-abc");
  });

  it("returns null when membership does not exist", async () => {
    prismaMock.tenantUserMembership.findFirst.mockResolvedValue(null);

    const result = await getTeamMemberById("tenant-abc", "mem-999", "user-admin");

    expect(result).toBeNull();
  });

  it("returns null when membership belongs to a different tenant", async () => {
    prismaMock.tenantUserMembership.findFirst.mockResolvedValue(null);

    const result = await getTeamMemberById("tenant-other", "mem-001", "user-admin");

    expect(result).toBeNull();
  });

  it("scopes query by id, tenantId, and deletedAt: null", async () => {
    prismaMock.tenantUserMembership.findFirst.mockResolvedValue(null);

    await getTeamMemberById("tenant-abc", "mem-001", "user-admin");

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
