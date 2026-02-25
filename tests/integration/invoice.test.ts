import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { createInvoice } from '../../lib/actions/create-invoice';
import { ActionInputValidationError } from '../../lib/actions/validation';
import { PermissionError } from '../../lib/auth/require-permission';
import { getInvoice, invoiceStore, InvoiceNotFoundError } from '../../lib/fetchers/get-invoice';
import { resetLogSink, setLogSink, type StructuredLogEntry } from '../../lib/observability/structured-logger';

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
  const entries: StructuredLogEntry[] = [];

  beforeEach(() => {
    invoiceStore.reset();
    entries.length = 0;
    setLogSink((entry) => {
      entries.push(entry);
    });
  });

  afterEach(() => {
    resetLogSink();
  });

  it('creates and fetches an invoice for the same tenant', async () => {
    const created = await createInvoice({
      headers: ownerHeaders,
      tenantId: 'tenant_acme',
      bookingId: 'booking_1',
      customerEmail: 'Customer@Example.com',
      amountCents: 250000
    });

    expect(created.id).toMatch(/^invoice_/);
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
    ).rejects.toThrowError(ActionInputValidationError);
  });

  it('rejects malformed invoice payloads with deterministic validation errors', async () => {
    await expect(
      createInvoice({
        headers: ownerHeaders,
        tenantId: 'tenant_acme',
        customerEmail: 'invalid-email',
        amountCents: 0
      })
    ).rejects.toThrowError(ActionInputValidationError);
  });

  it('propagates correlation id and redacts invoice logs', async () => {
    const headersWithCorrelation = {
      ...ownerHeaders,
      'x-correlation-id': 'corr_invoice_1'
    };

    const created = await createInvoice({
      headers: headersWithCorrelation,
      tenantId: 'tenant_acme',
      customerEmail: 'acme@example.com',
      amountCents: 180000
    });

    await getInvoice({
      headers: headersWithCorrelation,
      tenantId: 'tenant_acme',
      invoiceId: created.id
    });

    const createRequestedLog = entries.find((entry) => entry.event === 'invoice.create.requested');
    const fetchSucceededLog = entries.find((entry) => entry.event === 'invoice.fetch.succeeded');

    expect(createRequestedLog?.context.correlationId).toBe('corr_invoice_1');
    expect(fetchSucceededLog?.context.correlationId).toBe('corr_invoice_1');
    expect(createRequestedLog?.data).toMatchObject({ customerEmail: '[REDACTED]' });
    expect(fetchSucceededLog?.data).toMatchObject({ customerEmail: '[REDACTED]' });
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
