import 'server-only'

import { prisma } from '@/lib/prisma'
import { bookingListParamsSchema } from '@/schema/scheduling'
import { canViewAllSchedulingBookings, requireSchedulingReadSession } from '../access'
import { getBookingDisplayStatus } from '../utils'
import {
    type BookingDTO,
    type BookingListParams,
    type BookingListResult,
    type BookingStatusValue,
} from '../types'

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
    startTime: Date
    endTime: Date
    status: string
    totalPrice: number
    reservation: {
        expiresAt: Date
    } | null
    createdAt: Date
    updatedAt: Date
}): BookingDTO {
    const reservationExpiresAt = record.reservation?.expiresAt ?? null
    const displayStatus = getBookingDisplayStatus(
        record.status as BookingStatusValue,
        reservationExpiresAt
    )

    return {
        id: record.id,
        customerId: record.customerId,
        wrapId: record.wrapId,
        wrapName: record.wrap.name,
        startTime: record.startTime,
        endTime: record.endTime,
        status: record.status as BookingDTO['status'],
        totalPrice: record.totalPrice,
        reservationExpiresAt,
        displayStatus,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
    }
}

const bookingSelectFields = {
    id: true,
    customerId: true,
    wrapId: true,
    wrap: {
        select: {
            name: true,
        },
    },
    startTime: true,
    endTime: true,
    status: true,
    totalPrice: true,
    reservation: {
        select: {
            expiresAt: true,
        },
    },
    createdAt: true,
    updatedAt: true,
} as const

export async function getBookings(
    params: BookingListParams = DEFAULT_BOOKING_LIST_PARAMS,
    _scope?: {
        customerId?: string
    }
): Promise<BookingListResult> {
    void _scope

    const session = await requireSchedulingReadSession()
    const { page, pageSize, status, fromDate, toDate } = bookingListParamsSchema.parse(params)
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
