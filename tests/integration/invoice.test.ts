import { beforeEach, describe, expect, it } from 'vitest';

import { PermissionError } from '../../lib/server/auth/require-permission';
import { createInvoice, InvoiceValidationError } from '../../lib/server/actions/create-invoice';
import { getInvoice, invoiceStore, InvoiceNotFoundError } from '../../lib/server/fetchers/get-invoice';

const ownerHeaders = {
  'x-user-id': 'user_owner',
  'x-user-email': 'owner@example.com',
  'x-user-role': 'owner'
} as const;

const managerHeaders = {
  'x-user-id': 'user_manager',
  'x-user-email': 'manager@example.com',
  'x-user-role': 'manager'
} as const;

const viewerHeaders = {
  'x-user-id': 'user_viewer',
  'x-user-email': 'viewer@example.com',
  'x-user-role': 'viewer'
} as const;

describe('invoice domain', () => {
  beforeEach(() => {
    invoiceStore.reset();
  });

  it('creates and fetches an invoice for the same tenant', () => {
    const created = createInvoice({
      headers: ownerHeaders,
      tenantId: 'tenant_acme',
      bookingId: 'booking_1',
      customerEmail: 'Customer@Example.com',
      amountCents: 250000
    });

    expect(created.id).toBe('invoice_1');
    expect(created.customerEmail).toBe('customer@example.com');
    expect(created.status).toBe('draft');

    const invoice = getInvoice({
      headers: managerHeaders,
      tenantId: 'tenant_acme',
      invoiceId: created.id
    });

    expect(invoice.amountCents).toBe(250000);
    expect(invoice.bookingId).toBe('booking_1');
  });

  it('rejects unauthorized and invalid invoice creation', () => {
    expect(() =>
      createInvoice({
        headers: viewerHeaders,
        tenantId: 'tenant_acme',
        customerEmail: 'viewer@example.com',
        amountCents: 1000
      })
    ).toThrowError(PermissionError);

    expect(() =>
      createInvoice({
        headers: ownerHeaders,
        tenantId: 'tenant_acme',
        customerEmail: 'invalid-email',
        amountCents: 1000
      })
    ).toThrowError(InvoiceValidationError);
  });

  it('enforces tenant isolation when reading invoices', () => {
    const created = createInvoice({
      headers: ownerHeaders,
      tenantId: 'tenant_acme',
      customerEmail: 'acme@example.com',
      amountCents: 180000
    });

    expect(() =>
      getInvoice({
        headers: ownerHeaders,
        tenantId: 'tenant_beta',
        invoiceId: created.id
      })
    ).toThrowError(InvoiceNotFoundError);
  });
});
