import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
    return (
        <div className="space-y-6">
            {/* Header section */}
            <section className="rounded-2xl border border-neutral-800 bg-neutral-950/90 p-8 text-neutral-100 shadow-[0_24px_80px_-56px_rgba(0,0,0,0.95)]">
                <Skeleton className="h-4 w-20 rounded-full" />
                <Skeleton className="mt-4 h-12 w-72 rounded-lg" />
                <Skeleton className="mt-4 h-6 max-w-3xl rounded-lg" />
            </section>

            {/* Main content grid */}
            <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
                {/* Sidebar */}
                <div className="space-y-6">
                    <Card className="border-neutral-800 bg-neutral-950/90">
                        <CardHeader>
                            <CardTitle>
                                <Skeleton className="h-6 w-40 rounded" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-56 rounded-xl" />
                            <Skeleton className="h-12 rounded-lg" />
                        </CardContent>
                    </Card>
                    <Card className="border-neutral-800 bg-neutral-950/90">
                        <CardHeader>
                            <CardTitle className="h-6 w-36 rounded-full bg-neutral-800" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="h-4 rounded-full bg-neutral-800" />
                            <div className="h-4 w-5/6 rounded-full bg-neutral-800/80" />
                            <div className="h-4 w-4/6 rounded-full bg-neutral-800/70" />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-neutral-800 bg-neutral-950/90">
                        <CardHeader className="space-y-4">
                            <div className="flex items-center justify-between gap-4">
                                <CardTitle className="h-6 w-48 rounded-full bg-neutral-800" />
                                <div className="h-10 w-40 rounded-lg bg-neutral-800" />
                            </div>
                            <div className="h-12 rounded-lg bg-neutral-900" />
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 lg:grid-cols-2">
                                <div className="h-72 rounded-xl bg-neutral-900" />
                                <div className="h-72 rounded-xl bg-neutral-900" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-neutral-800 bg-neutral-950/90">
                        <CardHeader>
                            <CardTitle className="h-6 w-44 rounded-full bg-neutral-800" />
                        </CardHeader>
                        <CardContent>
                            <div className="h-136 rounded-xl bg-neutral-900" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
