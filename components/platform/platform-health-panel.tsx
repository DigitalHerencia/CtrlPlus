
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import type { DependencyHealthDTO } from '@/types/platform.types'

interface PlatformHealthPanelProps {
    dependencies: DependencyHealthDTO[]
}


export function PlatformHealthPanel({ dependencies }: PlatformHealthPanelProps) {
    return (
        <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
            <CardHeader>
                <CardTitle>Dependency health</CardTitle>
                <CardDescription className="text-neutral-400">
                    Real-time dependency status from server-side checks.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {dependencies.map((dependency) => (
                    <div
                        key={dependency.name}
                        className="flex items-center justify-between border border-neutral-800 bg-neutral-900/60 p-3"
                    >
                        <div>
                            <p className="text-sm font-medium capitalize text-neutral-100">
                                {dependency.name}
                            </p>
                            <p className="text-xs text-neutral-400">
                                {dependency.message ?? 'No warnings reported.'}
                            </p>
                        </div>
                        <Badge
                            variant={
                                dependency.status === 'healthy'
                                    ? 'secondary'
                                    : dependency.status === 'degraded'
                                      ? 'outline'
                                      : 'destructive'
                            }
                            className="uppercase"
                        >
                            {dependency.status}
                        </Badge>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
