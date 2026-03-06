/**
 * Stripe Client
 *
 * Provides a lazy singleton Stripe instance configured for the CtrlPlus platform.
 * Call `getStripeClient()` wherever Stripe API calls are needed.
 *
 * The client is created on first access to avoid throwing at module import
 * time in environments where STRIPE_SECRET_KEY is not set (e.g., tests, CI,
 * non-billing route handlers).
 *
 * Requires STRIPE_SECRET_KEY in the environment.
 */

import Stripe from "stripe";

let stripeClient: Stripe | null = null;

/**
 * Returns the shared Stripe client instance, creating it on first call.
 * Throws if STRIPE_SECRET_KEY is not set.
 */
export function getStripeClient(): Stripe {
  if (!stripeClient) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error(
        "STRIPE_SECRET_KEY is not defined. Please set it in your .env.local file.",
      );
    }
    stripeClient = new Stripe(secretKey, {
      apiVersion: "2023-10-16",
    });
  }
  return stripeClient;
}
