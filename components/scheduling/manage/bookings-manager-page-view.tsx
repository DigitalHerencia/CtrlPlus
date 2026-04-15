import Link from 'next/link'
import type { ReactNode } from 'react'
import { CalendarClock, CircleCheckBig, FolderClock, RotateCw } from 'lucide-react'

import {
    WorkspaceMetricCard,
    WorkspacePageContextCard,
    WorkspacePageIntro,
} from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface BookingsManagerPageViewProps {
    total: number
    requested: number
    confirmed: number
    completed: number
    filters: ReactNode
    table: ReactNode
}

export function BookingsManagerPageView({
    total,
    requested,
    confirmed,
    completed,
    filters,
    table,
}: BookingsManagerPageViewProps) {
    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Scheduling"
                title="Manage Appointments"
                description="Coordinate customer appointment requests, confirm install times, and keep the schedule aligned with real shop capacity."
            />
            <WorkspacePageContextCard
                title="Operator Actions"
                description="Review the customer-facing appointment experience when needed, then return here for owner/admin coordination."
            >
                <Button asChild variant="outline">
                    <Link href="/scheduling">Customer View</Link>
                </Button>
            </WorkspacePageContextCard>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:gap-8 xl:grid-cols-4">
                <WorkspaceMetricCard
                    label="Total Appointments"
                    value={total}
                    description="Visible inside the active manager filters."
                    icon={CalendarClock}
                />
                <WorkspaceMetricCard
                    label="Requested"
                    value={requested}
                    description="Requests still waiting on owner/admin review."
                    icon={FolderClock}
                />
                <WorkspaceMetricCard
                    label="Confirmed"
                    value={confirmed}
                    description="Install times already approved and ready for the bay."
                    icon={CircleCheckBig}
                />
                <WorkspaceMetricCard
                    label="Completed"
                    value={completed}
                    description="Finished appointments ready for billing follow-through."
                    icon={RotateCw}
                />
            </div>

            <Card className="border-neutral-700 bg-neutral-950/80">
                <CardContent className="p-6">{filters}</CardContent>
            </Card>

            {table}
        </div>
    )
}
