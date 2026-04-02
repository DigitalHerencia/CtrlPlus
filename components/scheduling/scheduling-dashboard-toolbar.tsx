import type { ReactNode } from 'react'

import { Card, CardContent } from '@/components/ui/card'

interface SchedulingDashboardToolbarProps {
    children: ReactNode
}

export function SchedulingDashboardToolbar({ children }: SchedulingDashboardToolbarProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-950/80">
            <CardContent className="flex flex-wrap items-center gap-3 p-4">{children}</CardContent>
        </Card>
    )
}
