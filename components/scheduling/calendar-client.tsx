"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface CalendarClientProps {
  /** Day-of-week indices (0=Sun … 6=Sat) that have availability windows */
  availableWeekdays: number[];
  selectedDate?: Date | null;
  onDateSelect?: (date: Date) => void;
  /** Earliest selectable date; defaults to today */
  minDate?: Date;
}

function normalizeToMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function CalendarClient({
  availableWeekdays,
  selectedDate,
  onDateSelect,
  minDate,
}: CalendarClientProps) {
  const today = normalizeToMidnight(new Date());

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const minDay = minDate ? normalizeToMidnight(minDate) : today;

  function isDayAvailable(day: number): boolean {
    const date = new Date(viewYear, viewMonth, day);
    if (date < minDay) return false;
    return availableWeekdays.includes(date.getDay());
  }

  function isDaySelected(day: number): boolean {
    if (!selectedDate) return false;
    const date = new Date(viewYear, viewMonth, day);
    return (
      date.getFullYear() === selectedDate.getFullYear() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getDate() === selectedDate.getDate()
    );
  }

  function isToday(day: number): boolean {
    return (
      viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate()
    );
  }

  // Build grid cells: leading nulls + day numbers
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="w-full max-w-sm">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={prevMonth} aria-label="Previous month">
          ‹
        </Button>
        <span className="font-semibold text-sm">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <Button variant="outline" size="icon" onClick={nextMonth} aria-label="Next month">
          ›
        </Button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS_OF_WEEK.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-neutral-500 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} />;
          }
          const available = isDayAvailable(day);
          const selected = isDaySelected(day);
          const todayCell = isToday(day);

          return (
            <button
              key={day}
              disabled={!available}
              onClick={() => onDateSelect?.(new Date(viewYear, viewMonth, day))}
              className={cn(
                "h-9 w-full rounded-md text-sm transition-colors",
                available && !selected ? "hover:bg-primary/10 cursor-pointer" : "",
                selected ? "bg-primary text-primary-foreground hover:bg-primary/90" : "",
                todayCell && !selected ? "border border-primary/50 font-medium" : "",
                !available && "text-neutral-300 cursor-not-allowed opacity-50",
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      {availableWeekdays.length === 0 && (
        <p className="text-center text-sm text-neutral-500 mt-4">No availability configured.</p>
      )}
    </div>
  );
}
