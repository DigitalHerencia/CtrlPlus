import { z } from "zod";

// ─── Status Constants ─────────────────────────────────────────────────────────

export const InvoiceStatus = {
  DRAFT: "draft",
  SENT: "sent",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];

export const PaymentStatus = {
  PENDING: "pending",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface InvoiceLineItemDTO {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface InvoiceDTO {
  id: string;
  bookingId: string;
  status: InvoiceStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceDetailDTO extends InvoiceDTO {
  lineItems: InvoiceLineItemDTO[];
  payments: PaymentDTO[];
}

export interface PaymentDTO {
  id: string;
  invoiceId: string;
  stripePaymentIntentId: string;
  status: PaymentStatus;
  amount: number;
  createdAt: Date;
}

// ─── Prisma Select Helpers ────────────────────────────────────────────────────

export const invoiceDTOFields = {
  id: true,
  bookingId: true,
  status: true,
  totalAmount: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const paymentDTOFields = {
  id: true,
  invoiceId: true,
  stripePaymentIntentId: true,
  status: true,
  amount: true,
  createdAt: true,
} as const;

export const invoiceLineItemDTOFields = {
  id: true,
  description: true,
  quantity: true,
  unitPrice: true,
  totalPrice: true,
} as const;

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

export const invoiceListParamsSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  status: z.enum(["draft", "sent", "paid", "failed", "refunded"]).optional(),
});

export type InvoiceListParams = z.infer<typeof invoiceListParamsSchema>;

export interface InvoiceListResult {
  invoices: InvoiceDTO[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Checkout ─────────────────────────────────────────────────────────────────

export interface CheckoutSessionDTO {
  sessionId: string;
  url: string;
  invoiceId: string;
}

export interface ConfirmPaymentResult {
  invoiceId: string;
  paymentId: string;
  status: "pending" | "succeeded" | "failed";
}
