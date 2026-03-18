import { PlatformRecoveryActions } from '@/components/platform/platform-recovery-actions'
import { WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { getPlatformStatusOverview } from '@/lib/platform/fetchers/get-platform-status-overview'
import { getWebhookOperationsOverview } from '@/lib/platform/fetchers/get-webhook-operations-overview'

export default async function PlatformPage() {
    // Fetch dashboard data
    const [overview, platformStatus] = await Promise.all([
        getWebhookOperationsOverview(),
        getPlatformStatusOverview(),
    ])

    // Extract failure IDs for recovery actions
    const clerkFailureIds = overview.clerk.recentFailures.map((event) => event.id)
    const stripeFailureIds = overview.stripe.recentFailures.map((event) => event.id)

    // Dashboard blocks
    return (
        <div className="space-y-8" aria-label="Platform dashboard">
            <WorkspacePageIntro
                label="Platform"
                title="Developer Operations"
                description="Monitor website and database status, inspect webhook health, and run safe maintenance actions."
            />

            <div className="grid grid-cols-2 gap-6">
                {/* Database Health Block */}
                <Card
                    aria-label="Database health"
                    className="border-neutral-700 bg-neutral-950/80 text-neutral-100"
                >
                    <CardHeader>
                        <CardTitle>Database Health</CardTitle>
                        <CardDescription>Live snapshot of Neon/Postgres state.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex gap-2">
                            <span>Active users:</span>
                            <Badge>{platformStatus.activeUsers}</Badge>
                        </div>
                        <div className="flex gap-2">
                            <span>Active bookings:</span>
                            <Badge>{platformStatus.activeBookings}</Badge>
                        </div>
                        <div className="flex gap-2">
                            <span>Active invoices:</span>
                            <Badge>{platformStatus.activeInvoices}</Badge>
                        </div>
                        <div className="flex gap-2">
                            <span>Active wraps:</span>
                            <Badge>{platformStatus.activeWraps}</Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Webhook Status Block */}
                <Card
                    aria-label="Webhook status"
                    className="border-neutral-700 bg-neutral-950/80 text-neutral-100"
                >
                    <CardHeader>
                        <CardTitle>Webhook System Status</CardTitle>
                        <CardDescription>Stripe and Clerk webhook event health.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex gap-2">
                            <span>Stripe failures:</span>
                            <Badge
                                variant={
                                    overview.stripe.recentFailures.length > 0
                                        ? 'destructive'
                                        : 'default'
                                }
                            >
                                {overview.stripe.failed}
                            </Badge>
                        </div>
                        <div className="flex gap-2">
                            <span>Clerk failures:</span>
                            <Badge
                                variant={
                                    overview.clerk.recentFailures.length > 0
                                        ? 'destructive'
                                        : 'default'
                                }
                            >
                                {overview.clerk.failed}
                            </Badge>
                        </div>
                        <div className="flex gap-2">
                            <span>Stripe stale processing:</span>
                            <Badge>{overview.stripe.staleProcessing}</Badge>
                        </div>
                        <div className="flex gap-2">
                            <span>Clerk stale processing:</span>
                            <Badge>{overview.clerk.staleProcessing}</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Failures Table */}
            <Card
                aria-label="Recent failures"
                className="mt-8 border-neutral-700 bg-neutral-950/80 text-neutral-100"
            >
                <CardHeader>
                    <CardTitle>Recent Failures</CardTitle>
                    <CardDescription>
                        Latest failed webhook events for review and recovery.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event ID</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Processed At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {overview.stripe.recentFailures.concat(overview.clerk.recentFailures)
                                .length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-neutral-500">
                                        No recent failures
                                    </TableCell>
                                </TableRow>
                            ) : (
                                overview.stripe.recentFailures
                                    .concat(overview.clerk.recentFailures)
                                    .map((event) => (
                                        <TableRow key={event.id}>
                                            <TableCell>{event.id}</TableCell>
                                            <TableCell>{event.type}</TableCell>
                                            <TableCell>
                                                <Badge variant="destructive">{event.status}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                {event.processedAt
                                                    ? new Date(event.processedAt).toLocaleString()
                                                    : ''}
                                            </TableCell>
                                        </TableRow>
                                    ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Recovery Actions Block */}
            <Card
                aria-label="Recovery actions"
                className="border-neutral-700 bg-neutral-950/80 text-neutral-100"
            >
                <CardHeader>
                    <CardTitle>Platform Recovery Actions</CardTitle>
                    <CardDescription>
                        Safely clear stuck events and reset failed webhooks.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <PlatformRecoveryActions
                        clerkFailureIds={clerkFailureIds}
                        stripeFailureIds={stripeFailureIds}
                        clerkFailureCount={overview.clerk.failed}
                        stripeFailureCount={overview.stripe.failed}
                        staleProcessingCount={
                            overview.stripe.staleProcessing + overview.clerk.staleProcessing
                        }
                    />
                </CardContent>
            </Card>
        </div>
    )
}
