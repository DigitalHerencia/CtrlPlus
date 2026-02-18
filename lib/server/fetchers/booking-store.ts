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
  private readonly bookings = new Map<string, BookingRecord>();

  reset(): void {
    this.bookings.clear();
  }

  listByTenant(tenantId: string): readonly BookingRecord[] {
    return Array.from(this.bookings.values()).filter((booking) => booking.tenantId === tenantId);
  }

  create(input: CreateBookingRecordInput): BookingRecord {
    const id = `booking_${this.bookings.size + 1}`;
    const booking: BookingRecord = {
      id,
      tenantId: input.tenantId,
      startsAtIso: input.startsAtIso,
      endsAtIso: input.endsAtIso,
      customerName: input.customerName
    };

    this.bookings.set(id, booking);
    return booking;
  }
}

export const bookingStore = new BookingStore();

