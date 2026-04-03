import { Card, CardContent, CardHeader } from '@/components/ui/card'
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

            {/* Actions bar skeleton */}
            <div className="flex gap-2">
                <Skeleton className="h-10 w-40 rounded" />
                <Skeleton className="h-10 w-32 rounded" />
            </div>

            {/* Content cards skeleton */}
            <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Card key={i} className="border-neutral-800 bg-neutral-950/90">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex-1 space-y-1">
                                    <Skeleton className="h-5 w-32 rounded" />
                                    <Skeleton className="h-4 w-48 rounded" />
                                </div>
                                <Skeleton className="h-8 w-20 rounded" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-12 w-full rounded" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
