import { z } from "zod";
import { BookingStatus } from "@prisma/client";

// ─── Booking DTOs ─────────────────────────────────────────────────────────────

export interface BookingDTO {
  id: string;
  tenantId: string;
  customerId: string;
  wrapId: string;
  dropOffStart: Date;
  dropOffEnd: Date;
  pickUpStart: Date;
  pickUpEnd: Date;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingListResult {
  items: BookingDTO[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const bookingListParamsSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  status: z.nativeEnum(BookingStatus).optional(),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
});

export type BookingListParams = z.infer<typeof bookingListParamsSchema>;

// ─── Availability Window DTOs ─────────────────────────────────────────────────

export interface AvailabilityWindowDTO {
  id: string;
  tenantId: string;
  /** 0 = Sunday … 6 = Saturday */
  dayOfWeek: number;
  /** "HH:mm" 24-hour format */
  startTime: string;
  /** "HH:mm" 24-hour format */
  endTime: string;
  capacity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AvailabilityListResult {
  items: AvailabilityWindowDTO[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const availabilityListParamsSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  dayOfWeek: z.number().int().min(0).max(6).optional(),
  activeOnly: z.boolean().default(true),
});

export type AvailabilityListParams = z.infer<
  typeof availabilityListParamsSchema
>;
