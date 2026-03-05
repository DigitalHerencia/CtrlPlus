import { z } from "zod";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const BookingStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

// ─── DTOs ─────────────────────────────────────────────────────────────────────

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
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

export const createBookingSchema = z
  .object({
    customerId: z.string().min(1, "Customer ID is required"),
    wrapId: z.string().min(1, "Wrap ID is required"),
    dropOffStart: z.coerce.date(),
    dropOffEnd: z.coerce.date(),
    pickUpStart: z.coerce.date(),
    pickUpEnd: z.coerce.date(),
    notes: z.string().max(1000).optional(),
  })
  .refine((data) => data.dropOffEnd > data.dropOffStart, {
    message: "dropOffEnd must be after dropOffStart",
    path: ["dropOffEnd"],
  })
  .refine((data) => data.pickUpStart >= data.dropOffEnd, {
    message: "pickUpStart must be on or after dropOffEnd",
    path: ["pickUpStart"],
  })
  .refine((data) => data.pickUpEnd > data.pickUpStart, {
    message: "pickUpEnd must be after pickUpStart",
    path: ["pickUpEnd"],
  })
  .refine((data) => data.dropOffStart > new Date(), {
    message: "dropOffStart must be in the future",
    path: ["dropOffStart"],
  });

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const cancelBookingSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  reason: z.string().max(500).optional(),
});

export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;

export const updateBookingSchema = z
  .object({
    bookingId: z.string().min(1, "Booking ID is required"),
    dropOffStart: z.coerce.date().optional(),
    dropOffEnd: z.coerce.date().optional(),
    pickUpStart: z.coerce.date().optional(),
    pickUpEnd: z.coerce.date().optional(),
    status: z
      .enum([
        BookingStatus.PENDING,
        BookingStatus.CONFIRMED,
        BookingStatus.IN_PROGRESS,
        BookingStatus.COMPLETED,
        BookingStatus.CANCELLED,
      ])
      .optional(),
    notes: z.string().max(1000).optional(),
  })
  .refine(
    (data) => {
      if (data.dropOffStart && data.dropOffEnd) {
        return data.dropOffEnd > data.dropOffStart;
      }
      return true;
    },
    {
      message: "dropOffEnd must be after dropOffStart",
      path: ["dropOffEnd"],
    }
  )
  .refine(
    (data) => {
      if (data.pickUpStart && data.pickUpEnd) {
        return data.pickUpEnd > data.pickUpStart;
      }
      return true;
    },
    {
      message: "pickUpEnd must be after pickUpStart",
      path: ["pickUpEnd"],
    }
  );

export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;

// ─── Select fields for DTO mapping ────────────────────────────────────────────

export const bookingDTOFields = {
  id: true,
  tenantId: true,
  customerId: true,
  wrapId: true,
  dropOffStart: true,
  dropOffEnd: true,
  pickUpStart: true,
  pickUpEnd: true,
  status: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
} as const;
