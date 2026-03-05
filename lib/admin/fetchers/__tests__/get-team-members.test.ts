import { describe, it, expect, vi, beforeEach } from "vitest";
import { MembershipStatus, TenantRole } from "@prisma/client";

// ── Mock Prisma client ────────────────────────────────────────────────────────
vi.mock("@/lib/prisma", () => ({
  prisma: {
    tenantUserMembership: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import {
  getTeamMemberById,
  getTeamMembersForTenant,
} from "../get-team-members";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const TENANT_ID = "tenant-1";
const ADMIN_USER_ID = "user_admin123";
const MEMBER_USER_ID = "user_member456";

const ADMIN_MEMBERSHIP = { role: TenantRole.ADMIN };
const OWNER_MEMBERSHIP = { role: TenantRole.OWNER };
const MEMBER_MEMBERSHIP = { role: TenantRole.MEMBER };

const NOW = new Date("2025-01-15T10:00:00.000Z");

function makeFullMembership(
  overrides: Partial<{
    id: string;
    tenantId: string;
    userId: string;
    role: TenantRole;
    status: MembershipStatus;
  }> = {}
) {
  return {
    id: "membership-1",
    tenantId: TENANT_ID,
    userId: "db-user-id-1",
    role: TenantRole.ADMIN,
    status: MembershipStatus.ACTIVE,
    createdAt: NOW,
    updatedAt: NOW,
    user: {
      clerkUserId: ADMIN_USER_ID,
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      imageUrl: "https://example.com/avatar.png",
    },
    ...overrides,
  };
}

// ── getTeamMembersForTenant ───────────────────────────────────────────────────

describe("getTeamMembersForTenant", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── RBAC checks ────────────────────────────────────────────────────────────

  it("throws Forbidden when user is not a member of the tenant", async () => {
    vi.mocked(prisma.tenantUserMembership.findFirst).mockResolvedValue(null);

    await expect(
      getTeamMembersForTenant(TENANT_ID, ADMIN_USER_ID)
    ).rejects.toThrow("Forbidden");
  });

  it("throws Forbidden when user has MEMBER role", async () => {
    vi.mocked(prisma.tenantUserMembership.findFirst).mockResolvedValue(
      MEMBER_MEMBERSHIP as never
    );

    await expect(
      getTeamMembersForTenant(TENANT_ID, MEMBER_USER_ID)
    ).rejects.toThrow("Forbidden");
  });

  it("permits access for ADMIN role", async () => {
    vi.mocked(prisma.tenantUserMembership.findFirst).mockResolvedValue(
      ADMIN_MEMBERSHIP as never
    );
    vi.mocked(prisma.tenantUserMembership.findMany).mockResolvedValue([]);
    vi.mocked(prisma.tenantUserMembership.count).mockResolvedValue(0);

    await expect(
      getTeamMembersForTenant(TENANT_ID, ADMIN_USER_ID)
    ).resolves.toBeDefined();
  });

  it("permits access for OWNER role", async () => {
    vi.mocked(prisma.tenantUserMembership.findFirst).mockResolvedValue(
      OWNER_MEMBERSHIP as never
    );
    vi.mocked(prisma.tenantUserMembership.findMany).mockResolvedValue([]);
    vi.mocked(prisma.tenantUserMembership.count).mockResolvedValue(0);

    await expect(
      getTeamMembersForTenant(TENANT_ID, ADMIN_USER_ID)
    ).resolves.toBeDefined();
  });

  // ── RBAC query scoping ─────────────────────────────────────────────────────

  it("checks RBAC using tenantId and clerkUserId relational filter", async () => {
    vi.mocked(prisma.tenantUserMembership.findFirst).mockResolvedValue(null);

    await expect(
      getTeamMembersForTenant(TENANT_ID, ADMIN_USER_ID)
    ).rejects.toThrow();

    expect(prisma.tenantUserMembership.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId: TENANT_ID,
          user: { clerkUserId: ADMIN_USER_ID },
          status: MembershipStatus.ACTIVE,
        }),
      })
    );
  });

  // ── List query behavior ────────────────────────────────────────────────────

  it("queries with tenant scope", async () => {
    vi.mocked(prisma.tenantUserMembership.findFirst).mockResolvedValue(
      ADMIN_MEMBERSHIP as never
    );
    vi.mocked(prisma.tenantUserMembership.findMany).mockResolvedValue([]);
    vi.mocked(prisma.tenantUserMembership.count).mockResolvedValue(0);

    await getTeamMembersForTenant(TENANT_ID, ADMIN_USER_ID);

    expect(prisma.tenantUserMembership.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ tenantId: TENANT_ID }),
      })
    );
    expect(prisma.tenantUserMembership.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ tenantId: TENANT_ID }),
      })
    );
  });

  it("returns mapped DTOs with embedded user info", async () => {
    const record = makeFullMembership();
    vi.mocked(prisma.tenantUserMembership.findFirst).mockResolvedValue(
      ADMIN_MEMBERSHIP as never
    );
    vi.mocked(prisma.tenantUserMembership.findMany).mockResolvedValue([
      record,
    ] as never);
    vi.mocked(prisma.tenantUserMembership.count).mockResolvedValue(1);

    const result = await getTeamMembersForTenant(TENANT_ID, ADMIN_USER_ID);

    expect(result.members).toHaveLength(1);
    const dto = result.members[0];
    expect(dto.id).toBe("membership-1");
    expect(dto.tenantId).toBe(TENANT_ID);
    expect(dto.role).toBe(TenantRole.ADMIN);
    expect(dto.status).toBe(MembershipStatus.ACTIVE);
    expect(dto.user.clerkUserId).toBe(ADMIN_USER_ID);
    expect(dto.user.email).toBe("admin@example.com");
    expect(dto.user.firstName).toBe("Admin");
    expect(dto.user.lastName).toBe("User");
    expect("deletedAt" in dto).toBe(false);
  });

  it("applies pagination correctly", async () => {
    vi.mocked(prisma.tenantUserMembership.findFirst).mockResolvedValue(
      ADMIN_MEMBERSHIP as never
    );
    vi.mocked(prisma.tenantUserMembership.findMany).mockResolvedValue([]);
    vi.mocked(prisma.tenantUserMembership.count).mockResolvedValue(55);

    const result = await getTeamMembersForTenant(TENANT_ID, ADMIN_USER_ID, {
      page: 3,
      pageSize: 10,
    });

    expect(prisma.tenantUserMembership.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 20, take: 10 })
    );
    expect(result.page).toBe(3);
    expect(result.pageSize).toBe(10);
    expect(result.total).toBe(55);
    expect(result.totalPages).toBe(6);
  });

  it("applies optional role filter", async () => {
    vi.mocked(prisma.tenantUserMembership.findFirst).mockResolvedValue(
      ADMIN_MEMBERSHIP as never
    );
    vi.mocked(prisma.tenantUserMembership.findMany).mockResolvedValue([]);
    vi.mocked(prisma.tenantUserMembership.count).mockResolvedValue(0);

    await getTeamMembersForTenant(TENANT_ID, ADMIN_USER_ID, {
      page: 1,
      pageSize: 20,
      role: TenantRole.MEMBER,
    });

    expect(prisma.tenantUserMembership.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ role: TenantRole.MEMBER }),
      })
    );
  });

  it("applies optional status filter", async () => {
    vi.mocked(prisma.tenantUserMembership.findFirst).mockResolvedValue(
      ADMIN_MEMBERSHIP as never
    );
    vi.mocked(prisma.tenantUserMembership.findMany).mockResolvedValue([]);
    vi.mocked(prisma.tenantUserMembership.count).mockResolvedValue(0);

    await getTeamMembersForTenant(TENANT_ID, ADMIN_USER_ID, {
      page: 1,
      pageSize: 20,
      status: MembershipStatus.INACTIVE,
    });

    expect(prisma.tenantUserMembership.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: MembershipStatus.INACTIVE }),
      })
    );
  });

  it("orders results by createdAt ascending", async () => {
    vi.mocked(prisma.tenantUserMembership.findFirst).mockResolvedValue(
      ADMIN_MEMBERSHIP as never
    );
    vi.mocked(prisma.tenantUserMembership.findMany).mockResolvedValue([]);
    vi.mocked(prisma.tenantUserMembership.count).mockResolvedValue(0);

    await getTeamMembersForTenant(TENANT_ID, ADMIN_USER_ID);

    expect(prisma.tenantUserMembership.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { createdAt: "asc" } })
    );
  });

  it("returns empty list when no members exist", async () => {
    vi.mocked(prisma.tenantUserMembership.findFirst).mockResolvedValue(
      ADMIN_MEMBERSHIP as never
    );
    vi.mocked(prisma.tenantUserMembership.findMany).mockResolvedValue([]);
    vi.mocked(prisma.tenantUserMembership.count).mockResolvedValue(0);

    const result = await getTeamMembersForTenant(TENANT_ID, ADMIN_USER_ID);

    expect(result.members).toHaveLength(0);
    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(0);
  });

  it("computes correct totalPages", async () => {
    vi.mocked(prisma.tenantUserMembership.findFirst).mockResolvedValue(
      ADMIN_MEMBERSHIP as never
    );
    vi.mocked(prisma.tenantUserMembership.findMany).mockResolvedValue([]);
    vi.mocked(prisma.tenantUserMembership.count).mockResolvedValue(45);

    const result = await getTeamMembersForTenant(TENANT_ID, ADMIN_USER_ID, {
      page: 1,
      pageSize: 20,
    });

    expect(result.totalPages).toBe(3);
  });
});

