import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

            {/* Upload details section */}
            <Card className="border-neutral-800 bg-neutral-950/90">
                <CardHeader>
                    <CardTitle>
                        <Skeleton className="h-6 w-40 rounded" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <Skeleton className="h-4 w-24 rounded" />
                            <Skeleton className="h-4 flex-1 rounded" />
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Preview area */}
            <Card className="border-neutral-800 bg-neutral-950/90">
                <CardHeader>
                    <CardTitle>
                        <Skeleton className="h-6 w-32 rounded" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="aspect-video w-full rounded" />
                </CardContent>
            </Card>
        </div>
    )
}
