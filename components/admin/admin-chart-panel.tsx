
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AdminAnalyticsSeriesPointDTO } from '@/types/admin.types'

interface AdminChartPanelProps {
    title: string
    series: AdminAnalyticsSeriesPointDTO[]
}


export function AdminChartPanel({ title, series }: AdminChartPanelProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-950/80 text-neutral-100">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {series.length === 0 ? (
                    <p className="text-sm text-neutral-400">No analytics data for this range.</p>
                ) : (
                    <div className="space-y-2">
                        {series.map((point) => (
                            <div
                                key={point.date}
                                className="flex items-center justify-between rounded border border-neutral-800 px-3 py-2 text-sm"
                            >
                                <span className="text-neutral-300">{point.date}</span>
                                <span className="text-neutral-100">
                                    bookings {point.bookingsCount} · previews{' '}
                                    {point.previewGenerationCount}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