// ── getTeamMemberById ─────────────────────────────────────────────────────────

describe("getTeamMemberById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws Forbidden when user is not a member", async () => {
    vi.mocked(prisma.tenantUserMembership.findFirst).mockResolvedValue(null);

    await expect(
      getTeamMemberById(TENANT_ID, ADMIN_USER_ID, "membership-1")
    ).rejects.toThrow("Forbidden");
  });

  it("throws Forbidden when user has MEMBER role", async () => {
    vi.mocked(prisma.tenantUserMembership.findFirst).mockResolvedValue(
      MEMBER_MEMBERSHIP as never
    );

    await expect(
      getTeamMemberById(TENANT_ID, MEMBER_USER_ID, "membership-1")
    ).rejects.toThrow("Forbidden");
  });

  it("queries with id and tenantId scope", async () => {
    const record = makeFullMembership();
    vi.mocked(prisma.tenantUserMembership.findFirst)
      .mockResolvedValueOnce(ADMIN_MEMBERSHIP as never) // RBAC check
      .mockResolvedValueOnce(record as never); // record lookup

    await getTeamMemberById(TENANT_ID, ADMIN_USER_ID, "membership-1");

    expect(prisma.tenantUserMembership.findFirst).toHaveBeenLastCalledWith(
      expect.objectContaining({
        where: {
          id: "membership-1",
          tenantId: TENANT_ID,
        },
      })
    );
  });

  it("returns mapped DTO when record exists", async () => {
    const record = makeFullMembership();
    vi.mocked(prisma.tenantUserMembership.findFirst)
      .mockResolvedValueOnce(ADMIN_MEMBERSHIP as never)
      .mockResolvedValueOnce(record as never);

    const result = await getTeamMemberById(
      TENANT_ID,
      ADMIN_USER_ID,
      "membership-1"
    );

    expect(result).not.toBeNull();
    expect(result?.id).toBe("membership-1");
    expect(result?.user.email).toBe("admin@example.com");
  });

  it("returns null when record not found", async () => {
    vi.mocked(prisma.tenantUserMembership.findFirst)
      .mockResolvedValueOnce(ADMIN_MEMBERSHIP as never)
      .mockResolvedValueOnce(null);

    const result = await getTeamMemberById(
      TENANT_ID,
      ADMIN_USER_ID,
      "membership-999"
    );

    expect(result).toBeNull();
  });

  it("returns null when membership belongs to a different tenant", async () => {
    vi.mocked(prisma.tenantUserMembership.findFirst)
      .mockResolvedValueOnce(ADMIN_MEMBERSHIP as never)
      .mockResolvedValueOnce(null); // tenantId mismatch → Prisma returns null

    const result = await getTeamMemberById(
      TENANT_ID,
      ADMIN_USER_ID,
      "membership-other-tenant"
    );

    expect(result).toBeNull();
  });
});
