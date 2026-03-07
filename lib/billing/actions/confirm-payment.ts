/**
 * confirmPayment
 *
 * Webhook handler callback invoked by the Stripe route handler
 * (`app/api/stripe/webhook/route.ts`) after receiving a
 * `checkout.session.completed` event.
 *
 * Security pipeline (adapted for system-triggered webhooks):
 * 1. Authenticate  — verify Stripe webhook signature (replaces user auth)
 * 2. Validate      — parse and validate the Stripe event payload
 * 3. Idempotency   — skip if the payment was already processed
 * 4. Mutate        — create Payment record, update Invoice and Booking status
 * 5. Audit         — write an immutable audit log entry
 *
 * NOTE: This function is NOT a Next.js Server Action ("use server").
 * It is a plain async function imported directly by the webhook route handler.
 */

import { constructWebhookEvent } from "@/lib/billing/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";
import { type ConfirmPaymentResult } from "../types";

/**
 * Sentinel userId written to AuditLog entries that originate from the
 * Stripe webhook (no human actor).
 */
export const STRIPE_WEBHOOK_ACTOR = "system:stripe-webhook";

type WebhookEventState = "process" | "processed" | "processing";

/**
 * Returns true when `err` is a Prisma unique-constraint violation (P2002).
 * Used to detect a concurrent duplicate payment creation inside a transaction.
 */
function isPrismaUniqueConstraintError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: string }).code === "P2002"
  );
}

function toPaymentStatus(status: string): ConfirmPaymentResult["status"] {
  if (status === "pending" || status === "succeeded" || status === "failed") {
    return status;
  }

  throw new Error(`Unsupported payment status: ${status}`);
}

async function claimStripeWebhookEvent(
  eventId: string,
  eventType: string,
): Promise<WebhookEventState> {
  try {
    await prisma.stripeWebhookEvent.create({
      data: {
        id: eventId,
        type: eventType,
        status: "processing",
      },
    });

    return "process";
  } catch (error: unknown) {
    if (!isPrismaUniqueConstraintError(error)) {
      throw error;
    }
  }

  const existingEvent = await prisma.stripeWebhookEvent.findUnique({
    where: { id: eventId },
    select: { status: true },
  });

  if (!existingEvent) {
    throw new Error(`Stripe webhook event state missing for ${eventId}`);
  }

  if (existingEvent.status === "failed") {
    const retryClaim = await prisma.stripeWebhookEvent.updateMany({
      where: {
        id: eventId,
        status: "failed",
      },
      data: {
        type: eventType,
        status: "processing",
        processedAt: new Date(),
      },
    });

    if (retryClaim.count === 1) {
      return "process";
    }

    const refreshedEvent = await prisma.stripeWebhookEvent.findUnique({
      where: { id: eventId },
      select: { status: true },
    });

    if (!refreshedEvent) {
      throw new Error(`Stripe webhook event state missing for ${eventId}`);
    }

    return refreshedEvent.status === "processed" ? "processed" : "processing";
  }

  return existingEvent.status === "processed" ? "processed" : "processing";
}

async function finalizeStripeWebhookEvent(eventId: string, status: "processed" | "failed") {
  await prisma.stripeWebhookEvent.update({
    where: { id: eventId },
    data: {
      status,
      processedAt: new Date(),
    },
  });
}

/**
 * Processes a Stripe `checkout.session.completed` webhook event.
 *
 * @param payload   - Raw request body (string) from the webhook route
 * @param signature - Value of the `Stripe-Signature` HTTP header
 */
