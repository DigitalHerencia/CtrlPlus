import { prisma } from "@/lib/prisma";
import {
  type AvailabilityRuleDTO,
  type AvailabilityListParams,
  type AvailabilityListResult,
} from "../types";

const DEFAULT_AVAILABILITY_LIST_PARAMS: AvailabilityListParams = {
  page: 1,
  pageSize: 20,
};

/**
 * Maps a raw Prisma AvailabilityRule record to an AvailabilityRuleDTO.
 * Never exposes deletedAt or other internal fields.
 */
function toAvailabilityRuleDTO(record: {
  id: string;
  tenantId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  capacitySlots: number;
  createdAt: Date;
  updatedAt: Date;
}): AvailabilityRuleDTO {
  return {
    id: record.id,
    tenantId: record.tenantId,
    dayOfWeek: record.dayOfWeek,
    startTime: record.startTime,
    endTime: record.endTime,
    capacitySlots: record.capacitySlots,
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
  capacitySlots: true,
  createdAt: true,
  updatedAt: true,
} as const;

/**
 * Returns a paginated list of non-deleted availability rules for a tenant.
 *
 * @param tenantId - Tenant scope (server-side verified)
 * @param params   - Optional filter / pagination options
 */
export async function getAvailabilityRulesForTenant(
  tenantId: string,
  params: AvailabilityListParams = DEFAULT_AVAILABILITY_LIST_PARAMS,
): Promise<AvailabilityListResult> {
  const { page, pageSize, dayOfWeek } = params;
  const skip = (page - 1) * pageSize;

  const where = {
    tenantId,
    deletedAt: null, // soft-delete filter
    ...(dayOfWeek !== undefined && { dayOfWeek }),
  };

  const [records, total] = await Promise.all([
    prisma.availabilityRule.findMany({
      where,
      select: availabilitySelectFields,
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      skip,
      take: pageSize,
    }),
    prisma.availabilityRule.count({ where }),
  ]);

  return {
    items: records.map(toAvailabilityRuleDTO),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

/** @deprecated Use getAvailabilityRulesForTenant */
export const getAvailabilityWindowsForTenant = getAvailabilityRulesForTenant;

/**
 * Returns a single non-deleted availability rule by ID, scoped to a tenant.
 * Returns null when not found or when it belongs to a different tenant.
 *
 * @param tenantId  - Tenant scope (server-side verified)
 * @param ruleId    - AvailabilityRule primary key
 */
export async function getAvailabilityRuleById(
  tenantId: string,
  ruleId: string,
): Promise<AvailabilityRuleDTO | null> {
  const record = await prisma.availabilityRule.findFirst({
    where: {
      id: ruleId,
      tenantId, // defensive scope check
      deletedAt: null,
    },
    select: availabilitySelectFields,
  });

  return record ? toAvailabilityRuleDTO(record) : null;
}

/** @deprecated Use getAvailabilityRuleById */
export const getAvailabilityWindowById = getAvailabilityRuleById;

/**
 * Returns all availability rules for a specific day of the week.
 * Ordered by startTime ascending — suitable for computing available slots.
 *
 * @param tenantId  - Tenant scope (server-side verified)
 * @param dayOfWeek - 0 (Sunday) … 6 (Saturday)
 */
export async function getAvailabilityRulesByDay(
  tenantId: string,
  dayOfWeek: number,
): Promise<AvailabilityRuleDTO[]> {
  const records = await prisma.availabilityRule.findMany({
    where: {
      tenantId,
      dayOfWeek,
      deletedAt: null,
    },
    select: availabilitySelectFields,
    orderBy: { startTime: "asc" },
  });

  return records.map(toAvailabilityRuleDTO);
}

/** @deprecated Use getAvailabilityRulesByDay */
export const getAvailabilityWindowsByDay = getAvailabilityRulesByDay;
