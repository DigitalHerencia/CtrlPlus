import { describe, it, expect, vi, beforeEach } from "vitest";
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
  });

  it("updates tenant settings and returns a DTO when the owner is authorized", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.tenant.update).mockResolvedValue(updatedTenant as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const result = await updateTenantSettings({ name: "Acme Wraps", slug: "acme-wraps" });

    expect(result).toMatchObject({
      id: "tenant-1",
      name: "Acme Wraps",
      slug: "acme-wraps",
    });
  });

  it("scopes the update to the current tenant via where: { id: tenantId }", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.tenant.update).mockResolvedValue(updatedTenant as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await updateTenantSettings({ name: "Acme Wraps" });

    expect(prisma.tenant.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "tenant-1" },
      }),
    );
  });

  it("only sends provided fields to Prisma (partial update with name only)", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.tenant.update).mockResolvedValue(updatedTenant as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await updateTenantSettings({ name: "New Name" });

    expect(prisma.tenant.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { name: "New Name" },
      }),
    );
  });

  it("only sends provided fields to Prisma (partial update with slug only)", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.tenant.update).mockResolvedValue(updatedTenant as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await updateTenantSettings({ slug: "new-slug" });

    expect(prisma.tenant.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { slug: "new-slug" },
      }),
    );
  });

  it("writes an audit log entry after updating tenant settings", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.tenant.update).mockResolvedValue(updatedTenant as never);
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
    vi.mocked(getSession).mockResolvedValue({ user: null, tenantId: "" });

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
    expect(prisma.tenant.update).not.toHaveBeenCalled();
  });

  it("throws a ZodError when name is empty", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);

    await expect(updateTenantSettings({ name: "" })).rejects.toThrow();
    expect(prisma.tenant.update).not.toHaveBeenCalled();
  });

  it("throws a ZodError when slug contains invalid characters", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);

    await expect(updateTenantSettings({ slug: "Invalid Slug!" })).rejects.toThrow();
    expect(prisma.tenant.update).not.toHaveBeenCalled();
  });

  it("requires OWNER authorization — assertTenantMembership is called with 'owner'", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.tenant.update).mockResolvedValue(updatedTenant as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await updateTenantSettings({ name: "Acme Wraps" });

    expect(assertTenantMembership).toHaveBeenCalledWith("tenant-1", "clerk-owner", "owner");
  });

  it("does not accept tenantId from the input payload", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.tenant.update).mockResolvedValue(updatedTenant as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    // Even if someone injects a tenantId, the where clause uses the server-side tenantId
    const inputWithTenantId = { name: "Acme Wraps", tenantId: "attacker-tenant" } as never;
    await updateTenantSettings(inputWithTenantId);

    expect(prisma.tenant.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "tenant-1" },
      }),
    );
  });
});
