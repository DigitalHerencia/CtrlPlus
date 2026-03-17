import { ClipboardList, DollarSign, Grid3x3, Layers } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { WorkspaceMetricCard, WorkspacePageIntro } from "@/components/shared/tenant-elements";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOwnerDashboardStats } from "@/lib/admin/fetchers/get-owner-dashboard-stats";
import { getSession } from "@/lib/auth/session";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session.isAuthenticated || !session.userId) redirect("/sign-in");

  let stats: Awaited<ReturnType<typeof getOwnerDashboardStats>> | null = null;
  let error: string | null = null;

  try {
    stats = await getOwnerDashboardStats();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load stats.";
  }

  const formattedRevenue = stats
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(stats.totalRevenue / 100)
    : "$0.00";

  return (
    <div className="space-y-6">
      <WorkspacePageIntro
        label="Operations Dashboard"
        title="Store Management"
        description="Manage the catalog, scheduling flow, and customer billing from one place."
      />

      {/* Loading/Error/Empty States */}
      {!stats && !error && (
        <div className="py-12 text-center text-neutral-400">Loading dashboard metrics...</div>
      )}
      {error && (
        <div className="border border-red-950/60 bg-red-950/30 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-4">
          <WorkspaceMetricCard
            label="Catalog Items"
            value={stats.wrapCount}
            description={`${stats.hiddenWrapCount} hidden from customers.`}
            icon={Grid3x3}
          />
          <WorkspaceMetricCard
            label="Upcoming Jobs"
            value={stats.upcomingBookingCount}
            description={`${stats.bookingCount} total appointments.`}
            icon={ClipboardList}
          />
          <WorkspaceMetricCard
            label="Collected Revenue"
            value={formattedRevenue}
            description={`${stats.openInvoiceCount} open invoices.`}
            icon={DollarSign}
          />
          <WorkspaceMetricCard
            label="Customer Count"
            value={stats.customerCount}
            description={"Unique customers with bookings."}
            icon={Layers}
          />
        </div>
      )}

      <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-neutral-100">Management Tools</CardTitle>
          <CardDescription>
            Tools for managing the catalog, scheduling, and billing.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <Link
            href="/catalog"
            className="hover:scale-103 group border border-neutral-700 bg-neutral-900 p-5 transition-all hover:border-blue-600"
          >
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-neutral-100">
              <Grid3x3 className="h-4 w-4 text-blue-600" /> Catalog
            </p>
            <p className="mt-2 text-sm text-neutral-100">Add, hide, or remove catalog items.</p>
          </Link>
          <Link
            href="/scheduling/bookings"
            className="hover:scale-103 group border border-neutral-700 bg-neutral-900 p-5 transition-all hover:border-blue-600"
          >
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-neutral-100">
              <ClipboardList className="h-4 w-4 text-blue-600" /> Scheduling
            </p>
            <p className="mt-2 text-sm text-neutral-100">Review all customer appointments.</p>
          </Link>
          <Link
            href="/billing"
            className="hover:scale-103 group border border-neutral-700 bg-neutral-900 p-5 transition-all hover:border-blue-600"
          >
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-neutral-100">
              <Layers className="h-4 w-4 text-blue-600" /> Billing
            </p>
            <p className="mt-2 text-sm text-neutral-100">Track invoices and payment status.</p>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
