import { z } from "zod";

// ─── Status Literals ──────────────────────────────────────────────────────────

export type InvoiceStatus = "draft" | "sent" | "paid" | "failed" | "refunded";
export type PaymentStatus = "pending" | "succeeded" | "failed";

// ─── DTOs ─────────────────────────────────────────────────────────────────────

/** Lightweight invoice summary returned by the invoice list fetcher. */
export interface InvoiceDTO {
  id: string;
  tenantId: string;
  bookingId: string;
  /** One of: "draft" | "sent" | "paid" | "failed" | "refunded" */
  status: InvoiceStatus;
  /** Total amount in cents (Float stored in DB) */
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

/** A single line item on an invoice. */
export interface InvoiceLineItemDTO {
  id: string;
  description: string;
  quantity: number;
  /** Unit price in cents */
  unitPrice: number;
  /** Total price in cents (quantity × unitPrice) */
  totalPrice: number;
}

/** A payment record linked to an invoice. */
export interface PaymentDTO {
  id: string;
  stripePaymentIntentId: string;
  /** One of: "pending" | "succeeded" | "failed" */
  status: PaymentStatus;
  /** Amount in cents */
  amount: number;
  createdAt: Date;
}

/** Full invoice with line items and payment history, for the detail view. */
export interface InvoiceDetailDTO extends InvoiceDTO {
  lineItems: InvoiceLineItemDTO[];
  payments: PaymentDTO[];
}

/** Paginated invoice list result. */
export interface InvoiceListResult {
  invoices: InvoiceDTO[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Stripe checkout session response. */
export interface CheckoutSessionDTO {
  sessionId: string;
  url: string;
}

// ─── Prisma Select Helpers ────────────────────────────────────────────────────

/** Explicit Prisma `select` for InvoiceDTO fields (no relations). */
export const invoiceDTOFields = {
  id: true,
  tenantId: true,
  bookingId: true,
  status: true,
  totalAmount: true,
  createdAt: true,
  updatedAt: true,
} as const;

/** Explicit Prisma `select` for InvoiceLineItemDTO fields. */
export const invoiceLineItemDTOFields = {
  id: true,
  description: true,
  quantity: true,
  unitPrice: true,
  totalPrice: true,
} as const;

/** Explicit Prisma `select` for PaymentDTO fields. */
export const paymentDTOFields = {
  id: true,
  stripePaymentIntentId: true,
  status: true,
  amount: true,
  createdAt: true,
} as const;

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

export const invoiceListParamsSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  status: z.enum(["draft", "sent", "paid", "failed", "refunded"]).optional(),
});

export type InvoiceListParams = z.infer<typeof invoiceListParamsSchema>;

export const createCheckoutSessionSchema = z.object({
  invoiceId: z.string().min(1),
  successUrl: z.string().url("successUrl must be a valid URL"),
  cancelUrl: z.string().url("cancelUrl must be a valid URL"),
});

export type CreateCheckoutSessionInput = z.infer<typeof createCheckoutSessionSchema>;
