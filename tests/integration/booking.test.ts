import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { BookingValidationError, createBooking } from '../../lib/actions/create-booking';
import { ActionInputValidationError } from '../../lib/actions/validation';
import { bookingStore } from '../../lib/fetchers/booking-store';
import { getAvailability } from '../../lib/fetchers/get-availability';
import { resetLogSink, setLogSink, type StructuredLogEntry } from '../../lib/observability/structured-logger';

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
  const entries: StructuredLogEntry[] = [];

  beforeEach(() => {
    bookingStore.reset();
    entries.length = 0;
    setLogSink((entry) => {
      entries.push(entry);
    });
  });

  afterEach(() => {
    resetLogSink();
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

    expect(booking.id).toMatch(/^booking_/);

    const updatedSlots = getAvailability({
      tenantId: 'tenant_acme',
      ...dayWindow
    });

    expect(updatedSlots).toHaveLength(3);
    expect(updatedSlots[0]?.startIso).toBe('2026-02-18T08:30:00.000Z');
  });

  it('propagates correlation id from action to availability fetcher logs', async () => {
    await createBooking({
      headers: {
        ...ownerHeaders,
        'x-correlation-id': 'corr_booking_1'
      },
      tenantId: 'tenant_acme',
      startsAtIso: '2026-02-18T08:30:00.000Z',
      endsAtIso: '2026-02-18T09:00:00.000Z',
      customerName: 'Correlation Customer',
      ...dayWindow
    });

    const bookingRequestedLog = entries.find((entry) => entry.event === 'booking.create.requested');
    const availabilityLog = entries.find((entry) => entry.event === 'availability.computed');

    expect(bookingRequestedLog?.context.correlationId).toBe('corr_booking_1');
    expect(availabilityLog?.context.correlationId).toBe('corr_booking_1');
    expect(bookingRequestedLog?.data).toMatchObject({
      customerName: '[REDACTED]'
    });
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

  it('rejects invalid booking payloads before evaluating availability', async () => {
    await expect(
      createBooking({
        headers: ownerHeaders,
        tenantId: 'tenant_acme',
        startsAtIso: 'not-an-iso-date',
        endsAtIso: '2026-02-18T09:00:00.000Z',
        customerName: '',
        ...dayWindow
      })
    ).rejects.toThrowError(ActionInputValidationError);
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
