import { requirePermission } from '../auth/require-permission';
import { bookingStore, type BookingRecord } from '../fetchers/booking-store';
import { getAvailability } from '../fetchers/get-availability';

export class BookingValidationError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode = 409) {
    super(message);
    this.name = 'BookingValidationError';
    this.statusCode = statusCode;
  }
}

export interface CreateBookingActionInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly tenantId: string;
  readonly startsAtIso: string;
  readonly endsAtIso: string;
  readonly customerName: string;
  readonly dayStartIso: string;
  readonly dayEndIso: string;
  readonly slotMinutes: number;
}

export function createBooking(input: CreateBookingActionInput): BookingRecord {
  requirePermission({
    headers: input.headers,
    permission: 'schedule:write'
  });

  const availableSlots = getAvailability({
    tenantId: input.tenantId,
    dayStartIso: input.dayStartIso,
    dayEndIso: input.dayEndIso,
    slotMinutes: input.slotMinutes
  });

  const requestedSlot = availableSlots.find(
    (slot) => slot.startIso === input.startsAtIso && slot.endIso === input.endsAtIso
  );

  if (!requestedSlot) {
    throw new BookingValidationError('Requested slot is no longer available');
  }

  return bookingStore.create({
    tenantId: input.tenantId,
    startsAtIso: input.startsAtIso,
    endsAtIso: input.endsAtIso,
    customerName: input.customerName
  });
}

