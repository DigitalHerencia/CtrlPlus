import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { type PlatformStatusOverviewDTO } from '@/types/platform'

interface PlatformHealthOverviewProps {
    status: PlatformStatusOverviewDTO
}

export function PlatformHealthOverview({ status }: PlatformHealthOverviewProps) {
    return (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,1fr))]">
            <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100 xl:col-span-1">
                <CardHeader>
                    <CardTitle>Database</CardTitle>
                    <CardDescription className="text-neutral-400">
                        Current platform data snapshot and server version.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-neutral-300">
                    <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                        PostgreSQL version
                    </p>
                    <p className="font-medium text-neutral-100">{status.databaseVersion}</p>
                </CardContent>
            </Card>

            {[
                { label: 'Active users', value: status.activeUsers },
                { label: 'Active bookings', value: status.activeBookings },
                { label: 'Active invoices', value: status.activeInvoices },
                { label: 'Active wraps', value: status.activeWraps },
            ].map((item) => (
                <Card
                    key={item.label}
                    className="border-neutral-700 bg-neutral-950/80 text-neutral-100"
                >
                    <CardHeader className="pb-3">
                        <CardDescription className="text-neutral-400">{item.label}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Badge className="text-base" variant="secondary">
                            {item.value}
                        </Badge>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
