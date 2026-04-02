import { revalidatePath } from 'next/cache'

const SCHEDULING_REVALIDATION_PATHS = ['/scheduling', '/scheduling/book', '/scheduling/bookings']

export function revalidateCatalogPaths(wrapId?: string): void {
    revalidatePath('/catalog')
    revalidatePath('/catalog/manage')

    if (wrapId) {
        revalidatePath(`/catalog/${wrapId}`)
    }
}

export function revalidateCatalogAndVisualizerPaths(wrapId?: string): void {
    revalidateCatalogPaths(wrapId)
    revalidatePath('/visualizer')
}

export function revalidateSchedulingPages(): void {
    for (const path of SCHEDULING_REVALIDATION_PATHS) {
        revalidatePath(path)
    }
}

export function revalidateBillingBookingRoute(invoiceId: string): void {
    revalidatePath(`/billing/${invoiceId}`)
}

export function revalidateAdminPaths(): void {
    revalidatePath('/admin')
    revalidatePath('/admin/moderation')
    revalidatePath('/admin/audit')
}

export function revalidateSettingsPaths(): void {
    revalidatePath('/settings')
    revalidatePath('/settings/profile')
    revalidatePath('/settings/account')
    revalidatePath('/settings/data')
}

export function revalidatePlatformPaths(): void {
    revalidatePath('/platform')
}
