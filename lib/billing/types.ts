import { z } from "zod";

// ─── Invoice Status ───────────────────────────────────────────────────────────

export const InvoiceStatus = {
  DRAFT: "draft",
  SENT: "sent",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];

// ─── Payment Status ───────────────────────────────────────────────────────────

export const PaymentStatus = {
  PENDING: "pending",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

// ─── DTOs ─────────────────────────────────────────────────────────────────────

/** A single line item on an invoice. */
export interface BillingItemDTO {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  /** Unit price in cents */
  unitPrice: number;
  /** Total price in cents (quantity × unitPrice) */
  totalPrice: number;
}

/** Read model returned by billing fetchers. Never exposes raw Prisma model. */
export interface InvoiceDTO {
  id: string;
  tenantId: string;
  bookingId: string;
  status: InvoiceStatus;
  /** Total invoice amount in cents */
  totalAmount: number;
  lineItems: BillingItemDTO[];
  createdAt: Date;
  updatedAt: Date;
}

/** Payment record linked to a Stripe PaymentIntent. */
export interface PaymentDTO {
  id: string;
  invoiceId: string;
  stripePaymentIntentId: string;
  status: PaymentStatus;
  /** Payment amount in cents */
  amount: number;
  createdAt: Date;
}

/** Result of creating a Stripe Checkout Session. */
export interface CheckoutSessionDTO {
  id: string;
  url: string;
  invoiceId: string;
  /** Stripe's own payment intent (if available) */
  stripePaymentIntentId: string | null;
  /** Status as returned by Stripe */
  status: string | null;
}

// ─── Prisma Select Helpers ────────────────────────────────────────────────────

export const invoiceLineItemDTOFields = {
  id: true,
  invoiceId: true,
  description: true,
  quantity: true,
  unitPrice: true,
  totalPrice: true,
} as const;

export const invoiceDTOFields = {
  id: true,
  tenantId: true,
  bookingId: true,
  status: true,
  totalAmount: true,
  createdAt: true,
  updatedAt: true,
  lineItems: {
    select: invoiceLineItemDTOFields,
  },
} as const;

export const paymentDTOFields = {
  id: true,
  invoiceId: true,
  stripePaymentIntentId: true,
  status: true,
  amount: true,
  createdAt: true,
} as const;

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

export const createCheckoutSessionSchema = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required"),
  successUrl: z.string().url("Success URL must be a valid URL"),
  cancelUrl: z.string().url("Cancel URL must be a valid URL"),
  customerEmail: z.string().email("Customer email must be valid").optional(),
});

export type CreateCheckoutSessionInput = z.infer<typeof createCheckoutSessionSchema>;

export const getInvoiceSchema = z.object({
  stripeInvoiceId: z.string().min(1, "Stripe invoice ID is required"),
});

export type GetInvoiceInput = z.infer<typeof getInvoiceSchema>;

export const getPaymentStatusSchema = z.object({
  stripePaymentIntentId: z.string().min(1, "Stripe payment intent ID is required"),
});

export type GetPaymentStatusInput = z.infer<typeof getPaymentStatusSchema>;
