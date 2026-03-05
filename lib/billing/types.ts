import { z } from "zod";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export type InvoiceStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED";
export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

// ---------------------------------------------------------------------------
// DTOs  (what fetchers return — never raw Prisma models)
// ---------------------------------------------------------------------------

export interface InvoiceDTO {
  id: string;
  tenantId: string;
  bookingId: string;
  /**
   * Invoice total in dollars (2 decimal places).
   * Stored as Decimal(10,2) in the database; represented as number in DTOs.
   */
  amount: number;
  status: InvoiceStatus;
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
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
  invoiceId: z.string().min(1, "Invoice ID is required"),
  status: z.enum(["PENDING", "PAID", "FAILED", "CANCELLED"]),
  stripeCheckoutSessionId: z.string().optional(),
  stripePaymentIntentId: z.string().optional(),
});

export type UpdateInvoiceStatusInput = z.infer<
  typeof updateInvoiceStatusSchema
>;

// ---------------------------------------------------------------------------
// Stripe event payload schemas — subset we care about
// ---------------------------------------------------------------------------

export const checkoutSessionCompletedSchema = z.object({
  id: z.string(),
  payment_intent: z.union([z.string(), z.null()]).optional(),
  metadata: z
    .object({
      invoiceId: z.string().optional(),
      bookingId: z.string().optional(),
      tenantId: z.string().optional(),
    })
    .nullable()
    .optional(),
});

export const paymentIntentSucceededSchema = z.object({
  id: z.string(),
  metadata: z
    .object({
      invoiceId: z.string().optional(),
      bookingId: z.string().optional(),
      tenantId: z.string().optional(),
    })
    .nullable()
    .optional(),
});

export type CheckoutSessionCompleted = z.infer<
  typeof checkoutSessionCompletedSchema
>;
export type PaymentIntentSucceeded = z.infer<
  typeof paymentIntentSucceededSchema
>;

// ---------------------------------------------------------------------------
// Action result wrapper
// ---------------------------------------------------------------------------

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; details?: unknown };
