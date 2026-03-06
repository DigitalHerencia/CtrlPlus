/**
 * Stripe Service Wrapper
 *
 * Provides type-safe wrapper functions around the Stripe API.
 * The Stripe client is initialized lazily using the STRIPE_SECRET_KEY env variable.
 *
 * All functions wrap Stripe errors in descriptive Error objects so callers
 * never receive raw Stripe SDK exceptions.
 */

import Stripe from "stripe";
import {
  type CheckoutSessionDTO,
  type CreateCheckoutSessionInput,
  type PaymentStatus,
} from "./types";

// ─── Client Singleton ─────────────────────────────────────────────────────────

let _stripe: Stripe | null = null;

/**
 * Returns the lazily-initialized Stripe client.
 * Throws a clear error if STRIPE_SECRET_KEY is not set.
 */
function getStripeClient(): Stripe {
  if (_stripe) return _stripe;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not defined. Set it in your .env.local file.");
  }

  _stripe = new Stripe(secretKey, {
    apiVersion: "2023-10-16",
    typescript: true,
  });

  return _stripe;
}

// ─── Wrapper Functions ────────────────────────────────────────────────────────

/**
 * Creates a Stripe Checkout Session for one-time invoice payment.
 *
 * @param input - Validated checkout session parameters
 * @param lineItems - Array of Stripe line items describing what is being charged
 * @returns CheckoutSessionDTO with the session ID and redirect URL
 * @throws Error if the Stripe API call fails
 */
export async function createCheckoutSession(
  input: CreateCheckoutSessionInput,
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
): Promise<CheckoutSessionDTO> {
  const stripe = getStripeClient();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      ...(input.customerEmail && { customer_email: input.customerEmail }),
      metadata: {
        invoiceId: input.invoiceId,
      },
    });

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL.");
    }

    return {
      id: session.id,
      url: session.url,
      invoiceId: input.invoiceId,
      stripePaymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : (session.payment_intent?.id ?? null),
      status: session.status ?? null,
    };
  } catch (err) {
    if (err instanceof Stripe.errors.StripeError) {
      throw new Error(`Stripe checkout session creation failed: ${err.message}`);
    }
    throw err;
  }
}

/**
 * Retrieves a Stripe Invoice by its ID.
 *
 * @param stripeInvoiceId - The Stripe invoice ID (e.g. "in_xxx")
 * @returns The raw Stripe Invoice object
 * @throws Error if the invoice is not found or the API call fails
 */
export async function getInvoice(stripeInvoiceId: string): Promise<Stripe.Invoice> {
  const stripe = getStripeClient();

  try {
    const invoice = await stripe.invoices.retrieve(stripeInvoiceId);
    return invoice;
  } catch (err) {
    if (err instanceof Stripe.errors.StripeError) {
      throw new Error(`Stripe invoice retrieval failed: ${err.message}`);
    }
    throw err;
  }
}

/**
 * Retrieves the status of a Stripe PaymentIntent.
 *
 * Maps Stripe PaymentIntent status values to our internal PaymentStatus type.
 *
 * @param stripePaymentIntentId - The Stripe PaymentIntent ID (e.g. "pi_xxx")
 * @returns The internal PaymentStatus ("pending" | "succeeded" | "failed")
 * @throws Error if the PaymentIntent is not found or the API call fails
 */
export async function getPaymentStatus(stripePaymentIntentId: string): Promise<PaymentStatus> {
  const stripe = getStripeClient();

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(stripePaymentIntentId);

    switch (paymentIntent.status) {
      case "succeeded":
        return "succeeded";
      case "canceled":
      case "requires_payment_method":
        return "failed";
      default:
        // covers: requires_confirmation, requires_action, processing, requires_capture
        return "pending";
    }
  } catch (err) {
    if (err instanceof Stripe.errors.StripeError) {
      throw new Error(`Stripe payment status retrieval failed: ${err.message}`);
    }
    throw err;
  }
}

/**
 * Constructs and verifies a Stripe webhook event from a raw request.
 *
 * @param payload - Raw request body as a string or Buffer
 * @param signature - Value of the `Stripe-Signature` header
 * @param webhookSecret - Webhook signing secret from Stripe dashboard
 * @returns Verified Stripe Event object
 * @throws Error if the signature is invalid or payload is malformed
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string,
): Stripe.Event {
  const stripe = getStripeClient();

  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    if (err instanceof Stripe.errors.StripeError) {
      throw new Error(`Stripe webhook verification failed: ${err.message}`);
    }
    throw err;
  }
}
