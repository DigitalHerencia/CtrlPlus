import { prisma } from "@/lib/prisma";
import {
  BookingStatus,
  bookingListParamsSchema,
  type BookingDTO,
  type BookingListParams,
  type BookingListResult,
} from "../types";

const DEFAULT_BOOKING_LIST_PARAMS: BookingListParams = {
  page: 1,
  pageSize: 20,
};

interface BookingScope {
  customerId?: string;
}

function toBookingDTO(record: {
  id: string;
  customerId: string;
  wrapId: string;
  startTime: Date;
  endTime: Date;
  status: string;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}): BookingDTO {
  return {
    id: record.id,
    customerId: record.customerId,
    wrapId: record.wrapId,
    startTime: record.startTime,
    endTime: record.endTime,
    status: record.status as BookingStatus,
    totalPrice: record.totalPrice,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

const bookingSelectFields = {
  id: true,
  customerId: true,
  wrapId: true,
  startTime: true,
  endTime: true,
  status: true,
  totalPrice: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function getBookings(
  params: BookingListParams = DEFAULT_BOOKING_LIST_PARAMS,
  scope: BookingScope = {},
): Promise<BookingListResult> {
  const { page, pageSize, status, fromDate, toDate } = bookingListParamsSchema.parse(params);
  const skip = (page - 1) * pageSize;

  const where = {
    deletedAt: null,
    ...(scope.customerId ? { customerId: scope.customerId } : {}),
    ...(status !== undefined && { status }),
    ...((fromDate !== undefined || toDate !== undefined) && {
      startTime: {
        ...(fromDate !== undefined && { gte: fromDate }),
        ...(toDate !== undefined && { lte: toDate }),
      },
    }),
  };

  const [records, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      select: bookingSelectFields,
      orderBy: { startTime: "asc" },
      skip,
      take: pageSize,
    }),
    prisma.booking.count({ where }),
  ]);

  return {
    items: records.map(toBookingDTO),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getBookingById(
  bookingId: string,
  scope: BookingScope = {},
): Promise<BookingDTO | null> {
  const record = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      ...(scope.customerId ? { customerId: scope.customerId } : {}),
      deletedAt: null,
    },
    select: bookingSelectFields,
  });

  return record ? toBookingDTO(record) : null;
}

export async function getUpcomingBookingCount(
  from: Date = new Date(),
  scope: BookingScope = {},
): Promise<number> {
  return prisma.booking.count({
    where: {
      ...(scope.customerId ? { customerId: scope.customerId } : {}),
      deletedAt: null,
      status: { notIn: [BookingStatus.CANCELLED, BookingStatus.COMPLETED] },
      startTime: { gte: from },
    },
  });
}
