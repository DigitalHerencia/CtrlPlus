/**
 * @introduction Components — TODO: short one-line summary of admin-activity-feed.tsx
 *
 * @description TODO: longer description for admin-activity-feed.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import Link from 'next/link'
import type { AdminActivityEventDTO } from '@/types/admin.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AdminActivityFeedProps {
    events: AdminActivityEventDTO[]
}

/**
 * AdminActivityFeed — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function AdminActivityFeed({ events }: AdminActivityFeedProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-950/80 text-neutral-100">
            <CardHeader>
                <CardTitle>Recent activity</CardTitle>
            </CardHeader>
            <CardContent>
                {events.length === 0 ? (
                    <p className="text-sm text-neutral-400">No activity recorded yet.</p>
                ) : (
                    <ul className="space-y-3">
                        {events.map((event) => (
                            <li key={event.id} className="rounded border border-neutral-800 p-3">
                                <p className="text-sm font-medium text-neutral-200">
                                    {event.label}
                                </p>
                                <div className="mt-2 flex items-center justify-between text-xs text-neutral-400">
                                    <span>{event.createdAt.toLocaleString()}</span>
                                    {event.href ? (
                                        <Link
                                            href={event.href}
                                            className="text-blue-400 hover:text-blue-300"
                                        >
                                            Open
                                        </Link>
                                    ) : null}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    )
}
