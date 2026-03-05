"use server";

import type Stripe from "stripe";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  checkoutSessionCompletedSchema,
  paymentIntentSucceededSchema,
} from "@/lib/billing/types";

/**
 * Idempotently records and processes a Stripe webhook event.
 *
 * Pipeline:
 * 1. Idempotency check — skip if already processed
 * 2. Persist raw event to StripeWebhookEvent
 * 3. Dispatch to event-specific handler
 */
export async function handleStripeEvent(event: Stripe.Event): Promise<void> {
  // Step 1: Idempotency — if already processed, do nothing
  const existing = await prisma.stripeWebhookEvent.findUnique({
    where: { id: event.id },
  });

  if (existing) {
    return;
  }

  // Step 2: Persist raw event (idempotency record)
  await prisma.stripeWebhookEvent.create({
    data: {
      id: event.id,
      type: event.type,
      payload: event as unknown as Prisma.InputJsonValue,
    },
  });

  // Step 3: Dispatch
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
      },
    });
  });
}

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
      },
    });
  });
}
