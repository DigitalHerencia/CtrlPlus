import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Loading() {
    return (
        <div className="space-y-6">
            <section className="border border-neutral-700 bg-neutral-950/80 px-6 py-7">
                <div className="space-y-2">
                    <div className="h-4 w-28 rounded-full bg-neutral-800" />
                    <div className="h-12 w-72 rounded-lg bg-neutral-800" />
                    <div className="h-5 max-w-2xl rounded-lg bg-neutral-800/70" />
                </div>
            </section>

            <Card className="max-w-6xl border-neutral-700 bg-neutral-950/80 text-neutral-100">
                <CardHeader className="space-y-4">
                    <CardTitle className="h-8 w-40 rounded-full bg-neutral-800" />
                    <div className="h-5 w-72 rounded-full bg-neutral-800/70" />
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <div className="h-8 w-28 rounded-full bg-neutral-800" />
                        <div className="h-11 rounded-lg bg-neutral-900" />
                        <div className="h-4 w-96 rounded-full bg-neutral-800/70" />
                    </div>

                    <div className="space-y-4">
                        <div className="h-8 w-56 rounded-full bg-neutral-800" />
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="h-28 rounded-2xl bg-neutral-900" />
                            <div className="h-28 rounded-2xl bg-neutral-900" />
                        </div>
                    </div>

                    <div className="grid gap-3">
                        <div className="h-24 rounded-2xl bg-neutral-900" />
                        <div className="h-24 rounded-2xl bg-neutral-900" />
                    </div>

                    <div className="h-12 w-40 rounded-lg bg-neutral-800" />
                </CardContent>
            </Card>
        </div>
    )
}
