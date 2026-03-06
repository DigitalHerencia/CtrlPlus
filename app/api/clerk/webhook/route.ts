/**
 * Clerk Webhook Handler
 *
 * Syncs Clerk user lifecycle events to the database.
 * Handles: user.created, user.updated, user.deleted
 *
 * Security:
 * - Signature verified with Svix (CLERK_WEBHOOK_SECRET)
 * - Idempotency enforced via ClerkWebhookEvent table (event ID deduplication)
 *
 * IMPORTANT: This route must be public (not protected by middleware).
 */

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // Step 1: Verify Svix signature – returns 401 on failure
  let evt: WebhookEvent;
  let svixId: string;

  try {
    const result = await verifyClerkWebhook(req);
    evt = result.event;
    svixId = result.svixId;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Signature verification failed";
    console.error("[clerk-webhook] Signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 401 });
  }

  // Step 2: Idempotency – skip already-processed events
  const existing = await prisma.clerkWebhookEvent.findUnique({ where: { id: svixId } });
  if (existing) {
    return NextResponse.json({ success: true, skipped: true });
  }

  // Step 3: Process the event inside a transaction
  try {
    await prisma.$transaction(async (tx) => {
      // Record the event first to claim idempotency.
      // Use createOrSkip via upsert-style: attempt insert and let a unique-constraint
      // violation (P2002) mean a concurrent delivery already claimed it – no-op.
      try {
        await tx.clerkWebhookEvent.create({ data: { id: svixId, type: evt.type } });
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
          // Duplicate: another concurrent delivery already processed this event.
          return;
        }
        throw err;
      }

      switch (evt.type) {
        case "user.created":
          await handleUserCreated(evt, tx);
          break;

        case "user.updated":
          await handleUserUpdated(evt, tx);
          break;

        case "user.deleted":
          await handleUserDeleted(evt, tx);
          break;

        default:
          // Silently ignore unhandled events
          break;
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[clerk-webhook] Processing error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

// ── Internal helpers ──────────────────────────────────────────────────────────

type Tx = Prisma.TransactionClient;

/**
 * Verify Clerk webhook signature using Svix.
 * Throws with a descriptive message on any failure.
 */
async function verifyClerkWebhook(
  req: NextRequest,
): Promise<{ event: WebhookEvent; svixId: string }> {
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    throw new Error("Missing required Svix headers");
  }

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("CLERK_WEBHOOK_SECRET is not configured");
  }

  const payload = await req.text();

  const { Webhook } = await import("svix");
  const wh = new Webhook(webhookSecret);

  const event = wh.verify(payload, {
    "svix-id": svixId,
    "svix-timestamp": svixTimestamp,
    "svix-signature": svixSignature,
  }) as WebhookEvent;

  return { event, svixId };
}

/**
 * Upsert a User record from Clerk profile data.
 * Returns false (and logs a warning) if no email address is present.
 */
async function upsertUser(
  clerkUserId: string,
  data: {
    email_addresses: Array<{ id: string; email_address: string }>;
    primary_email_address_id: string | null;
    first_name: string | null | undefined;
    last_name: string | null | undefined;
    image_url: string | null | undefined;
  },
  tx: Tx,
): Promise<boolean> {
  const primaryEmail = data.email_addresses.find((e) => e.id === data.primary_email_address_id);
  const email = primaryEmail?.email_address ?? data.email_addresses[0]?.email_address ?? "";

  if (!email) {
    console.warn(
      "[Clerk Webhook] upsertUser: No email address found for Clerk user",
      clerkUserId,
    );
    return false;
  }

  await tx.user.upsert({
    where: { clerkUserId },
    create: {
      clerkUserId,
      email,
      firstName: data.first_name ?? null,
      lastName: data.last_name ?? null,
      imageUrl: data.image_url ?? null,
    },
    update: {
      email,
      firstName: data.first_name ?? null,
      lastName: data.last_name ?? null,
      imageUrl: data.image_url ?? null,
      deletedAt: null,
    },
  });

  return true;
}

/**
 * Handle user.created – upsert a User record with data from Clerk.
 */
async function handleUserCreated(evt: WebhookEvent, tx: Tx): Promise<void> {
  if (evt.type !== "user.created") return;

  const { id } = evt.data;
  const synced = await upsertUser(id, evt.data, tx);

  if (!synced) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[clerk-webhook] user.created (${id}): no email address, skipping upsert`,
      );
    }
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    console.warn(`[clerk-webhook] user.created synced: ${id}`);
  }
}

/**
 * Handle user.updated – sync changed profile fields to the User record.
 */
async function handleUserUpdated(evt: WebhookEvent, tx: Tx): Promise<void> {
  if (evt.type !== "user.updated") return;

  const { id } = evt.data;
  const synced = await upsertUser(id, evt.data, tx);

  if (!synced) {
    console.warn(`[clerk-webhook] user.updated (${id}): no email address, skipping upsert`);
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    console.warn(`[clerk-webhook] user.updated synced: ${id}`);
  }
}

/**
 * Handle user.deleted – soft-delete User record and all tenant memberships.
 */
async function handleUserDeleted(evt: WebhookEvent, tx: Tx): Promise<void> {
  if (evt.type !== "user.deleted") return;

  const clerkUserId = evt.data.id;
  if (!clerkUserId) return;

  const now = new Date();

  // Soft-delete the local User record
  await tx.user.updateMany({
    where: { clerkUserId, deletedAt: null },
    data: { deletedAt: now },
  });

  // Soft-delete all tenant memberships
  await tx.tenantUserMembership.updateMany({
    where: { userId: clerkUserId, deletedAt: null },
    data: { deletedAt: now },
  });

  if (process.env.NODE_ENV !== "production") {
    console.warn(`[clerk-webhook] user.deleted soft-deleted: ${clerkUserId}`);
  }
}
