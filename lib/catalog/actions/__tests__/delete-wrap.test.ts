import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteWrap } from "../delete-wrap";

// ── Mock dependencies ─────────────────────────────────────────────────────────

vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/tenancy/assert", () => ({
  assertTenantMembership: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    wrap: {
      findFirst: vi.fn(),
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
  user: { id: "user-1", clerkUserId: "clerk-1", email: "admin@example.com" },
  tenantId: "tenant-1",
  isAuthenticated: true,
  userId: "user-1",
};

const existingWrap = {
  id: "wrap-1",
  tenantId: "tenant-1",
  name: "Carbon Fiber Full Wrap",
};

const softDeletedWrap = {
  id: "wrap-1",
  tenantId: "tenant-1",
  name: "Carbon Fiber Full Wrap",
  description: null,
  price: 1500,
  installationMinutes: 480,
  deletedAt: new Date(),
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-02"),
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("deleteWrap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("soft-deletes a wrap and returns a DTO when the user is authorized", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.findFirst).mockResolvedValue(existingWrap as never);
    vi.mocked(prisma.wrap.update).mockResolvedValue(softDeletedWrap as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const result = await deleteWrap("wrap-1");

    expect(result).toMatchObject({ id: "wrap-1", tenantId: "tenant-1" });
  });

  it("performs a soft delete (sets deletedAt), not a hard delete", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.findFirst).mockResolvedValue(existingWrap as never);
    vi.mocked(prisma.wrap.update).mockResolvedValue(softDeletedWrap as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await deleteWrap("wrap-1");

    expect(prisma.wrap.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "wrap-1" },
        data: expect.objectContaining({ deletedAt: expect.any(Date) }),
      }),
    );
  });

  it("checks that the wrap belongs to the current tenant before deleting", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.findFirst).mockResolvedValue(existingWrap as never);
    vi.mocked(prisma.wrap.update).mockResolvedValue(softDeletedWrap as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await deleteWrap("wrap-1");

    expect(prisma.wrap.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: "wrap-1",
          tenantId: "tenant-1",
          deletedAt: null,
        }),
      }),
    );
  });

  it("writes an audit log entry after soft-deleting the wrap", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.findFirst).mockResolvedValue(existingWrap as never);
    vi.mocked(prisma.wrap.update).mockResolvedValue(softDeletedWrap as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await deleteWrap("wrap-1");

    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: "DELETE_WRAP",
          resourceId: "wrap-1",
          tenantId: "tenant-1",
          userId: "user-1",
        }),
      }),
    );
  });

  it("throws Unauthorized when the user is not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue({
      user: null,
      tenantId: "",
      isAuthenticated: false,
      userId: "",
    });

    await expect(deleteWrap("wrap-1")).rejects.toThrow("Unauthorized");
  });

  it("throws Forbidden when assertTenantMembership rejects", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockRejectedValue(
      new Error("Forbidden: no active membership for this tenant"),
    );

    await expect(deleteWrap("wrap-1")).rejects.toThrow("Forbidden");
  });

  it("throws Forbidden when the wrap belongs to a different tenant", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    // findFirst returns null — wrap not found in this tenant
    vi.mocked(prisma.wrap.findFirst).mockResolvedValue(null);

    await expect(deleteWrap("wrap-1")).rejects.toThrow("Forbidden");
    expect(prisma.wrap.update).not.toHaveBeenCalled();
  });
});
