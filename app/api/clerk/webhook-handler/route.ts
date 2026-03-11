/**
 * Clerk Webhook Handler
 *
 * Syncs user data from Clerk to Neon PostgreSQL.
 * Handles user.created, user.updated, and user.deleted events.
 * Uses Clerk's verified webhook helper and a replay-safe event ledger to
 * prevent duplicate processing while allowing safe retries after failures.
 *
 * This route must be public (not protected by clerkMiddleware).
 * Webhook verification signature is validated using
 * CLERK_WEBHOOK_SIGNING_SECRET (or the legacy CLERK_WEBHOOK_SECRET fallback).
 */

import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { resolveGlobalRoleForClerkUserId } from "@/lib/auth/identity";
import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

interface ClerkWebhookEvent {
  data: unknown;
  object: string;
  type: string;
}

type JsonObject = Record<string, unknown>;
type WebhookEventState = "process" | "processed" | "processing";
const WEBHOOK_PROCESSING_TIMEOUT_MS = 5 * 60 * 1000;

const SUPPORTED_EVENTS = new Set([
  "email.created",
  "paymentAttempt.created",
  "paymentAttempt.updated",
  "session.created",
  "session.ended",
  "session.pending",
  "session.removed",
  "session.revoked",
  "sms.created",
  "subscription.active",
  "subscription.created",
  "subscription.pastDue",
  "subscription.updated",
  "subscriptionItem.abandoned",
  "subscriptionItem.active",
  "subscriptionItem.canceled",
  "subscriptionItem.created",
  "subscriptionItem.ended",
  "subscriptionItem.freeTrialEnding",
  "subscriptionItem.incomplete",
  "subscriptionItem.pastDue",
  "subscriptionItem.upcoming",
  "subscriptionItem.updated",
  "user.created",
  "user.deleted",
  "user.updated",
]);

const DEV_ONLY_EVENT_PREFIXES = ["subscription.", "subscriptionItem.", "paymentAttempt."];

export function isClerkSubscriptionSyncEnabled(): boolean {
  if (process.env.NODE_ENV === "production") {
    return false;
  }

  return process.env.ENABLE_CLERK_SUBSCRIPTION_SYNC !== "false";
}

export function resolveClerkDevWebhookBaseUrl(): string | null {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const configuredUrl =
    process.env.DEV_WEBHOOK_BASE_URL ?? process.env.CLERK_WEBHOOK_DEV_URL ?? null;

  return configuredUrl?.trim() || null;
}

export function shouldSkipWebhookEventInCurrentEnv(eventType: string): boolean {
  const isDevOnlyEvent = DEV_ONLY_EVENT_PREFIXES.some((prefix) => eventType.startsWith(prefix));
  return isDevOnlyEvent && !isClerkSubscriptionSyncEnabled();
}

function asObject(value: unknown): JsonObject | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as JsonObject) : null;
}

function getString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function getNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function getPathValue(data: unknown, path: string[]): unknown {
  let current: unknown = data;

  for (const key of path) {
    const obj = asObject(current);
    if (!obj) return undefined;
    current = obj[key];
  }

  return current;
}

function getFirstStringPath(data: unknown, paths: string[][]): string | undefined {
  for (const path of paths) {
    const value = getString(getPathValue(data, path));
    if (value) return value;
  }

  return undefined;
}

function getFirstNumberPath(data: unknown, paths: string[][]): number | undefined {
  for (const path of paths) {
    const value = getNumber(getPathValue(data, path));
    if (typeof value === "number") return value;
  }

  return undefined;
}

function deriveSessionStatus(eventType: string): string {
  if (eventType === "session.created") return "created";
  if (eventType === "session.pending") return "pending";
  if (eventType === "session.ended") return "ended";
  if (eventType === "session.removed") return "removed";
  if (eventType === "session.revoked") return "revoked";
  return "unknown";
}

