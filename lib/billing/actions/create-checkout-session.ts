"use server";

import Stripe from "stripe";
import { getSession } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";
import {
  createCheckoutSessionSchema,
  type CreateCheckoutSessionInput,
  type ActionResult,
  type InvoiceDTO,
} from "../types";

// ---------------------------------------------------------------------------
// Stripe client (lazy-initialised to avoid errors when env var is missing)
// ---------------------------------------------------------------------------

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY environment variable is not set. " +
        "Add it to .env.local to enable Stripe checkout."
    );
  }
  return new Stripe(key, { apiVersion: "2026-02-25.clover" });
}

// ---------------------------------------------------------------------------
// createCheckoutSession
// ---------------------------------------------------------------------------

/**
 * Creates a Stripe Checkout session for the given invoice.
 *
 * Security pipeline:
 *  1. Authenticate  – verify session
 *  2. Authorize     – check tenant membership
 *  3. Validate      – parse input with Zod
 *  4. Fetch invoice – verify invoice belongs to tenant
 *  5. Mutate        – create Stripe session + persist sessionId
 *  6. Audit         – log the operation
 *
 * @param input - Validated checkout input
 * @returns ActionResult with Stripe checkout URL or error
 */
export async function createCheckoutSession(
  input: CreateCheckoutSessionInput
): Promise<ActionResult<{ checkoutUrl: string; sessionId: string }>> {
  // 1. AUTHENTICATE
  const { user, tenantId } = await getSession();
  if (!user) {
    return { success: false, error: "Unauthorized: not authenticated" };
  }

  // 2. AUTHORIZE
  await assertTenantMembership(tenantId, user.id, ["owner", "admin", "member"]);

  // 3. VALIDATE
  const parsed = createCheckoutSessionSchema.parse(input);

  // 4. FETCH INVOICE (tenant-scoped)
  const invoice = await prisma.invoice.findFirst({
    where: { id: parsed.invoiceId, tenantId },
  });

  if (!invoice) {
    return {
      success: false,
      error: "Invoice not found or access denied",
    };
  }

  if (invoice.status === "PAID") {
    return { success: false, error: "Invoice has already been paid" };
  }

  if (invoice.status === "CANCELLED") {
    return { success: false, error: "Invoice has been cancelled" };
  }

  // 5. MUTATE – create Stripe Checkout Session
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Invoice #${invoice.id}`,
            description: `Booking ID: ${invoice.bookingId}`,
          },
          unit_amount: Math.round(invoice.amount * 100), // cents
        },
        quantity: 1,
      },
    ],
    success_url: parsed.successUrl,
    cancel_url: parsed.cancelUrl,
    metadata: {
      tenantId,
      invoiceId: invoice.id,
      bookingId: invoice.bookingId,
    },
  });

  if (!session.url) {
    return {
      success: false,
      error: "Stripe did not return a checkout URL",
    };
  }

  // Persist the checkout session ID on the invoice
  await prisma.invoice.update({
    where: { id: invoice.id },
    data: { stripeCheckoutSessionId: session.id },
  });

  // 6. AUDIT
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId: user.id,
      action: "BILLING_CHECKOUT_INITIATED",
      resourceId: invoice.id,
      details: { stripeSessionId: session.id, amount: invoice.amount },
      timestamp: new Date(),
    },
  });

  return {
    success: true,
    data: { checkoutUrl: session.url, sessionId: session.id },
  };
}

// ---------------------------------------------------------------------------
// updateInvoiceStatus  (called from Stripe webhook handler)
// ---------------------------------------------------------------------------

/**
 * Updates the payment status of an invoice.  Intended to be called from
 * the Stripe webhook handler (`app/api/stripe/[...webhook]/route.ts`) after
 * verifying the webhook signature.
 *
 * @param invoiceId - Invoice primary key
 * @param tenantId  - Tenant scope (extracted from Stripe metadata)
 * @param status    - New status
 * @param stripeCheckoutSessionId - Stripe session ID
 * @returns Updated InvoiceDTO
 */
export async function updateInvoiceStatus(
  invoiceId: string,
  tenantId: string,
  status: InvoiceDTO["status"],
  stripeCheckoutSessionId?: string
): Promise<ActionResult<InvoiceDTO>> {
  const record = await prisma.invoice.findFirst({
    where: { id: invoiceId, tenantId },
  });

  if (!record) {
    return { success: false, error: "Invoice not found" };
  }

  const updated = await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      status,
      ...(stripeCheckoutSessionId && { stripeCheckoutSessionId }),
    },
  });

  await prisma.auditLog.create({
    data: {
      tenantId,
      userId: "stripe-webhook",
      action: "BILLING_STATUS_UPDATED",
      resourceId: invoiceId,
      details: { status, stripeCheckoutSessionId },
      timestamp: new Date(),
    },
  });

  return {
    success: true,
    data: {
      id: updated.id,
      tenantId: updated.tenantId,
      bookingId: updated.bookingId,
      amount: updated.amount,
      status: updated.status,
      stripeCheckoutSessionId: updated.stripeCheckoutSessionId,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    },
  };
}
