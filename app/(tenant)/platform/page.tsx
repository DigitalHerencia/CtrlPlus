import { WorkspacePageIntro } from "@/components/shared/tenant-elements";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  clearStuckWebhookProcessingEvents,
  resetFailedWebhookLocks,
} from "@/lib/platform/actions/manage-webhook-events";
import { getPlatformStatusOverview } from "@/lib/platform/fetchers/get-platform-status-overview";
import { getWebhookOperationsOverview } from "@/lib/platform/fetchers/get-webhook-operations-overview";

function serializeFailureIds(ids: string[]): string {
  return ids.join(",");
}

function parseFailureIds(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string" || value.trim().length === 0) {
    return [];
  }

  return value
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id.length > 0);
}

export default async function PlatformPage() {
  const [overview, platformStatus] = await Promise.all([
    getWebhookOperationsOverview(),
    getPlatformStatusOverview(),
  ]);
  const clerkFailureIds = overview.clerk.recentFailures.map((event) => event.id);
  const stripeFailureIds = overview.stripe.recentFailures.map((event) => event.id);

  return (
    <div className="space-y-6">
      <WorkspacePageIntro
        label="Platform"
        title="Developer Operations"
        description="Monitor website and database status, inspect webhook health, and run safe maintenance actions."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
          <CardHeader>
            <CardTitle>Database Health</CardTitle>
            <CardDescription>Live snapshot of Neon/Postgres runtime state.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Active users: {platformStatus.activeUsers}</p>
            <p>Active bookings: {platformStatus.activeBookings}</p>
            <p>Active invoices: {platformStatus.activeInvoices}</p>
            <p>Active catalog items: {platformStatus.activeWraps}</p>
          </CardContent>
        </Card>

        <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
          <CardHeader>
            <CardTitle>Connection Diagnostics</CardTitle>
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
        <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
          <CardHeader>
            <CardTitle>Clerk Webhooks</CardTitle>
            <CardDescription>
              Status of user/session/subscription webhook processing.
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
          <CardHeader>
            <CardTitle>Stripe Webhooks</CardTitle>
            <CardDescription>Status of checkout/payment webhook processing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Processed: {overview.stripe.processed}</p>
            <p>Failed: {overview.stripe.failed}</p>
            <p>Processing: {overview.stripe.processing}</p>
            <p>Stale processing: {overview.stripe.staleProcessing}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
        <CardHeader>
          <CardTitle>Safe Recovery Actions</CardTitle>
          <CardDescription>
            Clear stuck processing rows and reset failed lock records to enable controlled replay.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <form
            action={async () => {
              "use server";
              await clearStuckWebhookProcessingEvents();
            }}
          >
            <Button
              type="submit"
              className="transition-all hover:border-2 hover:border-blue-600 hover:bg-transparent hover:text-blue-600"
              variant="default"
            >
              Clear Stale Processing Locks
            </Button>
          </form>

          <form
            action={async (formData) => {
              "use server";
              const eventIds = parseFailureIds(formData.get("eventIds"));
              if (eventIds.length === 0) return;
              await resetFailedWebhookLocks({ source: "clerk", eventIds });
            }}
          >
            <input type="hidden" name="eventIds" value={serializeFailureIds(clerkFailureIds)} />
            <Button
              type="submit"
              className="transition-all hover:border-2 hover:border-blue-600 hover:bg-transparent hover:text-blue-600"
              variant="default"
            >
              Reset Clerk Failed Locks
            </Button>
          </form>

          <form
            action={async (formData) => {
              "use server";
              const eventIds = parseFailureIds(formData.get("eventIds"));
              if (eventIds.length === 0) return;
              await resetFailedWebhookLocks({ source: "stripe", eventIds });
            }}
          >
            <input type="hidden" name="eventIds" value={serializeFailureIds(stripeFailureIds)} />
            <Button
              type="submit"
              className="transition-all hover:border-2 hover:border-blue-600 hover:bg-transparent hover:text-blue-600"
              variant="default"
            >
              Reset Stripe Failed Locks
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
          <CardHeader>
            <CardTitle>Recent Clerk Failures</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            {overview.clerk.recentFailures.length === 0 ? (
              <p className="text-neutral-400">No recent failed Clerk webhook events.</p>
            ) : (
              overview.clerk.recentFailures.map((event) => (
                <div key={event.id} className="border border-neutral-800 p-2">
                  <p className="font-mono text-neutral-300">{event.id}</p>
                  <p className="text-neutral-400">{event.type}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
          <CardHeader>
            <CardTitle>Recent Stripe Failures</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            {overview.stripe.recentFailures.length === 0 ? (
              <p className="text-neutral-400">No recent failed Stripe webhook events.</p>
            ) : (
              overview.stripe.recentFailures.map((event) => (
                <div key={event.id} className="border border-neutral-800 p-2">
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
