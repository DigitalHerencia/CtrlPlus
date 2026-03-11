import { prisma } from "@/lib/prisma";
import { requirePlatformDeveloperAdmin } from "@/lib/authz/guards";
import { type WebhookFailureDTO, type WebhookOperationsOverviewDTO } from "../types";

const STALE_THRESHOLD_MINUTES = 5;
const RECENT_FAILURE_LIMIT = 25;

function toFailureDTO(record: {
  id: string;
  type: string;
  status: string;
  processedAt: Date;
}): WebhookFailureDTO {
  return {
    id: record.id,
    type: record.type,
    status: record.status,
    processedAt: record.processedAt.toISOString(),
  };
}

export async function getWebhookOperationsOverview(): Promise<WebhookOperationsOverviewDTO> {
  await requirePlatformDeveloperAdmin();

  const staleCutoff = new Date(Date.now() - STALE_THRESHOLD_MINUTES * 60_000);

  const [
    clerkProcessed,
    clerkFailed,
    clerkProcessing,
    clerkStaleProcessing,
    clerkRecentFailures,
    stripeProcessed,
    stripeFailed,
    stripeProcessing,
    stripeStaleProcessing,
    stripeRecentFailures,
  ] = await Promise.all([
    prisma.clerkWebhookEvent.count({ where: { status: "processed" } }),
    prisma.clerkWebhookEvent.count({ where: { status: "failed" } }),
    prisma.clerkWebhookEvent.count({ where: { status: "processing" } }),
    prisma.clerkWebhookEvent.count({
      where: {
        status: "processing",
        processedAt: {
          lt: staleCutoff,
        },
      },
    }),
    prisma.clerkWebhookEvent.findMany({
      where: {
        status: "failed",
      },
      select: {
        id: true,
        type: true,
        status: true,
        processedAt: true,
      },
      orderBy: {
        processedAt: "desc",
      },
      take: RECENT_FAILURE_LIMIT,
    }),
    prisma.stripeWebhookEvent.count({ where: { status: "processed" } }),
    prisma.stripeWebhookEvent.count({ where: { status: "failed" } }),
    prisma.stripeWebhookEvent.count({ where: { status: "processing" } }),
    prisma.stripeWebhookEvent.count({
      where: {
        status: "processing",
        processedAt: {
          lt: staleCutoff,
        },
      },
    }),
    prisma.stripeWebhookEvent.findMany({
      where: {
        status: "failed",
      },
      select: {
        id: true,
        type: true,
        status: true,
        processedAt: true,
      },
      orderBy: {
        processedAt: "desc",
      },
      take: RECENT_FAILURE_LIMIT,
    }),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    staleThresholdMinutes: STALE_THRESHOLD_MINUTES,
    clerk: {
      processed: clerkProcessed,
      failed: clerkFailed,
      processing: clerkProcessing,
      staleProcessing: clerkStaleProcessing,
      recentFailures: clerkRecentFailures.map(toFailureDTO),
    },
    stripe: {
      processed: stripeProcessed,
      failed: stripeFailed,
      processing: stripeProcessing,
      staleProcessing: stripeStaleProcessing,
      recentFailures: stripeRecentFailures.map(toFailureDTO),
    },
  };
}
