import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Loading() {
    return (
        <div className="space-y-6">
            <section className="border border-neutral-700 bg-neutral-950/80 px-6 py-7">
                <div className="space-y-2">
                    <div className="h-4 w-24 rounded-full bg-neutral-800" />
                    <div className="h-12 w-56 rounded-lg bg-neutral-800" />
                    <div className="h-5 max-w-3xl rounded-lg bg-neutral-800/70" />
                </div>
            </section>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,1fr))]">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Card key={index} className="border-neutral-700 bg-neutral-950/80">
                        <CardContent className="space-y-3 p-6">
                            <div className="h-4 w-28 rounded-full bg-neutral-800" />
                            <div className="h-10 w-24 rounded-lg bg-neutral-800" />
                            <div className="h-4 w-40 rounded-full bg-neutral-800/70" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                {Array.from({ length: 2 }).map((_, index) => (
                    <Card key={index} className="border-neutral-700 bg-neutral-950/80">
                        <CardHeader>
                            <CardTitle className="h-6 w-40 rounded-full bg-neutral-800" />
                        </CardHeader>
                        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {Array.from({ length: 6 }).map((__, metricIndex) => (
                                <div key={metricIndex} className="h-20 rounded-xl bg-neutral-900/70" />
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-neutral-700 bg-neutral-950/80">
                <CardHeader>
                    <CardTitle className="h-6 w-48 rounded-full bg-neutral-800" />
                </CardHeader>
                <CardContent>
                    <div className="h-72 rounded-xl bg-neutral-900/70" />
                </CardContent>
            </Card>
        </div>
    )
}
