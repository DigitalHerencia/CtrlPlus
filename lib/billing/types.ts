/**
 * Billing Domain - Type Definitions
 *
 * DTOs and Zod schemas for the billing domain.
 * Never expose raw Prisma models - always use these explicit types.
 */

import { z } from "zod";

// ─── Input Schemas ────────────────────────────────────────────────────────────

/**
 * Schema for creating a Stripe Checkout Session.
 * bookingId identifies the booking to invoice.
 * successUrl and cancelUrl are the redirect targets after payment.
 */
export const createCheckoutSessionSchema = z.object({
  bookingId: z.string().min(1, "bookingId is required"),
  successUrl: z.string().url("successUrl must be a valid URL"),
  cancelUrl: z.string().url("cancelUrl must be a valid URL"),
});

export type CreateCheckoutSessionInput = z.infer<typeof createCheckoutSessionSchema>;

/**
 * Schema for confirming a Stripe payment via webhook.
 * payload is the raw request body and signature is the Stripe-Signature header.
 */
export const confirmPaymentSchema = z.object({
  payload: z.string().min(1, "Stripe payload is required"),
  signature: z.string().min(1, "Stripe-Signature header is required"),
});

export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>;

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface InvoiceDTO {
  id: string;
  tenantId: string;
  bookingId: string;
  /** "draft" | "sent" | "paid" | "failed" | "refunded" */
  status: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentDTO {
  id: string;
  invoiceId: string;
  stripePaymentIntentId: string;
  /** "pending" | "succeeded" | "failed" */
  status: string;
  amount: number;
  createdAt: Date;
}

/**
 * Returned by createCheckoutSession.
 * checkoutUrl is the Stripe-hosted payment page the client redirects to.
 */
export interface CheckoutSessionDTO {
  checkoutUrl: string;
  invoiceId: string;
}

/** Returned by confirmPayment after a webhook event is processed. */
export interface ConfirmPaymentResult {
  invoiceId: string;
  paymentId: string;
  /** "succeeded" | "already_processed" */
  status: string;
}
