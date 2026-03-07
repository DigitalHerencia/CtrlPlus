/**
 * Stripe Client Utility
 *
 * Lazy singleton Stripe instance.
 * Uses STRIPE_SECRET_KEY from environment.
 *
 * API Version: 2026-02-25.clover
 */

import Stripe from "stripe";

const STRIPE_API_VERSION: Stripe.LatestApiVersion = "2026-02-25.clover";

let _stripe: Stripe | null = null;

function getRequiredEnv(name: "STRIPE_SECRET_KEY" | "STRIPE_WEBHOOK_SECRET"): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} environment variable is not set`);
  }

  return value;
}

/**
 * Returns the shared Stripe client instance.
 * Throws if STRIPE_SECRET_KEY is not set.
 */
export function getStripeClient(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(getRequiredEnv("STRIPE_SECRET_KEY"), {
      apiVersion: STRIPE_API_VERSION,
    });
  }

  return _stripe;
}

/**
 * Returns the canonical server base URL used for checkout redirects.
 * Throws if NEXT_PUBLIC_APP_URL is not configured or is not a valid URL.
 */
export function getAppBaseUrl(): string {
  const rawBaseUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (!rawBaseUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL environment variable is not set");
  }

  try {
    return new URL(rawBaseUrl).origin;
  } catch {
    throw new Error("NEXT_PUBLIC_APP_URL must be a valid absolute URL");
  }
}

/**
 * Constructs and verifies a Stripe webhook event from the raw request body.
 *
 * @param payload - Raw request body as a string
 * @param signature - Value of the `stripe-signature` header
 * @returns Verified Stripe Event object
 * @throws If signature verification fails or STRIPE_WEBHOOK_SECRET is not set
 */
export function constructWebhookEvent(payload: string, signature: string): Stripe.Event {
  const stripe = getStripeClient();
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    getRequiredEnv("STRIPE_WEBHOOK_SECRET"),
  );
}
