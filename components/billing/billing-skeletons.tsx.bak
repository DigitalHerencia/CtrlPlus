import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Billing-specific skeleton components
 * Mapped 1:1 to real billing UI structure
 */

export function BillingInvoiceTableSkeleton() {
    return (
        <div className="space-y-2">
            {/* Header */}
            <div className="mb-3 grid grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 rounded" />
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-12 rounded" />
            ))}
        </div>
    )
}

export function BillingKpiCardsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
                <Card key={i} className="border-neutral-800 bg-neutral-950/90">
                    <CardHeader>
                        <CardTitle>
                            <Skeleton className="h-6 w-24 rounded" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-32 rounded" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export function BillingInvoiceDetailSkeleton() {
    return (
        <Card className="border-neutral-800 bg-neutral-950/90">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-32 rounded" />
                        <Skeleton className="h-4 w-40 rounded" />
                    </div>
                    <Skeleton className="h-8 w-20 rounded" />
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Address blocks */}
                <div className="grid gap-6 md:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24 rounded" />
                            {Array.from({ length: 3 }).map((_, j) => (
                                <Skeleton key={j} className="h-3 w-full rounded" />
                            ))}
                        </div>
                    ))}
                </div>
                {/* Line items */}
                <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 rounded" />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
