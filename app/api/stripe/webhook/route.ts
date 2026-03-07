import { confirmPayment } from "@/lib/billing/actions/confirm-payment";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const payload = await request.text();

  try {
    const result = await confirmPayment(payload, signature);
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Webhook processing failed";

    if (message === "Invalid Stripe webhook signature") {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (message.startsWith("Unhandled Stripe event type")) {
      return NextResponse.json({ ok: true, ignored: true }, { status: 200 });
    }

    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
