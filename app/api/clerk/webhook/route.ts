/**
 * Clerk Webhook Handler
 *
 * Syncs Clerk user events to the database.
 * Handles: user.created, user.updated, user.deleted
 *
 * IMPORTANT: This route must be public (not protected by middleware).
 */

import { prisma } from "@/lib/prisma";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Verify webhook signature
    const evt = await verifyClerkWebhook(req);

    // Handle different event types
    switch (evt.type) {
      case "user.created":
        await handleUserCreated(evt);
        break;

      case "user.updated":
        await handleUserUpdated(evt);
        break;

      case "user.deleted":
        await handleUserDeleted(evt);
        break;

      default:
        // Silently ignore unhandled events
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

/**
 * Verify Clerk webhook signature.
 * Uses CLERK_WEBHOOK_SECRET from environment.
 */
async function verifyClerkWebhook(req: NextRequest): Promise<WebhookEvent> {
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    throw new Error("Missing Svix headers");
  }

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("CLERK_WEBHOOK_SECRET not configured");
  }

  // Get raw body
  const payload = await req.text();

  // Verify signature using Svix
  const { Webhook } = await import("svix");
  const wh = new Webhook(webhookSecret);

  return wh.verify(payload, {
    "svix-id": svixId,
    "svix-timestamp": svixTimestamp,
    "svix-signature": svixSignature,
  }) as WebhookEvent;
}

/**
 * Handle user.created event.
 *
 * Note: We don't auto-create TenantUserMembership here.
 * Membership is created when:
 * - User creates a new tenant (becomes owner)
 * - User is invited to existing tenant (becomes member/admin)
 */
async function handleUserCreated(evt: WebhookEvent) {
  if (evt.type !== "user.created") return;

  const { id, email_addresses } = evt.data;

  // Log user creation for debugging
  if (process.env.NODE_ENV === "development") {
    console.warn(`User created: ${id} (${email_addresses[0]?.email_address})`);
  }

  // For now, just log the event
  // In the future, we could create a User table or track first-time users

  // Note: TenantUserMembership will be created separately when:
  // 1. User creates their first tenant (onboarding flow)
  // 2. User accepts an invitation to a tenant
}

/**
 * Handle user.updated event.
 * Sync user metadata changes if needed.
 */
async function handleUserUpdated(evt: WebhookEvent) {
  if (evt.type !== "user.updated") return;

  const { id } = evt.data;

  // Log user update for debugging
  if (process.env.NODE_ENV === "development") {
    console.warn(`User updated: ${id}`);
  }

  // If we maintain a User table, update it here
  // For now, Clerk is source of truth for user data
}

/**
 * Handle user.deleted event.
 * Clean up user's tenant memberships.
 */
async function handleUserDeleted(evt: WebhookEvent) {
  if (evt.type !== "user.deleted") return;

  const userId = evt.data.id;

  // Soft delete all tenant memberships for this user
  await prisma.tenantUserMembership.updateMany({
    where: { userId },
    data: { deletedAt: new Date() },
  });

  if (process.env.NODE_ENV === "development") {
    console.warn(`User deleted: ${userId} - Soft deleted all memberships`);
  }
}
