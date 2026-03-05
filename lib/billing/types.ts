/**
 * Billing domain types and DTOs
 *
 * This module defines all Data Transfer Objects (DTOs) and Zod validation
 * schemas used by the billing domain. Raw Stripe and Prisma models are never
 * exported outside lib/billing – callers always receive explicit DTOs.
 */

import { z } from "zod";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

/** Normalised payment / invoice status shared across Stripe and our DB layer. */
export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

// ---------------------------------------------------------------------------
// DTOs (read models returned from fetchers / actions)
// ---------------------------------------------------------------------------

/** A single line item inside a checkout session or invoice. */
export interface BillingItemDTO {
  /** Stripe Price ID or internal line-item ID */
  id: string;
  name: string;
  description?: string;
  /** Amount in the smallest currency unit (e.g. cents for USD) */
  unitAmount: number;
  /** ISO 4217 currency code, lower-case (e.g. "usd") */
  currency: string;
  quantity: number;
}

/** Minimal representation of a Stripe Checkout Session returned to callers. */
export interface CheckoutSessionDTO {
  /** Stripe Session ID (e.g. "cs_live_...") */
  id: string;
  /** Stripe-hosted payment URL – null once the session has expired */
  url: string | null;
  /** Stripe session status: "open" | "complete" | "expired" */
  status: string | null;
  /** Stripe payment_status: "paid" | "unpaid" | "no_payment_required" */
  paymentStatus: string;
  /** Total amount charged, in the smallest currency unit */
  amountTotal: number | null;
  /** ISO 4217 currency code, lower-case */
  currency: string | null;
  /** Internal tenant identifier – never sourced from the client */
  tenantId: string;
  createdAt: Date;
  /** Unix timestamp (seconds) at which the session expires */
  expiresAt: Date;
}

/** Full invoice record returned from the database layer. */
export interface InvoiceDTO {
  id: string;
  tenantId: string;
  status: PaymentStatus;
  /** Total amount in the smallest currency unit */
  amountTotal: number;
  /** ISO 4217 currency code, lower-case */
  currency: string;
  items: BillingItemDTO[];
  createdAt: Date;
  paidAt?: Date;
  /** Optional reference back to the originating Stripe Invoice */
  stripeInvoiceId?: string;
  /** Optional reference back to the originating Stripe Payment Intent */
  stripePaymentIntentId?: string;
}

/** Summary of a customer's current billing state (used in admin dashboards). */
export interface BillingStatusDTO {
  tenantId: string;
  hasActiveSubscription: boolean;
  currentPeriodEnd?: Date;
  /** Latest invoice, if any */
  lastInvoice?: Pick<
    InvoiceDTO,
    "id" | "status" | "amountTotal" | "currency" | "createdAt"
  >;
}

// ---------------------------------------------------------------------------
// Zod validation schemas (used by server actions for input sanitisation)
// ---------------------------------------------------------------------------

/** A single line item submitted when creating a checkout session. */
export const billingLineItemSchema = z.object({
  name: z.string().min(1, "Item name is required").max(200),
  description: z.string().max(500).optional(),
  /** Must be a positive integer (smallest currency unit). */
  unitAmount: z
    .number()
    .int()
    .positive("Unit amount must be a positive integer"),
  /** Lower-case ISO 4217 code, exactly 3 characters. */
  currency: z
    .string()
    .length(3, "Currency must be a 3-character ISO 4217 code")
    .toLowerCase(),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
});

export type BillingLineItemInput = z.infer<typeof billingLineItemSchema>;

/** Input schema for creating a Stripe Checkout Session. */
export const createCheckoutSessionSchema = z.object({
  items: z
    .array(billingLineItemSchema)
    .min(1, "At least one line item is required"),
  successUrl: z.string().url("successUrl must be a valid URL"),
  cancelUrl: z.string().url("cancelUrl must be a valid URL"),
  customerEmail: z
    .string()
    .email("customerEmail must be a valid email")
    .optional(),
});

export type CreateCheckoutSessionInput = z.infer<
  typeof createCheckoutSessionSchema
>;

/** Input schema for retrieving payment status. */
export const getPaymentStatusSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
});

export type GetPaymentStatusInput = z.infer<typeof getPaymentStatusSchema>;
