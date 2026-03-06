"use server";

/**
 * createCheckoutSession
 *
 * Creates a Stripe Checkout Session for a given booking and returns the
 * hosted payment URL. An Invoice record is created (or reused) as the
 * persistent representation of the charge.
 *
 * Security pipeline:
 * 1. Authenticate  — verify user is signed in
 * 2. Authorize     — verify user is an active member of the tenant
 * 3. Validate      — parse and validate input with Zod
 * 4. Mutate        — look up booking, create/reuse invoice, call Stripe
 * 5. Audit         — write an immutable audit log entry
 */

import { getSession } from "@/lib/auth/session";
import { assertTenantMembership, assertTenantScope, getUserTenantRole } from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/billing/stripe";
import {
  createCheckoutSessionSchema,
  type CreateCheckoutSessionInput,
  type CheckoutSessionDTO,
} from "../types";

export async function createCheckoutSession(
  input: CreateCheckoutSessionInput,
): Promise<CheckoutSessionDTO> {
  // 1. AUTHENTICATE
  const { user, tenantId } = await getSession();
  if (!user) throw new Error("Unauthorized: not authenticated");

  // 2. AUTHORIZE — any active member may initiate checkout for their booking
  await assertTenantMembership(tenantId, user.id, "member");

  // 3. VALIDATE
  const parsed = createCheckoutSessionSchema.parse(input);

  // 4a. LOOK UP BOOKING — always scoped by tenantId
  const booking = await prisma.booking.findFirst({
    where: {
      id: parsed.bookingId,
      tenantId,
      deletedAt: null,
    },
    select: {
      id: true,
      tenantId: true,
      customerId: true,
      status: true,
      totalPrice: true,
      wrap: {
        select: { name: true },
      },
    },
  });

  if (!booking) {
    throw new Error("Booking not found or access denied");
  }

  // Defensive tenant scope check
  assertTenantScope(booking.tenantId, tenantId);

  // Members may only checkout their own bookings; admins and owners may act on any
  const role = await getUserTenantRole(tenantId, user.id);
  if (role === "member" && booking.customerId !== user.id) {
    throw new Error("Forbidden: you can only checkout your own bookings");
  }

  if (booking.status !== "pending") {
    throw new Error(
      `Cannot create checkout for booking with status: ${booking.status}`,
    );
  }

  // 4b. CREATE OR REUSE INVOICE
  let invoice = await prisma.invoice.findUnique({
    where: { bookingId: parsed.bookingId },
  });

  if (!invoice) {
    invoice = await prisma.invoice.create({
      data: {
        tenantId,
        bookingId: parsed.bookingId,
        status: "draft",
        totalAmount: booking.totalPrice,
        lineItems: {
          create: [
            {
              description: booking.wrap?.name ?? "Vehicle Wrap Installation",
              quantity: 1,
              unitPrice: booking.totalPrice,
              totalPrice: booking.totalPrice,
            },
          ],
        },
      },
    });
  }

  // 4c. CREATE STRIPE CHECKOUT SESSION
  //
  // client_reference_id is set to the invoice ID so that the webhook can
  // locate the invoice without a separate lookup table.
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    client_reference_id: invoice.id,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: booking.wrap?.name ?? "Vehicle Wrap Installation",
          },
          // totalPrice is stored as a Float in cents; Math.round guards against
          // any floating-point drift before passing to Stripe's integer API.
          unit_amount: Math.round(booking.totalPrice),
        },
        quantity: 1,
      },
    ],
    success_url: parsed.successUrl,
    cancel_url: parsed.cancelUrl,
    metadata: {
      tenantId,
      invoiceId: invoice.id,
      bookingId: parsed.bookingId,
    },
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL");
  }

  // Mark invoice as sent now that the Stripe session exists
  await prisma.invoice.update({
    where: { id: invoice.id },
    data: { status: "sent" },
  });

  // 5. AUDIT
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId: user.id,
      action: "CREATE_CHECKOUT_SESSION",
      resourceType: "Invoice",
      resourceId: invoice.id,
      details: JSON.stringify({
        bookingId: parsed.bookingId,
        invoiceId: invoice.id,
        stripeSessionId: session.id,
        totalAmount: booking.totalPrice,
      }),
    },
  });

  return {
    checkoutUrl: session.url,
    invoiceId: invoice.id,
  };
}
