/**
 * @introduction Components — TODO: short one-line summary of scheduling-dashboard-toolbar.tsx
 *
 * @description TODO: longer description for scheduling-dashboard-toolbar.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import type { ReactNode } from 'react'

import { Card, CardContent } from '@/components/ui/card'

interface SchedulingDashboardToolbarProps {
    children: ReactNode
}

/**
 * SchedulingDashboardToolbar — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function SchedulingDashboardToolbar({ children }: SchedulingDashboardToolbarProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-950/80">
            <CardContent className="flex flex-wrap items-center gap-3 p-4">{children}</CardContent>
        </Card>
    )
}
