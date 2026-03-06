import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateUserRole } from "../update-user-role";

// ── Mock dependencies ─────────────────────────────────────────────────────────

vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/tenancy/assert", () => ({
  assertTenantMembership: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    tenantUserMembership: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}));

// ── Imports after mocks ───────────────────────────────────────────────────────

import { getSession } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";

// ── Helpers ───────────────────────────────────────────────────────────────────

const mockSession = {
  user: { id: "clerk-owner", clerkUserId: "clerk-owner", email: "owner@example.com" },
  tenantId: "tenant-1",
};

const existingMembership = {
  id: "membership-1",
  tenantId: "tenant-1",
  userId: "clerk-target",
  role: "member",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-02"),
  deletedAt: null,
};

const updatedMembership = {
  ...existingMembership,
  role: "admin",
  updatedAt: new Date("2024-01-03"),
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("updateUserRole", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates the role and returns a DTO when the owner is authorized", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.tenantUserMembership.findUnique).mockResolvedValue(existingMembership as never);
    vi.mocked(prisma.tenantUserMembership.update).mockResolvedValue(updatedMembership as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const result = await updateUserRole({ targetClerkUserId: "clerk-target", role: "admin" });

    expect(result).toMatchObject({
      tenantId: "tenant-1",
      userId: "clerk-target",
      role: "admin",
    });
  });

  it("scopes the membership lookup to the current tenant using the composite key", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.tenantUserMembership.findUnique).mockResolvedValue(existingMembership as never);
    vi.mocked(prisma.tenantUserMembership.update).mockResolvedValue(updatedMembership as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await updateUserRole({ targetClerkUserId: "clerk-target", role: "admin" });

    expect(prisma.tenantUserMembership.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          tenantId_userId: {
            tenantId: "tenant-1",
            userId: "clerk-target",
          },
        },
      }),
    );
  });

  it("scopes the update to the current tenant and target user", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.tenantUserMembership.findUnique).mockResolvedValue(existingMembership as never);
    vi.mocked(prisma.tenantUserMembership.update).mockResolvedValue(updatedMembership as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await updateUserRole({ targetClerkUserId: "clerk-target", role: "admin" });

    expect(prisma.tenantUserMembership.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          tenantId_userId: {
            tenantId: "tenant-1",
            userId: "clerk-target",
          },
        },
        data: { role: "admin" },
      }),
    );
  });

  it("writes an audit log entry after updating the role", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.tenantUserMembership.findUnique).mockResolvedValue(existingMembership as never);
    vi.mocked(prisma.tenantUserMembership.update).mockResolvedValue(updatedMembership as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await updateUserRole({ targetClerkUserId: "clerk-target", role: "admin" });

    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tenantId: "tenant-1",
          userId: "clerk-owner",
          action: "user.role_updated",
          resourceType: "TenantUserMembership",
          resourceId: "membership-1",
        }),
      }),
    );
  });

  it("throws Unauthorized when the user is not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue({ user: null, tenantId: "" });

    await expect(
      updateUserRole({ targetClerkUserId: "clerk-target", role: "admin" }),
    ).rejects.toThrow("Unauthorized");
  });

  it("throws Forbidden when assertTenantMembership rejects (non-owner)", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockRejectedValue(
      new Error("Forbidden - User role 'admin' insufficient, requires 'owner' or higher"),
    );

    await expect(
      updateUserRole({ targetClerkUserId: "clerk-target", role: "admin" }),
    ).rejects.toThrow("Forbidden");
  });

  it("throws Forbidden when the target user is not a member of the tenant", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.tenantUserMembership.findUnique).mockResolvedValue(null);

    await expect(
      updateUserRole({ targetClerkUserId: "unknown-user", role: "admin" }),
    ).rejects.toThrow("Forbidden");
    expect(prisma.tenantUserMembership.update).not.toHaveBeenCalled();
  });

  it("throws Forbidden when the target user is soft-deleted", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.tenantUserMembership.findUnique).mockResolvedValue({
      ...existingMembership,
      deletedAt: new Date(),
    } as never);

    await expect(
      updateUserRole({ targetClerkUserId: "clerk-target", role: "admin" }),
    ).rejects.toThrow("Forbidden");
    expect(prisma.tenantUserMembership.update).not.toHaveBeenCalled();
  });

  it("throws Forbidden when the target user is an owner", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.tenantUserMembership.findUnique).mockResolvedValue({
      ...existingMembership,
      role: "owner",
    } as never);

    await expect(
      updateUserRole({ targetClerkUserId: "clerk-target", role: "admin" }),
    ).rejects.toThrow("Forbidden: cannot change the role of an owner");
    expect(prisma.tenantUserMembership.update).not.toHaveBeenCalled();
  });

  it("throws a ZodError for an invalid role value", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);

    const badInput = { targetClerkUserId: "clerk-target", role: "owner" } as never;

    await expect(updateUserRole(badInput)).rejects.toThrow();
    expect(prisma.tenantUserMembership.findUnique).not.toHaveBeenCalled();
  });

  it("throws a ZodError when targetClerkUserId is empty", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);

    const badInput = { targetClerkUserId: "", role: "admin" } as never;

    await expect(updateUserRole(badInput)).rejects.toThrow();
    expect(prisma.tenantUserMembership.findUnique).not.toHaveBeenCalled();
  });

  it("requires OWNER authorization — assertTenantMembership is called with 'owner'", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.tenantUserMembership.findUnique).mockResolvedValue(existingMembership as never);
    vi.mocked(prisma.tenantUserMembership.update).mockResolvedValue(updatedMembership as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await updateUserRole({ targetClerkUserId: "clerk-target", role: "member" });

    expect(assertTenantMembership).toHaveBeenCalledWith("tenant-1", "clerk-owner", "owner");
  });
});
