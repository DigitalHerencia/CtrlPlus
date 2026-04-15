
import type { FlaggedItemDTO } from '@/types/admin.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ReactNode } from 'react'

interface AdminModerationQueueProps {
    items: FlaggedItemDTO[]
    actionsSlot?: ReactNode
}


export function AdminModerationQueue({ items, actionsSlot }: AdminModerationQueueProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-950/80 text-neutral-100">
            <CardHeader>
                <CardTitle>Moderation queue</CardTitle>
            </CardHeader>
            <CardContent>
                {items.length === 0 ? (
                    <p className="text-sm text-neutral-400">No flagged items in queue.</p>
                ) : (
                    <div className="space-y-3">
                        {items.map((item) => (
                            <article
                                key={item.id}
                                className="rounded border border-neutral-800 p-3"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-semibold text-neutral-100">
                                            {item.resourceType} · {item.resourceId}
                                        </p>
                                        <p className="mt-1 text-xs text-neutral-400">
                                            {item.reason} · flagged{' '}
                                            {item.flaggedAt.toLocaleString()}
                                        </p>
                                        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-neutral-500">
                                            {item.status}
                                        </p>
                                    </div>
                                    {actionsSlot}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
