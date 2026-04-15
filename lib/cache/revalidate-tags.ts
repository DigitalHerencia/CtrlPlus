/**
 * @introduction Cache — TODO: short one-line summary of revalidate-tags.ts
 *
 * @description TODO: longer description for revalidate-tags.ts. Keep it short — one or two sentences.
 * Domain: cache
 * Public: TODO (yes/no)
 */
import { revalidatePath } from 'next/cache'
// Note: revalidateTag migration planned for Phase 3 after Next.js 16+ improvements

const SCHEDULING_REVALIDATION_PATHS = ['/scheduling', '/scheduling/new', '/scheduling/manage']

// ============================================================================
// CANONICAL CACHE TAG NAMING CONVENTION
// ============================================================================
// Pattern: {domain}:{entity}:{id?}
// Examples: billing:invoices, billing:invoice:inv_123, scheduling:booking:book_456
// Status: Defined for future migration to tag-based revalidation in Phase 3

/**
 * CacheTags — TODO: brief description.
 */
export const CacheTags = {
    // ---- Billing ----
    Billing: {
        Invoices: 'billing:invoices',
        Invoice: (id: string) => `billing:invoice:${id}`,
        Balance: 'billing:balance',
        PaymentStatus: (invoiceId: string) => `billing:payment-status:${invoiceId}`,
    },
    // ---- Scheduling ----
    Scheduling: {
        Availability: 'scheduling:availability',
        Rules: 'scheduling:availability:rules',
        Bookings: 'scheduling:bookings',
        Booking: (id: string) => `scheduling:booking:${id}`,
        Slots: 'scheduling:availability:slots',
    },
    // ---- Catalog ----
    Catalog: {
        Wraps: 'catalog:wraps',
        Wrap: (id: string) => `catalog:wrap:${id}`,
        Categories: 'catalog:categories',
        Category: (id: string) => `catalog:category:${id}`,
        Images: (wrapId: string) => `catalog:wrap:${wrapId}:images`,
    },
    // ---- Visualizer ----
    Visualizer: {
        Previews: 'visualizer:previews',
        Preview: (id: string) => `visualizer:preview:${id}`,
        PreviewsByWrap: (wrapId: string) => `visualizer:previews:wrap:${wrapId}`,
        PreviewsByUser: (userId: string) => `visualizer:previews:user:${userId}`,
    },
    // ---- Auth ----
    Auth: {
        User: (clerkUserId: string) => `auth:user:${clerkUserId}`,
        Users: 'auth:users',
        Session: (userId: string) => `auth:session:${userId}`,
    },
    // ---- Settings ----
    Settings: {
        UserPreferences: (userId: string) => `settings:user-prefs:${userId}`,
        TenantConfig: (tenantId: string) => `settings:tenant:${tenantId}`,
        NotificationSettings: (userId: string) => `settings:notifications:${userId}`,
    },
    // ---- Admin ----
    Admin: {
        Metrics: 'admin:metrics',
        AuditLog: 'admin:audit-log',
        FlaggedItems: 'admin:flagged-items',
        Flag: (id: string) => `admin:flag:${id}`,
    },
    // ---- Platform ----
    Platform: {
        Health: 'platform:health',
        Incidents: 'platform:incidents',
        WebhookMonitor: 'platform:webhook-monitor',
        VisualizerTools: 'platform:visualizer-tools',
        JobTools: 'platform:job-tools',
    },
} as const

// ============================================================================
// REVALIDATION FUNCTIONS (Phase 2: Enhanced path-based)
// ============================================================================

