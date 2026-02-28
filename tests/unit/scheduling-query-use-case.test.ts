import { describe, expect, it } from 'vitest';

import { queryBookings } from '../../features/scheduling/use-cases';
import type { BookingSummaryContract } from '../../types/scheduling';

const bookings: readonly BookingSummaryContract[] = [
  {
    id: 'booking_3',
    startsAtIso: '2026-02-18T10:00:00.000Z',
    endsAtIso: '2026-02-18T10:30:00.000Z',
    customerName: 'Charlie',
  },
  {
    id: 'booking_2',
    startsAtIso: '2026-02-18T09:00:00.000Z',
    endsAtIso: '2026-02-18T09:30:00.000Z',
    customerName: 'Bravo',
  },
  {
    id: 'booking_1',
    startsAtIso: '2026-02-18T09:00:00.000Z',
    endsAtIso: '2026-02-18T09:30:00.000Z',
    customerName: 'Alpha',
  },
];

describe('scheduling query use-case', () => {
  it('sorts deterministically with id tie-breakers', () => {
    const response = queryBookings(bookings, {
      tenantId: 'tenant_acme',
      sort: {
        field: 'startsAtIso',
        direction: 'asc',
      },
      pagination: {
        page: 1,
        pageSize: 10,
      },
    });

    expect(response.items.map((item) => item.id)).toEqual(['booking_1', 'booking_2', 'booking_3']);
  });

  it('applies customer filter and pagination metadata', () => {
    const response = queryBookings(bookings, {
      tenantId: 'tenant_acme',
      filter: {
        customerNameQuery: 'br',
      },
      pagination: {
        page: 1,
        pageSize: 1,
      },
    });

    expect(response.total).toBe(1);
    expect(response.pageCount).toBe(1);
    expect(response.hasNextPage).toBe(false);
    expect(response.items[0]?.id).toBe('booking_2');
  });

  it('normalizes invalid pagination inputs', () => {
    const response = queryBookings(bookings, {
      tenantId: 'tenant_acme',
      pagination: {
        page: -3,
        pageSize: 999,
      },
    });

    expect(response.page).toBe(1);
    expect(response.pageSize).toBe(200);
  });
});
