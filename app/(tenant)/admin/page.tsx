import Link from "next/link";
import { redirect } from "next/navigation";

import { StatsCard } from "@/components/admin/stats-card";
import { getTenantStats } from "@/lib/admin/fetchers/get-tenant-stats";
import { getSession } from "@/lib/auth/session";
import { getUserTenantRole } from "@/lib/tenancy/assert";

export default async function AdminDashboardPage() {
  const { tenantId, userId } = await getSession();
  if (!tenantId || !userId) redirect("/sign-in");

  // Only admins and owners can access the admin area
  const role = await getUserTenantRole(tenantId, userId);
  if (!role || !["admin", "owner"].includes(role as string)) redirect("/catalog");

  const stats = await getTenantStats(tenantId, userId);

  // Format revenue from cents to dollars
  const formattedRevenue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(stats.totalRevenue / 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Overview of your tenant metrics and management tools.
        </p>
      </div>

      {/* Metrics grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard
          title="Team Members"
          value={stats.totalMembers}
          description="Active members in your team"
        />
        <StatsCard
          title="Total Bookings"
          value={stats.totalBookings}
          description="All-time booking count"
        />
        <StatsCard
          title="Total Revenue"
          value={formattedRevenue}
          description="Revenue from paid invoices"
        />
      </div>

      {/* Quick links */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Management</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/admin/team"
            className="flex flex-col gap-1 rounded-md border p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <span className="font-medium">Team</span>
            <span className="text-sm text-muted-foreground">Manage team members and roles</span>
          </Link>
          {(role as string) === "owner" && (
            <Link
              href="/admin/settings"
              className="flex flex-col gap-1 rounded-md border p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <span className="font-medium">Settings</span>
              <span className="text-sm text-muted-foreground">Configure tenant settings</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
