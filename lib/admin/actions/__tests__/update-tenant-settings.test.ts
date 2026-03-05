/**
 * Tests for updateTenantSettings server action
 *
 * Verifies the security pipeline:
 * 1. Unauthenticated requests are rejected
 * 2. Non-owner (ADMIN, MEMBER) requests are rejected
 * 3. Invalid input is rejected by Zod
 * 4. Empty update (no fields) is rejected
 * 5. Owner can update individual settings fields
 * 6. Audit event is created on successful update
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

// ─── Hoisted mocks (must be declared before imports) ────────────────────────

const mockGetSession = vi.hoisted(() => vi.fn());
const mockAssertTenantMembership = vi.hoisted(() => vi.fn());
const mockPrisma = vi.hoisted(() => ({
  tenant: {
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

import { updateTenantSettings } from "../update-tenant-settings";

// ─── Shared fixtures ─────────────────────────────────────────────────────────

const TENANT_ID = "tenant-001";
const OWNER_USER_ID = "user-owner";

const updatedTenant = {
  id: TENANT_ID,
  name: "Acme Wraps",
  logoUrl: "https://example.com/logo.png",
  primaryColor: "#FF5733",
  businessHours: {
    monday: { open: "09:00", close: "17:00" },
  },
  updatedAt: new Date("2024-06-01T10:00:00.000Z"),
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("updateTenantSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Authentication ────────────────────────────────────────────────────────

  it("throws Unauthorized when userId is null", async () => {
    mockGetSession.mockResolvedValue({ userId: null, tenantId: null });

    await expect(updateTenantSettings({ name: "Test" })).rejects.toThrow(
      "Unauthorized"
    );
  });

  it("throws Unauthorized when tenantId is null", async () => {
    mockGetSession.mockResolvedValue({
      userId: OWNER_USER_ID,
      tenantId: null,
    });

    await expect(updateTenantSettings({ name: "Test" })).rejects.toThrow(
      "Unauthorized"
    );
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

    await expect(updateTenantSettings({ name: "Test" })).rejects.toThrow(
      "Forbidden"
    );

    expect(mockAssertTenantMembership).toHaveBeenCalledWith(
      TENANT_ID,
      OWNER_USER_ID,
      "OWNER"
    );
  });

  // ── Validation ────────────────────────────────────────────────────────────

  it("throws when name exceeds 100 characters", async () => {
    mockGetSession.mockResolvedValue({
      userId: OWNER_USER_ID,
      tenantId: TENANT_ID,
    });
    mockAssertTenantMembership.mockResolvedValue(undefined);

    await expect(
      updateTenantSettings({ name: "A".repeat(101) })
    ).rejects.toThrow();
  });

  it("throws when logoUrl is not a valid URL", async () => {
    mockGetSession.mockResolvedValue({
      userId: OWNER_USER_ID,
      tenantId: TENANT_ID,
    });
    mockAssertTenantMembership.mockResolvedValue(undefined);

    await expect(
      updateTenantSettings({ logoUrl: "not-a-url" })
    ).rejects.toThrow();
  });

  it("throws when primaryColor is not a valid hex colour", async () => {
    mockGetSession.mockResolvedValue({
      userId: OWNER_USER_ID,
      tenantId: TENANT_ID,
    });
    mockAssertTenantMembership.mockResolvedValue(undefined);

    await expect(
      updateTenantSettings({ primaryColor: "red" })
    ).rejects.toThrow();
  });

  it("throws when businessHours time format is invalid", async () => {
    mockGetSession.mockResolvedValue({
      userId: OWNER_USER_ID,
      tenantId: TENANT_ID,
    });
    mockAssertTenantMembership.mockResolvedValue(undefined);

    await expect(
      updateTenantSettings({
        businessHours: {
          monday: { open: "9am", close: "5pm" },
        },
      })
    ).rejects.toThrow();
  });

  it("throws when no fields are provided", async () => {
    mockGetSession.mockResolvedValue({
      userId: OWNER_USER_ID,
      tenantId: TENANT_ID,
    });
    mockAssertTenantMembership.mockResolvedValue(undefined);

    await expect(updateTenantSettings({})).rejects.toThrow(
      "no settings fields provided"
    );
  });

  // ── Happy path ────────────────────────────────────────────────────────────

  it("updates the tenant name and returns the result DTO", async () => {
    mockGetSession.mockResolvedValue({
      userId: OWNER_USER_ID,
      tenantId: TENANT_ID,
    });
    mockAssertTenantMembership.mockResolvedValue(undefined);
    mockPrisma.tenant.update.mockResolvedValue(updatedTenant);
    mockPrisma.auditEvent.create.mockResolvedValue({});

    const result = await updateTenantSettings({ name: "Acme Wraps" });

    expect(result).toEqual({
      tenantId: TENANT_ID,
      name: "Acme Wraps",
      logoUrl: "https://example.com/logo.png",
      primaryColor: "#FF5733",
      businessHours: { monday: { open: "09:00", close: "17:00" } },
      updatedAt: updatedTenant.updatedAt,
    });
  });

  it("only sends provided fields to Prisma", async () => {
    mockGetSession.mockResolvedValue({
      userId: OWNER_USER_ID,
      tenantId: TENANT_ID,
    });
    mockAssertTenantMembership.mockResolvedValue(undefined);
    mockPrisma.tenant.update.mockResolvedValue(updatedTenant);
    mockPrisma.auditEvent.create.mockResolvedValue({});

    await updateTenantSettings({ name: "New Name" });

    expect(mockPrisma.tenant.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: TENANT_ID },
        data: { name: "New Name" },
      })
    );
    // logoUrl, primaryColor, businessHours must NOT be in the data payload.
    const call = mockPrisma.tenant.update.mock.calls[0][0] as {
      data: Record<string, unknown>;
    };
    expect(call.data).not.toHaveProperty("logoUrl");
    expect(call.data).not.toHaveProperty("primaryColor");
    expect(call.data).not.toHaveProperty("businessHours");
  });

  it("accepts null to clear nullable fields", async () => {
    const clearedTenant = {
      ...updatedTenant,
      logoUrl: null,
      primaryColor: null,
    };
    mockGetSession.mockResolvedValue({
      userId: OWNER_USER_ID,
      tenantId: TENANT_ID,
    });
    mockAssertTenantMembership.mockResolvedValue(undefined);
    mockPrisma.tenant.update.mockResolvedValue(clearedTenant);
    mockPrisma.auditEvent.create.mockResolvedValue({});

    const result = await updateTenantSettings({
      logoUrl: null,
      primaryColor: null,
    });

    expect(result.logoUrl).toBeNull();
    expect(result.primaryColor).toBeNull();
  });

  it("accepts valid hex colour strings", async () => {
    mockGetSession.mockResolvedValue({
      userId: OWNER_USER_ID,
      tenantId: TENANT_ID,
    });
    mockAssertTenantMembership.mockResolvedValue(undefined);
    mockPrisma.tenant.update.mockResolvedValue(updatedTenant);
    mockPrisma.auditEvent.create.mockResolvedValue({});

    // Should not throw for valid 3- or 6-character hex colours
    await expect(
      updateTenantSettings({ primaryColor: "#FFF" })
    ).resolves.toBeDefined();
    await expect(
      updateTenantSettings({ primaryColor: "#FF5733" })
    ).resolves.toBeDefined();
  });

  // ── Audit ─────────────────────────────────────────────────────────────────

  it("creates an audit event on successful settings update", async () => {
    mockGetSession.mockResolvedValue({
      userId: OWNER_USER_ID,
      tenantId: TENANT_ID,
    });
    mockAssertTenantMembership.mockResolvedValue(undefined);
    mockPrisma.tenant.update.mockResolvedValue(updatedTenant);
    mockPrisma.auditEvent.create.mockResolvedValue({});

    await updateTenantSettings({ name: "Acme Wraps", primaryColor: "#FF5733" });

    expect(mockPrisma.auditEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tenantId: TENANT_ID,
          userId: OWNER_USER_ID,
          action: "admin.settings.updated",
          resource: `tenant:${TENANT_ID}`,
          metadata: expect.objectContaining({
            changes: expect.objectContaining({
              name: "Acme Wraps",
              primaryColor: "#FF5733",
            }),
          }),
        }),
      })
    );
  });

  it("audit metadata only includes changed fields", async () => {
    mockGetSession.mockResolvedValue({
      userId: OWNER_USER_ID,
      tenantId: TENANT_ID,
    });
    mockAssertTenantMembership.mockResolvedValue(undefined);
    mockPrisma.tenant.update.mockResolvedValue(updatedTenant);
    mockPrisma.auditEvent.create.mockResolvedValue({});

    await updateTenantSettings({ name: "Changed Name" });

    const auditCall = mockPrisma.auditEvent.create.mock.calls[0][0] as {
      data: { metadata: { changes: Record<string, unknown> } };
    };
    expect(auditCall.data.metadata.changes).toEqual({ name: "Changed Name" });
    expect(auditCall.data.metadata.changes).not.toHaveProperty("logoUrl");
  });
});
