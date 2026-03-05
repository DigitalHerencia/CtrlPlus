import { z } from "zod";

// ─── Enums ────────────────────────────────────────────────────────────────────

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "RESERVED";

// ─── DTOs (read-side) ─────────────────────────────────────────────────────────

export interface TimeSlot {
  id: string;
  date: string; // ISO date string "YYYY-MM-DD"
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  available: boolean;
  remainingCapacity: number;
}

export interface BookingDTO {
  id: string;
  tenantId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  wrapId: string;
  wrapName: string;
  dropOffSlotId: string;
  dropOffDate: string;
  dropOffTime: string;
  pickUpSlotId: string;
  pickUpDate: string;
  pickUpTime: string;
  status: BookingStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AvailabilityDTO {
  date: string; // "YYYY-MM-DD"
  slots: TimeSlot[];
}

// ─── Zod Schemas (write-side validation) ─────────────────────────────────────

export const createBookingSchema = z.object({
  wrapId: z.string().min(1, "Wrap selection is required"),
  customerName: z.string().min(1, "Name is required").max(100),
  customerEmail: z.string().email("Valid email is required"),
  dropOffSlotId: z.string().min(1, "Drop-off time slot is required"),
  pickUpSlotId: z.string().min(1, "Pick-up time slot is required"),
  notes: z
    .string()
    .max(500, "Notes must be 500 characters or fewer")
    .optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const cancelBookingSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  reason: z
    .string()
    .max(500, "Reason must be 500 characters or fewer")
    .optional(),
});

export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;

export const getAvailabilitySchema = z.object({
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
});

export type GetAvailabilityInput = z.infer<typeof getAvailabilitySchema>;
