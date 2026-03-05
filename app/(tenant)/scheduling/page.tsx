import { type Metadata } from "next";
import { getAvailability } from "@/lib/scheduling/fetchers/get-availability";
import { SchedulingClient } from "./_components/scheduling-client";

export const metadata: Metadata = {
  title: "Schedule Your Appointment | CTRL+",
  description: "Choose a drop-off and pick-up time for your vehicle wrap.",
};

interface SchedulingPageProps {
  searchParams: Promise<{ wrapId?: string; wrapName?: string }>;
}

/**
 * Scheduling page (Server Component).
 *
 * Fetches availability for the next 30 days and renders the interactive
 * booking form via SchedulingClient (a Client Component).
 *
 * The tenant is resolved server-side from the request context. wrapId / wrapName
 * are passed as query params by the catalog page when the customer clicks
 * "Schedule" on a wrap.
 */
export default async function SchedulingPage({
  searchParams,
}: SchedulingPageProps) {
  // TODO: Resolve tenantId from request host once Clerk + Prisma are wired up.
  const tenantId = "demo-tenant";

  const params = await searchParams;
  const wrapId = params.wrapId ?? "demo-wrap";
  const wrapName = params.wrapName
    ? decodeURIComponent(params.wrapName)
    : "Carbon Fiber Full Wrap";

  // Fetch availability for the next 30 days
  const today = new Date();
  const startDate = today.toISOString().split("T")[0];
  const endDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const availability = await getAvailability(tenantId, startDate, endDate);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Schedule your appointment
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Choose a drop-off and pick-up time for your vehicle wrap installation.
        </p>
      </div>

      <SchedulingClient
        wrapId={wrapId}
        wrapName={wrapName}
        availability={availability}
      />
    </div>
  );
}
