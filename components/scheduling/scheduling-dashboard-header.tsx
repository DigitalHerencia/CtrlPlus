import Link from 'next/link'

import { Button } from '@/components/ui/button'

interface SchedulingDashboardHeaderProps {
    title?: string
    description?: string
}

export function SchedulingDashboardHeader({
    title = 'Scheduling',
    description = 'Review upcoming bookings, status, and slot usage.',
}: SchedulingDashboardHeaderProps) {
    return (
        <header className="flex flex-col gap-4 border border-neutral-800 bg-neutral-950/80 p-5 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-2xl font-bold text-neutral-100">{title}</h1>
                <p className="text-sm text-neutral-400">{description}</p>
            </div>
            <div className="flex items-center gap-2">
                <Button asChild variant="outline">
                    <Link href="/scheduling/manage">Manage</Link>
                </Button>
                <Button asChild>
                    <Link href="/scheduling/new">New Booking</Link>
                </Button>
            </div>
        </header>
    )
}
