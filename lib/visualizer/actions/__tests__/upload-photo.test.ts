import { beforeEach, describe, expect, it, vi } from "vitest";

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
    },
    visualizerPreview: {
      findUnique: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}));

// Node's built-in crypto is used by the action; no mock needed.

// ── Imports after mocks ───────────────────────────────────────────────────────

import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { uploadVehiclePhoto } from "../upload-photo";

// ── Helpers ───────────────────────────────────────────────────────────────────

const mockSession = {
  userId: "user-1",
  tenantId: "tenant-1",
  isAuthenticated: true,
  orgId: null,
};

const validInput = {
  wrapId: "wrap-1",
  customerPhotoUrl: "data:image/png;base64,abc123",
};

const mockWrap = { id: "wrap-1" };

const now = new Date();
const futureExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
const pastExpiry = new Date(Date.now() - 1000);

const mockPreview = {
  id: "preview-1",
  tenantId: "tenant-1",
  wrapId: "wrap-1",
  customerPhotoUrl: "data:image/png;base64,abc123",
  processedImageUrl: null,
  status: "pending",
  cacheKey: "some-hash",
  expiresAt: futureExpiry,
  createdAt: now,
  updatedAt: now,
  deletedAt: null,
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("uploadVehiclePhoto", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws Unauthorized when the user is not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue({
      userId: null,
      tenantId: "",
      isAuthenticated: false,
      orgId: null,
    });

    await expect(uploadVehiclePhoto(validInput)).rejects.toThrow("Unauthorized");
  });

  it("throws Forbidden when assertTenantMembership rejects", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockRejectedValue(
      new Error("Forbidden: no active membership for this tenant"),
    );

    await expect(uploadVehiclePhoto(validInput)).rejects.toThrow("Forbidden");
  });

  it("throws when the wrap does not belong to the tenant", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.findFirst).mockResolvedValue(null);

    await expect(uploadVehiclePhoto(validInput)).rejects.toThrow("Wrap not found");
    expect(prisma.visualizerPreview.create).not.toHaveBeenCalled();
  });

  it("returns cached preview on cache hit (valid, same tenant, not expired, not deleted)", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.findFirst).mockResolvedValue(mockWrap as never);
    vi.mocked(prisma.visualizerPreview.findUnique).mockResolvedValue(mockPreview as never);

    const result = await uploadVehiclePhoto(validInput);

    expect(result.id).toBe("preview-1");
    expect(prisma.visualizerPreview.create).not.toHaveBeenCalled();
  });

  it("updates (rather than creates) when a record exists with the cacheKey but is expired", async () => {
    const expiredPreview = { ...mockPreview, expiresAt: pastExpiry };
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.findFirst).mockResolvedValue(mockWrap as never);
    vi.mocked(prisma.visualizerPreview.findUnique).mockResolvedValue(expiredPreview as never);
    vi.mocked(prisma.visualizerPreview.update).mockResolvedValue({
      ...mockPreview,
      expiresAt: futureExpiry,
    } as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await uploadVehiclePhoto(validInput);

    expect(prisma.visualizerPreview.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ cacheKey: expect.any(String) }),
        data: expect.objectContaining({
          status: "pending",
          deletedAt: null,
          tenantId: "tenant-1",
        }),
      }),
    );
    expect(prisma.visualizerPreview.create).not.toHaveBeenCalled();
  });

  it("updates (rather than creates) when a record exists with the cacheKey but is soft-deleted", async () => {
    const deletedPreview = { ...mockPreview, deletedAt: new Date() };
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.findFirst).mockResolvedValue(mockWrap as never);
    vi.mocked(prisma.visualizerPreview.findUnique).mockResolvedValue(deletedPreview as never);
    vi.mocked(prisma.visualizerPreview.update).mockResolvedValue(mockPreview as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await uploadVehiclePhoto(validInput);

    expect(prisma.visualizerPreview.update).toHaveBeenCalled();
    expect(prisma.visualizerPreview.create).not.toHaveBeenCalled();
  });

  it("creates a new preview when no cached record exists", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.findFirst).mockResolvedValue(mockWrap as never);
    vi.mocked(prisma.visualizerPreview.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.visualizerPreview.create).mockResolvedValue(mockPreview as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const result = await uploadVehiclePhoto(validInput);

    expect(result.id).toBe("preview-1");
    expect(prisma.visualizerPreview.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tenantId: "tenant-1",
          wrapId: "wrap-1",
          status: "pending",
        }),
      }),
    );
  });

  it("scopes the wrap ownership check by tenantId", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.findFirst).mockResolvedValue(null);

    await expect(uploadVehiclePhoto(validInput)).rejects.toThrow("Wrap not found");

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

  it("writes an audit log after creating a new preview", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.findFirst).mockResolvedValue(mockWrap as never);
    vi.mocked(prisma.visualizerPreview.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.visualizerPreview.create).mockResolvedValue(mockPreview as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await uploadVehiclePhoto(validInput);

    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tenantId: "tenant-1",
          userId: "user-1",
          action: "UPLOAD_VEHICLE_PHOTO",
          resourceType: "VisualizerPreview",
          resourceId: "preview-1",
        }),
      }),
    );
  });

  it("does not accept tenantId from the input payload", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.wrap.findFirst).mockResolvedValue(mockWrap as never);
    vi.mocked(prisma.visualizerPreview.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.visualizerPreview.create).mockResolvedValue(mockPreview as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const inputWithTenantId = {
      ...validInput,
      tenantId: "attacker-tenant",
    } as unknown as typeof validInput;

    await uploadVehiclePhoto(inputWithTenantId);

    expect(prisma.visualizerPreview.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ tenantId: "tenant-1" }),
      }),
    );
  });
});
