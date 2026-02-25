import { computeSlots, type ComputedSlot } from '../../features/scheduling/compute-slots';
import type { LogContext } from '../observability/structured-logger';
import { logEvent } from '../observability/structured-logger';
import { bookingStore } from './booking-store';

export interface GetAvailabilityInput {
  readonly tenantId: string;
  readonly dayStartIso: string;
  readonly dayEndIso: string;
  readonly slotMinutes: number;
  readonly logContext?: LogContext;
}

export function getAvailability(input: GetAvailabilityInput): readonly ComputedSlot[] {
  const busyWindows = bookingStore.listByTenant(input.tenantId).map((booking) => ({
    startIso: booking.startsAtIso,
    endIso: booking.endsAtIso
  }));

  const slots = computeSlots({
    workingWindow: {
      startIso: input.dayStartIso,
      endIso: input.dayEndIso
    },
    busyWindows,
    slotMinutes: input.slotMinutes
  });

  if (input.logContext) {
    logEvent({
      event: 'availability.computed',
      context: input.logContext,
      data: {
        tenantId: input.tenantId,
        dayStartIso: input.dayStartIso,
        dayEndIso: input.dayEndIso,
        slotMinutes: input.slotMinutes,
        busyWindowCount: busyWindows.length,
        availableSlotCount: slots.length
      }
    });
  }

  return slots;
}
