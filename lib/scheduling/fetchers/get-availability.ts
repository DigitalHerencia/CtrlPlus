import { prisma } from "@/lib/prisma";
import {
  type AvailabilityWindowDTO,
  type AvailabilityListParams,
  type AvailabilityListResult,
} from "../types";

const DEFAULT_AVAILABILITY_LIST_PARAMS: AvailabilityListParams = {
  page: 1,
  pageSize: 20,
  activeOnly: true,
};

/**
 * Maps a raw Prisma AvailabilityWindow record to an AvailabilityWindowDTO.
 * Never exposes deletedAt or other internal fields.
 */
function toAvailabilityWindowDTO(record: {
  id: string;
  tenantId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  capacity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}): AvailabilityWindowDTO {
  return {
    id: record.id,
    tenantId: record.tenantId,
    dayOfWeek: record.dayOfWeek,
    startTime: record.startTime,
    endTime: record.endTime,
    capacity: record.capacity,
    isActive: record.isActive,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

const availabilitySelectFields = {
  id: true,
  tenantId: true,
  dayOfWeek: true,
  startTime: true,
  endTime: true,
  capacity: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

/**
 * Returns a paginated list of non-deleted availability windows for a tenant.
 *
 * @param tenantId - Tenant scope (server-side verified)
 * @param params   - Optional filter / pagination options
 */
export async function getAvailabilityWindowsForTenant(
  tenantId: string,
  params: AvailabilityListParams = DEFAULT_AVAILABILITY_LIST_PARAMS
): Promise<AvailabilityListResult> {
  const { page, pageSize, dayOfWeek, activeOnly } = params;
  const skip = (page - 1) * pageSize;

  const where = {
    tenantId,
    deletedAt: null, // soft-delete filter
    ...(activeOnly && { isActive: true }),
    ...(dayOfWeek !== undefined && { dayOfWeek }),
  };

  const [records, total] = await Promise.all([
    prisma.availabilityWindow.findMany({
      where,
      select: availabilitySelectFields,
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      skip,
      take: pageSize,
    }),
    prisma.availabilityWindow.count({ where }),
  ]);

  return {
    items: records.map(toAvailabilityWindowDTO),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

/**
 * Returns a single non-deleted availability window by ID, scoped to a tenant.
 * Returns null when not found or when it belongs to a different tenant.
 *
 * @param tenantId  - Tenant scope (server-side verified)
 * @param windowId  - AvailabilityWindow primary key
 */
export async function getAvailabilityWindowById(
  tenantId: string,
  windowId: string
): Promise<AvailabilityWindowDTO | null> {
  const record = await prisma.availabilityWindow.findFirst({
    where: {
      id: windowId,
      tenantId, // defensive scope check
      deletedAt: null,
    },
    select: availabilitySelectFields,
  });

  return record ? toAvailabilityWindowDTO(record) : null;
}

/**
 * Returns all active availability windows for a specific day of the week.
 * Ordered by startTime ascending — suitable for computing available slots.
 *
 * @param tenantId  - Tenant scope (server-side verified)
 * @param dayOfWeek - 0 (Sunday) … 6 (Saturday)
 */
export async function getAvailabilityWindowsByDay(
  tenantId: string,
  dayOfWeek: number
): Promise<AvailabilityWindowDTO[]> {
  const records = await prisma.availabilityWindow.findMany({
    where: {
      tenantId,
      dayOfWeek,
      isActive: true,
      deletedAt: null,
    },
    select: availabilitySelectFields,
    orderBy: { startTime: "asc" },
  });

  return records.map(toAvailabilityWindowDTO);
}
