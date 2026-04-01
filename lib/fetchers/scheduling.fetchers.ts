import 'server-only'
import { prisma } from '@/lib/db/prisma'
import { availabilitySelectFields, bookingSelectFields } from '@/lib/db/selects/scheduling.selects'
import { availabilityListParamsSchema, bookingListParamsSchema } from '@/schemas/scheduling.schemas'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import type {
    AvailabilityListParams,
    AvailabilityListResult,
    AvailabilityRuleDTO,
    AvailabilityWindowDTO,
    BookingDTO,
    BookingListParams,
    BookingListResult,
} from '@/types/scheduling.types'

import { getBookingDisplayStatus, BookingStatusValue } from '@/lib/constants/statuses'
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
