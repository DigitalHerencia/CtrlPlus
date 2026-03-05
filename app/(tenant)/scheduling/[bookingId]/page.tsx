import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBookingById } from "@/lib/scheduling/fetchers/get-bookings";
import { BookingCard } from "@/components/scheduling/booking-card";

export const metadata: Metadata = {
  title: "Booking Details | CTRL+",
};

interface BookingDetailPageProps {
  params: Promise<{ bookingId: string }>;
}

/**
 * Booking detail page (Server Component).
 *
 * Fetches a single booking by ID (scoped to the current tenant) and renders
 * its details. Returns a 404 if the booking is not found or belongs to a
 * different tenant.
 */
export default async function BookingDetailPage({
  params,
}: BookingDetailPageProps) {
  // TODO: Resolve tenantId from request host once Clerk + Prisma are wired up.
  const tenantId = "demo-tenant";

  const { bookingId } = await params;
  const booking = await getBookingById(tenantId, bookingId);

  if (!booking) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/scheduling"
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Back to scheduling
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Booking details
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Booking #{bookingId.slice(-8).toUpperCase()}
        </p>
      </div>

      <BookingCard booking={booking} />
    </div>
  );
}
