import 'server-only'
import { prisma } from '@/lib/db/prisma'
import { getWraps } from '@/lib/fetchers/catalog.fetchers'
import type { WrapDTO } from '@/types/catalog.types'
import {
    availabilitySelectFields,
    bookingSelectFields,
} from '@/lib/db/selects/scheduling.selects'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { availabilityQuerySchema } from '@/schemas/scheduling.schemas'
import type {
    AvailabilitySlotDTO,
    AvailabilityListParams,
    AvailabilityListResult,
    AvailabilityRuleDTO,
    AvailabilityWindowDTO,
    BookingDTO,
    BookingDetailViewDTO,
    BookingListParams,
    BookingListResult,
    BookingManagerRowDTO,
    BookingTimelineEventDTO,
} from '@/types/scheduling.types'

import {
    getBookingDisplayStatus,
    normalizeBookingStatus,
} from '@/lib/constants/statuses'

function parseHHmmToDate(baseDate: Date, hhmm: string): Date {
    const [hours, minutes = '0'] = hhmm.split(':')
    const date = new Date(baseDate)
    date.setHours(Number(hours), Number(minutes), 0, 0)
    return date
}

function rangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
    return aStart < bEnd && aEnd > bStart
}

function formatAuditActionLabel(action: string): string {
    return action
        .toLowerCase()
        .split('_')
        .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
        .join(' ')
}
async function requireSchedulingReadSession() {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    if (!hasCapability(session.authz, 'scheduling.read.own')) {
        throw new Error('Forbidden: insufficient permissions')
    }

    return session as typeof session & { userId: string }
}

function canViewAllSchedulingBookings(
    session: Awaited<ReturnType<typeof requireSchedulingReadSession>>
): boolean {
    return hasCapability(session.authz, 'scheduling.read.all')
}

const DEFAULT_AVAILABILITY_LIST_PARAMS: AvailabilityListParams = {
    page: 1,
    pageSize: 20,
}

function toAvailabilityRuleDTO(record: {
    id: string
    dayOfWeek: number
    startTime: string
    endTime: string
    capacitySlots: number
    createdAt: Date | string
    updatedAt: Date | string
}): AvailabilityRuleDTO {
    const createdAt =
        typeof record.createdAt === 'string' ? record.createdAt : record.createdAt?.toISOString()
    const updatedAt =
        typeof record.updatedAt === 'string' ? record.updatedAt : record.updatedAt?.toISOString()

    return {
        id: record.id,
        dayOfWeek: record.dayOfWeek,
        startTime: record.startTime,
        endTime: record.endTime,
        capacitySlots: record.capacitySlots,
        createdAt,
        updatedAt,
    }
}

export async function getAvailabilityWindows(
    params: AvailabilityListParams = DEFAULT_AVAILABILITY_LIST_PARAMS
): Promise<AvailabilityListResult> {
    await requireSchedulingReadSession()

    // Validate params at the action boundary: availabilityListParamsSchema.parse(params)
    const { page, pageSize, dayOfWeek } = params
    const skip = (page - 1) * pageSize

    const where = {
        deletedAt: null,
        ...(dayOfWeek !== undefined && { dayOfWeek }),
    }

    const [records, total] = await Promise.all([
        prisma.availabilityRule.findMany({
            where,
            select: availabilitySelectFields,
            orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
            skip,
            take: pageSize,
        }),
        prisma.availabilityRule.count({ where }),
    ])

    return {
        items: records.map(toAvailabilityRuleDTO),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    }
}

export async function getAvailabilityWindowById(
    windowId: string
): Promise<AvailabilityWindowDTO | null> {
    await requireSchedulingReadSession()

    const record = await prisma.availabilityRule.findFirst({
        where: {
            id: windowId,
            deletedAt: null,
        },
        select: availabilitySelectFields,
    })

    return record ? toAvailabilityRuleDTO(record) : null
}

export async function getAvailabilityWindowsByDay(
    dayOfWeek: number
): Promise<AvailabilityWindowDTO[]> {
    await requireSchedulingReadSession()

    const records = await prisma.availabilityRule.findMany({
        where: {
            dayOfWeek,
            deletedAt: null,
        },
        select: availabilitySelectFields,
        orderBy: { startTime: 'asc' },
    })

    return records.map(toAvailabilityRuleDTO)
}