function deriveSubscriptionStatus(eventType: string, fallback?: string): string {
  if (eventType === "subscription.active") return "active";
  if (eventType === "subscription.pastDue") return "past_due";
  if (eventType === "subscription.created") return "created";
  if (eventType === "subscription.updated") return fallback ?? "updated";
  return fallback ?? "unknown";
}

function deriveSubscriptionItemStatus(eventType: string, fallback?: string): string {
  if (eventType === "subscriptionItem.abandoned") return "abandoned";
  if (eventType === "subscriptionItem.active") return "active";
  if (eventType === "subscriptionItem.canceled") return "canceled";
  if (eventType === "subscriptionItem.created") return "created";
  if (eventType === "subscriptionItem.ended") return "ended";
  if (eventType === "subscriptionItem.freeTrialEnding") return "free_trial_ending";
  if (eventType === "subscriptionItem.incomplete") return "incomplete";
  if (eventType === "subscriptionItem.pastDue") return "past_due";
  if (eventType === "subscriptionItem.upcoming") return "upcoming";
  if (eventType === "subscriptionItem.updated") return fallback ?? "updated";
  return fallback ?? "unknown";
}

function isPrismaUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "P2002"
  );
}

function ensureClerkWebhookSigningSecret(): string | null {
  const signingSecret =
    process.env.CLERK_WEBHOOK_SIGNING_SECRET ?? process.env.CLERK_WEBHOOK_SECRET ?? null;

  if (signingSecret && !process.env.CLERK_WEBHOOK_SIGNING_SECRET) {
    process.env.CLERK_WEBHOOK_SIGNING_SECRET = signingSecret;
  }

  return signingSecret;
}

export async function claimClerkWebhookEvent(
  eventId: string,
  eventType: string,
): Promise<WebhookEventState> {
  const now = new Date();

  try {
    await prisma.clerkWebhookEvent.create({
      data: {
        id: eventId,
        type: eventType,
        status: "processing",
        processedAt: now,
      },
    });

    return "process";
  } catch (error: unknown) {
    if (!isPrismaUniqueConstraintError(error)) {
      throw error;
    }
  }

  const existingEvent = await prisma.clerkWebhookEvent.findUnique({
    where: { id: eventId },
    select: { status: true },
  });

  if (!existingEvent) {
    throw new Error(`Clerk webhook event state missing for ${eventId}`);
  }

  if (existingEvent.status === "failed") {
    const retryClaim = await prisma.clerkWebhookEvent.updateMany({
      where: {
        id: eventId,
        status: "failed",
      },
      data: {
        type: eventType,
        status: "processing",
        processedAt: now,
      },
    });

    if (retryClaim.count === 1) {
      return "process";
    }

    const refreshedEvent = await prisma.clerkWebhookEvent.findUnique({
      where: { id: eventId },
      select: { status: true },
    });

    if (!refreshedEvent) {
      throw new Error(`Clerk webhook event state missing for ${eventId}`);
    }

    return refreshedEvent.status === "processed" ? "processed" : "processing";
  }

  if (existingEvent.status === "processing") {
    const staleBefore = new Date(now.getTime() - WEBHOOK_PROCESSING_TIMEOUT_MS);

    const retryClaim = await prisma.clerkWebhookEvent.updateMany({
      where: {
        id: eventId,
        status: "processing",
        processedAt: {
          lte: staleBefore,
        },
      },
      data: {
        type: eventType,
        processedAt: now,
      },
    });

    if (retryClaim.count === 1) {
      return "process";
    }
  }

  return existingEvent.status === "processed" ? "processed" : "processing";
}

async function finalizeClerkWebhookEvent(eventId: string, status: "processed" | "failed") {
  await prisma.clerkWebhookEvent.update({
    where: { id: eventId },
    data: {
      status,
      processedAt: new Date(),
    },
  });
}

