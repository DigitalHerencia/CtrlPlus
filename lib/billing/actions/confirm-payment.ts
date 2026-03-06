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

import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/billing/stripe";
import { type ConfirmPaymentResult } from "../types";

/**
 * Sentinel userId written to AuditLog entries that originate from the
 * Stripe webhook (no human actor).
 */
export const STRIPE_WEBHOOK_ACTOR = "system:stripe-webhook";

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
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
  }

  let event: Stripe.Event;
  try {
    // constructEvent is synchronous — any signature error throws immediately
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch {
    throw new Error("Invalid Stripe webhook signature");
  }

  // 2. VALIDATE — only handle the event type we care about
  if (event.type !== "checkout.session.completed") {
    throw new Error(`Unhandled Stripe event type: ${event.type}`);
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Extract the invoice ID stored in client_reference_id or metadata
  const invoiceId =
    session.client_reference_id ?? session.metadata?.invoiceId ?? null;
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
    return {
      invoiceId: invoice.id,
      paymentId: existingPayment.id,
      status: "already_processed",
    };
  }

  // 4. MUTATE — transactional: create Payment, update Invoice, update Booking
  const amountPaid = session.amount_total ?? invoice.totalAmount;

  const [payment] = await prisma.$transaction([
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

  return {
    invoiceId: invoice.id,
    paymentId: payment.id,
    status: "succeeded",
  };
}
