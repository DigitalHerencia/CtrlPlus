import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Loading() {
    return (
        <div className="space-y-6">
            <section className="border border-neutral-700 bg-neutral-950/80 px-6 py-7">
                <div className="space-y-2">
                    <div className="h-4 w-24 rounded-full bg-neutral-800" />
                    <div className="h-12 w-64 rounded-lg bg-neutral-800" />
                    <div className="h-5 max-w-2xl rounded-lg bg-neutral-800/70" />
                </div>
            </section>

            <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} className="border-neutral-700 bg-neutral-950/80">
                        <CardContent className="space-y-3 p-6">
                            <div className="h-4 w-24 rounded-full bg-neutral-800" />
                            <div className="h-10 w-16 rounded-lg bg-neutral-800" />
                            <div className="h-4 w-40 rounded-full bg-neutral-800/70" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="border-neutral-700 bg-neutral-950/80 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="h-6 w-48 rounded-full bg-neutral-800" />
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <div className="h-80 w-full max-w-sm rounded-xl bg-neutral-900" />
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <Card key={index} className="border-neutral-700 bg-neutral-950/80">
                            <CardHeader>
                                <CardTitle className="h-6 w-32 rounded-full bg-neutral-800" />
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="h-16 rounded-xl bg-neutral-900" />
                                <div className="h-16 rounded-xl bg-neutral-900" />
                                <div className="h-16 rounded-xl bg-neutral-900" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
