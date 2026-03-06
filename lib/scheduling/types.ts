import { z } from "zod";

// ─── Booking Status ───────────────────────────────────────────────────────────

/** Booking status values as stored in the database (plain strings, no Prisma enum). */
export const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

// ─── Booking DTOs ─────────────────────────────────────────────────────────────

export interface BookingDTO {
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
  status: z.string().optional(),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
});

export type BookingListParams = z.infer<typeof bookingListParamsSchema>;

// ─── Availability Rule DTOs ───────────────────────────────────────────────────

export interface AvailabilityWindowDTO {
  id: string;
  tenantId: string;
  /** 0 = Sunday … 6 = Saturday */
  dayOfWeek: number;
  /** "HH:mm" 24-hour format */
  startTime: string;
  /** "HH:mm" 24-hour format */
  endTime: string;
  /** Number of concurrent booking slots */
  capacitySlots: number;
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
});

export type AvailabilityListParams = z.infer<typeof availabilityListParamsSchema>;