export async function getAvailability(
    startDate: Date,
    endDate: Date
): Promise<AvailabilitySlotDTO[]> {
    await requireSchedulingReadSession()

    const parsed = availabilityQuerySchema.parse({ startDate, endDate })
    const rangeStart = parsed.startDate
    const rangeEnd = parsed.endDate
    const now = new Date()

    const [rules, bookings] = await Promise.all([
        prisma.availabilityRule.findMany({
            where: {
                deletedAt: null,
            },
            select: availabilitySelectFields,
            orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
        }),
        prisma.booking.findMany({
            where: {
                deletedAt: null,
                startTime: { lte: rangeEnd },
                endTime: { gte: rangeStart },
                OR: [
                    {
                        status: 'requested',
                        reservation: {
                            is: null,
                        },
                    },
                    {
                        status: 'requested',
                        reservation: {
                            is: {
                                expiresAt: { gt: now },
                            },
                        },
                    },
                    { status: 'confirmed' },
                    { status: 'reschedule_requested' },
                    { status: 'completed' },
                ],
            },
            select: {
                startTime: true,
                endTime: true,
            },
        }),
    ])

    const slots: AvailabilitySlotDTO[] = []
    const cursor = new Date(rangeStart)
    cursor.setHours(0, 0, 0, 0)
    const max = new Date(rangeEnd)
    max.setHours(23, 59, 59, 999)

    while (cursor <= max) {
        const dayRules = rules.filter((rule) => rule.dayOfWeek === cursor.getDay())

        for (const rule of dayRules) {
            const slotStart = parseHHmmToDate(cursor, rule.startTime)
            const slotEnd = parseHHmmToDate(cursor, rule.endTime)

            if (slotEnd <= rangeStart || slotStart >= rangeEnd) {
                continue
            }

            const overlappingCount = bookings.filter((booking) =>
                rangesOverlap(slotStart, slotEnd, booking.startTime, booking.endTime)
            ).length

            const remainingCapacity = Math.max(0, rule.capacitySlots - overlappingCount)

            slots.push({
                start: slotStart.toISOString(),
                end: slotEnd.toISOString(),
                capacity: rule.capacitySlots,
                remainingCapacity,
                isAvailable: remainingCapacity > 0,
            })
        }

        cursor.setDate(cursor.getDate() + 1)
    }

    return slots.sort((a, b) => a.start.localeCompare(b.start))
}

// Bookings
const DEFAULT_BOOKING_LIST_PARAMS: BookingListParams = {
    page: 1,
    pageSize: 20,
}

