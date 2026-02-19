import { createHmac } from 'node:crypto';

import { expect, test } from '@playwright/test';

import { POST as stripeWebhookPost, __internal as stripeWebhookInternal } from '../../app/api/stripe/webhook/route';
import { createBooking } from '../../lib/server/actions/create-booking';
import { createCheckoutSession } from '../../lib/server/actions/create-checkout-session';
import { createInvoice } from '../../lib/server/actions/create-invoice';
import { createUploadPreviewAction } from '../../lib/server/actions/create-upload-preview';
import { bookingStore } from '../../lib/server/fetchers/booking-store';
import { getInvoice, invoiceStore } from '../../lib/server/fetchers/get-invoice';
import { uploadRateLimiter } from '../../lib/server/rate-limit/upload-rate-limit';
import { uploadStore } from '../../lib/server/storage/upload-store';

const ownerHeaders = {
  host: 'acme.localhost:3000',
  'x-clerk-user-id': 'user_owner',
  'x-clerk-user-email': 'owner@example.com'
} as const;

function pngPayload(): Uint8Array {
  return Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10, 73, 72, 68, 82, 0, 0, 0, 1]);
}

function signStripePayload(payload: string, secret: string): string {
  const signature = createHmac('sha256', secret).update(payload).digest('hex');
  return `t=123,v1=${signature}`;
}

test.describe('customer happy path', () => {
  test.beforeEach(() => {
    process.env.STRIPE_WEBHOOK_SECRET = 'stripe_test_secret';
    bookingStore.reset();
    invoiceStore.reset();
    uploadStore.reset();
    uploadRateLimiter.reset();
    stripeWebhookInternal.resetProcessedEvents();
  });

  test('completes preview to booking to payment confirmation', async () => {
    const uploadPreview = createUploadPreviewAction({
      headers: ownerHeaders,
      tenantId: 'tenant_acme',
      fileName: 'happy-path.png',
      mimeType: 'image/png',
      bytes: pngPayload(),
      wrapName: 'Fleet Upgrade',
      vehicleName: 'Transit Van'
    });

    expect(uploadPreview.uploadId).toBe('upload_1');

    const booking = createBooking({
      headers: ownerHeaders,
      tenantId: 'tenant_acme',
      startsAtIso: '2026-02-18T08:00:00.000Z',
      endsAtIso: '2026-02-18T08:30:00.000Z',
      customerName: 'Acme Customer',
      dayStartIso: '2026-02-18T08:00:00.000Z',
      dayEndIso: '2026-02-18T10:00:00.000Z',
      slotMinutes: 30
    });

    const invoice = createInvoice({
      headers: ownerHeaders,
      tenantId: 'tenant_acme',
      bookingId: booking.id,
      customerEmail: 'customer@example.com',
      amountCents: 250000
    });

    const checkout = createCheckoutSession({
      headers: ownerHeaders,
      tenantId: 'tenant_acme',
      invoiceId: invoice.id,
      successUrl: 'https://acme.example.com/success',
      cancelUrl: 'https://acme.example.com/cancel'
    });

    const stripeEvent = {
      id: 'evt_happy_path',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: checkout.sessionId,
          payment_intent: 'pi_happy_path',
          metadata: {
            tenantId: 'tenant_acme',
            invoiceId: invoice.id
          }
        }
      }
    };

    const payload = JSON.stringify(stripeEvent);
    const webhookResponse = await stripeWebhookPost(
      new Request('http://localhost/api/stripe/webhook', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'stripe-signature': signStripePayload(payload, 'stripe_test_secret')
        },
        body: payload
      })
    );

    expect(webhookResponse.status).toBe(200);

    const paidInvoice = getInvoice({
      headers: ownerHeaders,
      tenantId: 'tenant_acme',
      invoiceId: invoice.id
    });

    expect(paidInvoice.status).toBe('paid');
    expect(paidInvoice.stripePaymentIntentId).toBe('pi_happy_path');
  });
});

