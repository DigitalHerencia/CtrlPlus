import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Hoisted mocks ──────────────────────────────────────────────────────────
const { mockGetSession, mockAssertTenantMembership, mockAssertTenantScope } =
  vi.hoisted(() => ({
    mockGetSession: vi.fn(),
    mockAssertTenantMembership: vi.fn(),
    mockAssertTenantScope: vi.fn(),
  }));

vi.mock("@/lib/auth/session", () => ({ getSession: mockGetSession }));
vi.mock("@/lib/tenancy/assert", () => ({
  assertTenantMembership: mockAssertTenantMembership,
  assertTenantScope: mockAssertTenantScope,
}));
vi.mock("@/lib/prisma", () => {
  const findFirstMock = vi.fn();
  const updateMock = vi.fn();
  const auditCreateMock = vi.fn();
  return {
    prisma: {
      tenantUserMembership: { findFirst: findFirstMock, update: updateMock },
      auditLog: { create: auditCreateMock },
    },
  };
});

import { setUserRole } from "../set-user-role";
import { prisma } from "@/lib/prisma";

const EXISTING_MEMBERSHIP = {
  id: "membership-1",
  tenantId: "tenant-123",
  role: "MEMBER",
  status: "ACTIVE",
  createdAt: new Date("2024-01-01"),
  user: {
    id: "user-2",
    clerkUserId: "clerk-2",
    name: "Bob Jones",
    email: "bob@example.com",
  },
};

const UPDATED_MEMBERSHIP = { ...EXISTING_MEMBERSHIP, role: "ADMIN" };

describe("setUserRole", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSession.mockResolvedValue({
      clerkUserId: "clerk-owner",
      tenantId: "tenant-123",
      role: "OWNER",
      isAuthenticated: true,
    });
    mockAssertTenantMembership.mockResolvedValue(undefined);
    mockAssertTenantScope.mockReturnValue(undefined);
    (
      prisma.tenantUserMembership.findFirst as ReturnType<typeof vi.fn>
    ).mockResolvedValue(EXISTING_MEMBERSHIP);
    (
      prisma.tenantUserMembership.update as ReturnType<typeof vi.fn>
    ).mockResolvedValue(UPDATED_MEMBERSHIP);
    (prisma.auditLog.create as ReturnType<typeof vi.fn>).mockResolvedValue({});
  });

  it("returns updated TeamMember DTO on success", async () => {
    const result = await setUserRole({
      membershipId: "membership-1",
      role: "ADMIN",
    });

    expect(result.role).toBe("ADMIN");
    expect(result.id).toBe("membership-1");
  });

  it("throws Unauthorized when session has no userId", async () => {
    mockGetSession.mockResolvedValue({
      clerkUserId: null,
      tenantId: null,
      isAuthenticated: false,
    });

    await expect(
      setUserRole({ membershipId: "membership-1", role: "ADMIN" })
    ).rejects.toThrow("Unauthorized");
  });

  it("calls assertTenantMembership with OWNER-only restriction", async () => {
    await setUserRole({ membershipId: "membership-1", role: "ADMIN" });

    expect(mockAssertTenantMembership).toHaveBeenCalledWith(
      "tenant-123",
      "clerk-owner",
      "OWNER"
    );
  });

  it("throws Not found when membership does not exist", async () => {
    (
      prisma.tenantUserMembership.findFirst as ReturnType<typeof vi.fn>
    ).mockResolvedValue(null);

    await expect(
      setUserRole({ membershipId: "membership-1", role: "ADMIN" })
    ).rejects.toThrow("Not found");
  });

  it("calls assertTenantScope to prevent cross-tenant mutation", async () => {
    await setUserRole({ membershipId: "membership-1", role: "ADMIN" });

    expect(mockAssertTenantScope).toHaveBeenCalledWith(
      "tenant-123",
      "tenant-123"
    );
  });

  it("creates an audit log with previous and new role", async () => {
    await setUserRole({ membershipId: "membership-1", role: "ADMIN" });

    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: "SET_USER_ROLE",
          details: JSON.stringify({ previousRole: "MEMBER", newRole: "ADMIN" }),
        }),
      })
    );
  });

  it("rejects invalid role values", async () => {
    await expect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setUserRole({ membershipId: "membership-1", role: "SUPERUSER" as any })
    ).rejects.toThrow();
  });
});
