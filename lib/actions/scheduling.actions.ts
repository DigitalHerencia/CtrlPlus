'use server'
/**
 * Actions — TODO: brief module description.
 * Domain: actions
 * Public: TODO (yes/no)
 */
/**
 * Actions — TODO: brief module description.
 * Domain: actions
 * Public: TODO (yes/no)
 */

import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

import { getSession } from '@/lib/auth/session'
import { requireOwnerOrPlatformAdmin } from '@/lib/authz/guards'
import { requireCustomerOwnedResourceAccess } from '@/lib/authz/policy'
import { revalidateSchedulingPages } from '@/lib/cache/revalidate-tags'
import {
    BookingStatus,
    getBookingDisplayStatus,
    normalizeBookingStatus,
} from '@/lib/constants/statuses'
import { DEFAULT_STORE_TIMEZONE } from '@/lib/constants/app'
import { prisma } from '@/lib/db/prisma'
import { bookingSelectFields } from '@/lib/db/selects/scheduling.selects'
import { assertSlotHasCapacity } from '@/lib/db/transactions/scheduling.transactions'
import { getTenantNotificationEmail, sendNotificationEmail } from '@/lib/integrations/notifications'
import {
    cancelBookingSchema,
    createBookingSchema,
    reserveSlotSchema,
    updateBookingSchema,
} from '@/schemas/scheduling.schemas'
import type {
    BookingActionDTO,
    CancelBookingInput,
    CreateBookingInput,
    CreatedBookingDTO,
    ReserveSlotInput,
    ReservedBookingDTO,
    UpdateBookingInput,
} from '@/types/scheduling.types'

const RESERVATION_TTL_MINUTES = 15

type BookingRow = Prisma.BookingGetPayload<{ select: typeof bookingSelectFields }>
const STANDALONE_WRAP_NAME = 'General Appointment'

function buildOwnedBookingWhereClause(
    session: { isOwner: boolean; isPlatformAdmin: boolean },
    userId: string
): Prisma.BookingWhereInput {
    if (session.isOwner || session.isPlatformAdmin) {
        return {}
    }

    return { customerId: userId }
}

function toOptionalString(value: string | null | undefined): string | null {
    if (typeof value !== 'string') {
        return null
    }

    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : null
}

function toBookingActionDTO(
    row: BookingRow,
    reservationExpiresAt: Date | null = row.reservation?.expiresAt ?? null
): BookingActionDTO {
    const status = normalizeBookingStatus(row.status)

    return {
        id: row.id,
        customerId: row.customerId,
        wrapId: row.wrapId,
        wrapName: row.wrapNameSnapshot ?? row.wrap?.name ?? undefined,
        startTime: row.startTime.toISOString(),
        endTime: row.endTime.toISOString(),
        status,
        totalPrice: row.wrapPriceSnapshot ?? row.totalPrice,
        reservationExpiresAt: reservationExpiresAt ? reservationExpiresAt.toISOString() : null,
        displayStatus: getBookingDisplayStatus(status, reservationExpiresAt),
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    }
}

function isNullConstraintViolation(error: unknown): boolean {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2011'
}

