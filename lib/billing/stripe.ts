/**
 * Stripe Client
 *
 * Singleton Stripe instance configured for the CtrlPlus platform.
 * Import this wherever Stripe API calls are needed.
 *
 * Requires STRIPE_SECRET_KEY in the environment.
 */

import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "STRIPE_SECRET_KEY is not defined. Please set it in your .env.local file.",
  );
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});
