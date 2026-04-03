import 'server-only'

import { requireOwnerOrPlatformAdmin } from '@/lib/authz/guards'
import { prisma } from '@/lib/db/prisma'
import { auditLogFilterSchema, tenantMetricsFilterSchema } from '@/schemas/admin.schemas'
import type {
    AdminActivityEventDTO,
    AdminAnalyticsSeriesPointDTO,
    AdminDashboardDTO,
    AdminQuickLinkDTO,
    AuditLogFilterInput,
    AuditLogRowDTO,
    FlaggedItemDTO,
    TenantMetricsDTO,
    TenantMetricsFilterInput,
} from '@/types/admin.types'

const DEFAULT_TENANT_ID = 'single-store'

function resolveAdminTenantId(_tenantId?: string | null): string {
    void _tenantId
    return DEFAULT_TENANT_ID
}

function parseDateRange(input: { startDate?: string | null; endDate?: string | null }): {
    startDate: Date | null
    endDate: Date | null
} {
    return {
        startDate: input.startDate ? new Date(input.startDate) : null,
        endDate: input.endDate ? new Date(input.endDate) : null,
    }
}

function stringifySummary(action: string, details: string | null): string {
    if (!details) {
        return action
    }

    try {
        const parsed = JSON.parse(details) as Record<string, unknown>
        if (typeof parsed.summary === 'string' && parsed.summary.length > 0) {
            return parsed.summary
        }

        if (typeof parsed.reason === 'string' && parsed.reason.length > 0) {
            return `${action}: ${parsed.reason}`
        }
    } catch {
        return action
    }

    return action
}

function buildEventHref(resourceType: string | null, resourceId: string | null): string | null {
    if (!resourceType || !resourceId) {
        return null
    }

    switch (resourceType) {
        case 'Booking':
            return '/scheduling/bookings'
        case 'Invoice':
            return '/billing'
        case 'Wrap':
            return '/catalog/manage'
        case 'VisualizerPreview':
            return '/visualizer'
        default:
            return null
    }
}

export interface OwnerDashboardStatsDTO {
    wrapCount: number
    hiddenWrapCount: number
    bookingCount: number
    upcomingBookingCount: number
    openInvoiceCount: number
    totalRevenue: number
    customerCount: number
}

export async function getTenantMetrics(input: TenantMetricsFilterInput): Promise<TenantMetricsDTO> {
    await requireOwnerOrPlatformAdmin()

    const resolvedTenantId = resolveAdminTenantId(input.tenantId)

    const parsed = tenantMetricsFilterSchema.parse({
        tenantId: resolvedTenantId,
        startDate: input.startDate ?? null,
        endDate: input.endDate ?? null,
    })

    const { startDate, endDate } = parseDateRange(parsed)

    const bookingWhere = {
        deletedAt: null,
        ...(startDate ? { startTime: { gte: startDate } } : {}),
        ...(endDate ? { endTime: { lte: endDate } } : {}),
    }

    const invoiceWhere = {
        deletedAt: null,
        status: 'paid',
        ...(startDate ? { createdAt: { gte: startDate } } : {}),
        ...(endDate ? { updatedAt: { lte: endDate } } : {}),
    }

    const previewWhere = {
        deletedAt: null,
        ...(startDate ? { createdAt: { gte: startDate } } : {}),
        ...(endDate ? { createdAt: { lte: endDate } } : {}),
    }

    const [bookingsCount, revenueAggregate, previewGenerationCount] = await Promise.all([
        prisma.booking.count({ where: bookingWhere }),
        prisma.invoice.aggregate({
            where: invoiceWhere,
            _sum: { totalAmount: true },
        }),
        prisma.visualizerPreview.count({ where: previewWhere }),
    ])

    return {
        bookingsCount,
        revenueTotal: revenueAggregate._sum.totalAmount ?? 0,
        previewGenerationCount,
        dateRangeStart: startDate,
        dateRangeEnd: endDate,
    }
}

