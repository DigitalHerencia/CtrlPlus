import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
    return (
        <div className="space-y-6">
            {/* Header skeleton */}
            <div>
                <Skeleton className="mb-2 h-4 w-20 rounded-full" />
                <Skeleton className="mb-2 h-8 w-64 rounded-lg" />
                <Skeleton className="h-5 max-w-2xl rounded-lg" />
            </div>

            {/* Controls skeleton */}
            <div className="flex gap-2">
                <Skeleton className="h-10 w-32 rounded" />
                <Skeleton className="h-10 w-32 rounded" />
            </div>

            {/* Table skeleton */}
            <Card className="border-neutral-800 bg-neutral-950/90">
                <CardHeader>
                    <CardTitle>
                        <Skeleton className="h-6 w-40 rounded" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full rounded" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
