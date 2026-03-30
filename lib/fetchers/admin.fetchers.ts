import "server-only"
import { prisma } from '@/lib/db/prisma'
import { requireOwnerOrPlatformAdmin } from '@/lib/authz/guards'

export interface OwnerDashboardStatsDTO {
    wrapCount: number
    hiddenWrapCount: number
    bookingCount: number
    upcomingBookingCount: number
    openInvoiceCount: number
    totalRevenue: number
    customerCount: number
}

export async function getOwnerDashboardStats(): Promise<OwnerDashboardStatsDTO> {
    const now = new Date()

    const [
        wrapCount,
        hiddenWrapCount,
        bookingCount,
        upcomingBookingCount,
        openInvoiceCount,
        revenueAggregate,
        customers,
    ] = await Promise.all([
        prisma.wrap.count({ where: { deletedAt: null } }),
        prisma.wrap.count({ where: { deletedAt: null, isHidden: true } }),
        prisma.booking.count({ where: { deletedAt: null } }),
        prisma.booking.count({
            where: {
                deletedAt: null,
                status: { in: ['pending', 'confirmed'] },
                startTime: { gte: now },
            },
        }),
        prisma.invoice.count({ where: { deletedAt: null, status: { in: ['draft', 'sent'] } } }),
        prisma.invoice.aggregate({
            where: { status: 'paid', deletedAt: null },
            _sum: { totalAmount: true },
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
        bookingCount,
        upcomingBookingCount,
        openInvoiceCount,
        totalRevenue: revenueAggregate._sum.totalAmount ?? 0,
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

    const SINGLE_STORE_TENANT_ID = 'single-store'

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
                  tenantId: SINGLE_STORE_TENANT_ID,
                  bookingId: bookingToConfirm.id,
                  status: 'confirmed',
              }
            : null,
        createInvoiceExample: bookingToInvoice
            ? {
                  tenantId: SINGLE_STORE_TENANT_ID,
                  bookingId: bookingToInvoice.id,
                  customerId: bookingToInvoice.customerId,
                  amountCents: bookingToInvoice.totalPrice,
                  currency: 'usd',
                  description: 'Admin dashboard example invoice',
              }
            : null,
    }
}