async function handleUserEvent(eventType: string, data: unknown): Promise<void> {
  const clerkUserId = getFirstStringPath(data, [["id"], ["user_id"]]);

  if (!clerkUserId) {
    throw new Error("Missing Clerk user ID for user event");
  }

  const emailAddresses = getPathValue(data, ["email_addresses"]);
  const primaryEmailAddressId = getFirstStringPath(data, [["primary_email_address_id"]]);
  let email = `no-email+${clerkUserId}@local.invalid`;

  if (Array.isArray(emailAddresses)) {
    const emailAddressRecords = emailAddresses as unknown[];
    const primaryEmailRecord = primaryEmailAddressId
      ? emailAddressRecords.find(
          (item) => getFirstStringPath(item, [["id"]]) === primaryEmailAddressId,
        )
      : null;
    const prioritizedEmailAddresses = primaryEmailRecord
      ? [primaryEmailRecord, ...emailAddressRecords.filter((item) => item !== primaryEmailRecord)]
      : emailAddressRecords;

    for (const item of prioritizedEmailAddresses) {
      const emailAddress = getFirstStringPath(item, [["email_address"]]);
      if (emailAddress) {
        email = emailAddress.toLowerCase();
        break;
      }
    }
  }

  const firstName = getFirstStringPath(data, [["first_name"]]) ?? null;
  const lastName = getFirstStringPath(data, [["last_name"]]) ?? null;
  const imageUrl = getFirstStringPath(data, [["image_url"]]) ?? null;
  const globalRole = resolveGlobalRoleForClerkUserId(clerkUserId);

  if (eventType === "user.deleted") {
    const deletedAt = new Date();
    await prisma.$transaction(async (tx) => {
      await tx.user.updateMany({
        where: { clerkUserId },
        data: {
          email: `deleted+${clerkUserId}@local.invalid`,
          firstName: null,
          lastName: null,
          imageUrl: null,
          deletedAt,
        },
      });

      await Promise.all([
        tx.clerkSession.updateMany({
          where: { clerkUserId, deletedAt: null },
          data: { deletedAt },
        }),
        tx.clerkEmail.updateMany({
          where: { clerkUserId, deletedAt: null },
          data: { deletedAt },
        }),
        tx.clerkSms.updateMany({
          where: { clerkUserId, deletedAt: null },
          data: { deletedAt },
        }),
        tx.clerkSubscription.updateMany({
          where: { clerkUserId, deletedAt: null },
          data: { deletedAt },
        }),
        tx.clerkPaymentAttempt.updateMany({
          where: { clerkUserId, deletedAt: null },
          data: { deletedAt },
        }),
      ]);
    });

    return;
  }

  await prisma.user.upsert({
    where: { clerkUserId },
    create: {
      clerkUserId,
      email,
      globalRole,
      firstName,
      lastName,
      imageUrl,
    },
    update: {
      email,
      globalRole,
      firstName,
      lastName,
      imageUrl,
      deletedAt: null,
    },
  });
}

async function handleSessionEvent(eventType: string, data: unknown): Promise<void> {
  const sessionId = getFirstStringPath(data, [["id"], ["session_id"]]);
  const clerkUserId = getFirstStringPath(data, [["user_id"], ["actor", "id"]]);

  if (!sessionId || !clerkUserId) {
    throw new Error("Missing session ID or user ID for session event");
  }

  const status = deriveSessionStatus(eventType);

  await prisma.clerkSession.upsert({
    where: { id: sessionId },
    create: {
      id: sessionId,
      clerkUserId,
      status,
      lastEventType: eventType,
      endedAt: eventType === "session.ended" ? new Date() : null,
      removedAt: eventType === "session.removed" ? new Date() : null,
      revokedAt: eventType === "session.revoked" ? new Date() : null,
    },
    update: {
      clerkUserId,
      status,
      lastEventType: eventType,
      endedAt: eventType === "session.ended" ? new Date() : undefined,
      removedAt: eventType === "session.removed" ? new Date() : undefined,
      revokedAt: eventType === "session.revoked" ? new Date() : undefined,
      deletedAt: null,
    },
  });
}

