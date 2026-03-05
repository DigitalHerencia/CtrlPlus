import type { TenantStats } from "@/lib/admin/types";

interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
}

function StatCard({ label, value, description }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-white p-6 dark:bg-neutral-900">
      <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold text-neutral-900 dark:text-neutral-50">
        {value}
      </p>
      {description && (
        <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
          {description}
        </p>
      )}
    </div>
  );
}

interface DashboardStatsProps {
  stats: TenantStats;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const revenueFormatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(stats.totalRevenue);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Wraps"
        value={stats.totalWraps}
        description="Active catalog items"
      />
      <StatCard
        label="Total Bookings"
        value={stats.totalBookings}
        description={`${stats.pendingBookings} pending`}
      />
      <StatCard
        label="Revenue (Paid)"
        value={revenueFormatted}
        description="Lifetime paid invoices"
      />
      <StatCard
        label="Team Members"
        value={stats.totalMembers}
        description="Active members"
      />
    </div>
  );
}
