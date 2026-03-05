"use server";

import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import {
  checkoutSessionCompletedSchema,
  paymentIntentSucceededSchema,
} from "@/lib/billing/types";

// ---------------------------------------------------------------------------
// handleStripeEvent
// ---------------------------------------------------------------------------

/**
 * Idempotently records and processes a Stripe webhook event.
 *
 * Security pipeline:
 *  1. Idempotency check — skip if the event ID has already been processed
 *  2. Persist raw event to StripeWebhookEvent (idempotency record)
 *  3. Dispatch to event-specific handler
 *
 * The caller (webhook route handler) is responsible for verifying the Stripe
 * signature before calling this function.
 *
 * @param event - Verified Stripe event object
 */
export async function handleStripeEvent(event: Stripe.Event): Promise<void> {
  // Step 1: Idempotency — if already processed, do nothing
  const existing = await prisma.stripeWebhookEvent.findUnique({
    where: { id: event.id },
  });

  if (existing) {
    return;
  }

  // Step 2: Persist raw event record (ensures exactly-once processing)
  await prisma.stripeWebhookEvent.create({
    data: {
      id: event.id,
      type: event.type,
      processedAt: new Date(),
      payload: event as unknown as Record<string, unknown>,
    },
  });

  // Step 3: Dispatch to event-specific handler
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutSessionCompleted(event);
      break;
    case "payment_intent.succeeded":
      await handlePaymentIntentSucceeded(event);
      break;
    default:
      // Unsupported event type — already persisted; nothing more to do
      break;
  }
}

// ---------------------------------------------------------------------------
// Event handlers
// ---------------------------------------------------------------------------

/**
 * Handles `checkout.session.completed` events.
 *
 * Transactionally marks the invoice as PAID, confirms the linked booking,
 * and writes an audit log entry.
 */
async function handleCheckoutSessionCompleted(
  event: Stripe.Event
): Promise<void> {
  const session = checkoutSessionCompletedSchema.parse(event.data.object);

  const invoiceId = session.metadata?.invoiceId;
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : undefined;

  if (!invoiceId) {
    // Cannot correlate to an invoice — nothing to update
    return;
  }

  await prisma.$transaction(async (tx) => {
    const invoice = await tx.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      return;
    }

    await tx.invoice.update({
      where: { id: invoiceId },
      data: {
        status: "PAID",
        stripeCheckoutSessionId: session.id,
        ...(paymentIntentId && { stripePaymentIntentId: paymentIntentId }),
      },
    });

    await tx.booking.update({
      where: { id: invoice.bookingId, tenantId: invoice.tenantId },
      data: { status: "CONFIRMED" },
    });

    await tx.auditLog.create({
      data: {
        tenantId: invoice.tenantId,
        action: "PAYMENT_COMPLETED",
        resourceId: invoice.id,
        details: {
          stripeEventId: event.id,
          stripeCheckoutSessionId: session.id,
          paymentIntentId: paymentIntentId ?? null,
        },
        timestamp: new Date(),
      },
    });
  });
}

/**
 * Handles `payment_intent.succeeded` events.
 *
 * Transactionally marks the invoice as PAID (if not already), confirms
 * the linked booking, and writes an audit log entry.
 *
 * Using idempotency on invoice status ("already PAID" guard) prevents
 * double-processing when both `checkout.session.completed` and
 * `payment_intent.succeeded` fire for the same payment.
 */
async function handlePaymentIntentSucceeded(
  event: Stripe.Event
): Promise<void> {
  const paymentIntent = paymentIntentSucceededSchema.parse(event.data.object);

  const invoiceId = paymentIntent.metadata?.invoiceId;

  if (!invoiceId) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    const invoice = await tx.invoice.findUnique({
      where: { id: invoiceId },
    });

    // Guard: skip if invoice not found or already paid (idempotency)
    if (!invoice || invoice.status === "PAID") {
      return;
    }

    await tx.invoice.update({
      where: { id: invoiceId },
      data: {
        status: "PAID",
        stripePaymentIntentId: paymentIntent.id,
      },
    });

    await tx.booking.update({
      where: { id: invoice.bookingId, tenantId: invoice.tenantId },
      data: { status: "CONFIRMED" },
    });

    await tx.auditLog.create({
      data: {
        tenantId: invoice.tenantId,
        action: "PAYMENT_INTENT_SUCCEEDED",
        resourceId: invoice.id,
        details: {
          stripeEventId: event.id,
          paymentIntentId: paymentIntent.id,
        },
        timestamp: new Date(),
      },
    });
  });
}
