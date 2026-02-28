import { unstable_cache } from 'next/cache';

import { computeSlots, type ComputedSlot } from '../../features/scheduling/use-cases/compute-slots';
import { queryBookings } from '../../features/scheduling/use-cases';
import type {
  BookingListRequestContract,
  BookingListResponseContract,
  BookingSummaryContract,
} from '../../types/scheduling';
import { requirePermission } from '../auth/require-permission';
import { tenantScopedPrisma } from '../db/prisma';
import type { LogContext } from '../observability/structured-logger';
import { logEvent } from '../observability/structured-logger';
import { assertTenantScope } from '../tenancy/assert-tenant-scope';
import { requireTenant } from '../tenancy/require-tenant';

export const SCHEDULING_CACHE_POLICY = {
  availabilityRevalidateSeconds: 15,
  bookingListRevalidateSeconds: 15,
} as const;

export function getSchedulingTenantTag(tenantId: string): string {
  return `scheduling:${tenantId}`;
}

export function getSchedulingAvailabilityTag(tenantId: string): string {
  return `scheduling:${tenantId}:availability`;
}

export function getSchedulingBookingListTag(tenantId: string): string {
  return `scheduling:${tenantId}:bookings`;
}

function isMissingIncrementalCache(error: unknown): boolean {
  return error instanceof Error && error.message.includes('incrementalCache missing');
}

export interface RunSchedulingCacheInput<TValue> {
  readonly keyParts: readonly string[];
  readonly tags: readonly string[];
  readonly revalidate: number;
  readonly load: () => Promise<TValue> | TValue;
}

export interface BookingRecord {
  readonly id: string;
  readonly tenantId: string;
  readonly startsAtIso: string;
  readonly endsAtIso: string;
  readonly customerName: string;
}

export interface GetAvailabilityInput {
  readonly tenantId: string;
  readonly dayStartIso: string;
  readonly dayEndIso: string;
  readonly slotMinutes: number;
  readonly logContext?: LogContext;
}

export interface ListBookingsFetcherInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly query: BookingListRequestContract;
}

export class BookingStore {
  reset(): void {
    tenantScopedPrisma.reset();
  }

  listByTenant(tenantId: string): readonly BookingRecord[] {
    return tenantScopedPrisma.listBookingsByTenant(tenantId);
  }
}

export const bookingStore = new BookingStore();

function toBookingSummary(record: BookingRecord): BookingSummaryContract {
  return {
    id: record.id,
    startsAtIso: record.startsAtIso,
    endsAtIso: record.endsAtIso,
    customerName: record.customerName,
  };
}

export async function runSchedulingCache<TValue>(
  input: RunSchedulingCacheInput<TValue>,
): Promise<TValue> {
  try {
    const cachedLoad = unstable_cache(async () => input.load(), [...input.keyParts], {
      tags: [...input.tags],
      revalidate: input.revalidate,
    });

    return await cachedLoad();
  } catch (error) {
    if (!isMissingIncrementalCache(error)) {
      throw error;
    }

    return input.load();
  }
}

export async function getAvailability(input: GetAvailabilityInput): Promise<readonly ComputedSlot[]> {
  const busyWindows = bookingStore.listByTenant(input.tenantId).map((booking) => ({
    startIso: booking.startsAtIso,
    endIso: booking.endsAtIso
  }));

  const loadSlots = (): readonly ComputedSlot[] => computeSlots({
    workingWindow: {
      startIso: input.dayStartIso,
      endIso: input.dayEndIso
    },
    busyWindows,
    slotMinutes: input.slotMinutes
  });

  const slots = input.logContext
    ? loadSlots()
    : await runSchedulingCache({
      keyParts: [
        'scheduling',
        'availability',
        input.tenantId,
        input.dayStartIso,
        input.dayEndIso,
        input.slotMinutes.toString(),
      ],
      tags: [
        getSchedulingTenantTag(input.tenantId),
        getSchedulingAvailabilityTag(input.tenantId),
      ],
      revalidate: SCHEDULING_CACHE_POLICY.availabilityRevalidateSeconds,
      load: loadSlots,
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

export async function listBookings(input: ListBookingsFetcherInput): Promise<BookingListResponseContract> {
  const tenantContext = requireTenant({
    headers: input.headers,
  });
  const tenantId = tenantContext.tenantId;
  assertTenantScope(tenantId, input.query.tenantId);

  await requirePermission({
    headers: input.headers,
    tenantId,
    permission: 'schedule:read',
  });

  const filter = input.query.filter;
  const sort = input.query.sort;

  return runSchedulingCache({
    keyParts: [
      'scheduling',
      'bookings',
      tenantId,
      filter?.customerNameQuery ?? '',
      filter?.startsAfterIso ?? '',
      filter?.endsBeforeIso ?? '',
      sort?.field ?? 'startsAtIso',
      sort?.direction ?? 'asc',
      input.query.pagination.page.toString(),
      input.query.pagination.pageSize.toString(),
    ],
    tags: [
      getSchedulingTenantTag(tenantId),
      getSchedulingBookingListTag(tenantId),
    ],
    revalidate: SCHEDULING_CACHE_POLICY.bookingListRevalidateSeconds,
    load: () => {
      const tenantBookings = bookingStore.listByTenant(tenantId).map(toBookingSummary);
      return queryBookings(tenantBookings, input.query);
    },
  });
}
