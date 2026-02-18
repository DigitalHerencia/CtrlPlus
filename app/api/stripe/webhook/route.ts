import { createHmac, timingSafeEqual } from 'node:crypto';

import { invoiceStore } from '../../../../lib/server/fetchers/get-invoice';

interface StripeCheckoutSessionObject {
  readonly id: string;
  readonly payment_intent?: string;
  readonly metadata?: {
    readonly tenantId?: string;
    readonly invoiceId?: string;
  };
}

interface StripeEvent {
  readonly id: string;
  readonly type: string;
  readonly data: {
    readonly object: StripeCheckoutSessionObject;
  };
}

class ProcessedStripeEventStore {
  private readonly eventIds = new Set<string>();

  reset(): void {
    this.eventIds.clear();
  }

  markIfNew(eventId: string): boolean {
    if (this.eventIds.has(eventId)) {
      return false;
    }

    this.eventIds.add(eventId);
    return true;
  }
}

const processedStripeEvents = new ProcessedStripeEventStore();

function readSignature(signatureHeader: string | null): string | null {
  if (!signatureHeader) {
    return null;
  }

  const versionedPart = signatureHeader
    .split(',')
    .map((chunk) => chunk.trim())
    .find((chunk) => chunk.startsWith('v1='));

  return versionedPart ? versionedPart.replace('v1=', '') : null;
}

function isValidStripeSignature(payload: string, signatureHeader: string | null, secret: string): boolean {
  const signature = readSignature(signatureHeader);
  if (!signature) {
    return false;
  }

  const expected = createHmac('sha256', secret).update(payload).digest('hex');
  const expectedBuffer = Buffer.from(expected, 'hex');
  const providedBuffer = Buffer.from(signature, 'hex');

  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, providedBuffer);
}

export async function POST(request: Request): Promise<Response> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? 'stripe_test_secret';
  const payload = await request.text();

  if (!isValidStripeSignature(payload, request.headers.get('stripe-signature'), webhookSecret)) {
    return Response.json(
      {
        error: 'Invalid Stripe signature'
      },
      {
        status: 400
      }
    );
  }

  const event = JSON.parse(payload) as StripeEvent;

  if (!processedStripeEvents.markIfNew(event.id)) {
    return Response.json({ received: true, idempotent: true });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const tenantId = session.metadata?.tenantId;
    const invoiceId = session.metadata?.invoiceId;

    if (!tenantId || !invoiceId) {
      return Response.json(
        {
          error: 'Missing checkout metadata'
        },
        {
          status: 400
        }
      );
    }

    invoiceStore.markPaid(
      tenantId,
      invoiceId,
      session.id,
      session.payment_intent ?? `pi_fallback_${event.id}`
    );
  }

  return Response.json({ received: true });
}

export const __internal = {
  resetProcessedEvents(): void {
    processedStripeEvents.reset();
  }
};
