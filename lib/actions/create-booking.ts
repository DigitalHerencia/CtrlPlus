import { z } from 'zod';

import { requirePermission } from '../auth/require-permission';
import { validateActionInput, headerSchema } from './validation';
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

const createBookingActionInputSchema = z.object({
  headers: headerSchema,
  tenantId: z.string().min(1),
  startsAtIso: z.string().datetime(),
  endsAtIso: z.string().datetime(),
  customerName: z.string().trim().min(1).max(120),
  dayStartIso: z.string().datetime(),
  dayEndIso: z.string().datetime(),
  slotMinutes: z.number().int().positive().max(240)
});

export async function createBooking(input: CreateBookingActionInput): Promise<BookingRecord> {
  const validatedInput = validateActionInput(createBookingActionInputSchema, input);

  const tenantContext = requireTenant({
    headers: validatedInput.headers,
    routeTenantId: validatedInput.tenantId
  });
  const tenantId = tenantContext.tenant.tenantId;

  await requirePermission({
    headers: validatedInput.headers,
    tenantId,
    permission: 'schedule:write'
  });

  const availableSlots = getAvailability({
    tenantId,
    dayStartIso: validatedInput.dayStartIso,
    dayEndIso: validatedInput.dayEndIso,
    slotMinutes: validatedInput.slotMinutes
  });

  const requestedSlot = availableSlots.find(
    (slot) => slot.startIso === validatedInput.startsAtIso && slot.endIso === validatedInput.endsAtIso
  );

  if (!requestedSlot) {
    throw new BookingValidationError('Requested slot is no longer available');
  }

  return bookingStore.create({
    tenantId,
    startsAtIso: validatedInput.startsAtIso,
    endsAtIso: validatedInput.endsAtIso,
    customerName: validatedInput.customerName
  });
}
