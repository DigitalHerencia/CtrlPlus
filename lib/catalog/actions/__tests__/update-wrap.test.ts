import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateWrap } from "../update-wrap";

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
import { Prisma } from "@prisma/client";

// ── Helpers ───────────────────────────────────────────────────────────────────

const mockSession = {
  user: { id: "user-1", clerkUserId: "clerk-1", email: "admin@example.com" },
  tenantId: "tenant-1",
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

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("updateWrap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates a wrap and returns a DTO when the user is authorized", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.update).mockResolvedValue(updatedWrap as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const result = await updateWrap("wrap-1", { name: "Updated Wrap" });

    expect(result).toMatchObject({ id: "wrap-1", name: "Updated Wrap" });
  });

  it("scopes the mutation to the current tenantId via the where clause", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.update).mockResolvedValue(updatedWrap as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await updateWrap("wrap-1", { name: "Updated Wrap" });

    expect(prisma.wrap.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: "wrap-1",
          tenantId: "tenant-1",
          deletedAt: null,
        }),
      }),
    );
  });

  it("writes an audit log after updating the wrap", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.update).mockResolvedValue(updatedWrap as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await updateWrap("wrap-1", { name: "Updated Wrap" });

    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: "UPDATE_WRAP",
          resourceType: "Wrap",
          resourceId: "wrap-1",
        }),
      }),
    );
  });

  it("throws Unauthorized when the user is not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue({ user: null, tenantId: "" });

    await expect(updateWrap("wrap-1", { name: "x" })).rejects.toThrow("Unauthorized");
  });

  it("throws Forbidden when assertTenantMembership rejects", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockRejectedValue(
      new Error("Forbidden: no active membership for this tenant"),
    );

    await expect(updateWrap("wrap-1", { name: "x" })).rejects.toThrow("Forbidden");
  });

  it("throws Forbidden when the wrap belongs to a different tenant (P2025)", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);

    // Prisma throws P2025 when the compound where clause finds no matching row
    const p2025 = new Prisma.PrismaClientKnownRequestError("Record to update not found.", {
      code: "P2025",
      clientVersion: "6.0.0",
    });
    vi.mocked(prisma.wrap.update).mockRejectedValue(p2025);

    await expect(updateWrap("wrap-1", { name: "x" })).rejects.toThrow("Forbidden");
  });

  it("throws a ZodError for invalid input (negative price)", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);

    await expect(updateWrap("wrap-1", { price: -50 })).rejects.toThrow();
    expect(prisma.wrap.update).not.toHaveBeenCalled();
  });
});
