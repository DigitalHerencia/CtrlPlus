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
  availableWeekdays: number[];
  selectedDate?: Date | null;
  onDateSelect?: (date: Date) => void;
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
      return;
    }
    setViewMonth(viewMonth - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
      return;
    }
    setViewMonth(viewMonth + 1);
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

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="w-full max-w-sm rounded-xl border border-neutral-800 bg-neutral-950/50 p-3">
      <div className="mb-4 flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={prevMonth} aria-label="Previous month">
          ‹
        </Button>
        <span className="text-sm font-semibold text-neutral-100">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <Button variant="outline" size="icon" onClick={nextMonth} aria-label="Next month">
          ›
        </Button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1">
        {DAYS_OF_WEEK.map((d) => (
          <div key={d} className="py-1 text-center text-xs font-medium text-neutral-500">
            {d}
          </div>
        ))}
      </div>

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
                available && !selected
                  ? "cursor-pointer text-neutral-100 hover:bg-blue-500/20"
                  : "",
                selected ? "bg-blue-500 text-white hover:bg-blue-500/90" : "",
                todayCell && !selected ? "border border-blue-500/50 font-medium text-blue-200" : "",
                !available && "cursor-not-allowed text-neutral-700 opacity-50",
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      {availableWeekdays.length === 0 && (
        <p className="mt-4 text-center text-sm text-neutral-500">No availability configured.</p>
      )}
    </div>
  );
}
