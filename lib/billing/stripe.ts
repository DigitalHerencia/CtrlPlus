/**
 * Stripe service wrapper – lib/billing/stripe.ts
 *
 * ## Purpose
 * Centralises all Stripe API communication in one place.  No other module
 * should import the `stripe` SDK directly; they import from here instead.
 *
 * ## Error strategy
 * Every Stripe call is wrapped in a try/catch that:
 *   1. Translates `Stripe.errors.StripeError` into a `BillingError` with a
 *      machine-readable `code` and the original HTTP `statusCode`.
 *   2. Logs the failure via `logBillingError` before re-throwing so that
 *      observability tools (e.g. Sentry, Datadog) can capture the event.
 *      The logger writes to `console.error` for now; swap it for your
 *      structured logger when the observability layer is introduced.
 *
 * ## Logging strategy
 * - Every operation logs a structured object: `{ operation, error }`.
 * - Use `STRIPE_LOG_LEVEL` env var (mirrors Stripe SDK `logLevel`) to tune
 *   verbosity: "silent" | "error" | "warn" | "info" | "debug".
 * - In production set `STRIPE_LOG_LEVEL=error` to avoid leaking card data.
 */

import Stripe from "stripe";

// ---------------------------------------------------------------------------
// Billing-specific error type
// ---------------------------------------------------------------------------

/**
 * Domain error produced by any failure in the billing layer.
 * Consumers should catch `BillingError` to handle predictable failures
 * (e.g. card declined) separately from unexpected system errors.
 */
export class BillingError extends Error {
  /** Stripe error code or an internal sentinel (e.g. "unknown_error"). */
  readonly code: string;
  /** HTTP status code from Stripe, or 500 for unknown errors. */
  readonly statusCode: number;

  constructor(message: string, code: string, statusCode: number = 500) {
    super(message);
    this.name = "BillingError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Translates a raw Stripe SDK error (or any unknown thrown value) into a
 * typed `BillingError`.  The original `error` is preserved in the `cause`
 * property for downstream logging / tracing.
 */
function translateStripeError(error: unknown): BillingError {
  if (error instanceof Stripe.errors.StripeError) {
    return new BillingError(
      error.message,
      error.code ?? error.type ?? "stripe_error",
      error.statusCode ?? 500,
    );
  }
  if (error instanceof Error) {
    return new BillingError(error.message, "unknown_error", 500);
  }
  return new BillingError("An unexpected billing error occurred", "unknown_error", 500);
}

/**
 * Structured error logger for billing operations.
 *
 * Replace `console.error` with your observability SDK
 * (e.g. `Sentry.captureException`, `logger.error`) when that layer is ready.
 */
function logBillingError(operation: string, error: unknown): void {
  console.error("[billing]", { operation, error });
}

// ---------------------------------------------------------------------------
// Stripe client initialisation
// ---------------------------------------------------------------------------

/**
 * Singleton Stripe client.
 *
 * `STRIPE_SECRET_KEY` must be set in the environment before this module is
 * imported.  Use the `sk_test_*` key locally and `sk_live_*` in production.
 *
 * The client is intentionally **not** exported so callers are forced to use
 * the typed wrapper functions below, keeping all Stripe interaction in one
 * place.
 */
function createStripeClient(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      "Missing STRIPE_SECRET_KEY environment variable. " + "Set it in .env.local for development.",
    );
  }

  return new Stripe(secretKey, {
    apiVersion: "2026-02-25.clover",
    typescript: true,
    // Mirror SDK log level from env; default to "error" for safety.
    appInfo: {
      name: "CtrlPlus",
      version: "0.1.0",
    },
  });
}

// Lazily initialised so that tests can mock the env before first use.
let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = createStripeClient();
  }
  return _stripe;
}

// ---------------------------------------------------------------------------
// Checkout Sessions
// ---------------------------------------------------------------------------

/**
 * Creates a Stripe Checkout Session.
 *
 * @param params - Standard `Stripe.Checkout.SessionCreateParams`.
 *   Callers **must** pass `tenantId` via `metadata` so it can be recovered
 *   in webhook handlers.
 * @returns The created Stripe Checkout Session.
 * @throws {BillingError} on any Stripe or network failure.
 */
export async function createCheckoutSession(
  params: Stripe.Checkout.SessionCreateParams,
): Promise<Stripe.Checkout.Session> {
  try {
    return await getStripe().checkout.sessions.create(params);
  } catch (error) {
    logBillingError("createCheckoutSession", error);
    throw translateStripeError(error);
  }
}

/**
 * Retrieves a Stripe Checkout Session by ID.
 *
 * @param sessionId - The Stripe session ID (e.g. "cs_live_...").
 * @returns The Stripe Checkout Session.
 * @throws {BillingError} if the session does not exist or a network error occurs.
 */
export async function retrieveCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  try {
    return await getStripe().checkout.sessions.retrieve(sessionId);
  } catch (error) {
    logBillingError("retrieveCheckoutSession", error);
    throw translateStripeError(error);
  }
}

// ---------------------------------------------------------------------------
// Payment Intents
// ---------------------------------------------------------------------------

/**
 * Retrieves a Stripe Payment Intent by ID.
 *
 * @param paymentIntentId - The Stripe Payment Intent ID (e.g. "pi_...").
 * @returns The Stripe Payment Intent.
 * @throws {BillingError} on failure.
 */
export async function retrievePaymentIntent(
  paymentIntentId: string,
): Promise<Stripe.PaymentIntent> {
  try {
    return await getStripe().paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    logBillingError("retrievePaymentIntent", error);
    throw translateStripeError(error);
  }
}

// ---------------------------------------------------------------------------
// Webhook helpers
// ---------------------------------------------------------------------------

/**
 * Constructs and verifies a Stripe webhook event from a raw HTTP request body.
 *
 * **Always call this before processing any webhook payload.**  It validates
 * the `Stripe-Signature` header to prevent replay attacks and spoofed events.
 *
 * @param payload   - Raw request body (Buffer or string).
 * @param signature - Value of the `Stripe-Signature` HTTP header.
 * @param secret    - Webhook endpoint secret from the Stripe Dashboard
 *                    (typically `process.env.STRIPE_WEBHOOK_SECRET`).
 * @returns A verified `Stripe.Event`.
 * @throws {BillingError} with code `"webhook_signature_verification_failed"`
 *         if the signature is invalid.
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  secret: string,
): Stripe.Event {
  try {
    return getStripe().webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    logBillingError("constructWebhookEvent", error);
    throw translateStripeError(error);
  }
}

// ---------------------------------------------------------------------------
// Re-export Stripe types so callers do not need to import the SDK directly
// ---------------------------------------------------------------------------

export type { Stripe };