/**
 * revalidateBillingInvoice — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function revalidateBillingInvoice(invoiceId: string): void {
    revalidatePath('/billing')
    revalidatePath(`/billing/${invoiceId}`)
    revalidatePath('/')
}

/**
 * revalidateBillingAll — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function revalidateBillingAll(): void {
    revalidatePath('/billing')
}

/**
 * revalidateSchedulingAvailability — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function revalidateSchedulingAvailability(): void {
    for (const path of SCHEDULING_REVALIDATION_PATHS) {
        revalidatePath(path)
    }
}

/**
 * revalidateSchedulingBooking — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function revalidateSchedulingBooking(bookingId: string): void {
    void bookingId
    for (const path of SCHEDULING_REVALIDATION_PATHS) {
        revalidatePath(path)
    }
}

/**
 * revalidateSchedulingAll — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function revalidateSchedulingAll(): void {
    for (const path of SCHEDULING_REVALIDATION_PATHS) {
        revalidatePath(path)
    }
}

/**
 * revalidateCatalogWrap — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function revalidateCatalogWrap(wrapId: string): void {
    revalidatePath('/catalog')
    revalidatePath('/catalog/manage')
    revalidatePath(`/catalog/${wrapId}`)
    revalidatePath('/visualizer')
}

/**
 * revalidateCatalogCategories — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function revalidateCatalogCategories(): void {
    revalidatePath('/catalog')
    revalidatePath('/catalog/manage')
}

/**
 * revalidateCatalogAll — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function revalidateCatalogAll(): void {
    revalidatePath('/catalog')
    revalidatePath('/catalog/manage')
    revalidatePath('/visualizer')
}

/**
 * revalidateVisualizerPreview — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function revalidateVisualizerPreview(previewId: string): void {
    void previewId
    revalidatePath('/visualizer')
}

/**
 * revalidateVisualizerPreviewsByWrap — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function revalidateVisualizerPreviewsByWrap(wrapId: string): void {
    void wrapId
    revalidatePath('/visualizer')
}

/**
 * revalidateVisualizerPreviewsByUser — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function revalidateVisualizerPreviewsByUser(userId: string): void {
    void userId
    revalidatePath('/visualizer')
}

/**
 * revalidateAuthUser — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function revalidateAuthUser(clerkUserId: string): void {
    void clerkUserId
    // Auth state changes don't require path revalidation (session-based)
    // Will use tag-based in Phase 3
}

/**
 * revalidateSettingsUser — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function revalidateSettingsUser(userId: string): void {
    void userId
    revalidatePath('/settings')
}

/**
 * revalidateSettingsTenant — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function revalidateSettingsTenant(tenantId: string): void {
    void tenantId
    revalidatePath('/settings')
}

/**
 * revalidateAdminFlaggedItems — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function revalidateAdminFlaggedItems(): void {
    revalidatePath('/admin')
}

/**
 * revalidateAdminFlag — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function revalidateAdminFlag(flagId: string): void {
    void flagId
    revalidatePath('/admin')
}

/**
 * revalidateAdminAuditLog — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function revalidateAdminAuditLog(): void {
    revalidatePath('/admin')
}

/**
 * revalidatePlatformHealth — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function revalidatePlatformHealth(): void {
    revalidatePath('/platform')
}

// ============================================================================
// LEGACY PATH-BASED FUNCTIONS (being unified above)
// ============================================================================

/**
 * revalidateCatalogPaths — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function revalidateCatalogPaths(wrapId?: string): void {
    revalidatePath('/catalog')
    revalidatePath('/catalog/manage')

    if (wrapId) {
        revalidatePath(`/catalog/${wrapId}`)
    }
}

/**
 * revalidateCatalogAndVisualizerPaths — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function revalidateCatalogAndVisualizerPaths(wrapId?: string): void {
    revalidateCatalogPaths(wrapId)
    revalidatePath('/visualizer')
}

/**
 * revalidateSchedulingPages — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function revalidateSchedulingPages(): void {
    for (const path of SCHEDULING_REVALIDATION_PATHS) {
        revalidatePath(path)
    }
}

/**
 * revalidateBillingBookingRoute — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function revalidateBillingBookingRoute(invoiceId: string): void {
    revalidatePath(`/billing/${invoiceId}`)
}

/**
 * revalidateAdminPaths — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function revalidateAdminPaths(): void {
    revalidatePath('/admin')
    revalidatePath('/admin/moderation')
    revalidatePath('/admin/audit')
}

/**
 * revalidateSettingsPaths — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function revalidateSettingsPaths(): void {
    revalidatePath('/settings')
    revalidatePath('/settings/profile')
    revalidatePath('/settings/account')
    revalidatePath('/settings/data')
}

/**
 * revalidatePlatformPaths — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function revalidatePlatformPaths(): void {
    revalidatePath('/platform')
}