async function handleEmailEvent(eventType: string, data: unknown, eventId: string): Promise<void> {
  const emailId = getFirstStringPath(data, [["id"]]) ?? `${eventId}:email`;
  const clerkUserId = getFirstStringPath(data, [["user_id"]]);
  const status = getFirstStringPath(data, [["status"]]);
  const toEmail = getFirstStringPath(data, [
    ["to_email_address"],
    ["recipient_email_address"],
    ["email_address"],
    ["to"],
  ]);

  await prisma.clerkEmail.upsert({
    where: { id: emailId },
    create: {
      id: emailId,
      clerkUserId,
      status,
      toEmail,
      lastEventType: eventType,
    },
    update: {
      clerkUserId,
      status,
      toEmail,
      lastEventType: eventType,
      deletedAt: null,
    },
  });
}

async function handleSmsEvent(eventType: string, data: unknown, eventId: string): Promise<void> {
  const smsId = getFirstStringPath(data, [["id"]]) ?? `${eventId}:sms`;
  const clerkUserId = getFirstStringPath(data, [["user_id"]]);
  const status = getFirstStringPath(data, [["status"]]);
  const toPhone = getFirstStringPath(data, [["phone_number"], ["to_phone_number"], ["to"]]);

  await prisma.clerkSms.upsert({
    where: { id: smsId },
    create: {
      id: smsId,
      clerkUserId,
      status,
      toPhone,
      lastEventType: eventType,
    },
    update: {
      clerkUserId,
      status,
      toPhone,
      lastEventType: eventType,
      deletedAt: null,
    },
  });
}

async function handleSubscriptionEvent(eventType: string, data: unknown): Promise<void> {
  const subscriptionId = getFirstStringPath(data, [["id"], ["subscription_id"]]);
  if (!subscriptionId) {
    throw new Error("Missing subscription ID for subscription event");
  }

  const clerkUserId = getFirstStringPath(data, [["user_id"], ["subscriber", "user_id"]]);
  const payloadStatus = getFirstStringPath(data, [["status"]]);
  const status = deriveSubscriptionStatus(eventType, payloadStatus);

  await prisma.clerkSubscription.upsert({
    where: { id: subscriptionId },
    create: {
      id: subscriptionId,
      clerkUserId,
      status,
      lastEventType: eventType,
    },
    update: {
      clerkUserId,
      status,
      lastEventType: eventType,
      deletedAt: null,
    },
  });
}

async function handleSubscriptionItemEvent(eventType: string, data: unknown): Promise<void> {
  const itemId = getFirstStringPath(data, [["id"], ["subscription_item_id"]]);
  const subscriptionId = getFirstStringPath(data, [["subscription_id"], ["subscription", "id"]]);

  if (!itemId || !subscriptionId) {
    throw new Error("Missing subscription item ID or subscription ID");
  }

  const itemPayloadStatus = getFirstStringPath(data, [["status"]]);
  const itemStatus = deriveSubscriptionItemStatus(eventType, itemPayloadStatus);

  await prisma.clerkSubscription.upsert({
    where: { id: subscriptionId },
    create: {
      id: subscriptionId,
      status: "unknown",
      lastEventType: "subscription.placeholder",
    },
    update: {
      updatedAt: new Date(),
    },
  });

  await prisma.clerkSubscriptionItem.upsert({
    where: { id: itemId },
    create: {
      id: itemId,
      subscriptionId,
      status: itemStatus,
      lastEventType: eventType,
    },
    update: {
      subscriptionId,
      status: itemStatus,
      lastEventType: eventType,
      deletedAt: null,
    },
  });
}