export async function getAuditLog(input: AuditLogFilterInput): Promise<AuditLogRowDTO[]> {
    await requireOwnerOrPlatformAdmin()

    const resolvedTenantId = resolveAdminTenantId(input.tenantId)

    const parsed = auditLogFilterSchema.parse({
        tenantId: resolvedTenantId,
        actorId: input.actorId ?? null,
        eventType: input.eventType ?? null,
        resourceType: input.resourceType ?? null,
        startDate: input.startDate ?? null,
        endDate: input.endDate ?? null,
        limit: input.limit ?? 50,
    })

    const { startDate, endDate } = parseDateRange(parsed)

    const auditRows = await prisma.auditLog.findMany({
        where: {
            ...(parsed.actorId ? { userId: parsed.actorId } : {}),
            ...(parsed.eventType
                ? { action: { contains: parsed.eventType, mode: 'insensitive' } }
                : {}),
            ...(parsed.resourceType
                ? { resourceType: { equals: parsed.resourceType, mode: 'insensitive' } }
                : {}),
            ...(startDate || endDate
                ? {
                      timestamp: {
                          ...(startDate ? { gte: startDate } : {}),
                          ...(endDate ? { lte: endDate } : {}),
                      },
                  }
                : {}),
        },
        orderBy: { timestamp: 'desc' },
        take: parsed.limit,
    })

    const userIds = [...new Set(auditRows.map((row) => row.userId))]
    const users = userIds.length
        ? await prisma.user.findMany({
              where: { clerkUserId: { in: userIds }, deletedAt: null },
              select: {
                  clerkUserId: true,
                  firstName: true,
                  lastName: true,
                  email: true,
              },
          })
        : []

    const userMap = new Map(
        users.map((user) => [
            user.clerkUserId,
            `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email,
        ])
    )

    return auditRows.map((row) => ({
        id: row.id,
        actorName: userMap.get(row.userId) ?? null,
        actorId: row.userId,
        eventType: row.action,
        resourceType: row.resourceType,
        resourceId: row.resourceId,
        createdAt: row.timestamp,
        summary: stringifySummary(row.action, row.details),
    }))
}

export async function getFlaggedItems(tenantId: string): Promise<FlaggedItemDTO[]> {
    await requireOwnerOrPlatformAdmin()

    const parsedTenant = resolveAdminTenantId(tenantId)

    const logs = await prisma.auditLog.findMany({
        where: {
            action: { in: ['admin.flagContent', 'admin.resolveFlag'] },
            ...(parsedTenant
                ? {
                      details: {
                          contains: `"tenantId":"${parsedTenant}"`,
                      },
                  }
                : {}),
        },
        orderBy: { timestamp: 'asc' },
    })

    type FlagRecord = {
        id: string
        resourceType: string
        resourceId: string
        reason: string
        flaggedAt: Date
        flaggedById: string
        status: 'open' | 'resolved'
    }

    const flags = new Map<string, FlagRecord>()

    for (const log of logs) {
        let payload: Record<string, unknown> | null = null

        try {
            payload = log.details ? (JSON.parse(log.details) as Record<string, unknown>) : null
        } catch {
            payload = null
        }

        if (log.action === 'admin.flagContent') {
            const flagId =
                typeof payload?.flagId === 'string' && payload.flagId.length > 0
                    ? payload.flagId
                    : log.id
            const resourceType =
                typeof payload?.resourceType === 'string' && payload.resourceType.length > 0
                    ? payload.resourceType
                    : log.resourceType
            const resourceId =
                typeof payload?.resourceId === 'string' && payload.resourceId.length > 0
                    ? payload.resourceId
                    : log.resourceId
            const reason = typeof payload?.reason === 'string' ? payload.reason : 'Flagged by admin'

            if (!resourceType || !resourceId) {
                continue
            }

            flags.set(flagId, {
                id: flagId,
                resourceType,
                resourceId,
                reason,
                flaggedAt: log.timestamp,
                flaggedById: log.userId,
                status: 'open',
            })
            continue
        }

        if (log.action === 'admin.resolveFlag') {
            const resolvedFlagId = typeof payload?.flagId === 'string' ? payload.flagId : null
            if (!resolvedFlagId || !flags.has(resolvedFlagId)) {
                continue
            }

            const existing = flags.get(resolvedFlagId)
            if (!existing) {
                continue
            }

            flags.set(resolvedFlagId, {
                ...existing,
                status: 'resolved',
            })
        }
    }

    const flaggedByUserIds = [...new Set([...flags.values()].map((flag) => flag.flaggedById))]
    const users = flaggedByUserIds.length
        ? await prisma.user.findMany({
              where: { clerkUserId: { in: flaggedByUserIds }, deletedAt: null },
              select: {
                  clerkUserId: true,
                  firstName: true,
                  lastName: true,
                  email: true,
              },
          })
        : []

    const userMap = new Map(
        users.map((user) => [
            user.clerkUserId,
            `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email,
        ])
    )

    return [...flags.values()]
        .map((flag) => ({
            id: flag.id,
            resourceType: flag.resourceType,
            resourceId: flag.resourceId,
            reason: flag.reason,
            flaggedAt: flag.flaggedAt,
            flaggedByName: userMap.get(flag.flaggedById) ?? null,
            status: flag.status,
        }))
        .sort((left, right) => right.flaggedAt.getTime() - left.flaggedAt.getTime())
}

