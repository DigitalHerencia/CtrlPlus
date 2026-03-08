import { BookingCard } from "@/components/scheduling/booking-card";
import { TenantEmptyState, TenantPageHeader } from "@/components/tenant/page-shell";
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
    redirect("/sign-in"); // Only redirect if not authenticated
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
      <TenantPageHeader
        eyebrow="Appointments"
        title="Bookings"
        description="Flip between upcoming and past installs while keeping navigation and actions consistent with the rest of the tenant workspace."
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/scheduling">Calendar</Link>
            </Button>
            <Button asChild>
              <Link href="/scheduling/book">New Booking</Link>
            </Button>
          </>
        }
      />

      <div className="inline-flex gap-1 rounded-2xl border border-neutral-800 bg-neutral-900/80 p-1">
        <Link
          href="/scheduling/bookings?tab=upcoming"
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
            isUpcoming
              ? "bg-blue-600 text-neutral-100 shadow-[0_16px_30px_-20px_rgba(37,99,235,0.9)]"
              : "text-neutral-400 hover:text-neutral-100"
          }`}
        >
          Upcoming
        </Link>
        <Link
          href="/scheduling/bookings?tab=past"
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
            !isUpcoming
              ? "bg-blue-600 text-neutral-100 shadow-[0_16px_30px_-20px_rgba(37,99,235,0.9)]"
              : "text-neutral-400 hover:text-neutral-100"
          }`}
        >
          Past
        </Link>
      </div>

      <Card className="app-panel">
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
            <TenantEmptyState
              title={isUpcoming ? "No upcoming bookings" : "No past bookings"}
              description={
                isUpcoming
                  ? "Ready to schedule the next install? Start a new booking from here."
                  : "Completed and historical appointments will appear here once they exist."
              }
              action={
                isUpcoming ? (
                  <Button asChild>
                    <Link href="/scheduling/book">Book Appointment</Link>
                  </Button>
                ) : null
              }
              className="border-0 bg-transparent shadow-none"
            />
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