async function handlePaymentAttemptEvent(eventType: string, data: unknown): Promise<void> {
  const paymentAttemptId = getFirstStringPath(data, [["id"], ["payment_attempt_id"]]);

  if (!paymentAttemptId) {
    throw new Error("Missing payment attempt ID for paymentAttempt event");
  }

  const clerkUserId = getFirstStringPath(data, [["user_id"], ["payer", "user_id"]]);
  const status = getFirstStringPath(data, [["status"]]);
  const amount = getFirstNumberPath(data, [["amount"], ["amount_in_cents"]]);
  const currency = getFirstStringPath(data, [["currency"], ["currency_code"]]);

  await prisma.clerkPaymentAttempt.upsert({
    where: { id: paymentAttemptId },
    create: {
      id: paymentAttemptId,
      clerkUserId,
      status,
      amount,
      currency,
      lastEventType: eventType,
    },
    update: {
      clerkUserId,
      status,
      amount,
      currency,
      lastEventType: eventType,
      deletedAt: null,
    },
  });
}

/**
 * POST /api/clerk/webhook-handler
 * Receives webhook events from Clerk and syncs user data to Neon database.
 * Verifies webhook signature using CLERK_WEBHOOK_SECRET from environment.
 */
export async function POST(req: NextRequest) {
  try {
    const signingSecret = ensureClerkWebhookSigningSecret();

    if (!signingSecret) {
      console.error("[Clerk Webhook] CLERK_WEBHOOK_SIGNING_SECRET environment variable not set");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }

    const eventId = req.headers.get("svix-id");
    if (!eventId) {
      return NextResponse.json({ error: "Missing svix-id header" }, { status: 400 });
    }

    const evt = (await verifyWebhook(req)) as ClerkWebhookEvent;

    // Guard: Only process supported events
    if (!SUPPORTED_EVENTS.has(evt.type)) {
      console.warn(`[Clerk Webhook] Ignoring unsupported event type: ${evt.type}`);
      return NextResponse.json({ message: "Ignored unsupported event type" }, { status: 200 });
    }

    if (shouldSkipWebhookEventInCurrentEnv(evt.type)) {
      return NextResponse.json({ message: "Ignored in current environment" }, { status: 200 });
    }

    const devWebhookBaseUrl = resolveClerkDevWebhookBaseUrl();
    if (devWebhookBaseUrl && process.env.NODE_ENV !== "production") {
      const isNgrokBaseUrl = devWebhookBaseUrl.includes("ngrok-free.app");
      if (!isNgrokBaseUrl) {
        console.warn(
          "[Clerk Webhook] DEV_WEBHOOK_BASE_URL/CLERK_WEBHOOK_DEV_URL is set but does not use ngrok-free.app",
        );
      }
    }

    const webhookState = await claimClerkWebhookEvent(eventId, evt.type);

    if (webhookState !== "process") {
      console.warn(`[Clerk Webhook] Event ${eventId} already ${webhookState}`);
      return NextResponse.json({ message: `Event already ${webhookState}` }, { status: 200 });
    }

    try {
      if (!evt.data) {
        throw new Error("Missing webhook data");
      }

      // Handle different event types
      if (evt.type.startsWith("user.")) {
        await handleUserEvent(evt.type, evt.data);
      } else if (evt.type.startsWith("session.")) {
        await handleSessionEvent(evt.type, evt.data);
      } else if (evt.type === "email.created") {
        await handleEmailEvent(evt.type, evt.data, eventId);
      } else if (evt.type === "sms.created") {
        await handleSmsEvent(evt.type, evt.data, eventId);
      } else if (evt.type.startsWith("subscriptionItem.")) {
        await handleSubscriptionItemEvent(evt.type, evt.data);
      } else if (evt.type.startsWith("subscription.")) {
        await handleSubscriptionEvent(evt.type, evt.data);
      } else if (evt.type.startsWith("paymentAttempt.")) {
        await handlePaymentAttemptEvent(evt.type, evt.data);
      }

      await finalizeClerkWebhookEvent(eventId, "processed");
    } catch (error) {
      await finalizeClerkWebhookEvent(eventId, "failed");
      throw error;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    // Log detailed error for debugging
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[Clerk Webhook] Error:", errorMessage);

    // Return error status (Svix will retry on non-2xx responses)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 400 });
  }
}
