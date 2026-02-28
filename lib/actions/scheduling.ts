import { z } from 'zod';

import { createMutationAuditLogger } from '../audit/log-mutation-event';
import { requirePermission } from '../auth/require-permission';
import { safeRevalidatePath, safeRevalidateTag } from '../cache/invalidation';
import { tenantScopedPrisma } from '../db/prisma';
import {
  getAvailability,
  type BookingRecord,
  getSchedulingAvailabilityTag,
  getSchedulingBookingListTag,
  getSchedulingTenantTag,
} from '../fetchers/scheduling';
import { assertTenantScope } from '../tenancy/assert-tenant-scope';
import { requireTenant } from '../tenancy/require-tenant';
import { headerSchema, validateActionInput } from './shared';

export class BookingValidationError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode = 409) {
    super(message);
    this.name = 'BookingValidationError';
    this.statusCode = statusCode;
  }
}

export const SCHEDULING_MUTATION_INVALIDATION_PATHS = ['/operations/admin'] as const;

export interface InvalidateSchedulingMutationInput {
  readonly tenantId: string;
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

export function invalidateSchedulingMutation(input: InvalidateSchedulingMutationInput): void {
  safeRevalidateTag(getSchedulingTenantTag(input.tenantId));
  safeRevalidateTag(getSchedulingAvailabilityTag(input.tenantId));
  safeRevalidateTag(getSchedulingBookingListTag(input.tenantId));

  for (const path of SCHEDULING_MUTATION_INVALIDATION_PATHS) {
    safeRevalidatePath(path);
  }
}

export async function createBooking(input: CreateBookingActionInput): Promise<BookingRecord> {
  const validatedInput = validateActionInput(createBookingActionInputSchema, input);

  const tenantContext = requireTenant({
    headers: validatedInput.headers
  });
  const tenantId = tenantContext.tenantId;
  assertTenantScope(tenantId, validatedInput.tenantId);
  const audit = createMutationAuditLogger({
    headers: validatedInput.headers,
    tenantId,
    source: 'action.create-booking',
    eventPrefix: 'booking.create'
  });

  audit.requested({
    tenantId,
    startsAtIso: validatedInput.startsAtIso,
    endsAtIso: validatedInput.endsAtIso,
    customerName: validatedInput.customerName
  });

  await requirePermission({
    headers: validatedInput.headers,
    tenantId,
    permission: 'schedule:write'
  });

  const availableSlots = await getAvailability({
    tenantId,
    dayStartIso: validatedInput.dayStartIso,
    dayEndIso: validatedInput.dayEndIso,
    slotMinutes: validatedInput.slotMinutes,
    logContext: audit.context
  });

  const requestedSlot = availableSlots.find(
    (slot) => slot.startIso === validatedInput.startsAtIso && slot.endIso === validatedInput.endsAtIso
  );

  if (!requestedSlot) {
    audit.rejected({
      tenantId,
      startsAtIso: validatedInput.startsAtIso,
      endsAtIso: validatedInput.endsAtIso,
      reason: 'requested_slot_unavailable'
    });

    throw new BookingValidationError('Requested slot is no longer available');
  }

  const booking = tenantScopedPrisma.createBooking({
    tenantId,
    startsAtIso: validatedInput.startsAtIso,
    endsAtIso: validatedInput.endsAtIso,
    customerName: validatedInput.customerName
  });

  audit.succeeded({
    tenantId,
    bookingId: booking.id,
    startsAtIso: booking.startsAtIso,
    endsAtIso: booking.endsAtIso,
    customerName: booking.customerName
  });
  invalidateSchedulingMutation({
    tenantId,
  });

  return booking;
}
