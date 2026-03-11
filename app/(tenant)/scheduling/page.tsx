import { BookingCard } from "@/components/scheduling/booking-card";
import { CalendarClient } from "@/components/scheduling/calendar-client";
import { WorkspaceMetricCard, WorkspacePageIntro } from "@/components/nav/workspace-page-elements";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import { hasCapability } from "@/lib/authz/policy";
import { getAvailabilityWindows } from "@/lib/scheduling/fetchers/get-availability";
import { getBookings } from "@/lib/scheduling/fetchers/get-bookings";
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
  const { userId, authz } = await getSession();

  if (!userId) {
    redirect("/sign-in"); // Only redirect if not authenticated
  }

  const canViewAllBookings = hasCapability(authz, "scheduling.read.all");

  let availabilityWindows: Awaited<ReturnType<typeof getAvailabilityWindows>>["items"] = [];

  try {
    const result = await getAvailabilityWindows();
    availabilityWindows = result.items;
  } catch {
    // Gracefully degrade if availability data is unavailable
  }

  let upcomingBookings: Awaited<ReturnType<typeof getBookings>>["items"] = [];

  try {
    const result = await getBookings(
      {
        page: 1,
        pageSize: 3,
        fromDate: new Date(),
      },
      canViewAllBookings ? {} : { customerId: userId },
    );
    upcomingBookings = result.items;
  } catch {
    // Gracefully degrade
  }

  const availableWeekdays = [...new Set(availabilityWindows.map((w) => w.dayOfWeek))];

  return (
    <div className="space-y-6">
      <WorkspacePageIntro
        label="Calendar"
        title="Scheduling"
        description="Review open days, monitor upcoming installs, and move into booking without leaving the workspace flow."
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/scheduling/bookings">All Bookings</Link>
            </Button>
            <Button asChild>
              <Link href="/scheduling/book">Book Appointment</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <WorkspaceMetricCard
          label="Open Days"
          value={availableWeekdays.length}
          description="Weekdays currently accepting bookings."
        />
        <WorkspaceMetricCard
          label="Availability Windows"
          value={availabilityWindows.length}
          description="Total configured time windows for the shop."
        />
        <WorkspaceMetricCard
          label="Upcoming Jobs"
          value={upcomingBookings.length}
          description="Appointments coming up next."
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
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
          <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
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

          <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
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
