"use client";

import type { TimeSlot } from "@/lib/scheduling/types";

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  label: string;
  selectedSlotId: string | null;
  onSelectSlot: (slotId: string) => void;
}

/**
 * TimeSlotPicker renders the available time slots for a given date and allows
 * the user to select one. Slots with no remaining capacity are shown as
 * disabled with an "Unavailable" badge.
 */
export function TimeSlotPicker({
  slots,
  label,
  selectedSlotId,
  onSelectSlot,
}: TimeSlotPickerProps) {
  if (slots.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        No slots available for the selected date.
      </p>
    );
  }

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
        {label}
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {slots.map((slot) => {
          const isSelected = selectedSlotId === slot.id;
          const isDisabled = !slot.available || slot.remainingCapacity === 0;

          return (
            <button
              key={slot.id}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelectSlot(slot.id)}
              aria-pressed={isSelected}
              aria-label={`${slot.startTime} – ${slot.endTime}${isDisabled ? " (unavailable)" : ""}`}
              className={[
                "flex flex-col items-center rounded-lg border px-3 py-2 text-sm transition-colors",
                isDisabled
                  ? "cursor-not-allowed border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-600"
                  : isSelected
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "cursor-pointer border-zinc-200 bg-white text-zinc-700 hover:border-blue-400 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-blue-500 dark:hover:bg-blue-900/20",
              ].join(" ")}
            >
              <span className="font-semibold">
                {slot.startTime} – {slot.endTime}
              </span>
              {isDisabled ? (
                <span className="mt-0.5 text-xs">Unavailable</span>
              ) : (
                <span className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                  {slot.remainingCapacity}{" "}
                  {slot.remainingCapacity === 1 ? "spot" : "spots"} left
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
