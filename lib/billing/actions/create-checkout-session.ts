"use server";

import { getSession } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";
import { getStripe } from "../stripe";
import {
  createCheckoutSessionSchema,
  type CheckoutSessionDTO,
  type CreateCheckoutSessionInput,
  type InvoiceLineItemDTO,
} from "../types";

type InvoiceLineItemRow = Pick<InvoiceLineItemDTO, "description" | "quantity" | "unitPrice">;

/**
 * Creates a Stripe Checkout Session for the given invoice and returns the
 * hosted-page URL.
 *
 * Security pipeline:
 * 1. Authenticate  — verify user is signed in
 * 2. Authorize     — verify user is a member of the tenant
 * 3. Validate      — parse and validate input with Zod
 * 4. Tenant scope  — confirm the invoice belongs to the current tenant
 * 5. Mutate        — create Stripe Checkout Session
 * 6. Audit         — write an immutable audit event
 */
export async function createCheckoutSession(
  input: CreateCheckoutSessionInput,
): Promise<CheckoutSessionDTO> {
  // 1. AUTHENTICATE
  const { user, tenantId } = await getSession();
  if (!user) throw new Error("Unauthorized: not authenticated");

  // 2. AUTHORIZE — any tenant member can initiate checkout for their invoice
  await assertTenantMembership(tenantId, user.id, "member");

  // 3. VALIDATE
  const parsed = createCheckoutSessionSchema.parse(input);

  // 4. TENANT SCOPE — confirm invoice belongs to this tenant
  const invoice = await prisma.invoice.findFirst({
    where: { id: parsed.invoiceId, tenantId, deletedAt: null },
    select: {
      id: true,
      tenantId: true,
      totalAmount: true,
      status: true,
      lineItems: {
        select: { description: true, quantity: true, unitPrice: true },
      },
    },
  });

  if (!invoice) {
    throw new Error("Forbidden: invoice not found");
  }

  if (invoice.status === "paid") {
    throw new Error("Forbidden: invoice is already paid");
  }

  // Build Stripe line_items from invoice line items (fall back to single total item)
  const lineItems =
    invoice.lineItems.length > 0
      ? invoice.lineItems.map((li: InvoiceLineItemRow) => ({
          price_data: {
            currency: "usd",
            product_data: { name: li.description },
            unit_amount: Math.round(li.unitPrice),
          },
          quantity: li.quantity,
        }))
      : [
          {
            price_data: {
              currency: "usd",
              product_data: { name: `Invoice ${invoice.id}` },
              unit_amount: Math.round(invoice.totalAmount),
            },
            quantity: 1,
          },
        ];

  // Derive base URL server-side to prevent open-redirect attacks.
  // Prefer an explicit env variable so the URL cannot be influenced by a
  // spoofed Host header in edge cases (e.g., misconfigured reverse proxies).
  let baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  if (!baseUrl) {
    const { headers } = await import("next/headers");
    const headersList = await headers();
    const host = headersList.get("host") ?? "localhost:3000";
    const protocol = host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https";
    baseUrl = `${protocol}://${host}`;
  }

  // 5. MUTATE — create Stripe Checkout Session
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    client_reference_id: invoice.id, // used by webhook to correlate payment
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

  // 6. AUDIT
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId: user.id,
      action: "CREATE_CHECKOUT_SESSION",
      resourceType: "Invoice",
      resourceId: invoice.id,
      details: JSON.stringify({ sessionId: session.id }),
      timestamp: new Date(),
    },
  });

  return { sessionId: session.id, url: session.url };
}
