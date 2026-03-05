"use server";

import { getSession } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";
import { getStripe } from "../stripe";
import {
  createCheckoutSessionSchema,
  type CreateCheckoutSessionInput,
  type ActionResult,
  type InvoiceDTO,
} from "../types";

/** Sentinel user ID used in audit logs for operations triggered by the Stripe webhook (system actor). */
const STRIPE_WEBHOOK_ACTOR = "system:stripe-webhook";

// ---------------------------------------------------------------------------
// createCheckoutSession
// ---------------------------------------------------------------------------

/**
 * Creates a Stripe Checkout session for the given invoice.
 *
 * Security pipeline:
 *  1. Authenticate  – verify session, reject unauthenticated callers
 *  2. Authorize     – check tenant membership (any role may initiate checkout)
 *  3. Validate      – parse & validate input with Zod
 *  4. Fetch invoice – verify invoice belongs to tenant (tenant-ownership check)
 *  5. Mutate        – create Stripe session and persist sessionId on invoice
 *  6. Audit         – log the checkout initiation
 *
 * @param input - Validated checkout input (invoiceId + redirect URLs)
 * @returns ActionResult with the Stripe checkout URL and session ID on success
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

  // 4. FETCH INVOICE — tenant-ownership check (cross-tenant access silently returns 404)
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

  // 5. MUTATE — create Stripe Checkout session
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
          // Convert dollars to cents; guard against floating-point drift
          unit_amount: Math.round(invoice.amount * 100),
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

  // Persist the checkout session ID on the invoice record
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
      details: {
        stripeSessionId: session.id,
        amount: invoice.amount,
      },
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
 * Updates the payment status of an invoice.
 *
 * Intended to be called from the Stripe webhook handler after signature
 * verification.  The `tenantId` here is extracted from the Stripe session
 * metadata (never from the client).
 *
 * @param invoiceId               - Invoice primary key
 * @param tenantId                - Tenant scope (from Stripe metadata)
 * @param status                  - New invoice status
 * @param stripeCheckoutSessionId - Stripe checkout session ID (optional)
 * @returns ActionResult with the updated InvoiceDTO
 */
export async function updateInvoiceStatus(
  invoiceId: string,
  tenantId: string,
  status: InvoiceDTO["status"],
  stripeCheckoutSessionId?: string
): Promise<ActionResult<InvoiceDTO>> {
  // Tenant-ownership check: reject if invoice does not belong to tenantId
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
      userId: STRIPE_WEBHOOK_ACTOR,
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
      status: updated.status as InvoiceDTO["status"],
      stripeCheckoutSessionId: updated.stripeCheckoutSessionId,
      stripePaymentIntentId: updated.stripePaymentIntentId,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    },
  };
}
