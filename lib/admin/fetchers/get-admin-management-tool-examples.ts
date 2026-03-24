import 'server-only'

import { requireOwnerOrPlatformAdmin } from '@/lib/authz/guards'
import { prisma } from '@/lib/prisma'

const SINGLE_STORE_TENANT_ID = 'single-store'

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
            where: {
                deletedAt: null,
                status: 'pending',
            },
            select: {
                id: true,
            },
            orderBy: {
                startTime: 'asc',
            },
        }),
        prisma.booking.findFirst({
            where: {
                deletedAt: null,
                status: {
                    in: ['confirmed', 'completed'],
                },
                invoice: null,
            },
            select: {
                id: true,
                customerId: true,
                totalPrice: true,
            },
            orderBy: {
                startTime: 'asc',
            },
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
