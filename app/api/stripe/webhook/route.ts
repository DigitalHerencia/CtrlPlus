import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/billing/stripe";
import { handleStripeEvent } from "@/lib/billing/actions/handle-stripe-event";

/**
 * POST /api/stripe/webhook
 *
 * Handles Stripe lifecycle events.
 *
 * Security:
 * - Raw body is read for signature verification (stripe.webhooks.constructEvent)
 * - STRIPE_WEBHOOK_SECRET must be set in the environment
 *
 * Supported events:
 * - checkout.session.completed
 * - payment_intent.succeeded
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  // Read raw body for signature verification
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  // Verify signature
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("Stripe webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // Process event
  try {
    await handleStripeEvent(event);
  } catch (err) {
    console.error("Failed to process Stripe event:", event.id, err);
    return NextResponse.json(
      { error: "Internal processing error" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