function toBookingDTO(record: {
    id: string
    customerId: string
    wrapId: string | null
    wrap: {
        name: string
    } | null
    startTime: Date | string
    endTime: Date | string
    status: string
    totalPrice: number | null
    wrapNameSnapshot: string | null
    wrapPriceSnapshot: number | null
    customerName: string | null
    customerEmail: string | null
    customerPhone: string | null
    preferredContact: string | null
    billingAddressLine1: string | null
    billingAddressLine2: string | null
    billingCity: string | null
    billingState: string | null
    billingPostalCode: string | null
    billingCountry: string | null
    vehicleMake: string | null
    vehicleModel: string | null
    vehicleYear: string | null
    vehicleTrim: string | null
    previewImageUrl: string | null
    previewPromptUsed: string | null
    notes: string | null
    reservation: {
        expiresAt: Date | string
    } | null
    createdAt: Date | string
    updatedAt: Date | string
}): BookingDTO {
    const reservationExpiresAtDate: Date | string | null = record.reservation?.expiresAt ?? null
    const normalizedStatus = normalizeBookingStatus(record.status)
    const displayStatus = getBookingDisplayStatus(
        normalizedStatus,
        typeof reservationExpiresAtDate === 'string'
            ? reservationExpiresAtDate
                ? new Date(reservationExpiresAtDate)
                : null
            : (reservationExpiresAtDate as Date | null)
    )
    const reservationExpiresAt = reservationExpiresAtDate
        ? typeof reservationExpiresAtDate === 'string'
            ? reservationExpiresAtDate
            : reservationExpiresAtDate.toISOString()
        : null

    const startTime =
        typeof record.startTime === 'string' ? record.startTime : record.startTime.toISOString()
    const endTime =
        typeof record.endTime === 'string' ? record.endTime : record.endTime.toISOString()
    const createdAt =
        typeof record.createdAt === 'string' ? record.createdAt : record.createdAt.toISOString()
    const updatedAt =
        typeof record.updatedAt === 'string' ? record.updatedAt : record.updatedAt.toISOString()

    return {
        id: record.id,
        customerId: record.customerId,
        wrapId: record.wrapId,
        wrapName: record.wrapNameSnapshot ?? record.wrap?.name ?? undefined,
        startTime,
        endTime,
        status: normalizedStatus as BookingDTO['status'],
        totalPrice: record.wrapPriceSnapshot ?? record.totalPrice,
        reservationExpiresAt,
        displayStatus,
        customerName: record.customerName,
        customerEmail: record.customerEmail,
        customerPhone: record.customerPhone,
        preferredContact:
            record.preferredContact === 'sms' || record.preferredContact === 'email'
                ? record.preferredContact
                : null,
        billingAddressLine1: record.billingAddressLine1,
        billingAddressLine2: record.billingAddressLine2,
        billingCity: record.billingCity,
        billingState: record.billingState,
        billingPostalCode: record.billingPostalCode,
        billingCountry: record.billingCountry,
        vehicleMake: record.vehicleMake,
        vehicleModel: record.vehicleModel,
        vehicleYear: record.vehicleYear,
        vehicleTrim: record.vehicleTrim,
        previewImageUrl: record.previewImageUrl,
        previewPromptUsed: record.previewPromptUsed,
        notes: record.notes,
        createdAt,
        updatedAt,
    }
}

type BookingReadScope = {
    customerId?: string
    ownOnly?: boolean
}

function resolveBookingCustomerId(
    session: Awaited<ReturnType<typeof requireSchedulingReadSession>>,
    scope?: BookingReadScope
): string | undefined {
    if (scope?.customerId) {
        return scope.customerId
    }

    if (scope?.ownOnly) {
        return session.userId
    }

    return canViewAllSchedulingBookings(session) ? undefined : session.userId
}

export async function getBookings(
    params: BookingListParams = DEFAULT_BOOKING_LIST_PARAMS,
    scope?: BookingReadScope
): Promise<BookingListResult> {
    const session = await requireSchedulingReadSession()
    // Validate params at the action boundary: bookingListParamsSchema.parse(params)
    const { page, pageSize, status, fromDate, toDate } = params
    const skip = (page - 1) * pageSize

    const customerId = resolveBookingCustomerId(session, scope)

    const where = {
        deletedAt: null,
        ...(customerId ? { customerId } : {}),
        ...(status !== undefined && { status }),
        ...((fromDate !== undefined || toDate !== undefined) && {
            startTime: {
                ...(fromDate !== undefined && { gte: fromDate }),
                ...(toDate !== undefined && { lte: toDate }),
            },
        }),
    }

    const [records, total] = await Promise.all([
        prisma.booking.findMany({
            where,
            select: bookingSelectFields,
            orderBy: { startTime: 'asc' },
            skip,
            take: pageSize,
        }),
        prisma.booking.count({ where }),
    ])

    return {
        items: records.map(toBookingDTO),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    }
}

export async function getBookingById(
    bookingId: string,
    scope?: BookingReadScope
): Promise<BookingDTO | null> {
    const session = await requireSchedulingReadSession()
    const customerId = resolveBookingCustomerId(session, scope)

    const record = await prisma.booking.findFirst({
        where: {
            id: bookingId,
            ...(customerId ? { customerId } : {}),
            deletedAt: null,
        },
        select: bookingSelectFields,
    })

    return record ? toBookingDTO(record) : null
}

