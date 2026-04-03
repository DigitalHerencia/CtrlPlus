import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Platform-specific skeleton components
 * Mapped 1:1 to real platform UI structure
 */

export function PlatformHealthStatusSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="border-neutral-800 bg-neutral-950/90">
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full rounded" />
                            <Skeleton className="h-6 w-12 rounded" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export function PlatformIntegrationListSkeleton() {
    return (
        <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="border-neutral-800 bg-neutral-950/90">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-5 w-32 rounded" />
                            <Skeleton className="h-5 w-12 rounded" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-3 w-full rounded" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export function PlatformWebhookListSkeleton() {
    return (
        <div className="space-y-2">
            {/* Header */}
            <div className="mb-3 grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 rounded" />
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 rounded" />
            ))}
        </div>
    )
}

export function PlatformMetricsSkeleton() {
    return (
        <div className="grid gap-4 lg:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
                <Card key={i} className="border-neutral-800 bg-neutral-950/90">
                    <CardHeader>
                        <CardTitle>
                            <Skeleton className="h-6 w-40 rounded" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-48 w-full rounded" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
