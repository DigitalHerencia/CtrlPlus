import Stripe from "stripe";

let _stripe: Stripe | null = null;

/**
 * Returns a lazily-initialised Stripe client (v14, API version 2023-10-16).
 * Throws at call-time (not import-time) if STRIPE_SECRET_KEY is absent so
 * that unit tests that mock the module can still import it.
 */
export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY environment variable is not set");
    }
    _stripe = new Stripe(key, { apiVersion: "2023-10-16" });
  }
  return _stripe;
}
