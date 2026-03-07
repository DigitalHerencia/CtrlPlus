import { BookingCard } from "@/components/scheduling/booking-card";
import { CalendarClient } from "@/components/scheduling/calendar-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import { getAvailabilityWindowsForTenant } from "@/lib/scheduling/fetchers/get-availability";
import { getBookingsForTenant } from "@/lib/scheduling/fetchers/get-bookings";
import Link from "next/link";
import { redirect } from "next/navigation";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export default async function SchedulingPage() {
  const { tenantId } = await getSession();

  if (!tenantId) {
    redirect("/sign-in");
  }

  let availabilityWindows: Awaited<ReturnType<typeof getAvailabilityWindowsForTenant>>["items"] =
    [];

  try {
    const result = await getAvailabilityWindowsForTenant(tenantId);
    availabilityWindows = result.items;
  } catch {
    // Gracefully degrade if availability data is unavailable
  }

  let upcomingBookings: Awaited<ReturnType<typeof getBookingsForTenant>>["items"] = [];

  try {
    const result = await getBookingsForTenant(tenantId, {
      page: 1,
      pageSize: 3,
      fromDate: new Date(),
    });
    upcomingBookings = result.items;
  } catch {
    // Gracefully degrade
  }

  const availableWeekdays = [...new Set(availabilityWindows.map((w) => w.dayOfWeek))];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-neutral-800 bg-gradient-to-r from-neutral-950 via-neutral-900 to-blue-950/60 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-100">Scheduling</h1>
            <p className="mt-2 text-neutral-300">
              View availability and manage installation appointments.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline">
              <Link href="/scheduling/bookings">All Bookings</Link>
            </Button>
            <Button asChild>
              <Link href="/scheduling/book">Book Appointment</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border-neutral-800 bg-neutral-900/60">
            <CardHeader>
              <CardTitle className="text-neutral-100">Availability Calendar</CardTitle>
              <CardDescription className="text-neutral-400">
                Highlighted days have open time slots. Click a day to book.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <CalendarClient availableWeekdays={availableWeekdays} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-neutral-800 bg-neutral-900/60">
            <CardHeader>
              <CardTitle className="text-base text-neutral-100">Open Days</CardTitle>
            </CardHeader>
            <CardContent>
              {availabilityWindows.length === 0 ? (
                <p className="text-sm text-neutral-500">No availability windows configured.</p>
              ) : (
                <ul className="space-y-1.5">
                  {[0, 1, 2, 3, 4, 5, 6]
                    .filter((d) => availableWeekdays.includes(d))
                    .map((dow) => {
                      const slots = availabilityWindows.filter((w) => w.dayOfWeek === dow);
                      return (
                        <li key={dow} className="flex items-center justify-between text-sm">
                          <span className="font-medium text-neutral-200">{DAY_NAMES[dow]}</span>
                          <span className="text-neutral-400">
                            {slots.length} slot{slots.length !== 1 ? "s" : ""}
                          </span>
                        </li>
                      );
                    })}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="border-neutral-800 bg-neutral-900/60">
            <CardHeader>
              <CardTitle className="text-base text-neutral-100">Upcoming Bookings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingBookings.length === 0 ? (
                <p className="text-sm text-neutral-500">No upcoming bookings.</p>
              ) : (
                upcomingBookings.map((b) => (
                  <BookingCard
                    key={b.id}
                    booking={{
                      id: b.id,
                      wrapId: b.wrapId,
                      startTime: b.startTime,
                      endTime: b.endTime,
                      status: b.status,
                      totalPrice: b.totalPrice,
                    }}
                  />
                ))
              )}
              {upcomingBookings.length > 0 && (
                <Link
                  href="/scheduling/bookings"
                  className="block text-center text-sm text-blue-300 hover:underline"
                >
                  View all bookings →
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
