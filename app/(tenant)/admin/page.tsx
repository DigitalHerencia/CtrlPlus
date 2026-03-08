import { ShieldCheck, Users, Wrench } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { TenantMetricCard, TenantPageHeader } from "@/components/tenant/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTenantStats } from "@/lib/admin/fetchers/get-tenant-stats";
import { getSession } from "@/lib/auth/session";
import { getUserTenantRole } from "@/lib/tenancy/assert";

export default async function AdminDashboardPage() {
  const { tenantId, userId } = await getSession();
  if (!tenantId || !userId) redirect("/sign-in");

  const role = await getUserTenantRole(tenantId, userId);
  // All roles have access; no role check

  const stats = await getTenantStats(tenantId);

  const formattedRevenue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(stats.totalRevenue / 100);

  return (
    <div className="space-y-6">
      <TenantPageHeader
        eyebrow="Operations"
        title="Admin Command Center"
        description="Review tenant health, monitor commercial performance, and jump into role or settings work without losing the dark workspace aesthetic."
        detail={
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-emerald-300 uppercase">
            <ShieldCheck className="h-4 w-4" />
            Role {role}
          </div>
        }
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/admin/team">Manage Team</Link>
            </Button>
            {role === "owner" ? (
              <Button asChild>
                <Link href="/admin/settings">Tenant Settings</Link>
              </Button>
            ) : null}
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <TenantMetricCard
          label="Team Members"
          value={stats.memberCount}
          description="Active members with access to this tenant."
          icon={Users}
        />
        <TenantMetricCard
          label="Booked Jobs"
          value={stats.bookingCount}
          description="Appointments currently tracked in the workspace."
          icon={ShieldCheck}
        />
        <TenantMetricCard
          label="Collected Revenue"
          value={formattedRevenue}
          description="Paid invoice volume captured for this tenant."
          icon={Wrench}
        />
      </div>

      <Card className="app-panel">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Badge variant="outline">Access</Badge>
            <CardTitle className="text-2xl font-bold text-neutral-100">Management</CardTitle>
          </div>
          <CardDescription>
            Move between access control and tenant identity controls.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/admin/team"
            className="group rounded-2xl border border-neutral-800 bg-neutral-950/70 p-5 transition hover:border-blue-600/40 hover:bg-neutral-900"
          >
            <p className="flex items-center gap-2 text-sm font-semibold tracking-[0.16em] text-neutral-100 uppercase">
              <Users className="h-4 w-4 text-blue-400" /> Team
            </p>
            <p className="mt-2 text-sm text-neutral-400">Manage members and role assignments.</p>
          </Link>
          {role === "owner" && (
            <Link
              href="/admin/settings"
              className="group rounded-2xl border border-neutral-800 bg-neutral-950/70 p-5 transition hover:border-blue-600/40 hover:bg-neutral-900"
            >
              <p className="flex items-center gap-2 text-sm font-semibold tracking-[0.16em] text-neutral-100 uppercase">
                <Wrench className="h-4 w-4 text-blue-400" /> Settings
              </p>
              <p className="mt-2 text-sm text-neutral-400">
                Configure tenant identity and metadata.
              </p>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
