import { z } from "zod";

// ─── Invoice Status ───────────────────────────────────────────────────────────

export const INVOICE_STATUSES = [
  "draft",
  "sent",
  "paid",
  "failed",
  "refunded",
] as const;

export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

// ─── Payment Status ───────────────────────────────────────────────────────────

export const PAYMENT_STATUSES = ["pending", "succeeded", "failed"] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

// ─── DTOs ─────────────────────────────────────────────────────────────────────

/** A single invoice line item. Never exposes raw Prisma model. */
export interface InvoiceLineItemDTO {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  /** Unit price in cents */
  unitPrice: number;
  /** Total price in cents */
  totalPrice: number;
}

/** A payment record linked to an invoice. Never exposes raw Prisma model. */
export interface PaymentDTO {
  id: string;
  invoiceId: string;
  stripePaymentIntentId: string;
  status: PaymentStatus;
  /** Amount in cents */
  amount: number;
  createdAt: Date;
}

/** Summary invoice returned by list fetchers. */
export interface InvoiceDTO {
  id: string;
  tenantId: string;
  bookingId: string;
  status: InvoiceStatus;
  /** Total amount in cents */
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

/** Full invoice with line items and payments, returned by getInvoiceById. */
export interface InvoiceDetailDTO extends InvoiceDTO {
  lineItems: InvoiceLineItemDTO[];
  payments: PaymentDTO[];
}

/** Paginated result from getInvoicesForTenant. */
export interface InvoiceListResult {
  items: InvoiceDTO[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Prisma Select Helpers ────────────────────────────────────────────────────

/** Explicit Prisma `select` object for InvoiceDTO fields (no relations). */
export const invoiceDTOFields = {
  id: true,
  tenantId: true,
  bookingId: true,
  status: true,
  totalAmount: true,
  createdAt: true,
  updatedAt: true,
} as const;

/** Explicit Prisma `select` object for InvoiceLineItemDTO fields. */
export const lineItemDTOFields = {
  id: true,
  invoiceId: true,
  description: true,
  quantity: true,
  unitPrice: true,
  totalPrice: true,
} as const;

/** Explicit Prisma `select` object for PaymentDTO fields. */
export const paymentDTOFields = {
  id: true,
  invoiceId: true,
  stripePaymentIntentId: true,
  status: true,
  amount: true,
  createdAt: true,
} as const;

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

export const invoiceListParamsSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  status: z.enum(INVOICE_STATUSES).optional(),
});

export type InvoiceListParams = z.infer<typeof invoiceListParamsSchema>;
