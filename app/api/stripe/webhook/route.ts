/**
 * Stripe Webhook Handler
 *
 * Processes payment lifecycle events from Stripe.
 * Handles: checkout.session.completed, payment_intent.succeeded, payment_intent.payment_failed
 *
 * Security:
 * - Webhook signature verified with STRIPE_WEBHOOK_SECRET
 * - Idempotent: StripeWebhookEvent table prevents duplicate processing via atomic create-then-catch
 *
 * IMPORTANT: This route must be public (not protected by middleware).
 * Raw body must be read before any JSON parsing (required for signature verification).
 */

import { prisma } from "@/lib/prisma";
import { constructWebhookEvent } from "@/lib/billing/stripe";
import { InvoiceStatus, PaymentStatus } from "@/lib/billing/types";
import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";

// Sentinel used as the actor in audit logs for webhook-triggered updates
const STRIPE_WEBHOOK_ACTOR = "stripe-webhook";

export async function POST(req: NextRequest) {
  // Read raw body — must happen before any JSON parsing for signature verification
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  // 1. VERIFY signature
  let event: Stripe.Event;
  try {
    event = constructWebhookEvent(payload, signature);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signature verification failed";
    console.error("Stripe webhook signature verification failed:", message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // 2. IDEMPOTENCY — atomically claim the event by writing a "processing" record.
  // If another request already claimed this event ID (unique PK), the DB returns P2002.
  // This eliminates the TOCTOU race window of a separate read-then-write check.
  try {
    await prisma.stripeWebhookEvent.create({
      data: { id: event.id, type: event.type, status: "processing" },
    });
  } catch (err) {
    if (err instanceof Error && "code" in err && (err as { code: string }).code === "P2002") {
      // Already claimed — return 200 to acknowledge receipt without re-processing
      return NextResponse.json({ received: true, duplicate: true });
    }
    throw err;
  }

  // 3. DISPATCH event to the appropriate handler
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        // Acknowledge unhandled events without error
        break;
    }

    // 4. MARK the event as successfully processed
    await prisma.stripeWebhookEvent.update({
      where: { id: event.id },
      data: { status: "processed" },
    });

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(`Stripe webhook handler error for event ${event.id}:`, err);

    // Record the failure for observability (best-effort — don't throw if this fails)
    try {
      await prisma.stripeWebhookEvent.update({
        where: { id: event.id },
        data: { status: "failed" },
      });
    } catch {
      // Ignore — primary error takes precedence
    }

    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns true if the invoice status is terminal and should not be overwritten.
 * Prevents idempotency bugs (e.g., marking a refunded invoice as paid).
 */
function isInvoiceTerminal(status: string): boolean {
  return status === InvoiceStatus.PAID || status === InvoiceStatus.REFUNDED;
}

// ─── Event Handlers ───────────────────────────────────────────────────────────

/**
 * Handle checkout.session.completed
 *
 * Stripe sends this when the customer completes the Checkout flow.
 * The `client_reference_id` field is set to the Invoice ID when the
 * Checkout Session is created, allowing us to correlate the event.
 *
 * Updates Invoice → "paid" and creates/updates Payment → "succeeded".
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const invoiceId = session.client_reference_id;
  if (!invoiceId) {
    console.warn("checkout.session.completed: missing client_reference_id — skipping");
    return;
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  await prisma.$transaction(async (tx) => {
    // Fetch invoice (scoped — no tenantId available in webhook context, so we rely on
    // the invoiceId being an opaque, unguessable cuid)
    const invoice = await tx.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      throw new Error(`Invoice not found: ${invoiceId}`);
    }

    // Idempotent: only update if awaiting payment (not already paid, failed, or refunded)
    if (!isInvoiceTerminal(invoice.status)) {
      await tx.invoice.update({
        where: { id: invoiceId },
        data: { status: InvoiceStatus.PAID },
      });
    }

    // Upsert Payment record if we have a payment intent ID
    if (paymentIntentId) {
      await tx.payment.upsert({
        where: { stripePaymentIntentId: paymentIntentId },
        create: {
          invoiceId,
          stripePaymentIntentId: paymentIntentId,
          status: PaymentStatus.SUCCEEDED,
          amount: session.amount_total ?? invoice.totalAmount,
        },
        update: {
          status: PaymentStatus.SUCCEEDED,
        },
      });
    }

    // Audit log
    await tx.auditLog.create({
      data: {
        tenantId: invoice.tenantId,
        userId: STRIPE_WEBHOOK_ACTOR,
        action: "PAYMENT_SUCCEEDED",
        resourceType: "Invoice",
        resourceId: invoiceId,
        details: JSON.stringify({
          stripeSessionId: session.id,
          paymentIntentId,
          amountTotal: session.amount_total,
        }),
        timestamp: new Date(),
      },
    });
  });
}

/**
 * Handle payment_intent.succeeded
 *
 * Updates Payment → "succeeded" and Invoice → "paid" if not already.
 * The payment record lookup is performed inside the transaction to avoid
 * a stale-read race where a concurrent request updates the status between
 * the outer read and the guard check inside the transaction.
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { stripePaymentIntentId: paymentIntent.id },
      include: { invoice: true },
    });

    if (!payment) {
      // Payment record may not exist yet if checkout.session.completed hasn't fired.
      // This is safe to skip — checkout.session.completed will handle it.
      console.warn(`payment_intent.succeeded: no Payment record for intent ${paymentIntent.id}`);
      return;
    }

    // Idempotent update
    if (payment.status !== PaymentStatus.SUCCEEDED) {
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.SUCCEEDED },
      });
    }

    if (!isInvoiceTerminal(payment.invoice.status)) {
      await tx.invoice.update({
        where: { id: payment.invoiceId },
        data: { status: InvoiceStatus.PAID },
      });
    }

    await tx.auditLog.create({
      data: {
        tenantId: payment.invoice.tenantId,
        userId: STRIPE_WEBHOOK_ACTOR,
        action: "PAYMENT_INTENT_SUCCEEDED",
        resourceType: "Payment",
        resourceId: payment.id,
        details: JSON.stringify({
          stripePaymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
        }),
        timestamp: new Date(),
      },
    });
  });
}

/**
 * Handle payment_intent.payment_failed
 *
 * Updates Payment → "failed" and Invoice → "failed".
 * The payment record lookup is performed inside the transaction to avoid
 * a stale-read race where a concurrent request updates the status between
 * the outer read and the guard check inside the transaction.
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { stripePaymentIntentId: paymentIntent.id },
      include: { invoice: true },
    });

    if (!payment) {
      console.warn(
        `payment_intent.payment_failed: no Payment record for intent ${paymentIntent.id}`,
      );
      return;
    }

    // Idempotent update
    if (payment.status !== PaymentStatus.FAILED) {
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.FAILED },
      });
    }

    if (!isInvoiceTerminal(payment.invoice.status)) {
      await tx.invoice.update({
        where: { id: payment.invoiceId },
        data: { status: InvoiceStatus.FAILED },
      });
    }

    await tx.auditLog.create({
      data: {
        tenantId: payment.invoice.tenantId,
        userId: STRIPE_WEBHOOK_ACTOR,
        action: "PAYMENT_INTENT_FAILED",
        resourceType: "Payment",
        resourceId: payment.id,
        details: JSON.stringify({
          stripePaymentIntentId: paymentIntent.id,
          failureMessage: paymentIntent.last_payment_error?.message ?? null,
        }),
        timestamp: new Date(),
      },
    });
  });
}
