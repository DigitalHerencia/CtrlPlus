import { Badge } from '@/components/ui/badge'

import type { PlatformIncidentDTO } from '@/types/platform.types'

interface PlatformIncidentFeedProps {
    incidents: PlatformIncidentDTO[]
}

export function PlatformIncidentFeed({ incidents }: PlatformIncidentFeedProps) {
    if (incidents.length === 0) {
        return <p className="text-sm text-neutral-400">No incidents in the selected window.</p>
    }

    return (
        <div className="space-y-3">
            {incidents.map((incident) => (
                <article
                    key={incident.id}
                    className="border border-neutral-800 bg-neutral-900/60 p-3"
                >
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-neutral-100">{incident.title}</p>
                        <Badge
                            variant={
                                incident.severity === 'error'
                                    ? 'destructive'
                                    : incident.severity === 'warning'
                                      ? 'outline'
                                      : 'secondary'
                            }
                        >
                            {incident.severity}
                        </Badge>
                    </div>
                    <p className="mt-1 text-xs text-neutral-400">{incident.message}</p>
                </article>
            ))}
        </div>
    )
}
