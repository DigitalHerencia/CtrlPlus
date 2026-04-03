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

            {/* New booking form skeleton */}
            <Card className="border-neutral-800 bg-neutral-950/90">
                <CardHeader>
                    <CardTitle>
                        <Skeleton className="h-6 w-40 rounded" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Form fields */}
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24 rounded" />
                            <Skeleton className="h-10 w-full rounded" />
                        </div>
                    ))}

                    {/* Date/time pickers */}
                    <div className="grid gap-4 md:grid-cols-2">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-24 rounded" />
                                <Skeleton className="h-10 w-full rounded" />
                            </div>
                        ))}
                    </div>

                    {/* Submit button */}
                    <Skeleton className="h-10 w-40 rounded" />
                </CardContent>
            </Card>
        </div>
    )
}
