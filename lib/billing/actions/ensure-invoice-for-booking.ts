'use server'

import { getSession } from '@/lib/auth/session'
import { requireCustomerOwnedResourceAccess } from '@/lib/authz/policy'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import { z } from 'zod'

const ensureInvoiceInputSchema = z.object({
    bookingId: z.string().min(1),
})

interface EnsureInvoiceResult {
    invoiceId: string
    created: boolean
}

function isUniqueConstraintError(error: unknown): boolean {
    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code?: string }).code === 'P2002'
    )
}

function normalizeCents(amount: number): number {
    if (!Number.isFinite(amount)) {
        throw new Error('Invalid booking price')
    }

    return Math.round(amount)
}

export async function ensureInvoiceForBooking(rawInput: {
    bookingId: string
}): Promise<EnsureInvoiceResult> {
    const session = await getSession()
    const userId = session.userId

    if (!session.isAuthenticated || !userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const { bookingId } = ensureInvoiceInputSchema.parse(rawInput)

    const booking = await prisma.booking.findFirst({
        where: {
            id: bookingId,
            deletedAt: null,
        },
        select: {
            id: true,
            customerId: true,
            wrapId: true,
            totalPrice: true,
            invoice: {
                where: { deletedAt: null },
                select: { id: true },
            },
            wrap: {
                select: { name: true },
            },
        },
    })

    if (!booking) {
        throw new Error('Forbidden: booking not found')
    }

    requireCustomerOwnedResourceAccess(session.authz, booking.customerId)

    if (booking.invoice) {
        return {
            invoiceId: booking.invoice.id,
            created: false,
        }
    }

    const roundedTotalPrice = normalizeCents(booking.totalPrice)

    const createInvoice = async (tx: Prisma.TransactionClient) => {
        const created = await tx.invoice.create({
            data: {
                bookingId: booking.id,
                status: 'draft',
                totalAmount: roundedTotalPrice,
                lineItems: {
                    create: [
                        {
                            description: booking.wrap?.name ?? 'Wrap installation',
                            quantity: 1,
                            unitPrice: roundedTotalPrice,
                            totalPrice: roundedTotalPrice,
                        },
                    ],
                },
            },
            select: { id: true },
        })

        await tx.auditLog.create({
            data: {
                userId,
                action: 'ENSURE_INVOICE_FOR_BOOKING',
                resourceType: 'Invoice',
                resourceId: created.id,
                details: JSON.stringify({ bookingId: booking.id }),
                timestamp: new Date(),
            },
        })

        return created
    }

    try {
        const created = await prisma.$transaction(createInvoice)

        return {
            invoiceId: created.id,
            created: true,
        }
    } catch (error) {
        if (!isUniqueConstraintError(error)) {
            throw error
        }

        const existingInvoice = await prisma.invoice.findUnique({
            where: { bookingId: booking.id },
            select: { id: true },
        })

        if (!existingInvoice) {
            throw new Error('Invoice creation race detected but invoice could not be found')
        }

        return {
            invoiceId: existingInvoice.id,
            created: false,
        }
    }
}
