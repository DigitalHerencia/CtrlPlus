import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import type { PlatformActionResultDTO } from '@/types/platform.types'

interface PlatformMaintenanceResultCardProps {
    result: PlatformActionResultDTO
}

export function PlatformMaintenanceResultCard({ result }: PlatformMaintenanceResultCardProps) {
    return (
        <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
            <CardHeader>
                <CardTitle>{result.action}</CardTitle>
                <CardDescription className="text-neutral-400">{result.message}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-3">
                <Badge variant={result.success ? 'secondary' : 'destructive'}>
                    {result.success ? 'success' : 'failed'}
                </Badge>
                <p className="text-xs text-neutral-400">
                    Affected: {result.affectedCount ?? 'n/a'}
                </p>
            </CardContent>
        </Card>
    )
}
