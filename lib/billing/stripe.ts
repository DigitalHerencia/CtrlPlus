/**
 * Stripe Client Utility
 *
 * Lazy singleton Stripe instance.
 * Uses STRIPE_SECRET_KEY from environment.
 *
 * API Version: 2023-10-16
 */

import Stripe from "stripe";

let _stripe: Stripe | null = null;

/**
 * Returns the shared Stripe client instance.
 * Throws if STRIPE_SECRET_KEY is not set.
 */
export function getStripeClient(): Stripe {
  if (!_stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY environment variable is not set");
    }
    _stripe = new Stripe(secretKey, {
      apiVersion: "2023-10-16",
    });
  }
  return _stripe;
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
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET environment variable is not set");
  }

  const stripe = getStripeClient();
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}
