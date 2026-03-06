import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getBookingsForTenant } from "@/lib/scheduling/fetchers/get-bookings";
import { BookingCard } from "@/components/scheduling/booking-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BookingsPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function BookingsPage({ searchParams }: BookingsPageProps) {
  const { user, tenantId } = await getSession();

  if (!user) {
    redirect("/sign-in");
  }

  const { tab = "upcoming" } = await searchParams;
  const isUpcoming = tab !== "past";

  // Fetch upcoming or past bookings
  let bookings: Awaited<ReturnType<typeof getBookingsForTenant>>["items"] = [];
  let total = 0;

  try {
    const now = new Date();
    const params = isUpcoming
      ? { page: 1, pageSize: 20, fromDate: now }
      : { page: 1, pageSize: 20, toDate: now };

    const result = await getBookingsForTenant(tenantId, params);
    bookings = result.items;
    total = result.total;
  } catch {
    // Gracefully degrade
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Manage your installation appointments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline">
            <Link href="/scheduling">← Calendar</Link>
          </Button>
          <Button asChild>
            <Link href="/scheduling/book">New Booking</Link>
          </Button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 border-b border-neutral-200 dark:border-neutral-700">
        <Link
          href="/scheduling/bookings?tab=upcoming"
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            isUpcoming
              ? "border-primary text-primary"
              : "border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          }`}
        >
          Upcoming
        </Link>
        <Link
          href="/scheduling/bookings?tab=past"
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            !isUpcoming
              ? "border-primary text-primary"
              : "border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          }`}
        >
          Past
        </Link>
      </div>

      {/* Booking list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {isUpcoming ? "Upcoming Appointments" : "Past Appointments"}
          </CardTitle>
          {total > 0 && (
            <CardDescription>
              {total} booking{total !== 1 ? "s" : ""}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-500 text-sm">
                {isUpcoming
                  ? "No upcoming bookings. Ready to schedule an appointment?"
                  : "No past bookings found."}
              </p>
              {isUpcoming && (
                <Button asChild className="mt-4">
                  <Link href="/scheduling/book">Book Appointment</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
