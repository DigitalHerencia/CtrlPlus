import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mocks ────────────────────────────────────────────────────────────────────

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    tenant: { findFirst: vi.fn() },
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("@/lib/admin/rbac", () => ({ assertAdminOrOwner: vi.fn().mockResolvedValue(undefined) }));

import { assertAdminOrOwner } from "@/lib/admin/rbac";
import { getTenantSettings } from "../get-tenant-settings";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const NOW = new Date("2025-01-15T10:00:00.000Z");

function makeTenantRecord(overrides: Partial<ReturnType<typeof baseTenant>> = {}) {
  return { ...baseTenant(), ...overrides };
}

function baseTenant() {
  return {
    id: "tenant-abc",
    name: "Acme Wraps",
    slug: "acme",
    createdAt: NOW,
    updatedAt: NOW,
  };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("getTenantSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(assertAdminOrOwner).mockResolvedValue(undefined);
  });

  it("calls assertAdminOrOwner before querying", async () => {
    prismaMock.tenant.findFirst.mockResolvedValue(makeTenantRecord());

    await getTenantSettings("tenant-abc", "user-admin");

    expect(assertAdminOrOwner).toHaveBeenCalledWith("tenant-abc", "user-admin");
  });

  it("throws when assertAdminOrOwner rejects (member role)", async () => {
    vi.mocked(assertAdminOrOwner).mockRejectedValue(new Error("Forbidden"));

    await expect(getTenantSettings("tenant-abc", "user-member")).rejects.toThrow("Forbidden");

    expect(prismaMock.tenant.findFirst).not.toHaveBeenCalled();
  });

  it("returns TenantSettingsDTO when tenant exists", async () => {
    prismaMock.tenant.findFirst.mockResolvedValue(makeTenantRecord());

    const result = await getTenantSettings("tenant-abc", "user-admin");

    expect(result).not.toBeNull();
    expect(result?.id).toBe("tenant-abc");
    expect(result?.name).toBe("Acme Wraps");
    expect(result?.slug).toBe("acme");
    expect(result?.createdAt).toEqual(NOW);
    expect(result?.updatedAt).toEqual(NOW);
  });

  it("scopes query by tenantId and deletedAt: null", async () => {
    prismaMock.tenant.findFirst.mockResolvedValue(null);

    await getTenantSettings("tenant-abc", "user-admin");

    expect(prismaMock.tenant.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: "tenant-abc", deletedAt: null }),
      }),
    );
  });

  it("returns null when tenant does not exist", async () => {
    prismaMock.tenant.findFirst.mockResolvedValue(null);

    const result = await getTenantSettings("tenant-nonexistent", "user-admin");

    expect(result).toBeNull();
  });

  it("does not expose internal fields (deletedAt)", async () => {
    prismaMock.tenant.findFirst.mockResolvedValue(makeTenantRecord());

    const result = await getTenantSettings("tenant-abc", "user-admin");

    expect("deletedAt" in (result ?? {})).toBe(false);
  });

  it("returns a different tenant's settings for a different tenantId", async () => {
    const otherTenant = makeTenantRecord({
      id: "tenant-xyz",
      name: "XYZ Wraps",
      slug: "xyz",
    });
    prismaMock.tenant.findFirst.mockResolvedValue(otherTenant);

    const result = await getTenantSettings("tenant-xyz", "user-admin");

    expect(result?.id).toBe("tenant-xyz");
    expect(result?.name).toBe("XYZ Wraps");
  });
});
