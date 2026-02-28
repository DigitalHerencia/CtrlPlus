import { beforeEach, describe, expect, it } from 'vitest';

import { createCheckoutSession } from '../../lib/actions/billing';
import { createInvoice } from '../../lib/actions/billing';
import { ActionInputValidationError } from '../../lib/actions/shared';
import { PermissionError } from '../../lib/auth/require-permission';
import {
  getInvoice,
  invoiceStore,
  InvoiceNotFoundError,
} from '../../lib/fetchers/billing';
import { TenantAccessError } from '../../lib/tenancy/require-tenant';

const ownerHeaders = {
  host: 'acme.localhost:3000',
  'x-clerk-user-id': 'user_owner',
  'x-clerk-user-email': 'owner@example.com',
  'x-clerk-org-id': 'org_acme',
} as const;

const viewerHeaders = {
  host: 'acme.localhost:3000',
  'x-clerk-user-id': 'user_viewer',
  'x-clerk-user-email': 'viewer@example.com',
  'x-clerk-org-id': 'org_acme',
} as const;

describe('checkout session action integration', () => {
  beforeEach(() => {
    invoiceStore.reset();
  });

  it('creates a checkout session and marks invoice as open', async () => {
    const invoice = await createInvoice({
      headers: ownerHeaders,
      tenantId: 'tenant_acme',
      customerEmail: 'customer@example.com',
      amountCents: 99000,
    });

    const checkout = await createCheckoutSession({
      headers: ownerHeaders,
      tenantId: 'tenant_acme',
      invoiceId: invoice.id,
      successUrl: 'https://acme.example.com/success',
      cancelUrl: 'https://acme.example.com/cancel',
    });

    const updatedInvoice = await getInvoice({
      headers: ownerHeaders,
      tenantId: 'tenant_acme',
      invoiceId: invoice.id,
    });

    expect(checkout.sessionId).toMatch(/^cs_test_/);
    expect(checkout.checkoutUrl).toContain(checkout.sessionId);
    expect(updatedInvoice.status).toBe('open');
    expect(updatedInvoice.stripeCheckoutSessionId).toBe(checkout.sessionId);
  });

  it('rejects users without billing write permission', async () => {
    const invoice = await createInvoice({
      headers: ownerHeaders,
      tenantId: 'tenant_acme',
      customerEmail: 'customer@example.com',
      amountCents: 120000,
    });

    await expect(
      createCheckoutSession({
        headers: viewerHeaders,
        tenantId: 'tenant_acme',
        invoiceId: invoice.id,
        successUrl: 'https://acme.example.com/success',
        cancelUrl: 'https://acme.example.com/cancel',
      }),
    ).rejects.toThrowError(PermissionError);
  });

  it('rejects tenant ids that do not match host-derived tenant context', async () => {
    const invoice = await createInvoice({
      headers: ownerHeaders,
      tenantId: 'tenant_acme',
      customerEmail: 'customer@example.com',
      amountCents: 130000,
    });

    await expect(
      createCheckoutSession({
        headers: ownerHeaders,
        tenantId: 'tenant_beta',
        invoiceId: invoice.id,
        successUrl: 'https://acme.example.com/success',
        cancelUrl: 'https://acme.example.com/cancel',
      }),
    ).rejects.toThrowError(TenantAccessError);
  });

  it('rejects malformed checkout payloads', async () => {
    await expect(
      createCheckoutSession({
        headers: ownerHeaders,
        tenantId: 'tenant_acme',
        invoiceId: '',
        successUrl: 'not-a-url',
        cancelUrl: 'also-not-a-url',
      }),
    ).rejects.toThrowError(ActionInputValidationError);
  });

  it('throws when the target invoice is missing', async () => {
    await expect(
      createCheckoutSession({
        headers: ownerHeaders,
        tenantId: 'tenant_acme',
        invoiceId: 'invoice_missing',
        successUrl: 'https://acme.example.com/success',
        cancelUrl: 'https://acme.example.com/cancel',
      }),
    ).rejects.toThrowError(InvoiceNotFoundError);
  });
});


