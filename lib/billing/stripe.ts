import Stripe from "stripe";

let _stripe: Stripe | null = null;

/**
 * Returns a lazily-initialised Stripe client.
 *
 * Deferring construction until first use means the module can be imported
 * in environments (e.g. tests) where `STRIPE_SECRET_KEY` is not set, and
 * the real client is only instantiated when an action actually needs it.
 *
 * @throws Error if `STRIPE_SECRET_KEY` is not set at call-time.
 */
export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error(
        "STRIPE_SECRET_KEY environment variable is not set. " +
          "Add it to .env.local to enable Stripe checkout."
      );
    }
    _stripe = new Stripe(key, { apiVersion: "2026-02-25.clover" });
  }
  return _stripe;
}
