"use client";

import { useState } from "react";
import type { AvailabilityDTO } from "@/lib/scheduling/types";

interface CalendarViewProps {
  availability: AvailabilityDTO[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function formatMonthYear(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

/**
 * CalendarView renders a monthly calendar and highlights available dates.
 * Date selection is handled client-side and propagated via `onSelectDate`.
 */
export function CalendarView({
  availability,
  selectedDate,
  onSelectDate,
}: CalendarViewProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const availableDates = new Set(availability.map((a) => a.date));

  const days = getDaysInMonth(viewYear, viewMonth);

  // Pad the start of the grid so Monday/Tuesday/... align correctly
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
  const startOffset = firstDayOfWeek; // offset so Sunday lands in the first column

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          aria-label="Previous month"
          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          ‹
        </button>
        <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
          {formatMonthYear(viewYear, viewMonth)}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          aria-label="Next month"
          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          ›
        </button>
      </div>

      {/* Day-of-week labels */}
      <div className="mb-1 grid grid-cols-7 text-center text-xs font-medium text-zinc-400 dark:text-zinc-500">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Leading blank cells */}
        {Array.from({ length: startOffset }).map((_, i) => (
          <span key={`blank-${i}`} />
        ))}

        {days.map((day) => {
          const dateStr = day.toISOString().split("T")[0];
          const isAvailable = availableDates.has(dateStr);
          const isSelected = selectedDate === dateStr;
          const isPast =
            day <
            new Date(today.getFullYear(), today.getMonth(), today.getDate());

          return (
            <button
              key={dateStr}
              type="button"
              disabled={!isAvailable || isPast}
              onClick={() => onSelectDate(dateStr)}
              aria-label={`${dateStr}${isAvailable ? " – available" : " – unavailable"}`}
              aria-pressed={isSelected}
              className={[
                "flex aspect-square items-center justify-center rounded-lg text-sm transition-colors",
                isPast
                  ? "cursor-not-allowed text-zinc-300 dark:text-zinc-600"
                  : isAvailable
                    ? isSelected
                      ? "bg-blue-600 font-semibold text-white"
                      : "cursor-pointer font-medium text-zinc-700 hover:bg-blue-50 dark:text-zinc-200 dark:hover:bg-blue-900/30"
                    : "cursor-not-allowed text-zinc-300 dark:text-zinc-600",
              ].join(" ")}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex gap-4 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-full bg-blue-600" />
          Selected
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-full border border-zinc-300 dark:border-zinc-600" />
          Available
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-full bg-zinc-200 dark:bg-zinc-700" />
          Unavailable
        </span>
      </div>
    </div>
  );
}
