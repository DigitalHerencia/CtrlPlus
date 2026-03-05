import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Hoisted mocks ──────────────────────────────────────────────────────────
const { mockGetSession, mockAssertTenantMembership } = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
  mockAssertTenantMembership: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => ({ getSession: mockGetSession }));
vi.mock("@/lib/tenancy/assert", () => ({
  assertTenantMembership: mockAssertTenantMembership,
  assertTenantScope: vi.fn(),
}));
vi.mock("@/lib/prisma", () => {
  const tenantUpdateMock = vi.fn();
  const auditLogCreateMock = vi.fn();
  return {
    prisma: {
      tenant: { update: tenantUpdateMock },
      auditLog: { create: auditLogCreateMock },
    },
  };
});

import { updateTenantSettings } from "../update-tenant-settings";
import { prisma } from "@/lib/prisma";

const VALID_INPUT = {
  name: "Ace Wraps",
  logoUrl: null,
  contactEmail: "hello@acewraps.com",
  contactPhone: null,
  address: null,
};

const MOCK_TENANT = {
  id: "tenant-123",
  name: "Ace Wraps",
  slug: "ace-wraps",
  logoUrl: null,
  contactEmail: "hello@acewraps.com",
  contactPhone: null,
  address: null,
  updatedAt: new Date(),
};

describe("updateTenantSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSession.mockResolvedValue({
      clerkUserId: "clerk-1",
      tenantId: "tenant-123",
      role: "OWNER",
      isAuthenticated: true,
    });
    mockAssertTenantMembership.mockResolvedValue(undefined);
    (prisma.tenant.update as ReturnType<typeof vi.fn>).mockResolvedValue(
      MOCK_TENANT
    );
    (prisma.auditLog.create as ReturnType<typeof vi.fn>).mockResolvedValue({});
  });

  it("returns a TenantSettings DTO on success", async () => {
    const result = await updateTenantSettings(VALID_INPUT);

    expect(result).toMatchObject({
      id: "tenant-123",
      name: "Ace Wraps",
      slug: "ace-wraps",
    });
  });

  it("throws Unauthorized when session has no userId", async () => {
    mockGetSession.mockResolvedValue({
      clerkUserId: null,
      tenantId: null,
      isAuthenticated: false,
    });

    await expect(updateTenantSettings(VALID_INPUT)).rejects.toThrow(
      "Unauthorized"
    );
  });

  it("calls assertTenantMembership with OWNER or ADMIN allowed roles", async () => {
    await updateTenantSettings(VALID_INPUT);

    expect(mockAssertTenantMembership).toHaveBeenCalledWith(
      "tenant-123",
      "clerk-1",
      ["OWNER", "ADMIN"]
    );
  });

  it("rejects invalid input (empty name)", async () => {
    await expect(
      updateTenantSettings({ ...VALID_INPUT, name: "" })
    ).rejects.toThrow();
  });

  it("creates an audit log after successful update", async () => {
    await updateTenantSettings(VALID_INPUT);

    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: "UPDATE_TENANT_SETTINGS",
          tenantId: "tenant-123",
          userId: "clerk-1",
        }),
      })
    );
  });
});
