import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getAvailabilityWindowsForTenant } from "@/lib/scheduling/fetchers/get-availability";
import { getWrapsForTenant } from "@/lib/catalog/fetchers/get-wraps";
import { BookingForm } from "@/components/scheduling/booking-form";
import { Button } from "@/components/ui/button";

export default async function BookPage() {
  const { user, tenantId } = await getSession();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch active availability windows
  let availabilityWindows: {
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    capacity: number;
  }[] = [];

  try {
    const result = await getAvailabilityWindowsForTenant(tenantId);
    availabilityWindows = result.items.map((w) => ({
      id: w.id,
      dayOfWeek: w.dayOfWeek,
      startTime: w.startTime,
      endTime: w.endTime,
      capacity: w.capacitySlots,
    }));
  } catch {
    // Gracefully degrade
  }

  // Fetch wraps for the tenant
  let wraps: { id: string; name: string; price: number }[] = [];

  try {
    const result = await getWrapsForTenant(tenantId);
    wraps = result.map((w) => ({
      id: w.id,
      name: w.name,
      price: w.price,
    }));
  } catch {
    // Gracefully degrade
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Book an Appointment</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Select a date, time slot, and wrap to schedule your installation.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/scheduling">← Back to Calendar</Link>
        </Button>
      </div>

      {wraps.length === 0 && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800 p-4 text-sm text-yellow-800 dark:text-yellow-200">
          No wraps are available for this tenant yet. Please add wraps to the catalog before
          booking.
        </div>
      )}

      {availabilityWindows.length === 0 && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800 p-4 text-sm text-yellow-800 dark:text-yellow-200">
          No availability windows are configured. Please contact the shop to set up booking
          availability.
        </div>
      )}

      <BookingForm availabilityWindows={availabilityWindows} wraps={wraps} />
    </div>
  );
}
