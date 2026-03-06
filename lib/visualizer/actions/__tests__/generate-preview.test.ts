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
    visualizerPreview: {
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
import { prisma } from "@/lib/prisma";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { generatePreview } from "../generate-preview";

// ── Helpers ───────────────────────────────────────────────────────────────────

const mockSession = {
  userId: "user-1",
  tenantId: "tenant-1",
  isAuthenticated: true,
  orgId: null,
};

const now = new Date();
const futureExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

const mockPreviewPending = {
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

const mockPreviewComplete = {
  ...mockPreviewPending,
  status: "complete",
  processedImageUrl: "data:image/png;base64,abc123",
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("generatePreview", () => {
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

    await expect(generatePreview({ previewId: "preview-1" })).rejects.toThrow("Unauthorized");
  });

  it("throws Forbidden when assertTenantMembership rejects", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockRejectedValue(
      new Error("Forbidden: no active membership for this tenant"),
    );

    await expect(generatePreview({ previewId: "preview-1" })).rejects.toThrow("Forbidden");
  });

  it("throws when preview does not exist for the tenant", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.visualizerPreview.findFirst).mockResolvedValue(null);

    await expect(generatePreview({ previewId: "preview-1" })).rejects.toThrow("Preview not found");
    expect(prisma.visualizerPreview.update).not.toHaveBeenCalled();
  });

  it("scopes the preview lookup by tenantId (prevents cross-tenant access)", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.visualizerPreview.findFirst).mockResolvedValue(null);

    await expect(generatePreview({ previewId: "preview-1" })).rejects.toThrow("Preview not found");

    expect(prisma.visualizerPreview.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: "preview-1",
          tenantId: "tenant-1",
          deletedAt: null,
        }),
      }),
    );
  });

  it("returns the existing DTO immediately when preview is already complete", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.visualizerPreview.findFirst).mockResolvedValue(mockPreviewComplete as never);

    const result = await generatePreview({ previewId: "preview-1" });

    expect(result.status).toBe("complete");
    expect(prisma.visualizerPreview.update).not.toHaveBeenCalled();
    expect(prisma.auditLog.create).not.toHaveBeenCalled();
  });

  it("transitions status to complete and sets processedImageUrl", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.visualizerPreview.findFirst).mockResolvedValue(mockPreviewPending as never);
    vi.mocked(prisma.visualizerPreview.update).mockResolvedValue(mockPreviewComplete as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const result = await generatePreview({ previewId: "preview-1" });

    expect(result.status).toBe("complete");
    expect(prisma.visualizerPreview.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "preview-1" },
        data: expect.objectContaining({ status: "complete" }),
      }),
    );
  });

  it("writes an audit log after generating the preview", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.visualizerPreview.findFirst).mockResolvedValue(mockPreviewPending as never);
    vi.mocked(prisma.visualizerPreview.update).mockResolvedValue(mockPreviewComplete as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    await generatePreview({ previewId: "preview-1" });

    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tenantId: "tenant-1",
          userId: "user-1",
          action: "GENERATE_PREVIEW",
          resourceType: "VisualizerPreview",
          resourceId: "preview-1",
        }),
      }),
    );
  });

  it("returns a VisualizerPreviewDTO with the correct shape", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.visualizerPreview.findFirst).mockResolvedValue(mockPreviewPending as never);
    vi.mocked(prisma.visualizerPreview.update).mockResolvedValue(mockPreviewComplete as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const result = await generatePreview({ previewId: "preview-1" });

    expect(result).toMatchObject({
      id: "preview-1",
      tenantId: "tenant-1",
      wrapId: "wrap-1",
      status: "complete",
    });
  });
});
