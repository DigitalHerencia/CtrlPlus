import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: vi.fn(),
    visualizerPreview: {
      deleteMany: vi.fn(),
    },
    clerkWebhookEvent: {
      deleteMany: vi.fn(),
    },
    stripeWebhookEvent: {
      deleteMany: vi.fn(),
    },
  },
}));

const { prisma } = await import("@/lib/prisma");

import {
  EXPIRED_PREVIEW_RETENTION_DAYS,
  WEBHOOK_EVENT_RETENTION_DAYS,
  pruneDatabaseArtifacts,
} from "../database-maintenance";

describe("pruneDatabaseArtifacts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(prisma.$transaction).mockResolvedValue([
      { count: 2 },
      { count: 3 },
      { count: 4 },
    ] as never);
  });

  it("deletes expired previews and old processed webhook events", async () => {
    const now = new Date("2026-03-07T12:00:00.000Z");

    const result = await pruneDatabaseArtifacts({ now });

    expect(prisma.visualizerPreview.deleteMany).toHaveBeenCalledWith({
      where: {
        expiresAt: {
          lt: new Date(now.getTime() - EXPIRED_PREVIEW_RETENTION_DAYS * 24 * 60 * 60 * 1000),
        },
      },
    });
    expect(prisma.clerkWebhookEvent.deleteMany).toHaveBeenCalledWith({
      where: {
        status: { in: ["processed", "failed"] },
        processedAt: {
          lt: new Date(now.getTime() - WEBHOOK_EVENT_RETENTION_DAYS * 24 * 60 * 60 * 1000),
        },
      },
    });
    expect(prisma.stripeWebhookEvent.deleteMany).toHaveBeenCalledWith({
      where: {
        status: { in: ["processed", "failed"] },
        processedAt: {
          lt: new Date(now.getTime() - WEBHOOK_EVENT_RETENTION_DAYS * 24 * 60 * 60 * 1000),
        },
      },
    });
    expect(result).toEqual({
      deletedPreviewCount: 2,
      deletedClerkWebhookEventCount: 3,
      deletedStripeWebhookEventCount: 4,
    });
  });
});
