import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateTenantSettings } from "../update-tenant-settings";

// ── Mock dependencies ─────────────────────────────────────────────────────────

vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/tenancy/assert", () => ({
  assertTenantMembership: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    tenant: {
      updateMany: vi.fn(),
      findFirst: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

// ── Imports after mocks ───────────────────────────────────────────────────────

import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { assertTenantMembership } from "@/lib/tenancy/assert";

// ── Helpers ───────────────────────────────────────────────────────────────────

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("updateTenantSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(prisma.$transaction).mockImplementation(async (callback) =>
      callback({
        tenant: {
          updateMany: prisma.tenant.updateMany,
          findFirst: prisma.tenant.findFirst,
        },
        auditLog: {
          create: prisma.auditLog.create,
        },
      } as never),
    );
  });

  it("updates tenant settings and returns a DTO when the owner is authorized", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.tenant.updateMany).mockResolvedValue({ count: 1 } as never);
    vi.mocked(prisma.tenant.findFirst).mockResolvedValue(updatedTenant as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const result = await updateTenantSettings({ name: "Acme Wraps", slug: "acme-wraps" });

    expect(result).toMatchObject({
      id: "tenant-1",
      name: "Acme Wraps",
      slug: "acme-wraps",
    });
  });

  // ... (remaining tests omitted for brevity)
});

// ── Mock dependencies ─────────────────────────────────────────────────────────

vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/tenancy/assert", () => ({
  assertTenantMembership: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    tenant: {
      updateMany: vi.fn(),
      findFirst: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

// ── Imports after mocks ───────────────────────────────────────────────────────

// ── Helpers ───────────────────────────────────────────────────────────────────

const mockSession = {
  userId: "clerk-owner",
  tenantId: "tenant-1",
  isAuthenticated: true,
  orgId: null,
};

const updatedTenant = {
  id: "tenant-1",
  name: "Acme Wraps",
  slug: "acme-wraps",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-03"),
  deletedAt: null,
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("updateTenantSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(prisma.$transaction).mockImplementation(async (callback) =>
      callback({
        tenant: {
          updateMany: prisma.tenant.updateMany,
          findFirst: prisma.tenant.findFirst,
        },
        auditLog: {
          create: prisma.auditLog.create,
        },
      } as never),
    );
  });

  it("updates tenant settings and returns a DTO when the owner is authorized", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.tenant.updateMany).mockResolvedValue({ count: 1 } as never);
    vi.mocked(prisma.tenant.findFirst).mockResolvedValue(updatedTenant as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const result = await updateTenantSettings({ name: "Acme Wraps", slug: "acme-wraps" });

    expect(result).toMatchObject({
      id: "tenant-1",
      name: "Acme Wraps",
      slug: "acme-wraps",
    });
  });

  it("scopes the update to the current tenant and active records", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.tenant.updateMany).mockResolvedValue({ count: 1 } as never);
    vi.mocked(prisma.tenant.findFirst).mockResolvedValue(updatedTenant as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await updateTenantSettings({ name: "Acme Wraps" });

    expect(prisma.tenant.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "tenant-1", deletedAt: null },
      }),
    );
  });

  it("only sends provided fields to Prisma (partial update with name only)", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.tenant.updateMany).mockResolvedValue({ count: 1 } as never);
    vi.mocked(prisma.tenant.findFirst).mockResolvedValue(updatedTenant as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await updateTenantSettings({ name: "New Name" });

    expect(prisma.tenant.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { name: "New Name" },
      }),
    );
  });

  it("only sends provided fields to Prisma (partial update with slug only)", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.tenant.updateMany).mockResolvedValue({ count: 1 } as never);
    vi.mocked(prisma.tenant.findFirst).mockResolvedValue(updatedTenant as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await updateTenantSettings({ slug: "new-slug" });

    expect(prisma.tenant.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { slug: "new-slug" },
      }),
    );
  });

  it("writes an audit log entry after updating tenant settings", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.tenant.updateMany).mockResolvedValue({ count: 1 } as never);
    vi.mocked(prisma.tenant.findFirst).mockResolvedValue(updatedTenant as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await updateTenantSettings({ name: "Acme Wraps", slug: "acme-wraps" });

    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tenantId: "tenant-1",
          userId: "clerk-owner",
          action: "tenant.settings_updated",
          resourceType: "Tenant",
          resourceId: "tenant-1",
        }),
      }),
    );
  });

  it("throws Unauthorized when the user is not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue({
      userId: null,
      tenantId: "",
      isAuthenticated: false,
      orgId: null,
    });

    await expect(updateTenantSettings({ name: "New Name" })).rejects.toThrow("Unauthorized");
  });

  it("throws Forbidden when assertTenantMembership rejects (non-owner)", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockRejectedValue(
      new Error("Forbidden - User role 'admin' insufficient, requires 'owner' or higher"),
    );

    await expect(updateTenantSettings({ name: "New Name" })).rejects.toThrow("Forbidden");
  });

  it("throws a ZodError when no fields are provided", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);

    await expect(updateTenantSettings({} as never)).rejects.toThrow();
    expect(prisma.tenant.updateMany).not.toHaveBeenCalled();
  });

  it("throws a ZodError when name is empty", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);

    await expect(updateTenantSettings({ name: "" })).rejects.toThrow();
    expect(prisma.tenant.updateMany).not.toHaveBeenCalled();
  });

  it("throws a ZodError when slug contains invalid characters", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);

    await expect(updateTenantSettings({ slug: "Invalid Slug!" })).rejects.toThrow();
    expect(prisma.tenant.updateMany).not.toHaveBeenCalled();
  });

  it("requires OWNER authorization — assertTenantMembership is called with 'owner'", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.tenant.updateMany).mockResolvedValue({ count: 1 } as never);
    vi.mocked(prisma.tenant.findFirst).mockResolvedValue(updatedTenant as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await updateTenantSettings({ name: "Acme Wraps" });

    expect(assertTenantMembership).toHaveBeenCalledWith("tenant-1", "clerk-owner", "owner");
  });

  it("does not accept tenantId from the input payload", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.tenant.updateMany).mockResolvedValue({ count: 1 } as never);
    vi.mocked(prisma.tenant.findFirst).mockResolvedValue(updatedTenant as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    // Even if someone injects a tenantId, the where clause uses the server-side tenantId
    const inputWithTenantId = { name: "Acme Wraps", tenantId: "attacker-tenant" } as never;
    await updateTenantSettings(inputWithTenantId);

    expect(prisma.tenant.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "tenant-1", deletedAt: null },
      }),
    );
  });

  it("throws a Conflict error when the slug is already in use (P2002)", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.tenant.updateMany).mockRejectedValue({ code: "P2002" });

    await expect(updateTenantSettings({ slug: "taken-slug" })).rejects.toThrow("Conflict");
    expect(prisma.auditLog.create).not.toHaveBeenCalled();
  });

  it("throws a Forbidden error when the tenant record is not found", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.tenant.updateMany).mockResolvedValue({ count: 0 } as never);

    await expect(updateTenantSettings({ name: "Ghost" })).rejects.toThrow("Forbidden");
    expect(prisma.auditLog.create).not.toHaveBeenCalled();
  });

  it("re-throws unknown Prisma errors unchanged", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    const unknownError = new Error("database connection lost");
    vi.mocked(prisma.tenant.updateMany).mockRejectedValue(unknownError);

    await expect(updateTenantSettings({ name: "New Name" })).rejects.toThrow(
      "database connection lost",
    );
  });
});