export async function getAdminRecentActivity(tenantId: string): Promise<AdminActivityEventDTO[]> {
    const rows = await getAuditLog({
        tenantId,
        limit: 8,
    })

    return rows.map((row) => ({
        id: row.id,
        type: row.eventType,
        label: row.summary,
        createdAt: row.createdAt,
        href: buildEventHref(row.resourceType, row.resourceId),
    }))
}

export async function getAdminQuickLinks(): Promise<AdminQuickLinkDTO[]> {
    await requireOwnerOrPlatformAdmin()

    return [
        {
            label: 'Catalog management',
            href: '/catalog/manage',
            description: 'Review publish readiness and update wrap assets.',
        },
        {
            label: 'Scheduling operations',
            href: '/scheduling/bookings',
            description: 'Inspect upcoming jobs and booking status transitions.',
        },
        {
            label: 'Billing workspace',
            href: '/billing',
            description: 'Review invoices, payment status, and revenue flow.',
        },
        {
            label: 'Visualizer queue',
            href: '/visualizer',
            description: 'Monitor preview generation volume and outcomes.',
        },
    ]
}

export async function getAnalyticsSeries(
    input: TenantMetricsFilterInput
): Promise<AdminAnalyticsSeriesPointDTO[]> {
    await requireOwnerOrPlatformAdmin()

    const resolvedTenantId = resolveAdminTenantId(input.tenantId)

    const parsed = tenantMetricsFilterSchema.parse({
        tenantId: resolvedTenantId,
        startDate: input.startDate ?? null,
        endDate: input.endDate ?? null,
    })

    const { startDate, endDate } = parseDateRange(parsed)
    const windowStart = startDate ?? new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    const windowEnd = endDate ?? new Date()

    const bookings = await prisma.booking.findMany({
        where: {
            deletedAt: null,
            startTime: {
                gte: windowStart,
                lte: windowEnd,
            },
        },
        select: { startTime: true },
        orderBy: { startTime: 'asc' },
    })

    const previews = await prisma.visualizerPreview.findMany({
        where: {
            deletedAt: null,
            createdAt: {
                gte: windowStart,
                lte: windowEnd,
            },
        },
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' },
    })

    const daily = new Map<string, { bookingsCount: number; previewGenerationCount: number }>()

    for (const booking of bookings) {
        const key = booking.startTime.toISOString().slice(0, 10)
        const current = daily.get(key) ?? { bookingsCount: 0, previewGenerationCount: 0 }
        daily.set(key, { ...current, bookingsCount: current.bookingsCount + 1 })
    }

    for (const preview of previews) {
        const key = preview.createdAt.toISOString().slice(0, 10)
        const current = daily.get(key) ?? { bookingsCount: 0, previewGenerationCount: 0 }
        daily.set(key, {
            ...current,
            previewGenerationCount: current.previewGenerationCount + 1,
        })
    }

    return [...daily.entries()]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([date, values]) => ({
            date,
            bookingsCount: values.bookingsCount,
            previewGenerationCount: values.previewGenerationCount,
        }))
}