async function getBookingTimeline(
    bookingId: string,
    scope?: BookingReadScope
): Promise<BookingTimelineEventDTO[]> {
    const session = await requireSchedulingReadSession()
    const customerId = resolveBookingCustomerId(session, scope)

    const bookingExists = await prisma.booking.findFirst({
        where: {
            id: bookingId,
            deletedAt: null,
            ...(customerId ? { customerId } : {}),
        },
        select: { id: true },
    })

    if (!bookingExists) {
        return []
    }

    const events = await prisma.auditLog.findMany({
        where: {
            deletedAt: null,
            resourceType: 'Booking',
            resourceId: bookingId,
        },
        select: {
            id: true,
            action: true,
            timestamp: true,
            userId: true,
            details: true,
        },
        orderBy: {
            timestamp: 'desc',
        },
    })

    return events.map((event) => ({
        id: event.id,
        type: event.action,
        label: formatAuditActionLabel(event.action),
        createdAt: event.timestamp.toISOString(),
        actorName: event.userId ?? null,
        notes: event.details ?? null,
    }))
}

export async function getBooking(
    bookingId: string,
    scope?: BookingReadScope
): Promise<BookingDetailViewDTO | null> {
    const booking = await getBookingById(bookingId, scope)
    if (!booking) {
        return null
    }

    const timeline = await getBookingTimeline(bookingId, scope)

    const scheduledAt = booking.startTime
    const durationMinutes = Math.max(
        0,
        Math.round(
            (new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime()) / 60000
        )
    )

    return {
        id: booking.id,
        wrapId: booking.wrapId,
        wrapName: booking.wrapName ?? null,
        scheduledAt,
        estimatedPickupAt: booking.endTime,
        durationMinutes,
        status: booking.status,
        customerName: booking.customerName ?? 'Customer',
        customerEmail: booking.customerEmail ?? booking.customerId ?? 'unknown@ctrlplus.local',
        customerPhone: booking.customerPhone ?? null,
        preferredContact: booking.preferredContact ?? null,
        billingAddressLine1: booking.billingAddressLine1 ?? null,
        billingAddressLine2: booking.billingAddressLine2 ?? null,
        billingCity: booking.billingCity ?? null,
        billingState: booking.billingState ?? null,
        billingPostalCode: booking.billingPostalCode ?? null,
        billingCountry: booking.billingCountry ?? null,
        vehicleMake: booking.vehicleMake ?? null,
        vehicleModel: booking.vehicleModel ?? null,
        vehicleYear: booking.vehicleYear ?? null,
        vehicleTrim: booking.vehicleTrim ?? null,
        previewImageUrl: booking.previewImageUrl ?? null,
        previewPromptUsed: booking.previewPromptUsed ?? null,
        notes: booking.notes ?? null,
        timeline,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
    }
}

export async function getBookingManagerRows(
    params: BookingListParams = DEFAULT_BOOKING_LIST_PARAMS
): Promise<BookingManagerRowDTO[]> {
    const result = await getBookings(params)

    return result.items.map((booking) => ({
        id: booking.id,
        wrapId: booking.wrapId,
        wrapName: booking.wrapName ?? null,
        scheduledAt: booking.startTime,
        estimatedPickupAt: booking.endTime,
        durationMinutes: Math.max(
            0,
            Math.round(
                (new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime()) /
                    60000
            )
        ),
        status: booking.status,
        customerName: booking.customerName ?? 'Customer',
        customerEmail: booking.customerEmail ?? booking.customerId ?? 'unknown@ctrlplus.local',
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
    }))
}

export async function getUpcomingBookingCount(
    from: Date = new Date(),
    scope?: BookingReadScope
): Promise<number> {
    const session = await requireSchedulingReadSession()
    const customerId = resolveBookingCustomerId(session, scope)

    return prisma.booking.count({
        where: {
            ...(customerId ? { customerId } : {}),
            deletedAt: null,
            status: { notIn: ['cancelled', 'completed'] },
            startTime: { gte: from },
        },
    })
}

/**
 * Returns the published wrap catalog as needed by scheduling booking forms.
 * Keeps the scheduling domain decoupled from a direct catalog fetcher import.
 */
export async function getWrapsForScheduling(opts?: {
    includeHidden?: boolean
}): Promise<WrapDTO[]> {
    return getWraps({ includeHidden: opts?.includeHidden ?? false })
}

export async function getWrapForScheduling(
    wrapId: string,
    opts?: { includeHidden?: boolean }
): Promise<WrapDTO | null> {
    const wraps = await getWrapsForScheduling(opts)
    return wraps.find((wrap) => wrap.id === wrapId) ?? null
}

