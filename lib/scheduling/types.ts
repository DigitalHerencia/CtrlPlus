import { z } from "zod";

// ─── Booking Status ───────────────────────────────────────────────────────────

/** Booking status values as stored in the database (Booking.status String). */
export const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type BookingStatusValue = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

// ─── Action DTOs ──────────────────────────────────────────────────────────────

/**
 * Booking data as returned by scheduling actions.
 * Maps directly to the Prisma `Booking` model fields.
 */
export interface BookingActionDTO {
  id: string;
  tenantId: string;
  customerId: string;
  wrapId: string;
  startTime: Date;
  endTime: Date;
  status: BookingStatusValue;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Action Input Schemas ─────────────────────────────────────────────────────

export const createBookingSchema = z
  .object({
    wrapId: z.string().min(1, "Wrap ID is required"),
    startTime: z.date({ required_error: "Start time is required" }),
    endTime: z.date({ required_error: "End time is required" }),
    totalPrice: z.number().positive("Total price must be positive"),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const updateBookingSchema = z
  .object({
    startTime: z.date({ required_error: "Start time is required" }),
    endTime: z.date({ required_error: "End time is required" }),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;

// ─── Booking DTOs ─────────────────────────────────────────────────────────────

export interface BookingDTO {
  id: string;
  tenantId: string;
  customerId: string;
  wrapId: string;
  startTime: Date;
  endTime: Date;
  status: BookingStatusValue;
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
  status: z
    .enum([
      BOOKING_STATUS.PENDING,
      BOOKING_STATUS.CONFIRMED,
      BOOKING_STATUS.COMPLETED,
      BOOKING_STATUS.CANCELLED,
    ])
    .optional(),
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

export type AvailabilityListParams = z.infer<typeof availabilityListParamsSchema>;
