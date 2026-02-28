import { describe, expect, it } from 'vitest';

import { queryInvoices } from '../../features/billing/use-cases';
import type { InvoiceSummaryContract } from '../../types/billing';

const invoices: readonly InvoiceSummaryContract[] = [
  {
    id: 'invoice_c',
    bookingId: 'booking_3',
    customerEmail: 'charlie@example.com',
    amountCents: 30000,
    status: 'paid',
  },
  {
    id: 'invoice_b',
    bookingId: 'booking_2',
    customerEmail: 'bravo@example.com',
    amountCents: 15000,
    status: 'open',
  },
  {
    id: 'invoice_a',
    bookingId: 'booking_1',
    customerEmail: 'alpha@example.com',
    amountCents: 15000,
    status: 'draft',
  },
];

describe('billing use-cases', () => {
  it('applies status and email filters deterministically', () => {
    const response = queryInvoices(invoices, {
      tenantId: 'tenant_acme',
      filter: {
        status: 'open',
        customerEmailQuery: 'bravo',
      },
      pagination: {
        page: 1,
        pageSize: 20,
      },
    });

    expect(response.total).toBe(1);
    expect(response.items[0]?.id).toBe('invoice_b');
  });

  it('sorts by amount with stable id tie-breakers', () => {
    const response = queryInvoices(invoices, {
      tenantId: 'tenant_acme',
      sort: {
        field: 'amountCents',
        direction: 'desc',
      },
      pagination: {
        page: 1,
        pageSize: 20,
      },
    });

    expect(response.items.map((item) => item.id)).toEqual(['invoice_c', 'invoice_a', 'invoice_b']);
  });

  it('normalizes invalid pagination inputs', () => {
    const response = queryInvoices(invoices, {
      tenantId: 'tenant_acme',
      pagination: {
        page: 0,
        pageSize: 1000,
      },
    });

    expect(response.page).toBe(1);
    expect(response.pageSize).toBe(200);
  });
});