export async function confirmPayment(
  payload: string,
  signature: string,
): Promise<ConfirmPaymentResult> {
  // 1. AUTHENTICATE — verify Stripe webhook signature
  let event: Stripe.Event;
  try {
    // constructEvent is synchronous — any signature error throws immediately
    event = constructWebhookEvent(payload, signature);
  } catch {
    throw new Error("Invalid Stripe webhook signature");
  }

  // 2. VALIDATE — only handle the event type we care about
  if (event.type !== "checkout.session.completed") {
    throw new Error(`Unhandled Stripe event type: ${event.type}`);
  }

  const session = event.data.object;

  // Extract the invoice ID stored in client_reference_id or metadata
  const invoiceId = session.client_reference_id ?? session.metadata?.invoiceId ?? null;
  if (!invoiceId) {
    throw new Error(
      "Stripe session is missing invoiceId (client_reference_id or metadata.invoiceId)",
    );
  }

  const stripePaymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : (session.payment_intent?.id ?? null);

  if (!stripePaymentIntentId) {
    throw new Error("Stripe session is missing payment_intent");
  }

  const tenantId = session.metadata?.tenantId ?? null;
  if (!tenantId) {
    throw new Error("Stripe session metadata is missing tenantId");
  }

  const webhookState = await claimStripeWebhookEvent(event.id, event.type);

  if (webhookState !== "process") {
    const duplicatePayment = await prisma.payment.findUnique({
      where: { stripePaymentIntentId },
      select: { id: true, invoiceId: true, status: true },
    });

    if (duplicatePayment) {
      return {
        invoiceId: duplicatePayment.invoiceId,
        paymentId: duplicatePayment.id,
        status: toPaymentStatus(duplicatePayment.status),
      };
    }

    return {
      invoiceId,
      paymentId: stripePaymentIntentId,
      status: "pending",
    };
  }

  try {
    // Locate the invoice, always scoped by tenantId
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        tenantId,
        deletedAt: null,
      },
      select: {
        id: true,
        tenantId: true,
        bookingId: true,
        totalAmount: true,
      },
    });

    if (!invoice) {
      throw new Error(`Invoice not found: ${invoiceId}`);
    }

    // 3. IDEMPOTENCY — return early if we already recorded this payment
    const existingPayment = await prisma.payment.findUnique({
      where: { stripePaymentIntentId },
      select: { id: true, status: true },
    });

    if (existingPayment) {
      await finalizeStripeWebhookEvent(event.id, "processed");

      return {
        invoiceId: invoice.id,
        paymentId: existingPayment.id,
        status: toPaymentStatus(existingPayment.status),
      };
    }

    // 4. MUTATE — transactional: create Payment, update Invoice, update Booking
    //
    // The $transaction is wrapped in a try/catch for P2002 to handle a rare
    // TOCTOU race: if two webhook deliveries for the same intent arrive close
    // together, the second create will fail on the unique payment-intent
    // constraint and we fall back to the winner's record.
    const amountPaid = session.amount_total ?? invoice.totalAmount;

    let payment: { id: string };
    try {
      const [createdPayment] = await prisma.$transaction([
        prisma.payment.create({
          data: {
            invoiceId: invoice.id,
            stripePaymentIntentId,
            status: "succeeded",
            amount: amountPaid,
          },
        }),
        prisma.invoice.update({
          where: { id: invoice.id },
          data: { status: "paid" },
        }),
        prisma.booking.update({
          where: { id: invoice.bookingId },
          data: { status: "confirmed" },
        }),
      ]);
      payment = createdPayment;
    } catch (err: unknown) {
      if (isPrismaUniqueConstraintError(err)) {
        const winner = await prisma.payment.findUnique({
          where: { stripePaymentIntentId },
          select: { id: true, status: true },
        });
        if (winner) {
          await finalizeStripeWebhookEvent(event.id, "processed");

          return {
            invoiceId: invoice.id,
            paymentId: winner.id,
            status: toPaymentStatus(winner.status),
          };
        }
      }

      throw err;
    }

    // 5. AUDIT
    await prisma.auditLog.create({
      data: {
        tenantId: invoice.tenantId,
        userId: STRIPE_WEBHOOK_ACTOR,
        action: "CONFIRM_PAYMENT",
        resourceType: "Payment",
        resourceId: payment.id,
        details: JSON.stringify({
          invoiceId: invoice.id,
          bookingId: invoice.bookingId,
          stripePaymentIntentId,
          amount: amountPaid,
        }),
      },
    });

    await finalizeStripeWebhookEvent(event.id, "processed");

    return {
      invoiceId: invoice.id,
      paymentId: payment.id,
      status: "succeeded",
    };
  } catch (error) {
    await finalizeStripeWebhookEvent(event.id, "failed");
    throw error;
  }
}
