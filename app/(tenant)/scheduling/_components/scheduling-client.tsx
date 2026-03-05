"use client";

import { useState } from "react";
import type { AvailabilityDTO, BookingDTO } from "@/lib/scheduling/types";
import { BookingForm } from "@/components/scheduling/booking-form";
import { BookingCard } from "@/components/scheduling/booking-card";

interface SchedulingClientProps {
  wrapId: string;
  wrapName: string;
  availability: AvailabilityDTO[];
}

/**
 * Client wrapper for the scheduling page that manages the success/confirmation
 * state transition after a booking is created.
 */
export function SchedulingClient({
  wrapId,
  wrapName,
  availability,
}: SchedulingClientProps) {
  const [confirmedBooking, setConfirmedBooking] = useState<BookingDTO | null>(
    null
  );

  if (confirmedBooking) {
    return (
      <div className="space-y-6">
        {/* Success banner */}
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border border-green-200 bg-green-50 px-5 py-4 dark:border-green-800 dark:bg-green-900/20"
        >
          <p className="text-sm font-semibold text-green-800 dark:text-green-400">
            ✓ Booking confirmed!
          </p>
          <p className="mt-0.5 text-xs text-green-700 dark:text-green-500">
            You will receive a confirmation email at{" "}
            <strong>{confirmedBooking.customerEmail}</strong>.
          </p>
        </div>

        <BookingCard booking={confirmedBooking} />

        <button
          type="button"
          onClick={() => setConfirmedBooking(null)}
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Make another booking
        </button>
      </div>
    );
  }

  return (
    <BookingForm
      wrapId={wrapId}
      wrapName={wrapName}
      availability={availability}
      onSuccess={setConfirmedBooking}
    />
  );
}
