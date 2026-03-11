import { ClipboardList, DollarSign, Grid3x3, Layers } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { WorkspaceMetricCard, WorkspacePageIntro } from "@/components/nav/workspace-page-elements";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import { getOwnerDashboardStats } from "@/lib/admin/fetchers/get-owner-dashboard-stats";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session.isAuthenticated || !session.userId) redirect("/sign-in");

  const stats = await getOwnerDashboardStats();

  const formattedRevenue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(stats.totalRevenue / 100);

  return (
    <div className="space-y-6">
      <WorkspacePageIntro
        label="Owner Dashboard"
        title="Store Operations"
        description="Manage the shared catalog, scheduling flow, and customer billing operations from one place."
        detail={
          <div className="inline-flex items-center gap-2 border border-blue-600 bg-neutral-900 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-neutral-100 uppercase">
            Role {session.role}
          </div>
        }
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/catalog">Catalog</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/scheduling/bookings">Scheduling</Link>
            </Button>
            <Button asChild>
              <Link href="/billing">Billing</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <WorkspaceMetricCard
          label="Catalog Items"
          value={stats.wrapCount}
          description={`${stats.hiddenWrapCount} currently hidden from customers.`}
          icon={Grid3x3}
        />
        <WorkspaceMetricCard
          label="Upcoming Jobs"
          value={stats.upcomingBookingCount}
          description={`${stats.bookingCount} total appointments in the system.`}
          icon={ClipboardList}
        />
        <WorkspaceMetricCard
          label="Collected Revenue"
          value={formattedRevenue}
          description={`${stats.openInvoiceCount} open invoices awaiting payment.`}
          icon={DollarSign}
        />
      </div>

      <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-neutral-100">Management Tools</CardTitle>
          <CardDescription>
            Owner tools are optimized for the shared store catalog, scheduling, and billing.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <Link
            href="/catalog"
            className="group border border-neutral-800 bg-neutral-950/70 p-5 transition hover:border-blue-600/40 hover:bg-neutral-900"
          >
            <p className="flex items-center gap-2 text-sm font-semibold tracking-[0.16em] text-neutral-100 uppercase">
              <Grid3x3 className="h-4 w-4 text-blue-400" /> Catalog
            </p>
            <p className="mt-2 text-sm text-neutral-400">Add, hide, or remove catalog items.</p>
          </Link>
          <Link
            href="/scheduling/bookings"
            className="group border border-neutral-800 bg-neutral-950/70 p-5 transition hover:border-blue-600/40 hover:bg-neutral-900"
          >
            <p className="flex items-center gap-2 text-sm font-semibold tracking-[0.16em] text-neutral-100 uppercase">
              <ClipboardList className="h-4 w-4 text-blue-400" /> Scheduling
            </p>
            <p className="mt-2 text-sm text-neutral-400">Review all customer appointments.</p>
          </Link>
          <Link
            href="/billing"
            className="group border border-neutral-800 bg-neutral-950/70 p-5 transition hover:border-blue-600/40 hover:bg-neutral-900"
          >
            <p className="flex items-center gap-2 text-sm font-semibold tracking-[0.16em] text-neutral-100 uppercase">
              <Layers className="h-4 w-4 text-blue-400" /> Billing
            </p>
            <p className="mt-2 text-sm text-neutral-400">Track invoices and payment status.</p>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
