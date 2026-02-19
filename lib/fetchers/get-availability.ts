import { computeSlots, type ComputedSlot } from '../../features/scheduling/compute-slots';
import { bookingStore } from './booking-store';

export interface GetAvailabilityInput {
  readonly tenantId: string;
  readonly dayStartIso: string;
  readonly dayEndIso: string;
  readonly slotMinutes: number;
}

export function getAvailability(input: GetAvailabilityInput): readonly ComputedSlot[] {
  const busyWindows = bookingStore.listByTenant(input.tenantId).map((booking) => ({
    startIso: booking.startsAtIso,
    endIso: booking.endsAtIso
  }));

  return computeSlots({
    workingWindow: {
      startIso: input.dayStartIso,
      endIso: input.dayEndIso
    },
    busyWindows,
    slotMinutes: input.slotMinutes
  });
}

