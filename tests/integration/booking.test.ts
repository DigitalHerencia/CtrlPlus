import { beforeEach, describe, expect, it } from 'vitest';

import { BookingValidationError, createBooking } from '../../lib/server/actions/create-booking';
import { bookingStore } from '../../lib/server/fetchers/booking-store';
import { getAvailability } from '../../lib/server/fetchers/get-availability';

const ownerHeaders = {
  'x-user-id': 'user_owner',
  'x-user-email': 'owner@example.com',
  'x-user-role': 'owner'
} as const;

const dayWindow = {
  dayStartIso: '2026-02-18T08:00:00.000Z',
  dayEndIso: '2026-02-18T10:00:00.000Z',
  slotMinutes: 30
} as const;

describe('booking action + availability fetcher', () => {
  beforeEach(() => {
    bookingStore.reset();
  });

  it('creates a booking and removes the slot from availability', () => {
    const initialSlots = getAvailability({
      tenantId: 'tenant_acme',
      ...dayWindow
    });

    expect(initialSlots).toHaveLength(4);

    const booking = createBooking({
      headers: ownerHeaders,
      tenantId: 'tenant_acme',
      startsAtIso: '2026-02-18T08:00:00.000Z',
      endsAtIso: '2026-02-18T08:30:00.000Z',
      customerName: 'Acme Customer',
      ...dayWindow
    });

    expect(booking.id).toBe('booking_1');

    const updatedSlots = getAvailability({
      tenantId: 'tenant_acme',
      ...dayWindow
    });

    expect(updatedSlots).toHaveLength(3);
    expect(updatedSlots[0]?.startIso).toBe('2026-02-18T08:30:00.000Z');
  });

  it('rejects overlapping booking attempts', () => {
    createBooking({
      headers: ownerHeaders,
      tenantId: 'tenant_acme',
      startsAtIso: '2026-02-18T08:30:00.000Z',
      endsAtIso: '2026-02-18T09:00:00.000Z',
      customerName: 'First Booking',
      ...dayWindow
    });

    expect(() =>
      createBooking({
        headers: ownerHeaders,
        tenantId: 'tenant_acme',
        startsAtIso: '2026-02-18T08:30:00.000Z',
        endsAtIso: '2026-02-18T09:00:00.000Z',
        customerName: 'Second Booking',
        ...dayWindow
      })
    ).toThrowError(BookingValidationError);
  });

  it('keeps availability tenant-scoped', () => {
    createBooking({
      headers: ownerHeaders,
      tenantId: 'tenant_acme',
      startsAtIso: '2026-02-18T09:00:00.000Z',
      endsAtIso: '2026-02-18T09:30:00.000Z',
      customerName: 'Acme Booking',
      ...dayWindow
    });

    const betaSlots = getAvailability({
      tenantId: 'tenant_beta',
      ...dayWindow
    });

    expect(betaSlots).toHaveLength(4);
  });
});

