import { revalidatePath } from 'next/cache'
// Note: revalidateTag migration planned for Phase 3 after Next.js 16+ improvements

const SCHEDULING_REVALIDATION_PATHS = ['/scheduling', '/scheduling/book', '/scheduling/bookings']

// ============================================================================
// CANONICAL CACHE TAG NAMING CONVENTION
// ============================================================================
// Pattern: {domain}:{entity}:{id?}
// Examples: billing:invoices, billing:invoice:inv_123, scheduling:booking:book_456
// Status: Defined for future migration to tag-based revalidation in Phase 3

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

export function revalidateBillingInvoice(invoiceId: string): void {
    revalidatePath('/billing')
    revalidatePath(`/billing/${invoiceId}`)
    revalidatePath('/')
}

export function revalidateBillingAll(): void {
    revalidatePath('/billing')
}

export function revalidateSchedulingAvailability(): void {
    for (const path of SCHEDULING_REVALIDATION_PATHS) {
        revalidatePath(path)
    }
}

export function revalidateSchedulingBooking(bookingId: string): void {
    for (const path of SCHEDULING_REVALIDATION_PATHS) {
        revalidatePath(path)
    }
}

export function revalidateSchedulingAll(): void {
    for (const path of SCHEDULING_REVALIDATION_PATHS) {
        revalidatePath(path)
    }
}

export function revalidateCatalogWrap(wrapId: string): void {
    revalidatePath('/catalog')
    revalidatePath('/catalog/manage')
    revalidatePath(`/catalog/${wrapId}`)
    revalidatePath('/visualizer')
}

export function revalidateCatalogCategories(): void {
    revalidatePath('/catalog')
    revalidatePath('/catalog/manage')
}

export function revalidateCatalogAll(): void {
    revalidatePath('/catalog')
    revalidatePath('/catalog/manage')
    revalidatePath('/visualizer')
}

export function revalidateVisualizerPreview(previewId: string): void {
    revalidatePath('/visualizer')
}

export function revalidateVisualizerPreviewsByWrap(wrapId: string): void {
    revalidatePath('/visualizer')
}

export function revalidateVisualizerPreviewsByUser(userId: string): void {
    revalidatePath('/visualizer')
}

export function revalidateAuthUser(clerkUserId: string): void {
    // Auth state changes don't require path revalidation (session-based)
    // Will use tag-based in Phase 3
}

export function revalidateSettingsUser(userId: string): void {
    revalidatePath('/settings')
}

export function revalidateSettingsTenant(tenantId: string): void {
    revalidatePath('/settings')
}

export function revalidateAdminFlaggedItems(): void {
    revalidatePath('/admin')
}

export function revalidateAdminFlag(flagId: string): void {
    revalidatePath('/admin')
}

export function revalidateAdminAuditLog(): void {
    revalidatePath('/admin')
}

export function revalidatePlatformHealth(): void {
    revalidatePath('/platform')
}

// ============================================================================
// LEGACY PATH-BASED FUNCTIONS (being unified above)
// ============================================================================

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
