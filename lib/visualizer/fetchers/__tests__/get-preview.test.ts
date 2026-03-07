import { beforeEach, describe, expect, it, vi } from "vitest";

// ─── Prisma mock ─────────────────────────────────────────────────────────────

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    visualizerPreview: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

const now = new Date();
const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

const mockPreview = {
  id: "preview-001",
  tenantId: "tenant-abc",
  wrapId: "wrap-001",
  customerPhotoUrl: "data:image/png;base64,abc123",
  processedImageUrl: null,
  status: "pending",
  cacheKey: "deadbeef",
  expiresAt,
  createdAt: now,
  updatedAt: now,
};

// ─── Import fetchers after mock is set up ────────────────────────────────────

import { getPreviewById, getPreviewsByWrap } from "../get-preview";

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("getPreviewById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a VisualizerPreviewDTO when preview exists for the tenant", async () => {
    prismaMock.visualizerPreview.findFirst.mockResolvedValue(mockPreview);

    const result = await getPreviewById("tenant-abc", "preview-001");

    expect(result).not.toBeNull();
    expect(result?.id).toBe("preview-001");
    expect(result?.tenantId).toBe("tenant-abc");
    expect(result?.wrapId).toBe("wrap-001");
    expect(result?.status).toBe("pending");
  });

  it("returns null when preview does not exist", async () => {
    prismaMock.visualizerPreview.findFirst.mockResolvedValue(null);

    const result = await getPreviewById("tenant-abc", "preview-999");

    expect(result).toBeNull();
  });

  it("returns null when preview belongs to a different tenant", async () => {
    prismaMock.visualizerPreview.findFirst.mockResolvedValue(null);

    const result = await getPreviewById("tenant-other", "preview-001");

    expect(result).toBeNull();
  });

  it("scopes the query by both tenantId and previewId", async () => {
    prismaMock.visualizerPreview.findFirst.mockResolvedValue(null);

    await getPreviewById("tenant-abc", "preview-001");

    expect(prismaMock.visualizerPreview.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: "preview-001",
          tenantId: "tenant-abc",
        }),
      }),
    );
  });

  it("filters out soft-deleted previews (deletedAt: null)", async () => {
    prismaMock.visualizerPreview.findFirst.mockResolvedValue(null);

    await getPreviewById("tenant-abc", "preview-001");

    expect(prismaMock.visualizerPreview.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ deletedAt: null }),
      }),
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("getPreviewsByWrap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns an array of VisualizerPreviewDTOs for the wrap", async () => {
    prismaMock.visualizerPreview.findMany.mockResolvedValue([mockPreview]);

    const result = await getPreviewsByWrap("tenant-abc", "wrap-001");

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("preview-001");
    expect(result[0].wrapId).toBe("wrap-001");
  });

  it("scopes the query by both tenantId and wrapId", async () => {
    prismaMock.visualizerPreview.findMany.mockResolvedValue([]);

    await getPreviewsByWrap("tenant-abc", "wrap-001");

    expect(prismaMock.visualizerPreview.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId: "tenant-abc",
          wrapId: "wrap-001",
        }),
      }),
    );
  });

  it("filters out soft-deleted previews (deletedAt: null)", async () => {
    prismaMock.visualizerPreview.findMany.mockResolvedValue([]);

    await getPreviewsByWrap("tenant-abc", "wrap-001");

    expect(prismaMock.visualizerPreview.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ deletedAt: null }),
      }),
    );
  });

  it("filters out expired previews (expiresAt: { gt: now })", async () => {
    prismaMock.visualizerPreview.findMany.mockResolvedValue([]);

    await getPreviewsByWrap("tenant-abc", "wrap-001");

    expect(prismaMock.visualizerPreview.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          expiresAt: expect.objectContaining({ gt: expect.any(Date) }),
        }),
      }),
    );
  });

  it("returns an empty array when no previews exist", async () => {
    prismaMock.visualizerPreview.findMany.mockResolvedValue([]);

    const result = await getPreviewsByWrap("tenant-abc", "wrap-001");

    expect(result).toEqual([]);
  });

  it("transforms raw records to VisualizerPreviewDTOs", async () => {
    const completePreview = {
      ...mockPreview,
      status: "complete",
      processedImageUrl: "https://example.com/processed.jpg",
    };
    prismaMock.visualizerPreview.findMany.mockResolvedValue([completePreview]);

    const result = await getPreviewsByWrap("tenant-abc", "wrap-001");

    expect(result[0].status).toBe("complete");
    expect(result[0].processedImageUrl).toBe("https://example.com/processed.jpg");
  });
});
