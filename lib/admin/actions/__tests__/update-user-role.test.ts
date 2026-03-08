vi.mock("@/lib/auth/session", () => ({ getSession: vi.fn() }));
vi.mock("@/lib/tenancy/assert", () => ({ assertTenantMembership: vi.fn() }));
vi.mock("@/lib/admin/user-id", () => ({ getInternalUserIdByClerkId: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    tenantUserMembership: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    auditLog: { create: vi.fn() },
  },
}));

describe("updateUserRole", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(getInternalUserIdByClerkId).mockResolvedValue("user-internal-2");
    vi.mocked(prisma.tenantUserMembership.findUnique).mockResolvedValue({
      id: "membership-2",
      tenantId: "tenant-1",
      userId: "user-internal-2",
      role: "member",
      deletedAt: null,
    } as never);
    vi.mocked(prisma.tenantUserMembership.update).mockResolvedValue({
      id: "membership-2",
      tenantId: "tenant-1",
      userId: "user-internal-2",
      role: "admin",
      updatedAt: new Date("2024-01-03T00:00:00.000Z"),
    } as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);
  });

  it("maps target clerk user ID to internal user ID before querying membership", async () => {
    await updateUserRole({ targetClerkUserId: "clerk-target", role: "admin" });

    expect(getInternalUserIdByClerkId).toHaveBeenCalledWith("clerk-target");
    expect(prisma.tenantUserMembership.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          tenantId_userId: {
            tenantId: "tenant-1",
            userId: "user-internal-2",
          },
        },
      }),
    );
  });

  it("enforces owner-only authorization", async () => {
    await updateUserRole({ targetClerkUserId: "clerk-target", role: "member" });

    expect(assertTenantMembership).toHaveBeenCalledWith("tenant-1", "clerk-owner", "owner");
  });

  it("forbids changing owner role", async () => {
    vi.mocked(prisma.tenantUserMembership.findUnique).mockResolvedValue({
      id: "membership-owner",
      tenantId: "tenant-1",
      userId: "user-owner",
      role: "owner",
      deletedAt: null,
    } as never);

    await expect(
      updateUserRole({ targetClerkUserId: "clerk-owner", role: "admin" }),
    ).rejects.toThrow("Forbidden: cannot change the role of an owner");

    expect(prisma.tenantUserMembership.update).not.toHaveBeenCalled();
  });

  it("enforces tenant scoping in update query", async () => {
    await updateUserRole({ targetClerkUserId: "clerk-target", role: "admin" });

    expect(prisma.tenantUserMembership.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          tenantId_userId: {
            tenantId: "tenant-1",
            userId: "user-internal-2",
          },
        },
      }),
    );
  });

  it("writes audit log with clerk and internal target IDs", async () => {
    await updateUserRole({ targetClerkUserId: "clerk-target", role: "admin" });

    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tenantId: "tenant-1",
          userId: "clerk-owner",
          action: "user.role_updated",
          resourceType: "TenantUserMembership",
          resourceId: "membership-2",
          details: expect.stringContaining('"targetClerkUserId":"clerk-target"'),
        }),
      }),
    );
  });

  it("throws when unauthenticated", async () => {
    vi.mocked(getSession).mockResolvedValue({
      userId: null,
      tenantId: "",
      isAuthenticated: false,
      orgId: null,
    });

    await expect(
      updateUserRole({ targetClerkUserId: "clerk-target", role: "admin" }),
    ).rejects.toThrow("Unauthorized: not authenticated");
  });
});
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/session", () => ({ getSession: vi.fn() }));
vi.mock("@/lib/tenancy/assert", () => ({ assertTenantMembership: vi.fn() }));
vi.mock("@/lib/admin/user-id", () => ({ getInternalUserIdByClerkId: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    tenantUserMembership: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    auditLog: { create: vi.fn() },
  },
}));

import { getInternalUserIdByClerkId } from "@/lib/admin/user-id";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { updateUserRole } from "../update-user-role";

const mockSession = {
  userId: "clerk-owner",
  tenantId: "tenant-1",
  isAuthenticated: true,
  orgId: null,
};

describe("updateUserRole", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(getInternalUserIdByClerkId).mockResolvedValue("user-internal-2");
    vi.mocked(prisma.tenantUserMembership.findUnique).mockResolvedValue({
      id: "membership-2",
      tenantId: "tenant-1",
      userId: "user-internal-2",
      role: "member",
      deletedAt: null,
    } as never);
    vi.mocked(prisma.tenantUserMembership.update).mockResolvedValue({
      id: "membership-2",
      tenantId: "tenant-1",
      userId: "user-internal-2",
      role: "admin",
      updatedAt: new Date("2024-01-03T00:00:00.000Z"),
    } as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);
  });

  it("maps target clerk user ID to internal user ID before querying membership", async () => {
    await updateUserRole({ targetClerkUserId: "clerk-target", role: "admin" });

    expect(getInternalUserIdByClerkId).toHaveBeenCalledWith("clerk-target");
    expect(prisma.tenantUserMembership.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          tenantId_userId: {
            tenantId: "tenant-1",
            userId: "user-internal-2",
          },
        },
      }),
    );
  });

  it("enforces owner-only authorization", async () => {
    await updateUserRole({ targetClerkUserId: "clerk-target", role: "member" });

    expect(assertTenantMembership).toHaveBeenCalledWith("tenant-1", "clerk-owner", "owner");
  });

  it("forbids changing owner role", async () => {
    vi.mocked(prisma.tenantUserMembership.findUnique).mockResolvedValue({
      id: "membership-owner",
      tenantId: "tenant-1",
      userId: "user-owner",
      role: "owner",
      deletedAt: null,
    } as never);

    await expect(
      updateUserRole({ targetClerkUserId: "clerk-owner", role: "admin" }),
    ).rejects.toThrow("Forbidden: cannot change the role of an owner");

    expect(prisma.tenantUserMembership.update).not.toHaveBeenCalled();
  });

  it("enforces tenant scoping in update query", async () => {
    await updateUserRole({ targetClerkUserId: "clerk-target", role: "admin" });

    expect(prisma.tenantUserMembership.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          tenantId_userId: {
            tenantId: "tenant-1",
            userId: "user-internal-2",
          },
        },
      }),
    );
  });

  it("writes audit log with clerk and internal target IDs", async () => {
    await updateUserRole({ targetClerkUserId: "clerk-target", role: "admin" });

    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tenantId: "tenant-1",
          userId: "clerk-owner",
          action: "user.role_updated",
          resourceType: "TenantUserMembership",
          resourceId: "membership-2",
          details: expect.stringContaining('"targetClerkUserId":"clerk-target"'),
        }),
      }),
    );
  });

  it("throws when unauthenticated", async () => {
    vi.mocked(getSession).mockResolvedValue({
      userId: null,
      tenantId: "",
      isAuthenticated: false,
      orgId: null,
    });

    await expect(
      updateUserRole({ targetClerkUserId: "clerk-target", role: "admin" }),
    ).rejects.toThrow("Unauthorized: not authenticated");
  });
});
