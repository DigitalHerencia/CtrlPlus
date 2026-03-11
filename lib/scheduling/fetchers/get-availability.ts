import { prisma } from "@/lib/prisma";
import {
  availabilityListParamsSchema,
  type AvailabilityListParams,
  type AvailabilityListResult,
  type AvailabilityRuleDTO,
  type AvailabilityWindowDTO,
} from "../types";

const DEFAULT_AVAILABILITY_LIST_PARAMS: AvailabilityListParams = {
  page: 1,
  pageSize: 20,
};

function toAvailabilityRuleDTO(record: {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  capacitySlots: number;
  createdAt: Date;
  updatedAt: Date;
}): AvailabilityRuleDTO {
  return {
    id: record.id,
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
  dayOfWeek: true,
  startTime: true,
  endTime: true,
  capacitySlots: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function getAvailabilityRules(
  params: AvailabilityListParams = DEFAULT_AVAILABILITY_LIST_PARAMS,
): Promise<AvailabilityListResult> {
  const { page, pageSize, dayOfWeek } = availabilityListParamsSchema.parse(params);
  const skip = (page - 1) * pageSize;

  const where = {
    deletedAt: null,
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

export const getAvailabilityWindows = getAvailabilityRules;

export async function getAvailabilityRuleById(
  windowId: string,
): Promise<AvailabilityWindowDTO | null> {
  const record = await prisma.availabilityRule.findFirst({
    where: {
      id: windowId,
      deletedAt: null,
    },
    select: availabilitySelectFields,
  });

  return record ? toAvailabilityRuleDTO(record) : null;
}

export const getAvailabilityWindowById = getAvailabilityRuleById;

export async function getAvailabilityRulesByDay(
  dayOfWeek: number,
): Promise<AvailabilityWindowDTO[]> {
  const records = await prisma.availabilityRule.findMany({
    where: {
      dayOfWeek,
      deletedAt: null,
    },
    select: availabilitySelectFields,
    orderBy: { startTime: "asc" },
  });

  return records.map(toAvailabilityRuleDTO);
}

export const getAvailabilityWindowsByDay = getAvailabilityRulesByDay;
