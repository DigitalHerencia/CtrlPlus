/**
 * CreateInvoiceInput — TODO: brief description of this type.
 */
/**
 * CreateInvoiceInput — TODO: brief description of this type.
 */
/**
 * CreateInvoiceInput — TODO: brief description of this type.
 */
export interface CreateInvoiceInput {
    tenantId: string
    bookingId: string
    customerId?: string
    amountCents: number
    currency?: string
    description?: string
}

/**
 * ConfirmAppointmentInput — TODO: brief description of this type.
 */
/**
 * ConfirmAppointmentInput — TODO: brief description of this type.
 */
/**
 * ConfirmAppointmentInput — TODO: brief description of this type.
 */
export interface ConfirmAppointmentInput {
    tenantId: string
    bookingId: string
    status: 'confirmed' | 'cancelled' | 'rescheduled'
    note?: string
}

/**
 * AdminDateRangeInput — TODO: brief description of this type.
 */
/**
 * AdminDateRangeInput — TODO: brief description of this type.
 */
/**
 * AdminDateRangeInput — TODO: brief description of this type.
 */
export interface AdminDateRangeInput {
    startDate: Date | null
    endDate: Date | null
}

/**
 * TenantMetricsDTO — TODO: brief description of this type.
 */
/**
 * TenantMetricsDTO — TODO: brief description of this type.
 */
/**
 * TenantMetricsDTO — TODO: brief description of this type.
 */
export interface TenantMetricsDTO {
    bookingsCount: number
    revenueTotal: number
    previewGenerationCount: number
    dateRangeStart: Date | null
    dateRangeEnd: Date | null
}

/**
 * AuditLogRowDTO — TODO: brief description of this type.
 */
/**
 * AuditLogRowDTO — TODO: brief description of this type.
 */
/**
 * AuditLogRowDTO — TODO: brief description of this type.
 */
export interface AuditLogRowDTO {
    id: string
    actorName: string | null
    actorId: string | null
    eventType: string
    resourceType: string | null
    resourceId: string | null
    createdAt: Date
    summary: string
}

/**
 * FlaggedItemDTO — TODO: brief description of this type.
 */
/**
 * FlaggedItemDTO — TODO: brief description of this type.
 */
/**
 * FlaggedItemDTO — TODO: brief description of this type.
 */
export interface FlaggedItemDTO {
    id: string
    resourceType: string
    resourceId: string
    reason: string
    flaggedAt: Date
    flaggedByName: string | null
    status: 'open' | 'resolved'
}

/**
 * AdminActivityEventDTO — TODO: brief description of this type.
 */
/**
 * AdminActivityEventDTO — TODO: brief description of this type.
 */
/**
 * AdminActivityEventDTO — TODO: brief description of this type.
 */
export interface AdminActivityEventDTO {
    id: string
    type: string
    label: string
    createdAt: Date
    href: string | null
}

/**
 * AdminQuickLinkDTO — TODO: brief description of this type.
 */
/**
 * AdminQuickLinkDTO — TODO: brief description of this type.
 */
/**
 * AdminQuickLinkDTO — TODO: brief description of this type.
 */
export interface AdminQuickLinkDTO {
    label: string
    href: string
    description: string | null
}

/**
 * AdminDashboardDTO — TODO: brief description of this type.
 */
/**
 * AdminDashboardDTO — TODO: brief description of this type.
 */
/**
 * AdminDashboardDTO — TODO: brief description of this type.
 */
export interface AdminDashboardDTO {
    totalUsers: number
    totalBookings: number
    totalRevenue: number
    totalPreviewGenerations: number
    recentActivity: AdminActivityEventDTO[]
    quickLinks: AdminQuickLinkDTO[]
}

/**
 * TenantMetricsFilterInput — TODO: brief description of this type.
 */
/**
 * TenantMetricsFilterInput — TODO: brief description of this type.
 */
/**
 * TenantMetricsFilterInput — TODO: brief description of this type.
 */
export interface TenantMetricsFilterInput {
    tenantId: string
    startDate?: string | null
    endDate?: string | null
}

/**
 * AuditLogFilterInput — TODO: brief description of this type.
 */
/**
 * AuditLogFilterInput — TODO: brief description of this type.
 */
/**
 * AuditLogFilterInput — TODO: brief description of this type.
 */
export interface AuditLogFilterInput {
    tenantId: string
    actorId?: string | null
    eventType?: string | null
    resourceType?: string | null
    startDate?: string | null
    endDate?: string | null
    limit?: number
}

/**
 * FlagContentInput — TODO: brief description of this type.
 */
/**
 * FlagContentInput — TODO: brief description of this type.
 */
/**
 * FlagContentInput — TODO: brief description of this type.
 */
export interface FlagContentInput {
    tenantId: string
    resourceType: string
    resourceId: string
    reason: string
}

/**
 * ResolveFlagInput — TODO: brief description of this type.
 */
/**
 * ResolveFlagInput — TODO: brief description of this type.
 */
/**
 * ResolveFlagInput — TODO: brief description of this type.
 */
export interface ResolveFlagInput {
    tenantId: string
    flagId: string
    action: 'approve' | 'dismiss' | 'hide' | 'delete'
}

/**
 * AdminAnalyticsSeriesPointDTO — TODO: brief description of this type.
 */
/**
 * AdminAnalyticsSeriesPointDTO — TODO: brief description of this type.
 */
/**
 * AdminAnalyticsSeriesPointDTO — TODO: brief description of this type.
 */
export interface AdminAnalyticsSeriesPointDTO {
    date: string
    bookingsCount: number
    previewGenerationCount: number
}
