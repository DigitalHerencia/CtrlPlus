import { createHmac } from 'node:crypto';
import { beforeEach, describe, expect, it } from 'vitest';

import { createInvoice } from '../../lib/server/actions/create-invoice';
import { createCheckoutSession } from '../../lib/server/actions/create-checkout-session';
import { getInvoice, invoiceStore } from '../../lib/server/fetchers/get-invoice';
import { __internal, POST } from '../../app/api/stripe/webhook/route';

const ownerHeaders = {
  host: 'acme.localhost:3000',
  'x-clerk-user-id': 'user_owner',
  'x-clerk-user-email': 'owner@example.com',
  'x-clerk-org-id': 'org_acme'
} as const;

const webhookSecret = 'stripe_test_secret';

function signPayload(payload: string): string {
  const signature = createHmac('sha256', webhookSecret).update(payload).digest('hex');
  return `t=123,v1=${signature}`;
}

describe('stripe checkout + webhook integration', () => {
  beforeEach(() => {
    process.env.STRIPE_WEBHOOK_SECRET = webhookSecret;
    invoiceStore.reset();
    __internal.resetProcessedEvents();
  });

  it('creates a checkout session and marks invoice paid from webhook', async () => {
    const invoice = await createInvoice({
      headers: ownerHeaders,
      tenantId: 'tenant_acme',
      customerEmail: 'customer@example.com',
      amountCents: 275000
    });

    const checkout = await createCheckoutSession({
      headers: ownerHeaders,
      tenantId: 'tenant_acme',
      invoiceId: invoice.id,
      successUrl: 'https://acme.example.com/success',
      cancelUrl: 'https://acme.example.com/cancel'
    });

    const openInvoice = await getInvoice({
      headers: ownerHeaders,
      tenantId: 'tenant_acme',
      invoiceId: invoice.id
    });

    expect(openInvoice.status).toBe('open');
    expect(checkout.sessionId).toContain('cs_test_');

    const event = {
      id: 'evt_1',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: checkout.sessionId,
          payment_intent: 'pi_123',
          metadata: {
            tenantId: 'tenant_acme',
            invoiceId: invoice.id
          }
        }
      }
    };

    const payload = JSON.stringify(event);
    const response = await POST(
      new Request('http://localhost/api/stripe/webhook', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'stripe-signature': signPayload(payload)
        },
        body: payload
      })
    );

    expect(response.status).toBe(200);

    const paidInvoice = await getInvoice({
      headers: ownerHeaders,
      tenantId: 'tenant_acme',
      invoiceId: invoice.id
    });

    expect(paidInvoice.status).toBe('paid');
    expect(paidInvoice.stripePaymentIntentId).toBe('pi_123');
  });

  it('handles duplicate webhook events idempotently', async () => {
    const invoice = await createInvoice({
      headers: ownerHeaders,
      tenantId: 'tenant_acme',
      customerEmail: 'customer@example.com',
      amountCents: 95000
    });

    const event = {
      id: 'evt_duplicate',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_dup',
          payment_intent: 'pi_dup',
          metadata: {
            tenantId: 'tenant_acme',
            invoiceId: invoice.id
          }
        }
      }
    };

    const payload = JSON.stringify(event);
    const signature = signPayload(payload);

    const firstResponse = await POST(
      new Request('http://localhost/api/stripe/webhook', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'stripe-signature': signature
        },
        body: payload
      })
    );

    const secondResponse = await POST(
      new Request('http://localhost/api/stripe/webhook', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'stripe-signature': signature
        },
        body: payload
      })
    );

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(200);

    const secondBody: unknown = await secondResponse.json();
    expect(
      typeof secondBody === 'object' &&
      secondBody !== null &&
      'idempotent' in secondBody &&
      (secondBody as { idempotent?: boolean }).idempotent === true
    ).toBe(true);
  });

  it('rejects webhook payloads with invalid signatures', async () => {
    const payload = JSON.stringify({
      id: 'evt_invalid',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_invalid',
          metadata: {
            tenantId: 'tenant_acme',
            invoiceId: 'invoice_1'
          }
        }
      }
    });

    const response = await POST(
      new Request('http://localhost/api/stripe/webhook', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'stripe-signature': 't=123,v1=deadbeef'
        },
        body: payload
      })
    );

    expect(response.status).toBe(400);
  });
});


