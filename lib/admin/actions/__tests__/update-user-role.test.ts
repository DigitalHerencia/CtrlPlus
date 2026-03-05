/**
 * Tests for updateUserRole server action
 *
 * Verifies the security pipeline:
 * 1. Unauthenticated requests are rejected
 * 2. Non-owner (ADMIN, MEMBER) requests are rejected
 * 3. Invalid input is rejected by Zod
 * 4. Owner can update a member's role
 * 5. Audit event is created on successful update
 * 6. Target user not found throws a clear error
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

// ─── Hoisted mocks (must be declared before imports) ────────────────────────

const mockGetSession = vi.hoisted(() => vi.fn());
const mockAssertTenantMembership = vi.hoisted(() => vi.fn());
const mockPrisma = vi.hoisted(() => ({
  tenantUserMembership: {
    findFirst: vi.fn(),
    update: vi.fn(),
  },
  auditEvent: {
    create: vi.fn(),
  },
}));

vi.mock("@/lib/auth/session", () => ({ getSession: mockGetSession }));
vi.mock("@/lib/tenancy/assert", () => ({
  assertTenantMembership: mockAssertTenantMembership,
}));
vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }));

// ─── Import the action under test AFTER mocks ────────────────────────────────

import { updateUserRole } from "../update-user-role";
import type { UpdateUserRoleInput } from "../../types";

// ─── Shared fixtures ─────────────────────────────────────────────────────────

const TENANT_ID = "tenant-001";
const OWNER_USER_ID = "user-owner";
const TARGET_USER_ID = "user-member";
const MEMBERSHIP_ID = "membership-001";

const validInput = {
  targetClerkUserId: TARGET_USER_ID,
  newRole: "ADMIN" as const,
};

const existingMembership = {
  id: MEMBERSHIP_ID,
  role: "MEMBER",
  user: { clerkUserId: TARGET_USER_ID },
};

const updatedMembership = {
  id: MEMBERSHIP_ID,
  role: "ADMIN",
  updatedAt: new Date("2024-06-01T10:00:00.000Z"),
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("updateUserRole", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Authentication ────────────────────────────────────────────────────────

  it("throws Unauthorized when userId is null", async () => {
    mockGetSession.mockResolvedValue({ userId: null, tenantId: null });

    await expect(updateUserRole(validInput)).rejects.toThrow("Unauthorized");
  });

  it("throws Unauthorized when tenantId is null", async () => {
    mockGetSession.mockResolvedValue({
      userId: OWNER_USER_ID,
      tenantId: null,
    });

    await expect(updateUserRole(validInput)).rejects.toThrow("Unauthorized");
  });

  // ── Authorization ─────────────────────────────────────────────────────────

  it("throws Forbidden when caller is not an OWNER", async () => {
    mockGetSession.mockResolvedValue({
      userId: OWNER_USER_ID,
      tenantId: TENANT_ID,
    });
    mockAssertTenantMembership.mockRejectedValue(
      new Error(
        "Forbidden: role 'ADMIN' is insufficient; requires 'OWNER' or higher"
      )
    );

    await expect(updateUserRole(validInput)).rejects.toThrow("Forbidden");

    expect(mockAssertTenantMembership).toHaveBeenCalledWith(
      TENANT_ID,
      OWNER_USER_ID,
      "OWNER"
    );
  });

  // ── Validation ────────────────────────────────────────────────────────────

  it("throws ZodError when targetClerkUserId is missing", async () => {
    mockGetSession.mockResolvedValue({
      userId: OWNER_USER_ID,
      tenantId: TENANT_ID,
    });
    mockAssertTenantMembership.mockResolvedValue(undefined);

    await expect(
      updateUserRole({ newRole: "ADMIN" } as UpdateUserRoleInput)
    ).rejects.toThrow();
  });

  it("throws ZodError when newRole is invalid", async () => {
    mockGetSession.mockResolvedValue({
      userId: OWNER_USER_ID,
      tenantId: TENANT_ID,
    });
    mockAssertTenantMembership.mockResolvedValue(undefined);

    await expect(
      updateUserRole({
        targetClerkUserId: TARGET_USER_ID,
        newRole: "SUPERADMIN" as "OWNER",
      })
    ).rejects.toThrow();
  });

  // ── Target not found ──────────────────────────────────────────────────────

  it("throws Not found when target user is not a member", async () => {
    mockGetSession.mockResolvedValue({
      userId: OWNER_USER_ID,
      tenantId: TENANT_ID,
    });
    mockAssertTenantMembership.mockResolvedValue(undefined);
    mockPrisma.tenantUserMembership.findFirst.mockResolvedValue(null);

    await expect(updateUserRole(validInput)).rejects.toThrow("Not found");
  });

  // ── Happy path ────────────────────────────────────────────────────────────

  it("updates the role and returns the result DTO", async () => {
    mockGetSession.mockResolvedValue({
      userId: OWNER_USER_ID,
      tenantId: TENANT_ID,
    });
    mockAssertTenantMembership.mockResolvedValue(undefined);
    mockPrisma.tenantUserMembership.findFirst.mockResolvedValue(
      existingMembership
    );
    mockPrisma.tenantUserMembership.update.mockResolvedValue(updatedMembership);
    mockPrisma.auditEvent.create.mockResolvedValue({});

    const result = await updateUserRole(validInput);

    expect(result).toEqual({
      membershipId: MEMBERSHIP_ID,
      targetClerkUserId: TARGET_USER_ID,
      newRole: "ADMIN",
      updatedAt: updatedMembership.updatedAt,
    });
  });

  it("scopes the membership lookup by tenantId", async () => {
    mockGetSession.mockResolvedValue({
      userId: OWNER_USER_ID,
      tenantId: TENANT_ID,
    });
    mockAssertTenantMembership.mockResolvedValue(undefined);
    mockPrisma.tenantUserMembership.findFirst.mockResolvedValue(
      existingMembership
    );
    mockPrisma.tenantUserMembership.update.mockResolvedValue(updatedMembership);
    mockPrisma.auditEvent.create.mockResolvedValue({});

    await updateUserRole(validInput);

    expect(mockPrisma.tenantUserMembership.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ tenantId: TENANT_ID }),
      })
    );
  });

  // ── Audit ─────────────────────────────────────────────────────────────────

  it("creates an audit event on successful role update", async () => {
    mockGetSession.mockResolvedValue({
      userId: OWNER_USER_ID,
      tenantId: TENANT_ID,
    });
    mockAssertTenantMembership.mockResolvedValue(undefined);
    mockPrisma.tenantUserMembership.findFirst.mockResolvedValue(
      existingMembership
    );
    mockPrisma.tenantUserMembership.update.mockResolvedValue(updatedMembership);
    mockPrisma.auditEvent.create.mockResolvedValue({});

    await updateUserRole(validInput);

    expect(mockPrisma.auditEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tenantId: TENANT_ID,
          userId: OWNER_USER_ID,
          action: "admin.role.updated",
          resource: `tenantUserMembership:${MEMBERSHIP_ID}`,
          metadata: expect.objectContaining({
            targetClerkUserId: TARGET_USER_ID,
            previousRole: "MEMBER",
            newRole: "ADMIN",
          }),
        }),
      })
    );
  });

  it("records the previous role in the audit event", async () => {
    const existingOwnerMembership = {
      id: MEMBERSHIP_ID,
      role: "OWNER",
      user: { clerkUserId: TARGET_USER_ID },
    };

    mockGetSession.mockResolvedValue({
      userId: OWNER_USER_ID,
      tenantId: TENANT_ID,
    });
    mockAssertTenantMembership.mockResolvedValue(undefined);
    mockPrisma.tenantUserMembership.findFirst.mockResolvedValue(
      existingOwnerMembership
    );
    mockPrisma.tenantUserMembership.update.mockResolvedValue({
      ...updatedMembership,
      role: "MEMBER",
    });
    mockPrisma.auditEvent.create.mockResolvedValue({});

    await updateUserRole({
      targetClerkUserId: TARGET_USER_ID,
      newRole: "MEMBER",
    });

    expect(mockPrisma.auditEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          metadata: expect.objectContaining({
            previousRole: "OWNER",
            newRole: "MEMBER",
          }),
        }),
      })
    );
  });
});
