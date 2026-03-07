import Link from "next/link";
import { ShieldCheck, Users, Wrench } from "lucide-react";
import { redirect } from "next/navigation";

import { StatsCard } from "@/components/admin/stats-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTenantStats } from "@/lib/admin/fetchers/get-tenant-stats";
import { getSession } from "@/lib/auth/session";
import { getUserTenantRole } from "@/lib/tenancy/assert";

export default async function AdminDashboardPage() {
  const { tenantId, userId } = await getSession();
  if (!tenantId || !userId) redirect("/sign-in");

  const role = await getUserTenantRole(tenantId, userId);
  if (!role || !["admin", "owner"].includes(role)) redirect("/catalog");

  const stats = await getTenantStats(tenantId, userId);

  const formattedRevenue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(stats.totalRevenue / 100);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/70 bg-card/90 p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <Badge
              variant="secondary"
              className="border border-border/80 bg-accent/70 text-accent-foreground"
            >
              Admin
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Review performance and manage tenant operations from one place.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
            <ShieldCheck className="h-4 w-4" />
            Role: {role}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard
          title="Team Members"
          value={stats.totalMembers}
          description="Active members in your tenant"
        />
        <StatsCard
          title="Total Bookings"
          value={stats.totalBookings}
          description="Booked jobs across your team"
        />
        <StatsCard
          title="Total Revenue"
          value={formattedRevenue}
          description="Paid invoice revenue"
        />
      </div>

      <Card className="border-border/70 bg-card/95">
        <CardHeader>
          <CardTitle>Management</CardTitle>
          <CardDescription>Navigate to team and tenant controls.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/admin/team"
            className="group rounded-lg border border-border/70 bg-background/60 p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
          >
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Users className="h-4 w-4 text-primary" /> Team
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage members and role assignments.
            </p>
          </Link>
          {role === "owner" && (
            <Link
              href="/admin/settings"
              className="group rounded-lg border border-border/70 bg-background/60 p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
            >
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Wrench className="h-4 w-4 text-primary" /> Settings
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Configure tenant identity and metadata.
              </p>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
