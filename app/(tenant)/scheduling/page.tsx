import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getAvailabilityWindowsForTenant } from "@/lib/scheduling/fetchers/get-availability";
import { getBookingsForTenant } from "@/lib/scheduling/fetchers/get-bookings";
import { CalendarClient } from "@/components/scheduling/calendar-client";
import { BookingCard } from "@/components/scheduling/booking-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SchedulingPage() {
  const { user, tenantId } = await getSession();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch availability windows (active only)
  let availabilityWindows: Awaited<ReturnType<typeof getAvailabilityWindowsForTenant>>["items"] =
    [];

  try {
    const result = await getAvailabilityWindowsForTenant(tenantId);
    availabilityWindows = result.items;
  } catch {
    // Gracefully degrade if availability data is unavailable
  }

  // Fetch upcoming bookings (first 3 for preview)
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scheduling</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            View availability and manage appointments
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Availability Calendar</CardTitle>
              <CardDescription>
                Highlighted days have open time slots. Click a day to book.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <CalendarClient availableWeekdays={availableWeekdays} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Availability summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Open Days</CardTitle>
            </CardHeader>
            <CardContent>
              {availabilityWindows.length === 0 ? (
                <p className="text-sm text-neutral-500">No availability windows configured.</p>
              ) : (
                <ul className="space-y-1">
                  {[0, 1, 2, 3, 4, 5, 6]
                    .filter((d) => availableWeekdays.includes(d))
                    .map((dow) => {
                      const DAY_NAMES = [
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                      ];
                      const slots = availabilityWindows.filter((w) => w.dayOfWeek === dow);
                      return (
                        <li key={dow} className="flex items-center justify-between text-sm">
                          <span className="font-medium">{DAY_NAMES[dow]}</span>
                          <span className="text-neutral-500">
                            {slots.length} slot{slots.length !== 1 ? "s" : ""}
                          </span>
                        </li>
                      );
                    })}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Upcoming bookings preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upcoming Bookings</CardTitle>
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
                  className="text-sm text-primary hover:underline block text-center"
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
