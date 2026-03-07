import { BookingCard } from "@/components/scheduling/booking-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import { getBookingsForTenant } from "@/lib/scheduling/fetchers/get-bookings";
import Link from "next/link";
import { redirect } from "next/navigation";

interface BookingsPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function BookingsPage({ searchParams }: BookingsPageProps) {
  const { tenantId } = await getSession();

  if (!tenantId) {
    redirect("/sign-in");
  }

  const { tab = "upcoming" } = await searchParams;
  const isUpcoming = tab !== "past";

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
      <div className="rounded-xl border border-neutral-800 bg-gradient-to-r from-neutral-950 via-neutral-900 to-blue-950/60 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-100">Bookings</h1>
            <p className="mt-2 text-neutral-300">
              Manage your installation appointments across upcoming and past visits.
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
      </div>

      <div className="flex gap-1 rounded-lg border border-neutral-800 bg-neutral-900 p-1">
        <Link
          href="/scheduling/bookings?tab=upcoming"
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            isUpcoming ? "bg-blue-500 text-white" : "text-neutral-400 hover:text-neutral-100"
          }`}
        >
          Upcoming
        </Link>
        <Link
          href="/scheduling/bookings?tab=past"
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            !isUpcoming ? "bg-blue-500 text-white" : "text-neutral-400 hover:text-neutral-100"
          }`}
        >
          Past
        </Link>
      </div>

      <Card className="border-neutral-800 bg-neutral-900/60">
        <CardHeader>
          <CardTitle className="text-base text-neutral-100">
            {isUpcoming ? "Upcoming Appointments" : "Past Appointments"}
          </CardTitle>
          {total > 0 && (
            <CardDescription className="text-neutral-400">
              {total} booking{total !== 1 ? "s" : ""}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-neutral-500">
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
