import 'server-only'
import { prisma } from '@/lib/db/prisma'
import { availabilitySelectFields, bookingSelectFields } from '@/lib/db/selects/scheduling.selects'
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

import { getBookingDisplayStatus, BookingStatusValue } from '@/lib/constants/statuses'

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

    return session
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

export async function getAvailabilityRules(
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

export const getAvailabilityWindows = getAvailabilityRules

export async function getAvailabilityRuleById(
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

export const getAvailabilityWindowById = getAvailabilityRuleById

export async function getAvailabilityRulesByDay(
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

export const getAvailabilityWindowsByDay = getAvailabilityRulesByDay

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
                    { status: 'confirmed' },
                    { status: 'completed' },
                    {
                        status: 'pending',
                        reservation: {
                            is: {
                                expiresAt: { gt: now },
                            },
                        },
                    },
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
    wrapId: string
    wrap: {
        name: string
    }
    startTime: Date | string
    endTime: Date | string
    status: string
    totalPrice: number
    reservation: {
        expiresAt: Date | string
    } | null
    createdAt: Date | string
    updatedAt: Date | string
}): BookingDTO {
    const reservationExpiresAtDate: Date | string | null = record.reservation?.expiresAt ?? null
    const displayStatus = getBookingDisplayStatus(
        record.status as BookingStatusValue,
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
        wrapName: record.wrap.name,
        startTime,
        endTime,
        status: record.status as BookingDTO['status'],
        totalPrice: record.totalPrice,
        reservationExpiresAt,
        displayStatus,
        createdAt,
        updatedAt,
    }
}

export async function getBookings(
    params: BookingListParams = DEFAULT_BOOKING_LIST_PARAMS,
    _scope?: {
        customerId?: string
    }
): Promise<BookingListResult> {
    void _scope

    const session = await requireSchedulingReadSession()
    // Validate params at the action boundary: bookingListParamsSchema.parse(params)
    const { page, pageSize, status, fromDate, toDate } = params
    const skip = (page - 1) * pageSize

    const customerId = canViewAllSchedulingBookings(session) ? undefined : session.userId

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

export async function getBookingById(bookingId: string): Promise<BookingDTO | null> {
    const session = await requireSchedulingReadSession()
    const customerId = canViewAllSchedulingBookings(session) ? undefined : session.userId

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

export async function getBookingTimeline(bookingId: string): Promise<BookingTimelineEventDTO[]> {
    await requireSchedulingReadSession()

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
    _userId?: string
): Promise<BookingDetailViewDTO | null> {
    void _userId

    const booking = await getBookingById(bookingId)
    if (!booking) {
        return null
    }

    const timeline = await getBookingTimeline(bookingId)

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
        scheduledAt,
        durationMinutes,
        status: booking.status,
        customerName: 'Customer',
        customerEmail: booking.customerId ?? 'unknown@ctrlplus.local',
        customerPhone: null,
        notes: null,
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
        scheduledAt: booking.startTime,
        durationMinutes: Math.max(
            0,
            Math.round(
                (new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime()) /
                    60000
            )
        ),
        status: booking.status,
        customerName: 'Customer',
        customerEmail: booking.customerId ?? 'unknown@ctrlplus.local',
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
    }))
}

export async function getUpcomingBookingCount(from: Date = new Date()): Promise<number> {
    const session = await requireSchedulingReadSession()
    const customerId = canViewAllSchedulingBookings(session) ? undefined : session.userId

    return prisma.booking.count({
        where: {
            ...(customerId ? { customerId } : {}),
            deletedAt: null,
            status: { notIn: ['cancelled', 'completed'] },
            startTime: { gte: from },
        },
    })
}
