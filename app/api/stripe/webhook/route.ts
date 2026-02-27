import { createHmac, timingSafeEqual } from 'node:crypto';

import { invoiceStore } from '../../../../lib/fetchers/get-invoice';
import { createLogContext, logEvent } from '../../../../lib/observability/structured-logger';

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

function requestHeadersToObject(request: Request): Readonly<Record<string, string>> {
  return Object.fromEntries(request.headers.entries());
}

export async function POST(request: Request): Promise<Response> {
  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET ?? (process.env.NODE_ENV === 'test' ? 'stripe_test_secret' : null);
  if (!webhookSecret) {
    return Response.json(
      {
        error: 'Stripe webhook secret is not configured'
      },
      {
        status: 500
      }
    );
  }

  const payload = await request.text();
  const requestHeaders = requestHeadersToObject(request);
  const baseLogContext = createLogContext({
    headers: requestHeaders,
    source: 'webhook.stripe'
  });

  if (!isValidStripeSignature(payload, request.headers.get('stripe-signature'), webhookSecret)) {
    logEvent({
      level: 'warn',
      event: 'stripe.webhook.invalid_signature',
      context: baseLogContext,
      data: {
        payload,
        stripeSignature: request.headers.get('stripe-signature')
      }
    });

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
  const eventContext = {
    ...baseLogContext,
    correlationId: baseLogContext.correlationId || event.id
  };

  logEvent({
    event: 'stripe.webhook.received',
    context: eventContext,
    data: {
      eventId: event.id,
      eventType: event.type,
      payload
    }
  });

  if (!processedStripeEvents.markIfNew(event.id)) {
    logEvent({
      event: 'stripe.webhook.idempotent_skip',
      context: eventContext,
      data: {
        eventId: event.id
      }
    });

    return Response.json({ received: true, idempotent: true });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const tenantId = session.metadata?.tenantId;
    const invoiceId = session.metadata?.invoiceId;

    if (!tenantId || !invoiceId) {
      logEvent({
        level: 'warn',
        event: 'stripe.webhook.metadata_missing',
        context: eventContext,
        data: {
          eventId: event.id,
          metadata: session.metadata
        }
      });

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

    logEvent({
      event: 'stripe.webhook.invoice_marked_paid',
      context: {
        ...eventContext,
        tenantId
      },
      data: {
        eventId: event.id,
        tenantId,
        invoiceId,
        sessionId: session.id,
        paymentIntentId: session.payment_intent ?? `pi_fallback_${event.id}`
      }
    });
  }

  return Response.json({ received: true });
}

export const __internal = {
  resetProcessedEvents(): void {
    processedStripeEvents.reset();
  }
};
