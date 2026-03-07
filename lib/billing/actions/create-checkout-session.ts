"use server";

import { getSession } from "@/lib/auth/session";
import { getAppBaseUrl, getStripeClient } from "@/lib/billing/stripe";
import { prisma } from "@/lib/prisma";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { z } from "zod";
import { type CheckoutSessionDTO, type InvoiceLineItemDTO } from "../types";

type InvoiceLineItemRow = Pick<InvoiceLineItemDTO, "description" | "quantity" | "unitPrice">;
const checkoutInputSchema = z.object({
  invoiceId: z.string().min(1),
});

function toStripeAmount(cents: number): number {
  if (!Number.isFinite(cents)) {
    throw new Error("Invalid invoice amount");
  }

  return Math.round(cents);
}

/**
 * Creates a Stripe Checkout Session for the given invoice and returns the
 * hosted-page URL.
 */
export async function createCheckoutSession(rawInput: {
  invoiceId: string;
}): Promise<CheckoutSessionDTO> {
  const { tenantId, userId } = await getSession();
  if (!tenantId || !userId) throw new Error("Unauthorized: not authenticated");

  await assertTenantMembership(tenantId, userId);

  const { invoiceId } = checkoutInputSchema.parse(rawInput);

  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, tenantId, deletedAt: null },
    select: {
      id: true,
      tenantId: true,
      totalAmount: true,
      status: true,
      booking: {
        select: {
          customerId: true,
        },
      },
      lineItems: {
        select: { description: true, quantity: true, unitPrice: true },
      },
    },
  });

  if (!invoice) {
    throw new Error("Forbidden: invoice not found");
  }

  if (invoice.booking.customerId !== userId) {
    throw new Error("Forbidden: user cannot pay this invoice");
  }

  if (invoice.status === "paid") {
    throw new Error("Forbidden: invoice is already paid");
  }

  const lineItems =
    invoice.lineItems.length > 0
      ? invoice.lineItems.map((li: InvoiceLineItemRow) => ({
          price_data: {
            currency: "usd",
            product_data: { name: li.description },
            unit_amount: toStripeAmount(li.unitPrice),
          },
          quantity: li.quantity,
        }))
      : [
          {
            price_data: {
              currency: "usd",
              product_data: { name: `Invoice ${invoice.id}` },
              unit_amount: toStripeAmount(invoice.totalAmount),
            },
            quantity: 1,
          },
        ];

  const baseUrl = getAppBaseUrl();
  const stripe = getStripeClient();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    client_reference_id: invoice.id,
    success_url: `${baseUrl}/billing/${invoice.id}?payment=success`,
    cancel_url: `${baseUrl}/billing/${invoice.id}?payment=cancelled`,
    metadata: {
      invoiceId: invoice.id,
      tenantId,
    },
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL");
  }

  await prisma.auditLog.create({
    data: {
      tenantId,
      userId,
      action: "CREATE_CHECKOUT_SESSION",
      resourceType: "Invoice",
      resourceId: invoice.id,
      details: JSON.stringify({ sessionId: session.id }),
      timestamp: new Date(),
    },
  });

  return { sessionId: session.id, url: session.url, invoiceId: invoice.id };
}
