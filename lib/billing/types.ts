import { z } from "zod";
import { InvoiceStatus } from "@prisma/client";

// ─── Invoice DTOs ─────────────────────────────────────────────────────────────

export interface InvoiceDTO {
  id: string;
  tenantId: string;
  bookingId: string;
  /** Stored as Decimal in DB; serialised as a string to preserve precision. */
  amount: string;
  status: InvoiceStatus;
  stripeCheckoutSessionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceListResult {
  items: InvoiceDTO[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const invoiceListParamsSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  status: z.nativeEnum(InvoiceStatus).optional(),
});

export type InvoiceListParams = z.infer<typeof invoiceListParamsSchema>;

// ─── Payment Status DTOs ──────────────────────────────────────────────────────

export interface PaymentStatusDTO {
  invoiceId: string;
  status: InvoiceStatus;
  stripeCheckoutSessionId: string | null;
  updatedAt: Date;
}

export interface InvoiceCountByStatusDTO {
  status: InvoiceStatus;
  count: number;
}
