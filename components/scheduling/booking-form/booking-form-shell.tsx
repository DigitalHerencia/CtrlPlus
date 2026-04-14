/**
 * @introduction Components — TODO: short one-line summary of booking-form-shell.tsx
 *
 * @description TODO: longer description for booking-form-shell.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import type { ReactNode } from 'react'

interface BookingFormShellProps {
    title?: string
    description?: string
    children: ReactNode
}

/**
 * BookingFormShell — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
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
