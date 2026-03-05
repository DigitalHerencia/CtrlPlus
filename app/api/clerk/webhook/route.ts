import { type NextRequest } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { UserJSON, UserDeletedJSON } from "@clerk/backend";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/clerk/webhook
 *
 * Handles Clerk user lifecycle webhook events:
 *  - user.created  → upsert ClerkUser record
 *  - user.updated  → update ClerkUser record
 *  - user.deleted  → hard-delete ClerkUser and cascade memberships
 *
 * Security: signature verified via Svix (CLERK_WEBHOOK_SIGNING_SECRET env var).
 * Idempotency: every event is recorded in ClerkWebhookEvent; duplicate svix-id
 *              returns 200 without re-processing.
 */
export async function POST(req: NextRequest): Promise<Response> {
  // ── 1. Signature verification ───────────────────────────────────────────
  let evt;
  try {
    evt = await verifyWebhook(req);
  } catch (err) {
    console.error("[clerk-webhook] signature verification failed", err);
    return new Response("Webhook signature verification failed", {
      status: 400,
    });
  }

  const svixId = req.headers.get("svix-id") ?? (evt.data as { id?: string }).id;

  if (!svixId) {
    console.error("[clerk-webhook] missing svix-id header");
    return new Response("Missing svix-id", { status: 400 });
  }

  const { type: eventType } = evt;

  console.info("[clerk-webhook] received event", { svixId, eventType });

  // ── 2. Idempotency check ─────────────────────────────────────────────────
  const existing = await prisma.clerkWebhookEvent.findUnique({
    where: { svixId },
    select: { id: true },
  });

  if (existing) {
    console.info("[clerk-webhook] duplicate event, skipping", { svixId });
    return new Response("Already processed", { status: 200 });
  }

  // ── 3. Process event ─────────────────────────────────────────────────────
  try {
    await processEvent(eventType, evt.data as UserJSON | UserDeletedJSON);

    // Record successful processing for idempotency
    await prisma.clerkWebhookEvent.create({
      data: {
        svixId,
        eventType,
        payload: evt.data as unknown as Prisma.InputJsonValue,
      },
    });

    console.info("[clerk-webhook] event processed", { svixId, eventType });
    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("[clerk-webhook] processing error", {
      svixId,
      eventType,
      err,
    });
    // Return 500 so Clerk/Svix will retry delivery
    return new Response("Internal server error", { status: 500 });
  }
}

// ── Event handlers ──────────────────────────────────────────────────────────

async function processEvent(
  eventType: string,
  data: UserJSON | UserDeletedJSON
): Promise<void> {
  switch (eventType) {
    case "user.created":
      await handleUserCreated(data as UserJSON);
      break;
    case "user.updated":
      await handleUserUpdated(data as UserJSON);
      break;
    case "user.deleted":
      await handleUserDeleted(data as UserDeletedJSON);
      break;
    default:
      // Unhandled event types are silently acknowledged
      console.info("[clerk-webhook] unhandled event type", { eventType });
  }
}

/** Upsert a ClerkUser row when a new Clerk user is created. */
async function handleUserCreated(data: UserJSON): Promise<void> {
  const email = getPrimaryEmail(data);

  await prisma.clerkUser.upsert({
    where: { clerkUserId: data.id },
    update: {
      email,
      firstName: data.first_name ?? null,
      lastName: data.last_name ?? null,
      imageUrl: data.image_url ?? null,
    },
    create: {
      clerkUserId: data.id,
      email,
      firstName: data.first_name ?? null,
      lastName: data.last_name ?? null,
      imageUrl: data.image_url ?? null,
    },
  });

  console.info("[clerk-webhook] user created/upserted", {
    clerkUserId: data.id,
  });
}

/** Update an existing ClerkUser row when a Clerk user is updated. */
async function handleUserUpdated(data: UserJSON): Promise<void> {
  const email = getPrimaryEmail(data);

  await prisma.clerkUser.upsert({
    where: { clerkUserId: data.id },
    update: {
      email,
      firstName: data.first_name ?? null,
      lastName: data.last_name ?? null,
      imageUrl: data.image_url ?? null,
    },
    create: {
      clerkUserId: data.id,
      email,
      firstName: data.first_name ?? null,
      lastName: data.last_name ?? null,
      imageUrl: data.image_url ?? null,
    },
  });

  console.info("[clerk-webhook] user updated", { clerkUserId: data.id });
}

/**
 * Delete the ClerkUser row and cascade remove their tenant memberships
 * when a Clerk user is deleted.
 */
async function handleUserDeleted(data: UserDeletedJSON): Promise<void> {
  if (!data.id) {
    // Malformed event — throw so the caller returns 400 and Clerk stops retrying
    throw new Error("[clerk-webhook] user.deleted event missing id");
  }

  // Use a transaction so memberships and user are removed atomically
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const user = await tx.clerkUser.findUnique({
      where: { clerkUserId: data.id! },
      select: { id: true },
    });

    if (!user) {
      console.warn("[clerk-webhook] user.deleted: no local record found", {
        clerkUserId: data.id,
      });
      return;
    }

    // Cascade: remove memberships first (FK constraint)
    await tx.tenantUserMembership.deleteMany({
      where: { userId: user.id },
    });

    // Delete the user record
    await tx.clerkUser.delete({ where: { id: user.id } });
  });

  console.info("[clerk-webhook] user deleted", { clerkUserId: data.id });
}

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Resolves the primary email address from a Clerk UserJSON payload.
 * Falls back to the first email in the list when no primary is set.
 */
function getPrimaryEmail(data: UserJSON): string {
  const { email_addresses, primary_email_address_id } = data;

  if (!email_addresses || email_addresses.length === 0) {
    throw new Error(`[clerk-webhook] user ${data.id} has no email addresses`);
  }

  const primary = primary_email_address_id
    ? email_addresses.find((e) => e.id === primary_email_address_id)
    : null;

  const resolved = primary ?? email_addresses[0];
  return resolved.email_address;
}
