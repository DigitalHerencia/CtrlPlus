import 'server-only'

import { revalidatePath } from 'next/cache'

const SCHEDULING_REVALIDATION_PATHS = ['/scheduling', '/scheduling/book', '/scheduling/bookings']

export function revalidateSchedulingPages(): void {
    for (const path of SCHEDULING_REVALIDATION_PATHS) {
        revalidatePath(path)
    }
}

export function revalidateBillingBookingRoute(invoiceId: string): void {
    revalidatePath(`/billing/${invoiceId}`)
}
