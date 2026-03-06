import { z } from "zod";

// ─── Booking status constants ─────────────────────────────────────────────────
// Defined locally since the Prisma schema uses plain String (not an enum).

export const BookingStatus = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

// ─── Booking DTOs ─────────────────────────────────────────────────────────────

/** Valid booking status values (plain strings, not enum) */
export type BookingStatusValue = "pending" | "confirmed" | "completed" | "cancelled";

export interface BookingDTO {
  id: string;
  tenantId: string;
  customerId: string;
  wrapId: string;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  totalPrice: number;
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
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]).optional(),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
});

export type BookingListParams = z.infer<typeof bookingListParamsSchema>;

// ─── Availability Rule DTOs ───────────────────────────────────────────────────

export interface AvailabilityRuleDTO {
  id: string;
  tenantId: string;
  /** 0 = Sunday … 6 = Saturday */
  dayOfWeek: number;
  /** "HH:mm" 24-hour format */
  startTime: string;
  /** "HH:mm" 24-hour format */
  endTime: string;
  capacitySlots: number;
  createdAt: Date;
  updatedAt: Date;
}

/** @deprecated Use AvailabilityRuleDTO */
export type AvailabilityWindowDTO = AvailabilityRuleDTO;

export interface AvailabilityListResult {
  items: AvailabilityRuleDTO[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const availabilityListParamsSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  dayOfWeek: z.number().int().min(0).max(6).optional(),
});

export type AvailabilityListParams = z.infer<typeof availabilityListParamsSchema>;
