import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { BookingTimelineEventDTO } from '@/types/scheduling.types'

interface BookingDetailTimelineProps {
    timeline: BookingTimelineEventDTO[]
}

export function BookingDetailTimeline({ timeline }: BookingDetailTimelineProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-950/80">
            <CardHeader>
                <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
                {timeline.length === 0 ? (
                    <p className="text-sm text-neutral-400">No lifecycle events captured yet.</p>
                ) : (
                    <ul className="space-y-3 text-sm">
                        {timeline.map((event) => (
                            <li key={event.id} className="rounded border border-neutral-800 p-3">
                                <p className="font-medium text-neutral-100">{event.label}</p>
                                <p className="text-xs text-neutral-500">
                                    {new Date(event.createdAt).toLocaleString()}
                                </p>
                                {event.notes ? (
                                    <p className="mt-1 text-neutral-300">{event.notes}</p>
                                ) : null}
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    )
}
