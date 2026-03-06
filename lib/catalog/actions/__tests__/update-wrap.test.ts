import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateWrap } from "../update-wrap";

// ── Mock dependencies ─────────────────────────────────────────────────────────

vi.mock("@/lib/auth/session", () => ({
  requireAuth: vi.fn(),
}));

vi.mock("@/lib/tenancy/assert", () => ({
  assertTenantMembership: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    wrap: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}));

// ── Imports after mocks ───────────────────────────────────────────────────────

import { requireAuth } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";

// ── Helpers ───────────────────────────────────────────────────────────────────

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
  deletedAt: null,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-02"),
};

const existingWrap = {
  id: "wrap-1",
  tenantId: "tenant-1",
  deletedAt: null,
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("updateWrap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates a wrap and returns a DTO when the user is authorized", async () => {
    vi.mocked(requireAuth).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.findUnique).mockResolvedValue(existingWrap as never);
    vi.mocked(prisma.wrap.update).mockResolvedValue(updatedWrap as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const result = await updateWrap("wrap-1", { name: "Updated Wrap" });

    expect(result).toMatchObject({ id: "wrap-1", name: "Updated Wrap" });
  });

  it("verifies tenant ownership via findUnique before updating", async () => {
    vi.mocked(requireAuth).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.findUnique).mockResolvedValue(existingWrap as never);
    vi.mocked(prisma.wrap.update).mockResolvedValue(updatedWrap as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await updateWrap("wrap-1", { name: "Updated Wrap" });

    // Lookup uses PK (most efficient path)
    expect(prisma.wrap.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "wrap-1" } }),
    );
    // Update also uses unique primary key only
    expect(prisma.wrap.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "wrap-1" } }),
    );
  });

  it("writes an audit log after updating the wrap", async () => {
    vi.mocked(requireAuth).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.findUnique).mockResolvedValue(existingWrap as never);
    vi.mocked(prisma.wrap.update).mockResolvedValue(updatedWrap as never);
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

  it("throws Forbidden when the wrap belongs to a different tenant", async () => {
    vi.mocked(requireAuth).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    // findUnique returns wrap owned by a different tenant
    vi.mocked(prisma.wrap.findUnique).mockResolvedValue({
      id: "wrap-1",
      tenantId: "other-tenant",
      deletedAt: null,
    } as never);

    await expect(updateWrap("wrap-1", { name: "x" })).rejects.toThrow("Forbidden");
    expect(prisma.wrap.update).not.toHaveBeenCalled();
  });

  it("throws Forbidden when the wrap is soft-deleted", async () => {
    vi.mocked(requireAuth).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.findUnique).mockResolvedValue({
      id: "wrap-1",
      tenantId: "tenant-1",
      deletedAt: new Date(),
    } as never);

    await expect(updateWrap("wrap-1", { name: "x" })).rejects.toThrow("Forbidden");
    expect(prisma.wrap.update).not.toHaveBeenCalled();
  });

  it("throws a ZodError for invalid input (negative price)", async () => {
    vi.mocked(requireAuth).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);

    await expect(updateWrap("wrap-1", { price: -50 })).rejects.toThrow();
    expect(prisma.wrap.update).not.toHaveBeenCalled();
  });
});
