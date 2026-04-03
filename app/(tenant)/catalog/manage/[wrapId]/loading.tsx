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

            {/* Tabs skeleton */}
            <div className="flex gap-4 border-b border-neutral-800">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-24 rounded" />
                ))}
            </div>

            {/* Form content grid */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Left: Media upload */}
                <div className="space-y-4">
                    <Skeleton className="aspect-square w-full rounded" />
                    <Skeleton className="h-10 w-full rounded" />
                </div>

                {/* Middle: Basic info */}
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24 rounded" />
                            <Skeleton className="h-10 w-full rounded" />
                        </div>
                    ))}
                </div>

                {/* Right: Preview/settings */}
                <div className="space-y-4">
                    <Card className="border-neutral-800 bg-neutral-950/90">
                        <CardHeader>
                            <CardTitle>
                                <Skeleton className="h-5 w-32 rounded" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-4 w-full rounded" />
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Submit buttons */}
            <div className="flex gap-2">
                <Skeleton className="h-10 w-24 rounded" />
                <Skeleton className="h-10 w-24 rounded" />
            </div>
        </div>
    )
}
