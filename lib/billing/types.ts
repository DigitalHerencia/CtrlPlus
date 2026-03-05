import { z } from "zod";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export type InvoiceStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED";
export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

// ---------------------------------------------------------------------------
// DTOs
// ---------------------------------------------------------------------------

export interface InvoiceDTO {
  id: string;
  tenantId: string;
  bookingId: string;
  amount: string;
  status: InvoiceStatus;
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Stripe event payloads — subset we care about
// ---------------------------------------------------------------------------

export const checkoutSessionCompletedSchema = z.object({
  id: z.string(),
  payment_intent: z.string().nullable().optional(),
  metadata: z
    .object({
      invoiceId: z.string().optional(),
      bookingId: z.string().optional(),
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
