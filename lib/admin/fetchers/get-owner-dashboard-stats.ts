import { prisma } from '@/lib/prisma'

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
        prisma.invoice.count({
            where: {
                deletedAt: null,
                status: { in: ['draft', 'sent'] },
            },
        }),
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
