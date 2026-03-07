import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateWrap } from "../update-wrap";

vi.mock("@/lib/auth/session", () => ({
  requireAuth: vi.fn(),
}));

vi.mock("@/lib/tenancy/assert", () => ({
  assertTenantMembership: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    wrap: {
      updateMany: vi.fn(),
      findFirst: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}));

const mockSession = {
  userId: "user-1",
  tenantId: "tenant-1",
  isAuthenticated: true,
  orgId: null,
};

const updatedWrap = {
  id: "wrap-1",
  tenantId: "tenant-1",
  name: "Updated Wrap",
  description: null,
  price: 2000,
  installationMinutes: null,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-02"),
};

describe("updateWrap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates a wrap and returns a DTO when the user is authorized", async () => {
    vi.mocked(requireAuth).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.updateMany).mockResolvedValue({ count: 1 } as never);
    vi.mocked(prisma.wrap.findFirst).mockResolvedValue(updatedWrap as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const result = await updateWrap("wrap-1", { name: "Updated Wrap" });

    expect(result).toMatchObject({ id: "wrap-1", name: "Updated Wrap" });
  });

  it("scopes the atomic update by id, tenantId, and deletedAt", async () => {
    vi.mocked(requireAuth).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.updateMany).mockResolvedValue({ count: 1 } as never);
    vi.mocked(prisma.wrap.findFirst).mockResolvedValue(updatedWrap as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await updateWrap("wrap-1", { name: "Updated Wrap" });

    expect(prisma.wrap.updateMany).toHaveBeenCalledWith({
      where: {
        id: "wrap-1",
        tenantId: "tenant-1",
        deletedAt: null,
      },
      data: {
        name: "Updated Wrap",
      },
    });
    expect(prisma.wrap.findFirst).toHaveBeenCalledWith({
      where: {
        id: "wrap-1",
        tenantId: "tenant-1",
        deletedAt: null,
      },
      select: {
        id: true,
        tenantId: true,
        name: true,
        description: true,
        price: true,
        installationMinutes: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });

  it("writes an audit log after updating the wrap", async () => {
    vi.mocked(requireAuth).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.updateMany).mockResolvedValue({ count: 1 } as never);
    vi.mocked(prisma.wrap.findFirst).mockResolvedValue(updatedWrap as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await updateWrap("wrap-1", { name: "Updated Wrap" });

    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: "wrap.updated",
          resourceType: "Wrap",
          resourceId: "wrap-1",
        }),
      }),
    );
  });

  it("throws Unauthorized when the user is not authenticated", async () => {
    vi.mocked(requireAuth).mockRejectedValue(new Error("Unauthorized: not authenticated"));

    await expect(updateWrap("wrap-1", { name: "x" })).rejects.toThrow("Unauthorized");
  });

  it("throws Forbidden when assertTenantMembership rejects", async () => {
    vi.mocked(requireAuth).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockRejectedValue(
      new Error("Forbidden: no active membership for this tenant"),
    );

    await expect(updateWrap("wrap-1", { name: "x" })).rejects.toThrow("Forbidden");
  });

  it("throws Forbidden when the conditional update affects no rows", async () => {
    vi.mocked(requireAuth).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.updateMany).mockResolvedValue({ count: 0 } as never);

    await expect(updateWrap("wrap-1", { name: "x" })).rejects.toThrow(
      "Forbidden: resource not found",
    );
    expect(prisma.wrap.findFirst).not.toHaveBeenCalled();
    expect(prisma.auditLog.create).not.toHaveBeenCalled();
  });

  it("throws when validation fails", async () => {
    vi.mocked(requireAuth).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);

    await expect(updateWrap("wrap-1", { price: -50 })).rejects.toThrow();
    expect(prisma.wrap.updateMany).not.toHaveBeenCalled();
  });
});
