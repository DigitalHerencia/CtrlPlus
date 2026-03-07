import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/session", () => ({ getSession: vi.fn() }));
vi.mock("@/lib/tenancy/assert", () => ({ assertTenantMembership: vi.fn() }));
vi.mock("@/lib/visualizer/preview-pipeline", () => ({ generateCompositePreview: vi.fn() }));

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

import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { generateCompositePreview } from "@/lib/visualizer/preview-pipeline";
import { generatePreview } from "../generate-preview";

const mockSession = { userId: "user-1", tenantId: "tenant-1", isAuthenticated: true, orgId: null };
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

describe("generatePreview", () => {
  beforeEach(() => vi.clearAllMocks());

  it("transitions pending -> processing -> complete", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.visualizerPreview.findFirst).mockResolvedValue(mockPreviewPending as never);
    vi.mocked(generateCompositePreview).mockResolvedValue("https://blob.test/preview.png");
    vi.mocked(prisma.visualizerPreview.update)
      .mockResolvedValueOnce({ ...mockPreviewPending, status: "processing" } as never)
      .mockResolvedValueOnce({
        ...mockPreviewPending,
        status: "complete",
        processedImageUrl: "https://blob.test/preview.png",
      } as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const result = await generatePreview({ previewId: "preview-1" });

    expect(result.status).toBe("complete");
    expect(prisma.visualizerPreview.update).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ data: { status: "processing" } }),
    );
    expect(prisma.visualizerPreview.update).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        data: expect.objectContaining({
          status: "complete",
          processedImageUrl: "https://blob.test/preview.png",
        }),
      }),
    );
  });

  it("marks preview as failed when pipeline throws", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.visualizerPreview.findFirst).mockResolvedValue(mockPreviewPending as never);
    vi.mocked(generateCompositePreview).mockRejectedValue(new Error("hf timeout"));
    vi.mocked(prisma.visualizerPreview.update)
      .mockResolvedValueOnce({ ...mockPreviewPending, status: "processing" } as never)
      .mockResolvedValueOnce({ ...mockPreviewPending, status: "failed" } as never);

    await expect(generatePreview({ previewId: "preview-1" })).rejects.toThrow("hf timeout");

    expect(prisma.visualizerPreview.update).toHaveBeenLastCalledWith(
      expect.objectContaining({ data: { status: "failed" } }),
    );
  });

  it("returns complete record without reprocessing when cache is valid", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(assertTenantMembership).mockResolvedValue(undefined);
    vi.mocked(prisma.visualizerPreview.findFirst).mockResolvedValue({
      ...mockPreviewPending,
      status: "complete",
      processedImageUrl: "https://blob.test/existing.png",
    } as never);

    const result = await generatePreview({ previewId: "preview-1" });

    expect(result.processedImageUrl).toBe("https://blob.test/existing.png");
    expect(generateCompositePreview).not.toHaveBeenCalled();
  });
});
