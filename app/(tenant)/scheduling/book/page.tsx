import { BookingForm } from "@/components/scheduling/booking-form";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth/session";
import { getWrapsForTenant } from "@/lib/catalog/fetchers/get-wraps";
import { getAvailabilityWindowsForTenant } from "@/lib/scheduling/fetchers/get-availability";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function BookPage() {
  const { tenantId } = await getSession();

  if (!tenantId) {
    redirect("/sign-in");
  }

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
      <div className="rounded-xl border border-neutral-800 bg-gradient-to-r from-neutral-950 via-neutral-900 to-blue-950/60 p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-100">
              Book an Appointment
            </h1>
            <p className="mt-2 text-neutral-300">
              Select a date, time slot, and wrap package to schedule your installation.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/scheduling">← Back to Calendar</Link>
          </Button>
        </div>
      </div>

      {wraps.length === 0 && (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
          No wraps are available for this tenant yet. Please add wraps to the catalog before
          booking.
        </div>
      )}

      {availabilityWindows.length === 0 && (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
          No availability windows are configured. Please contact the shop to set up booking
          availability.
        </div>
      )}

      <BookingForm availabilityWindows={availabilityWindows} wraps={wraps} />
    </div>
  );
}
