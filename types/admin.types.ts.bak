export interface CreateInvoiceInput {
    tenantId: string
    bookingId: string
    customerId?: string
    amountCents: number
    currency?: string
    description?: string
}

export interface ConfirmAppointmentInput {
    tenantId: string
    bookingId: string
    status: 'confirmed' | 'cancelled' | 'rescheduled'
    note?: string
}

export interface AdminDateRangeInput {
    startDate: Date | null
    endDate: Date | null
}

export interface TenantMetricsDTO {
    bookingsCount: number
    revenueTotal: number
    previewGenerationCount: number
    dateRangeStart: Date | null
    dateRangeEnd: Date | null
}

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

export interface FlaggedItemDTO {
    id: string
    resourceType: string
    resourceId: string
    reason: string
    flaggedAt: Date
    flaggedByName: string | null
    status: 'open' | 'resolved'
}

export interface AdminActivityEventDTO {
    id: string
    type: string
    label: string
    createdAt: Date
    href: string | null
}

export interface AdminQuickLinkDTO {
    label: string
    href: string
    description: string | null
}

export interface AdminDashboardDTO {
    totalUsers: number
    totalBookings: number
    totalRevenue: number
    totalPreviewGenerations: number
    recentActivity: AdminActivityEventDTO[]
    quickLinks: AdminQuickLinkDTO[]
}

export interface TenantMetricsFilterInput {
    tenantId: string
    startDate?: string | null
    endDate?: string | null
}

export interface AuditLogFilterInput {
    tenantId: string
    actorId?: string | null
    eventType?: string | null
    resourceType?: string | null
    startDate?: string | null
    endDate?: string | null
    limit?: number
}

export interface FlagContentInput {
    tenantId: string
    resourceType: string
    resourceId: string
    reason: string
}

export interface ResolveFlagInput {
    tenantId: string
    flagId: string
    action: 'approve' | 'dismiss' | 'hide' | 'delete'
}

export interface AdminAnalyticsSeriesPointDTO {
    date: string
    bookingsCount: number
    previewGenerationCount: number
}
