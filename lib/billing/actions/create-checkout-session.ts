"use server";

import { getSession } from "@/lib/auth/session";
import { hasCapability } from "@/lib/authz/policy";
import { getAppBaseUrl, getStripeClient } from "@/lib/billing/stripe";
import { prisma } from "@/lib/prisma";
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

export async function createCheckoutSession(rawInput: {
  invoiceId: string;
}): Promise<CheckoutSessionDTO> {
  const session = await getSession();
  const userId = session.userId;
  if (!session.isAuthenticated || !userId) throw new Error("Unauthorized: not authenticated");

  const { invoiceId } = checkoutInputSchema.parse(rawInput);

  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, deletedAt: null },
    select: {
      id: true,
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

  const canManageAllBilling = hasCapability(session.authz, "billing.write.all");

  if (invoice.booking.customerId !== userId && !canManageAllBilling) {
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

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    client_reference_id: invoice.id,
    success_url: `${baseUrl}/billing/${invoice.id}?payment=success`,
    cancel_url: `${baseUrl}/billing/${invoice.id}?payment=cancelled`,
    metadata: {
      invoiceId: invoice.id,
    },
  });

  if (!checkoutSession.url) {
    throw new Error("Stripe did not return a checkout URL");
  }

  await prisma.auditLog.create({
    data: {
      userId,
      action: "CREATE_CHECKOUT_SESSION",
      resourceType: "Invoice",
      resourceId: invoice.id,
      details: JSON.stringify({ sessionId: checkoutSession.id }),
      timestamp: new Date(),
    },
  });

  return { sessionId: checkoutSession.id, url: checkoutSession.url, invoiceId: invoice.id };
}
