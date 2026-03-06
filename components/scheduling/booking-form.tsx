"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarClient } from "./calendar-client";
import { TimeSlot } from "./time-slot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createBooking } from "@/lib/scheduling/actions/create-booking";

interface AvailabilityWindow {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  capacity: number;
}

interface WrapOption {
  id: string;
  name: string;
  price: number;
}

interface BookingFormProps {
  availabilityWindows: AvailabilityWindow[];
  wraps: WrapOption[];
}

/** Day-of-week indices derived from availability windows */
function getAvailableWeekdays(windows: AvailabilityWindow[]): number[] {
  return [...new Set(windows.map((w) => w.dayOfWeek))];
}

/** Returns windows matching a given Date's day of week */
function getWindowsForDate(windows: AvailabilityWindow[], date: Date): AvailabilityWindow[] {
  const dow = date.getDay();
  return windows.filter((w) => w.dayOfWeek === dow);
}

/** Build the start DateTime for a given date + "HH:mm" time string */
function buildDateTime(date: Date, timeStr: string): Date {
  const [hourStr, minuteStr] = timeStr.split(":");
  const result = new Date(date);
  result.setHours(parseInt(hourStr, 10), parseInt(minuteStr ?? "0", 10), 0, 0);
  return result;
}

export function BookingForm({ availabilityWindows, wraps }: BookingFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedWindowId, setSelectedWindowId] = useState<string | null>(null);
  const [selectedWrapId, setSelectedWrapId] = useState<string>(wraps[0]?.id ?? "");
  const [error, setError] = useState<string | null>(null);

  if (wraps.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-500">
        No wrap services are available for booking at this time.
      </div>
    );
  }

  const availableWeekdays = getAvailableWeekdays(availabilityWindows);
  const windowsForDay = selectedDate ? getWindowsForDate(availabilityWindows, selectedDate) : [];

  function handleDateSelect(date: Date) {
    setSelectedDate(date);
    setSelectedWindowId(null); // reset time slot on new date
  }

  function handleSubmit() {
    if (!selectedDate || !selectedWindowId || !selectedWrapId) return;

    const window = availabilityWindows.find((w) => w.id === selectedWindowId);
    if (!window) return;

    const startTime = buildDateTime(selectedDate, window.startTime);
    const endTime = buildDateTime(selectedDate, window.endTime);

    setError(null);
    startTransition(async () => {
      try {
        await createBooking({ wrapId: selectedWrapId, startTime, endTime });
        router.push("/scheduling/bookings");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create booking.");
      }
    });
  }

  const canSubmit = selectedDate !== null && selectedWindowId !== null && selectedWrapId !== "";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Select a Date</CardTitle>
          <CardDescription>Highlighted days have available time slots.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <CalendarClient
            availableWeekdays={availableWeekdays}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
        </CardContent>
      </Card>

      {/* Right: Time slots + wrap selector */}
      <div className="space-y-4">
        {selectedDate ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Available Times for{" "}
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {windowsForDay.length === 0 ? (
                  <p className="text-sm text-neutral-500">No time slots available for this day.</p>
                ) : (
                  windowsForDay.map((w) => (
                    <TimeSlot
                      key={w.id}
                      startTime={w.startTime}
                      endTime={w.endTime}
                      capacity={w.capacity}
                      isSelected={selectedWindowId === w.id}
                      onClick={() => setSelectedWindowId(w.id)}
                    />
                  ))
                )}
              </CardContent>
            </Card>

            {wraps.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Select a Wrap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {wraps.map((wrap) => (
                      <button
                        key={wrap.id}
                        type="button"
                        onClick={() => setSelectedWrapId(wrap.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                          selectedWrapId === wrap.id
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-neutral-200 bg-white dark:bg-neutral-900 dark:border-neutral-700 hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{wrap.name}</span>
                          <span className="text-sm text-neutral-600">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(wrap.price / 100)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-neutral-500 text-sm">
              Select a date to see available time slots.
            </CardContent>
          </Card>
        )}

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <Button onClick={handleSubmit} disabled={!canSubmit || isPending} className="w-full">
          {isPending ? "Booking…" : "Confirm Booking"}
        </Button>
      </div>
    </div>
  );
}
