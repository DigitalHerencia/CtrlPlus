import { beforeEach, describe, expect, it } from 'vitest';

import { BookingValidationError, createBooking } from '../../lib/actions/create-booking';
import { bookingStore } from '../../lib/fetchers/booking-store';
import { getAvailability } from '../../lib/fetchers/get-availability';

const ownerHeaders = {
  host: 'acme.localhost:3000',
  'x-clerk-user-id': 'user_owner',
  'x-clerk-user-email': 'owner@example.com',
  'x-clerk-org-id': 'org_acme'
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

  it('creates a booking and removes the slot from availability', async () => {
    const initialSlots = getAvailability({
      tenantId: 'tenant_acme',
      ...dayWindow
    });

    expect(initialSlots).toHaveLength(4);

    const booking = await createBooking({
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

  it('rejects overlapping booking attempts', async () => {
    await createBooking({
      headers: ownerHeaders,
      tenantId: 'tenant_acme',
      startsAtIso: '2026-02-18T08:30:00.000Z',
      endsAtIso: '2026-02-18T09:00:00.000Z',
      customerName: 'First Booking',
      ...dayWindow
    });

    await expect(
      createBooking({
        headers: ownerHeaders,
        tenantId: 'tenant_acme',
        startsAtIso: '2026-02-18T08:30:00.000Z',
        endsAtIso: '2026-02-18T09:00:00.000Z',
        customerName: 'Second Booking',
        ...dayWindow
      })
    ).rejects.toThrowError(BookingValidationError);
  });

  it('keeps availability tenant-scoped', async () => {
    await createBooking({
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