async function getOrCreateStandaloneWrap(tx: Prisma.TransactionClient): Promise<{
    id: string
    name: string
    price: number
}> {
    const existing = await tx.wrap.findFirst({
        where: {
            name: STANDALONE_WRAP_NAME,
            deletedAt: null,
        },
        select: {
            id: true,
            name: true,
            price: true,
        },
    })

    if (existing) {
        return existing
    }

    return tx.wrap.create({
        data: {
            name: STANDALONE_WRAP_NAME,
            description: 'Fallback wrap for standalone appointment compatibility',
            price: 0,
            isHidden: true,
        },
        select: {
            id: true,
            name: true,
            price: true,
        },
    })
}
async function assertNoCustomerSlotConflict(
    tx: Prisma.TransactionClient,
    input: {
        customerId: string
        startTime: Date
        endTime: Date
        now: Date
        excludeBookingId?: string
    }
): Promise<void> {
    const existing = await tx.booking.findFirst({
        where: {
            deletedAt: null,
            customerId: input.customerId,
            id: input.excludeBookingId ? { not: input.excludeBookingId } : undefined,
            startTime: { lt: input.endTime },
            endTime: { gt: input.startTime },
            OR: [
                { status: BookingStatus.CONFIRMED },
                { status: BookingStatus.COMPLETED },
                { status: BookingStatus.REQUESTED },
                { status: BookingStatus.RESCHEDULE_REQUESTED },
                {
                    status: 'pending',
                    reservation: {
                        is: {
                            expiresAt: { gt: input.now },
                        },
                    },
                },
            ],
        },
        select: { id: true },
    })

    if (existing) {
        throw new Error('You already have a booking in this time slot')
    }
}

