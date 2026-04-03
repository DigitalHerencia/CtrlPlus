import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
    return (
        <div className="space-y-6">
            {/* Header skeleton */}
            <div>
                <Skeleton className="mb-2 h-4 w-20 rounded-full" />
                <Skeleton className="mb-2 h-8 w-72 rounded-lg" />
                <Skeleton className="h-5 max-w-2xl rounded-lg" />
            </div>

            {/* Filters skeleton */}
            <div className="flex gap-2">
                <Skeleton className="h-10 w-28 rounded" />
                <Skeleton className="h-10 w-28 rounded" />
            </div>

            {/* Preview grid skeleton */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden border-neutral-800 bg-neutral-950/90">
                        <div className="aspect-square">
                            <Skeleton className="h-full w-full rounded-none" />
                        </div>
                        <CardHeader>
                            <Skeleton className="h-4 w-full rounded" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-10 w-full rounded" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
