/**
 * @introduction Components — TODO: short one-line summary of bookings-manager-header.tsx
 *
 * @description TODO: longer description for bookings-manager-header.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { WorkspacePageIntro } from '@/components/shared/tenant-elements'

/**
 * BookingsManagerHeader — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function BookingsManagerHeader() {
    return (
        <WorkspacePageIntro
            label="Scheduling Manager"
            title="Booking Operations"
            description="Oversee every install appointment, keep timelines accurate, and protect the customer experience from lead to handoff."
        />
    )
}
