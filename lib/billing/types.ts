import { z } from "zod";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export type InvoiceStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED";

// ---------------------------------------------------------------------------
// DTOs  (what fetchers return — never raw Prisma models)
// ---------------------------------------------------------------------------

export interface InvoiceDTO {
  id: string;
  tenantId: string;
  bookingId: string;
  /** Invoice total in dollars (2 decimal places) */
  amount: number;
  status: InvoiceStatus;
  stripeCheckoutSessionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Zod schemas  (used for server-action input validation)
// ---------------------------------------------------------------------------

export const createCheckoutSessionSchema = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required"),
  successUrl: z.string().url("successUrl must be a valid URL"),
  cancelUrl: z.string().url("cancelUrl must be a valid URL"),
});

export type CreateCheckoutSessionInput = z.infer<
  typeof createCheckoutSessionSchema
>;

export const updateInvoiceStatusSchema = z.object({
  invoiceId: z.string().min(1),
  status: z.enum(["PENDING", "PAID", "FAILED", "CANCELLED"]),
  stripeCheckoutSessionId: z.string().optional(),
});

export type UpdateInvoiceStatusInput = z.infer<
  typeof updateInvoiceStatusSchema
>;

// ---------------------------------------------------------------------------
// Action result wrapper
// ---------------------------------------------------------------------------

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; details?: unknown };
