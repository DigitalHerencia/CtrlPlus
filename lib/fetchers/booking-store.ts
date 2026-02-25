import { tenantScopedPrisma } from '../db/prisma';

export interface BookingRecord {
  readonly id: string;
  readonly tenantId: string;
  readonly startsAtIso: string;
  readonly endsAtIso: string;
  readonly customerName: string;
}

export interface CreateBookingRecordInput {
  readonly tenantId: string;
  readonly startsAtIso: string;
  readonly endsAtIso: string;
  readonly customerName: string;
}

export class BookingStore {
  reset(): void {
    tenantScopedPrisma.reset();
  }

  listByTenant(tenantId: string): readonly BookingRecord[] {
    return tenantScopedPrisma.listBookingsByTenant(tenantId);
  }

  create(input: CreateBookingRecordInput): BookingRecord {
    return tenantScopedPrisma.createBooking(input);
  }
}

export const bookingStore = new BookingStore();
