import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
    return (
        <div className="space-y-6">
            {/* Breadcrumb skeleton */}
            <div className="flex items-center gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <Skeleton className="h-4 w-16 rounded" />
                        {i < 2 && <span>/</span>}
                    </div>
                ))}
            </div>

            {/* Main content grid */}
            <div className="grid gap-6 md:grid-cols-[1fr_400px]">
                {/* Left: Hero and gallery */}
                <div className="space-y-4">
                    <Skeleton className="aspect-video w-full rounded-lg" />
                    <div className="grid grid-cols-4 gap-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="aspect-square rounded" />
                        ))}
                    </div>
                </div>

                {/* Right: Details sidebar */}
                <Card className="h-fit border-neutral-800 bg-neutral-950/90">
                    <CardHeader>
                        <CardTitle className="space-y-2">
                            <Skeleton className="h-6 w-full rounded" />
                            <Skeleton className="h-4 w-3/4 rounded" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Price, status, etc */}
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex justify-between">
                                <Skeleton className="h-4 w-24 rounded" />
                                <Skeleton className="h-4 w-24 rounded" />
                            </div>
                        ))}
                        <Skeleton className="h-10 w-full rounded" />
                    </CardContent>
                </Card>
            </div>

            {/* Description section */}
            <Card className="border-neutral-800 bg-neutral-950/90">
                <CardHeader>
                    <CardTitle>
                        <Skeleton className="h-6 w-32 rounded" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-4 w-full rounded" />
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
