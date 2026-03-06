import { prisma } from "@/lib/prisma";
import { type BookingDTO, type BookingListParams, type BookingListResult } from "../types";

const DEFAULT_BOOKING_LIST_PARAMS: BookingListParams = {
  page: 1,
  pageSize: 20,
};

/**
 * Maps a raw Prisma Booking record to a BookingDTO.
 * Never exposes deletedAt or other internal fields.
 */
function toBookingDTO(record: {
  id: string;
  tenantId: string;
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
    tenantId: record.tenantId,
    customerId: record.customerId,
    wrapId: record.wrapId,
    startTime: record.startTime,
    endTime: record.endTime,
    status: record.status,
    totalPrice: record.totalPrice,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

const bookingSelectFields = {
  id: true,
  tenantId: true,
  customerId: true,
  wrapId: true,
  startTime: true,
  endTime: true,
  status: true,
  totalPrice: true,
  createdAt: true,
  updatedAt: true,
} as const;

/**
 * Returns a paginated list of non-deleted bookings for a tenant.
 *
 * @param tenantId - Tenant scope (server-side verified)
 * @param params   - Optional filter / pagination options
 */
export async function getBookingsForTenant(
  tenantId: string,
  params: BookingListParams = DEFAULT_BOOKING_LIST_PARAMS,
): Promise<BookingListResult> {
  const { page, pageSize, status, fromDate, toDate } = params;
  const skip = (page - 1) * pageSize;

  const where = {
    tenantId,
    deletedAt: null, // soft-delete filter
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

/**
 * Returns a single non-deleted booking by ID, scoped to a tenant.
 * Returns null when not found or when it belongs to a different tenant.
 *
 * @param tenantId  - Tenant scope (server-side verified)
 * @param bookingId - Booking primary key
 */
export async function getBookingById(
  tenantId: string,
  bookingId: string,
): Promise<BookingDTO | null> {
  const record = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      tenantId, // defensive scope check
      deletedAt: null,
    },
    select: bookingSelectFields,
  });

  return record ? toBookingDTO(record) : null;
}

/**
 * Returns the count of upcoming non-cancelled, non-completed bookings for a
 * tenant starting at or after `from` (defaults to now).
 *
 * @param tenantId - Tenant scope (server-side verified)
 * @param from     - Lower-bound date (defaults to current time)
 */
export async function getUpcomingBookingCount(
  tenantId: string,
  from: Date = new Date(),
): Promise<number> {
  return prisma.booking.count({
    where: {
      tenantId,
      deletedAt: null,
      status: { notIn: ["cancelled", "completed"] },
      startTime: { gte: from },
    },
  });
}