async function notifyBookingLifecycle(input: {
    action: string
    actorUserId: string
    bookingId: string
    customerEmail: string | null
    ownerSubject: string
    ownerText: string
    customerSubject: string
    customerText: string
}): Promise<void> {
    const ownerEmail = await getTenantNotificationEmail()
    const [ownerResult, customerResult] = await Promise.all([
        ownerEmail
            ? sendNotificationEmail({
                  to: ownerEmail,
                  subject: input.ownerSubject,
                  text: input.ownerText,
              })
            : Promise.resolve({
                  delivered: false,
                  skipped: true,
                  reason: 'owner email unavailable',
              }),
        input.customerEmail
            ? sendNotificationEmail({
                  to: input.customerEmail,
                  subject: input.customerSubject,
                  text: input.customerText,
              })
            : Promise.resolve({
                  delivered: false,
                  skipped: true,
                  reason: 'customer email unavailable',
              }),
    ])

    await prisma.auditLog.create({
        data: {
            userId: input.actorUserId,
            action: input.action,
            resourceType: 'Booking',
            resourceId: input.bookingId,
            details: JSON.stringify({
                ownerEmail,
                customerEmail: input.customerEmail,
                ownerDelivery: ownerResult,
                customerDelivery: customerResult,
            }),
            timestamp: new Date(),
        },
    })
}
export async function reserveSlot(input: ReserveSlotInput): Promise<ReservedBookingDTO> {
    const session = await getSession()
    const userId = session.userId

    if (!session.isAuthenticated || !userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const parsed = reserveSlotSchema.parse(input)

    return prisma.$transaction(
        async (tx) => {
            const now = new Date()
            const expiresAt = new Date(now.getTime() + RESERVATION_TTL_MINUTES * 60 * 1000)

            const wrap = await tx.wrap.findFirst({
                where: {
                    id: parsed.wrapId,
                    deletedAt: null,
                    ...(!session.isOwner && !session.isPlatformAdmin ? { isHidden: false } : {}),
                },
                select: { id: true, name: true, price: true },
            })

            if (!wrap) {
                throw new Error('Wrap not found')
            }

            await assertSlotHasCapacity(tx, {
                startTime: parsed.startTime,
                endTime: parsed.endTime,
                now,
            })

            await assertNoCustomerSlotConflict(tx, {
                customerId: userId,
                startTime: parsed.startTime,
                endTime: parsed.endTime,
                now,
            })

            const existingReservation = await tx.bookingReservation.findFirst({
                where: {
                    expiresAt: { gt: now },
                    booking: {
                        customerId: userId,
                        deletedAt: null,
                        OR: [{ status: BookingStatus.REQUESTED }, { status: 'pending' }],
                    },
                },
                select: { id: true },
            })

            if (existingReservation) {
                throw new Error('You already have an active reservation')
            }

            const booking = await tx.booking.create({
                data: {
                    customerId: userId,
                    wrapId: parsed.wrapId,
                    startTime: parsed.startTime,
                    endTime: parsed.endTime,
                    status: BookingStatus.REQUESTED,
                    totalPrice: wrap.price,
                    wrapNameSnapshot: wrap.name,
                    wrapPriceSnapshot: wrap.price,
                    reservation: {
                        create: { expiresAt },
                    },
                },
                select: {
                    id: true,
                    wrapId: true,
                    startTime: true,
                    endTime: true,
                    status: true,
                    totalPrice: true,
                },
            })

            await tx.auditLog.create({
                data: {
                    userId,
                    action: 'RESERVE_SLOT',
                    resourceType: 'Booking',
                    resourceId: booking.id,
                    details: JSON.stringify({
                        wrapId: booking.wrapId,
                        status: booking.status,
                        startTime: booking.startTime.toISOString(),
                        endTime: booking.endTime.toISOString(),
                        reservationExpiresAt: expiresAt.toISOString(),
                    }),
                    timestamp: now,
                },
            })

            return {
                id: booking.id,
                wrapId: booking.wrapId ?? wrap.id,
                wrapName: wrap.name,
                startTime: booking.startTime.toISOString(),
                endTime: booking.endTime.toISOString(),
                status: normalizeBookingStatus(booking.status),
                totalPrice: booking.totalPrice ?? wrap.price,
                reservationExpiresAt: expiresAt.toISOString(),
                displayStatus: 'reserved',
            }
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    )
}

export async function createBooking(rawInput: CreateBookingInput): Promise<CreatedBookingDTO> {
    const session = await getSession()
    const userId = session.userId

    if (!session.isAuthenticated || !userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const parsed = createBookingSchema.parse(rawInput)

    const runCreateBookingTransaction = async (
        forceStandaloneFallbackWrap: boolean
    ): Promise<BookingRow> =>
        prisma.$transaction(
            async (tx) => {
                const now = new Date()
                const requestedWrap = parsed.wrapId
                    ? await tx.wrap.findFirst({
                          where: {
                              id: parsed.wrapId,
                              deletedAt: null,
                              ...(!session.isOwner && !session.isPlatformAdmin
                                  ? { isHidden: false }
                                  : {}),
                          },
                          select: { id: true, name: true, price: true },
                      })
                    : null

                if (parsed.wrapId && !requestedWrap) {
                    throw new Error('Wrap not found')
                }

                const effectiveWrap =
                    requestedWrap ??
                    (forceStandaloneFallbackWrap ? await getOrCreateStandaloneWrap(tx) : null)

                await assertSlotHasCapacity(tx, {
                    startTime: parsed.startTime,
                    endTime: parsed.endTime,
                    now,
                })

                await assertNoCustomerSlotConflict(tx, {
                    customerId: userId,
                    startTime: parsed.startTime,
                    endTime: parsed.endTime,
                    now,
                })

                const created = await tx.booking.create({
                    data: {
                        customerId: userId,
                        wrapId: effectiveWrap?.id ?? undefined,
                        startTime: parsed.startTime,
                        endTime: parsed.endTime,
                        status: BookingStatus.REQUESTED,
                        totalPrice: effectiveWrap?.price ?? undefined,
                        wrapNameSnapshot: effectiveWrap?.name ?? undefined,
                        wrapPriceSnapshot: effectiveWrap?.price ?? undefined,
                        customerName: parsed.customerName,
                        customerEmail: parsed.customerEmail,
                        customerPhone: toOptionalString(parsed.customerPhone),
                        preferredContact: parsed.preferredContact,
                        billingAddressLine1: toOptionalString(parsed.billingAddressLine1),
                        billingAddressLine2: toOptionalString(parsed.billingAddressLine2),
                        billingCity: toOptionalString(parsed.billingCity),
                        billingState: toOptionalString(parsed.billingState),
                        billingPostalCode: toOptionalString(parsed.billingPostalCode),
                        billingCountry: toOptionalString(parsed.billingCountry),
                        vehicleMake: toOptionalString(parsed.vehicleMake),
                        vehicleModel: toOptionalString(parsed.vehicleModel),
                        vehicleYear: toOptionalString(parsed.vehicleYear),
                        vehicleTrim: toOptionalString(parsed.vehicleTrim),
                        previewImageUrl: toOptionalString(parsed.previewImageUrl),
                        previewPromptUsed: toOptionalString(parsed.previewPromptUsed),
                        notes: toOptionalString(parsed.notes),
                    },
                    select: bookingSelectFields,
                })

                await tx.websiteSettings.upsert({
                    where: { clerkUserId: userId },
                    create: {
                        clerkUserId: userId,
                        preferredContact: parsed.preferredContact,
                        appointmentReminders: true,
                        marketingOptIn: false,
                        timezone: DEFAULT_STORE_TIMEZONE,
                        fullName: parsed.customerName,
                        email: parsed.customerEmail,
                        phone: toOptionalString(parsed.customerPhone),
                        billingAddressLine1: parsed.billingAddressLine1,
                        billingAddressLine2: toOptionalString(parsed.billingAddressLine2),
                        billingCity: parsed.billingCity,
                        billingState: parsed.billingState,
                        billingPostalCode: parsed.billingPostalCode,
                        billingCountry: parsed.billingCountry,
                        vehicleMake: parsed.vehicleMake,
                        vehicleModel: parsed.vehicleModel,
                        vehicleYear: parsed.vehicleYear,
                        vehicleTrim: toOptionalString(parsed.vehicleTrim),
                    },
                    update: {
                        preferredContact: parsed.preferredContact,
                        fullName: parsed.customerName,
                        email: parsed.customerEmail,
                        phone: toOptionalString(parsed.customerPhone),
                        billingAddressLine1: parsed.billingAddressLine1,
                        billingAddressLine2: toOptionalString(parsed.billingAddressLine2),
                        billingCity: parsed.billingCity,
                        billingState: parsed.billingState,
                        billingPostalCode: parsed.billingPostalCode,
                        billingCountry: parsed.billingCountry,
                        vehicleMake: parsed.vehicleMake,
                        vehicleModel: parsed.vehicleModel,
                        vehicleYear: parsed.vehicleYear,
                        vehicleTrim: toOptionalString(parsed.vehicleTrim),
                    },
                })

                await tx.auditLog.create({
                    data: {
                        userId,
                        action: 'CREATE_BOOKING_REQUEST',
                        resourceType: 'Booking',
                        resourceId: created.id,
                        details: JSON.stringify({
                            wrapId: created.wrapId,
                            startTime: created.startTime.toISOString(),
                            endTime: created.endTime.toISOString(),
                            preferredContact: created.preferredContact,
                        }),
                        timestamp: now,
                    },
                })

                return created
            },
            { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
        )

    let booking: BookingRow
    try {
        booking = await runCreateBookingTransaction(false)
    } catch (error) {
        if (parsed.wrapId || !isNullConstraintViolation(error)) {
            throw error
        }

        booking = await runCreateBookingTransaction(true)
    }

    await notifyBookingLifecycle({
        action: 'SEND_BOOKING_NOTIFICATION',
        actorUserId: userId,
        bookingId: booking.id,
        customerEmail: booking.customerEmail,
        ownerSubject: `New appointment request: ${booking.wrapNameSnapshot ?? booking.wrap?.name ?? 'Consultation or service'}`,
        ownerText: `${booking.customerName ?? 'A customer'} requested ${booking.wrapNameSnapshot ?? booking.wrap?.name ?? 'a consultation or service appointment'} on ${booking.startTime.toISOString()}.`,
        customerSubject: 'We received your appointment request',
        customerText: `Your request for ${booking.wrapNameSnapshot ?? booking.wrap?.name ?? 'a consultation or service appointment'} has been submitted. We will confirm or reschedule it shortly.`,
    })

    revalidateSchedulingPages()
    revalidatePath('/scheduling/book')

    return {
        ...toBookingActionDTO(booking, null),
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        preferredContact: (booking.preferredContact as 'email' | 'sms' | null) ?? null,
        billingAddressLine1: booking.billingAddressLine1,
        billingAddressLine2: booking.billingAddressLine2,
        billingCity: booking.billingCity,
        billingState: booking.billingState,
        billingPostalCode: booking.billingPostalCode,
        billingCountry: booking.billingCountry,
        vehicleMake: booking.vehicleMake,
        vehicleModel: booking.vehicleModel,
        vehicleYear: booking.vehicleYear,
        vehicleTrim: booking.vehicleTrim,
        previewImageUrl: booking.previewImageUrl,
        previewPromptUsed: booking.previewPromptUsed,
        notes: booking.notes,
    }
}
export async function updateBooking(
    bookingId: string,
    input: UpdateBookingInput
): Promise<BookingActionDTO> {
    const session = await getSession()
    const userId = session.userId

    if (!session.isAuthenticated || !userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const parsed = updateBookingSchema.parse(input)
    const isOwnerActor = session.isOwner || session.isPlatformAdmin

    const existing = await prisma.booking.findFirst({
        where: {
            id: bookingId,
            deletedAt: null,
            ...buildOwnedBookingWhereClause(session, userId),
        },
        select: bookingSelectFields,
    })

    if (!existing) {
        throw new Error('Forbidden: resource not found')
    }

    requireCustomerOwnedResourceAccess(session.authz, existing.customerId)

    const updated = await prisma.$transaction(
        async (tx) => {
            const now = new Date()

            await assertSlotHasCapacity(tx, {
                startTime: parsed.startTime,
                endTime: parsed.endTime,
                excludeBookingId: bookingId,
                now,
            })

            await assertNoCustomerSlotConflict(tx, {
                customerId: existing.customerId,
                startTime: parsed.startTime,
                endTime: parsed.endTime,
                now,
                excludeBookingId: bookingId,
            })

            await tx.bookingReservation.deleteMany({ where: { bookingId } })

            const nextStatus = isOwnerActor
                ? BookingStatus.RESCHEDULE_REQUESTED
                : normalizeBookingStatus(existing.status)

            const row = await tx.booking.update({
                where: { id: bookingId },
                data: {
                    startTime: parsed.startTime,
                    endTime: parsed.endTime,
                    status: nextStatus,
                },
                select: bookingSelectFields,
            })

            await tx.auditLog.create({
                data: {
                    userId,
                    action: isOwnerActor ? 'REQUEST_BOOKING_RESCHEDULE' : 'UPDATE_BOOKING',
                    resourceType: 'Booking',
                    resourceId: row.id,
                    details: JSON.stringify({
                        previousStartTime: existing.startTime.toISOString(),
                        previousEndTime: existing.endTime.toISOString(),
                        newStartTime: parsed.startTime.toISOString(),
                        newEndTime: parsed.endTime.toISOString(),
                    }),
                    timestamp: now,
                },
            })

            return row
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    )

    if (isOwnerActor) {
        await notifyBookingLifecycle({
            action: 'SEND_BOOKING_RESCHEDULE_NOTIFICATION',
            actorUserId: userId,
            bookingId: updated.id,
            customerEmail: updated.customerEmail,
            ownerSubject: `Reschedule requested for ${updated.wrapNameSnapshot ?? updated.wrap?.name ?? 'booking'}`,
            ownerText: `Booking ${updated.id} now needs customer review for a new time window.`,
            customerSubject: 'Your appointment request needs a new time',
            customerText: `We proposed a new drop-off window for ${updated.wrapNameSnapshot ?? updated.wrap?.name ?? 'your appointment'}. Please review the updated booking in your account.`,
        })
    }

    revalidateSchedulingPages()
    return toBookingActionDTO(updated, null)
}

export async function confirmBooking(bookingId: string): Promise<BookingActionDTO> {
    const session = await requireOwnerOrPlatformAdmin()
    const userId = session.userId

    if (!session.isAuthenticated || !userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const updated = await prisma.$transaction(async (tx) => {
        const booking = await tx.booking.findFirst({
            where: { id: bookingId, deletedAt: null },
            select: bookingSelectFields,
        })

        if (!booking) {
            throw new Error('Forbidden: resource not found')
        }

        const normalizedStatus = normalizeBookingStatus(booking.status)
        if (
            normalizedStatus !== BookingStatus.REQUESTED &&
            normalizedStatus !== BookingStatus.RESCHEDULE_REQUESTED
        ) {
            throw new Error('Only requested bookings can be confirmed')
        }

        await tx.bookingReservation.deleteMany({ where: { bookingId } })

        const row = await tx.booking.update({
            where: { id: bookingId },
            data: { status: BookingStatus.CONFIRMED },
            select: bookingSelectFields,
        })

        await tx.auditLog.create({
            data: {
                userId,
                action: 'CONFIRM_BOOKING',
                resourceType: 'Booking',
                resourceId: row.id,
                details: JSON.stringify({ previousStatus: booking.status }),
                timestamp: new Date(),
            },
        })

        return row
    })

    await notifyBookingLifecycle({
        action: 'SEND_BOOKING_CONFIRMATION_NOTIFICATION',
        actorUserId: userId,
        bookingId: updated.id,
        customerEmail: updated.customerEmail,
        ownerSubject: `Booking confirmed: ${updated.wrapNameSnapshot ?? updated.wrap?.name ?? 'Consultation or service'}`,
        ownerText: `Booking ${updated.id} has been confirmed.`,
        customerSubject: 'Your appointment is confirmed',
        customerText: `Your booking for ${updated.wrapNameSnapshot ?? updated.wrap?.name ?? 'your consultation or service appointment'} is confirmed.`,
    })

    revalidateSchedulingPages()
    return toBookingActionDTO(updated, null)
}
export async function completeBooking(bookingId: string): Promise<BookingActionDTO> {
    const session = await requireOwnerOrPlatformAdmin()
    const userId = session.userId

    if (!session.isAuthenticated || !userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const updated = await prisma.$transaction(async (tx) => {
        const booking = await tx.booking.findFirst({
            where: { id: bookingId, deletedAt: null },
            select: bookingSelectFields,
        })

        if (!booking) {
            throw new Error('Forbidden: resource not found')
        }

        if (normalizeBookingStatus(booking.status) !== BookingStatus.CONFIRMED) {
            throw new Error('Only confirmed bookings can be marked complete')
        }

        const row = await tx.booking.update({
            where: { id: bookingId },
            data: { status: BookingStatus.COMPLETED },
            select: bookingSelectFields,
        })

        await tx.auditLog.create({
            data: {
                userId,
                action: 'COMPLETE_BOOKING',
                resourceType: 'Booking',
                resourceId: row.id,
                details: JSON.stringify({ previousStatus: booking.status }),
                timestamp: new Date(),
            },
        })

        return row
    })

    await notifyBookingLifecycle({
        action: 'SEND_BOOKING_COMPLETED_NOTIFICATION',
        actorUserId: userId,
        bookingId: updated.id,
        customerEmail: updated.customerEmail,
        ownerSubject: `Booking completed: ${updated.wrapNameSnapshot ?? updated.wrap?.name ?? 'Consultation or service'}`,
        ownerText: `Booking ${updated.id} has been marked completed.`,
        customerSubject: 'Your appointment is complete',
        customerText: `Your ${updated.wrapNameSnapshot ?? updated.wrap?.name ?? 'consultation or service appointment'} is complete. Billing can issue an invoice when it is ready.`,
    })

    revalidateSchedulingPages()
    revalidatePath('/billing/manage/new')
    return toBookingActionDTO(updated, null)
}

export async function cancelBooking(
    bookingId: string,
    input: CancelBookingInput
): Promise<BookingActionDTO> {
    const session = await getSession()
    const userId = session.userId

    if (!session.isAuthenticated || !userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const parsed = cancelBookingSchema.parse(input)

    const existing = await prisma.booking.findFirst({
        where: {
            id: bookingId,
            deletedAt: null,
            ...buildOwnedBookingWhereClause(session, userId),
        },
        select: bookingSelectFields,
    })

    if (!existing) {
        throw new Error('Forbidden: resource not found')
    }

    requireCustomerOwnedResourceAccess(session.authz, existing.customerId)

    const normalizedStatus = normalizeBookingStatus(existing.status)
    if (normalizedStatus === BookingStatus.COMPLETED) {
        throw new Error('Completed bookings cannot be cancelled')
    }

    if (normalizedStatus === BookingStatus.CANCELLED) {
        throw new Error('Booking is already cancelled')
    }

    const updated = await prisma.$transaction(async (tx) => {
        await tx.bookingReservation.deleteMany({ where: { bookingId } })

        const row = await tx.booking.update({
            where: { id: bookingId },
            data: { status: BookingStatus.CANCELLED },
            select: bookingSelectFields,
        })

        await tx.auditLog.create({
            data: {
                userId,
                action: 'CANCEL_BOOKING',
                resourceType: 'Booking',
                resourceId: row.id,
                details: JSON.stringify({ previousStatus: existing.status, reason: parsed.reason }),
                timestamp: new Date(),
            },
        })

        return row
    })

    revalidateSchedulingPages()
    return toBookingActionDTO(updated, null)
}

/**
 * CleanupExpiredReservationsInput — TODO: brief description of this type.
 */
/**
 * CleanupExpiredReservationsInput — TODO: brief description of this type.
 */
export interface CleanupExpiredReservationsInput {
    now?: Date
    limit?: number
}

/**
 * CleanupExpiredReservationsResult — TODO: brief description of this type.
 */
/**
 * CleanupExpiredReservationsResult — TODO: brief description of this type.
 */
export interface CleanupExpiredReservationsResult {
    processedReservationIds: string[]
    processedBookingIds: string[]
}
export async function cleanupExpiredReservations(
    input: CleanupExpiredReservationsInput = {}
): Promise<CleanupExpiredReservationsResult> {
    const now = input.now ?? new Date()
    const limit = input.limit ?? 100

    const expired = await prisma.bookingReservation.findMany({
        where: {
            expiresAt: { lte: now },
            booking: {
                deletedAt: null,
                OR: [{ status: BookingStatus.REQUESTED }, { status: 'pending' }],
            },
        },
        select: {
            id: true,
            bookingId: true,
            booking: {
                select: {
                    customerId: true,
                },
            },
        },
        take: limit,
        orderBy: { expiresAt: 'asc' },
    })

    if (expired.length === 0) {
        return { processedReservationIds: [], processedBookingIds: [] }
    }

    const bookingIds = expired.map((item) => item.bookingId)
    const reservationIds = expired.map((item) => item.id)

    await prisma.$transaction(async (tx) => {
        await tx.booking.updateMany({
            where: {
                id: { in: bookingIds },
                deletedAt: null,
                OR: [{ status: BookingStatus.REQUESTED }, { status: 'pending' }],
            },
            data: {
                status: BookingStatus.CANCELLED,
                deletedAt: now,
            },
        })

        await tx.bookingReservation.deleteMany({
            where: {
                id: { in: reservationIds },
            },
        })

        await tx.auditLog.createMany({
            data: expired.map((record) => ({
                userId: record.booking.customerId,
                action: 'EXPIRE_BOOKING_RESERVATION',
                resourceType: 'Booking',
                resourceId: record.bookingId,
                details: JSON.stringify({ reservationId: record.id, expiredAt: now.toISOString() }),
                timestamp: now,
            })),
        })
    })

    revalidateSchedulingPages()

    return {
        processedReservationIds: reservationIds,
        processedBookingIds: bookingIds,
    }
}
