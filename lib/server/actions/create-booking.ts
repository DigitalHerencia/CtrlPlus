import { requirePermission } from '../auth/require-permission';
import { bookingStore, type BookingRecord } from '../fetchers/booking-store';
import { getAvailability } from '../fetchers/get-availability';
import { requireTenant } from '../tenancy/require-tenant';

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
  const tenantContext = requireTenant({
    headers: input.headers,
    routeTenantId: input.tenantId
  });
  const tenantId = tenantContext.tenant.tenantId;

  requirePermission({
    headers: input.headers,
    tenantId,
    permission: 'schedule:write'
  });

  const availableSlots = getAvailability({
    tenantId,
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
    tenantId,
    startsAtIso: input.startsAtIso,
    endsAtIso: input.endsAtIso,
    customerName: input.customerName
  });
}

