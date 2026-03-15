import { PlatformRecoveryActions } from "@/components/platform/platform-recovery-actions";
import { WorkspacePageIntro } from "@/components/shared/tenant-elements";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPlatformStatusOverview } from "@/lib/platform/fetchers/get-platform-status-overview";
import { getWebhookOperationsOverview } from "@/lib/platform/fetchers/get-webhook-operations-overview";

export default async function PlatformPage() {
  // Fetch webhook and platform status in parallel for performance
  const [overview, platformStatus] = await Promise.all([
    getWebhookOperationsOverview(),
    getPlatformStatusOverview(),
  ]);

  // Extract failure IDs for recovery actions
  const clerkFailureIds = overview.clerk.recentFailures.map((event) => event.id);
  const stripeFailureIds = overview.stripe.recentFailures.map((event) => event.id);

  return (
    <div className="space-y-6" aria-label="Platform developer operations overview">
      <WorkspacePageIntro
        label="Platform"
        title="Developer Operations"
        description="Monitor website and database status, inspect webhook health, and run safe maintenance actions."
        // Intro component for context and accessibility
      />

      <div className="grid gap-4 md:grid-cols-2">
        {/* Database health snapshot */}
        <Card
          className="border-neutral-700 bg-neutral-950/80 text-neutral-100"
          aria-label="Database health"
        >
          <CardHeader>
            <CardTitle>Database health</CardTitle>
            <CardDescription>Live snapshot of Neon and Postgres runtime state.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Active users: {platformStatus.activeUsers}</p>
            <p>Active bookings: {platformStatus.activeBookings}</p>
            <p>Active invoices: {platformStatus.activeInvoices}</p>
            <p>Active catalog items: {platformStatus.activeWraps}</p>
          </CardContent>
        </Card>

        <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
          {/* Connection diagnostics snapshot */}
          <CardHeader>
            <CardTitle>Connection diagnostics</CardTitle>
            <CardDescription>Database version and generated timestamp.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Generated: {new Date(platformStatus.generatedAt).toLocaleString()}</p>
            <p className="wrap-break-word">Database: {platformStatus.databaseVersion}</p>
            <p>Environment: {process.env.NODE_ENV}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Clerk webhook status */}
        <Card
          className="border-neutral-700 bg-neutral-950/80 text-neutral-100"
          aria-label="Clerk webhook status"
        >
          <CardHeader>
            <CardTitle>Clerk webhooks</CardTitle>
            <CardDescription>
              Status of user, session, and subscription webhook processing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Processed: {overview.clerk.processed}</p>
            <p>Failed: {overview.clerk.failed}</p>
            <p>Processing: {overview.clerk.processing}</p>
            <p>Stale processing: {overview.clerk.staleProcessing}</p>
          </CardContent>
        </Card>

        <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
          {/* Stripe webhook status */}
          <CardHeader>
            <CardTitle>Stripe webhooks</CardTitle>
            <CardDescription>Status of checkout and payment webhook processing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Processed: {overview.stripe.processed}</p>
            <p>Failed: {overview.stripe.failed}</p>
            <p>Processing: {overview.stripe.processing}</p>
            <p>Stale processing: {overview.stripe.staleProcessing}</p>
          </CardContent>
        </Card>
      </div>

      <PlatformRecoveryActions
        // Platform recovery actions for failed webhooks
        clerkFailureIds={clerkFailureIds}
        stripeFailureIds={stripeFailureIds}
        clerkFailureCount={overview.clerk.failed}
        stripeFailureCount={overview.stripe.failed}
        staleProcessingCount={overview.clerk.staleProcessing + overview.stripe.staleProcessing}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Clerk failures */}
        <Card
          className="border-neutral-700 bg-neutral-950/80 text-neutral-100"
          aria-label="Recent Clerk failures"
        >
          <CardHeader>
            <CardTitle>Recent Clerk failures</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            {overview.clerk.recentFailures.length === 0 ? (
              <p className="text-neutral-400">No recent failed Clerk webhook events.</p>
            ) : (
              overview.clerk.recentFailures.map((event) => (
                <div
                  key={event.id}
                  className="border border-neutral-800 p-2"
                  aria-label={`Clerk failure ${event.id}`}
                >
                  <p className="font-mono text-neutral-300">{event.id}</p>
                  <p className="text-neutral-400">{event.type}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
          {/* Recent Stripe failures */}
          <CardHeader>
            <CardTitle>Recent Stripe failures</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            {overview.stripe.recentFailures.length === 0 ? (
              <p className="text-neutral-400">No recent failed Stripe webhook events.</p>
            ) : (
              overview.stripe.recentFailures.map((event) => (
                <div
                  key={event.id}
                  className="border border-neutral-800 p-2"
                  aria-label={`Stripe failure ${event.id}`}
                >
                  <p className="font-mono text-neutral-300">{event.id}</p>
                  <p className="text-neutral-400">{event.type}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
