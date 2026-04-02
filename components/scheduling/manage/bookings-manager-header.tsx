import Link from 'next/link'

import { Button } from '@/components/ui/button'

export function BookingsManagerHeader() {
    return (
        <header className="flex flex-col gap-4 border border-neutral-800 bg-neutral-950/80 p-5 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-2xl font-bold text-neutral-100">Scheduling Manager</h1>
                <p className="text-sm text-neutral-400">Review and operate tenant bookings.</p>
            </div>
            <div className="flex items-center gap-2">
                <Button asChild variant="outline">
                    <Link href="/scheduling">Customer View</Link>
                </Button>
                <Button asChild>
                    <Link href="/scheduling/manage/new">Create Booking</Link>
                </Button>
            </div>
        </header>
    )
}