export async function getAdminDashboardSummary(tenantId: string): Promise<AdminDashboardDTO> {
    await requireOwnerOrPlatformAdmin()

    const resolvedTenantId = resolveAdminTenantId(tenantId)

    const [userCount, tenantMetrics, recentActivity, quickLinks] = await Promise.all([
        prisma.user.count({ where: { deletedAt: null } }),
        getTenantMetrics({ tenantId: resolvedTenantId }),
        getAdminRecentActivity(resolvedTenantId),
        getAdminQuickLinks(),
    ])

    return {
        totalUsers: userCount,
        totalBookings: tenantMetrics.bookingsCount,
        totalRevenue: tenantMetrics.revenueTotal,
        totalPreviewGenerations: tenantMetrics.previewGenerationCount,
        recentActivity,
        quickLinks,
    }
}

// Legacy compatibility exports while transitioning to the new admin surface
export async function getOwnerDashboardStats(): Promise<OwnerDashboardStatsDTO> {
    const metrics = await getTenantMetrics({ tenantId: DEFAULT_TENANT_ID })

    const now = new Date()
    const [wrapCount, hiddenWrapCount, upcomingBookingCount, openInvoiceCount, customers] =
        await Promise.all([
            prisma.wrap.count({ where: { deletedAt: null } }),
            prisma.wrap.count({ where: { deletedAt: null, isHidden: true } }),
            prisma.booking.count({
                where: {
                    deletedAt: null,
                    status: { in: ['pending', 'confirmed'] },
                    startTime: { gte: now },
                },
            }),
            prisma.invoice.count({
                where: { deletedAt: null, status: { in: ['draft', 'issued'] } },
            }),
            prisma.booking.findMany({
                where: { deletedAt: null },
                select: { customerId: true },
                distinct: ['customerId'],
            }),
        ])

    return {
        wrapCount,
        hiddenWrapCount,
        bookingCount: metrics.bookingsCount,
        upcomingBookingCount,
        openInvoiceCount,
        totalRevenue: metrics.revenueTotal,
        customerCount: customers.length,
    }
}

export type ConfirmAppointmentExample = {
    tenantId: string
    bookingId: string
    status: 'confirmed'
}

export type CreateInvoiceExample = {
    tenantId: string
    bookingId: string
    customerId: string
    amountCents: number
    currency: 'usd'
    description: string
}

export type AdminManagementToolExamples = {
    confirmAppointmentExample: ConfirmAppointmentExample | null
    createInvoiceExample: CreateInvoiceExample | null
}

export async function getAdminManagementToolExamples(): Promise<AdminManagementToolExamples> {
    await requireOwnerOrPlatformAdmin()

    const [bookingToConfirm, bookingToInvoice] = await Promise.all([
        prisma.booking.findFirst({
            where: { deletedAt: null, status: 'pending' },
            select: { id: true },
            orderBy: { startTime: 'asc' },
        }),
        prisma.booking.findFirst({
            where: { deletedAt: null, status: { in: ['confirmed', 'completed'] }, invoice: null },
            select: { id: true, customerId: true, totalPrice: true },
            orderBy: { startTime: 'asc' },
        }),
    ])

    return {
        confirmAppointmentExample: bookingToConfirm
            ? {
                  tenantId: DEFAULT_TENANT_ID,
                  bookingId: bookingToConfirm.id,
                  status: 'confirmed',
              }
            : null,
        createInvoiceExample: bookingToInvoice
            ? {
                  tenantId: DEFAULT_TENANT_ID,
                  bookingId: bookingToInvoice.id,
                  customerId: bookingToInvoice.customerId,
                  amountCents: bookingToInvoice.totalPrice,
                  currency: 'usd',
                  description: 'Admin dashboard example invoice',
              }
            : null,
    }
}
