import type { BookingDTO } from "@/lib/scheduling/types";
import { BookingCard } from "./booking-card";

interface BookingListProps {
  bookings: BookingDTO[];
  emptyMessage?: string;
}

/**
 * BookingList renders a vertical list of BookingCards.
 * It is a pure Server Component that accepts pre-fetched booking data.
 */
export function BookingList({
  bookings,
  emptyMessage = "No bookings found.",
}: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <div className="flex min-h-32 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-4" aria-label="Bookings list">
      {bookings.map((booking) => (
        <li key={booking.id}>
          <BookingCard booking={booking} />
        </li>
      ))}
    </ul>
  );
}
