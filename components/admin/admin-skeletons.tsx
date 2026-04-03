import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Admin-specific skeleton components
 * Mapped 1:1 to real admin UI structure
 */

export function AdminKpiGridSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="border-neutral-800 bg-neutral-950/90">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <Skeleton className="h-4 w-24 rounded" />
                            <Skeleton className="h-4 w-12 rounded" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-16 rounded" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export function AdminChartSkeleton() {
    return (
        <Card className="border-neutral-800 bg-neutral-950/90">
            <CardHeader>
                <CardTitle>
                    <Skeleton className="h-6 w-32 rounded" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-64 w-full rounded" />
            </CardContent>
        </Card>
    )
}

export function AdminActivityFeedSkeleton() {
    return (
        <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex gap-4 rounded border border-neutral-800 p-3">
                    <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-48 rounded" />
                        <Skeleton className="h-3 w-32 rounded" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export function AdminAuditTableSkeleton() {
    return (
        <div className="space-y-2">
            {/* Header */}
            <div className="mb-3 grid grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 rounded" />
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-10 rounded" />
            ))}
        </div>
    )
}
