import { createCheckoutSession } from "@/lib/billing/actions/create-checkout-session";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const checkoutRequestSchema = z.object({
  invoiceId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const input = checkoutRequestSchema.parse(body);
    const session = await createCheckoutSession(input);
    return NextResponse.json(session, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : "Failed to create checkout session";
    if (message.startsWith("Unauthorized")) {
      return NextResponse.json({ error: message }, { status: 401 });
    }

    if (message.startsWith("Forbidden")) {
      return NextResponse.json({ error: message }, { status: 403 });
    }

    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
