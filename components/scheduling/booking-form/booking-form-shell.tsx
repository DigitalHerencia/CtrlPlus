
import type { ReactNode } from 'react'

interface BookingFormShellProps {
    title?: string
    description?: string
    children: ReactNode
}


export function BookingFormShell({
    title = 'Create Booking',
    description = 'Pick slot, collect customer information, and submit booking.',
    children,
}: BookingFormShellProps) {
    return (
        <div className="mx-auto max-w-3xl space-y-8">
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight text-neutral-100">{title}</h1>
                <p className="text-sm text-neutral-400">{description}</p>
            </div>
            <div className="space-y-4">{children}</div>
        </div>
    )
}
