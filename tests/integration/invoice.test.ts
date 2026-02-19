import { beforeEach, describe, expect, it } from 'vitest';

import { PermissionError } from '../../lib/auth/require-permission';
import { createInvoice, InvoiceValidationError } from '../../lib/actions/create-invoice';
import { getInvoice, invoiceStore, InvoiceNotFoundError } from '../../lib/fetchers/get-invoice';

const ownerHeaders = {
  host: 'acme.localhost:3000',
  'x-clerk-user-id': 'user_owner',
  'x-clerk-user-email': 'owner@example.com',
  'x-clerk-org-id': 'org_acme'
} as const;

const managerHeaders = {
  host: 'acme.localhost:3000',
  'x-clerk-user-id': 'user_manager',
  'x-clerk-user-email': 'manager@example.com',
  'x-clerk-org-id': 'org_acme'
} as const;

const viewerHeaders = {
  host: 'acme.localhost:3000',
  'x-clerk-user-id': 'user_viewer',
  'x-clerk-user-email': 'viewer@example.com',
  'x-clerk-org-id': 'org_acme'
} as const;

describe('invoice domain', () => {
  beforeEach(() => {
    invoiceStore.reset();
  });

  it('creates and fetches an invoice for the same tenant', async () => {
    const created = await createInvoice({
      headers: ownerHeaders,
      tenantId: 'tenant_acme',
      bookingId: 'booking_1',
      customerEmail: 'Customer@Example.com',
      amountCents: 250000
    });

    expect(created.id).toBe('invoice_1');
    expect(created.customerEmail).toBe('customer@example.com');
    expect(created.status).toBe('draft');

    const invoice = await getInvoice({
      headers: managerHeaders,
      tenantId: 'tenant_acme',
      invoiceId: created.id
    });

    expect(invoice.amountCents).toBe(250000);
    expect(invoice.bookingId).toBe('booking_1');
  });

  it('rejects unauthorized and invalid invoice creation', async () => {
    await expect(
      createInvoice({
        headers: viewerHeaders,
        tenantId: 'tenant_acme',
        customerEmail: 'viewer@example.com',
        amountCents: 1000
      })
    ).rejects.toThrowError(PermissionError);

    await expect(
      createInvoice({
        headers: ownerHeaders,
        tenantId: 'tenant_acme',
        customerEmail: 'invalid-email',
        amountCents: 1000
      })
    ).rejects.toThrowError(InvoiceValidationError);
  });

  it('enforces tenant isolation when reading invoices', async () => {
    const created = await createInvoice({
      headers: ownerHeaders,
      tenantId: 'tenant_acme',
      customerEmail: 'acme@example.com',
      amountCents: 180000
    });

    await expect(
      getInvoice({
        headers: {
          ...ownerHeaders,
          host: 'beta.localhost:3000',
          'x-clerk-org-id': 'org_beta'
        },
        tenantId: 'tenant_beta',
        invoiceId: created.id
      })
    ).rejects.toThrowError(InvoiceNotFoundError);
  });
});

