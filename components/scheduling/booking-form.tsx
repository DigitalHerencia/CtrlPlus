"use client";

import { useState, useTransition } from "react";
import { createBooking } from "@/lib/scheduling/actions/create-booking";
import {
  createBookingSchema,
  type CreateBookingInput,
} from "@/lib/scheduling/types";
import { CalendarView } from "./calendar-view";
import { TimeSlotPicker } from "./time-slot-picker";
import type { AvailabilityDTO, BookingDTO } from "@/lib/scheduling/types";

interface BookingFormProps {
  wrapId: string;
  wrapName: string;
  availability: AvailabilityDTO[];
  onSuccess: (booking: BookingDTO) => void;
}

type FieldErrors = Partial<Record<keyof CreateBookingInput, string>>;

/**
 * BookingForm is a fully client-side form that lets customers:
 * 1. Select a drop-off date & time slot from a calendar
 * 2. Select a pick-up date & time slot from a calendar
 * 3. Enter contact details
 * 4. Submit the booking
 *
 * Validation runs client-side via Zod before the server action is called.
 * Server-side validation errors are also surfaced to the user.
 * The tenant is resolved from the session inside the server action itself.
 */
export function BookingForm({
  wrapId,
  wrapName,
  availability,
  onSuccess,
}: BookingFormProps) {
  const [isPending, startTransition] = useTransition();

  // Form state
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [dropOffDate, setDropOffDate] = useState<string | null>(null);
  const [dropOffSlotId, setDropOffSlotId] = useState<string | null>(null);
  const [pickUpDate, setPickUpDate] = useState<string | null>(null);
  const [pickUpSlotId, setPickUpSlotId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  // Error state
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const dropOffSlots =
    availability.find((a) => a.date === dropOffDate)?.slots ?? [];
  const pickUpSlots =
    availability.find((a) => a.date === pickUpDate)?.slots ?? [];

  function handleDropOffDateChange(date: string) {
    setDropOffDate(date);
    setDropOffSlotId(null); // reset slot when date changes
    setFieldErrors((prev) => ({ ...prev, dropOffSlotId: undefined }));
  }

  function handlePickUpDateChange(date: string) {
    setPickUpDate(date);
    setPickUpSlotId(null);
    setFieldErrors((prev) => ({ ...prev, pickUpSlotId: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const input: CreateBookingInput = {
      wrapId,
      customerName,
      customerEmail,
      dropOffSlotId: dropOffSlotId ?? "",
      pickUpSlotId: pickUpSlotId ?? "",
      notes: notes || undefined,
    };

    // Client-side validation
    const result = createBookingSchema.safeParse(input);
    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof CreateBookingInput;
        if (field) errors[field] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    startTransition(async () => {
      try {
        const booking = await createBooking(result.data);
        onSuccess(booking);
      } catch (err) {
        setServerError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Booking form"
      className="space-y-8"
    >
      {/* Wrap summary */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-800">
        <span className="text-zinc-500 dark:text-zinc-400">
          Selected wrap:{" "}
        </span>
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
          {wrapName}
        </span>
      </div>

      {/* Contact details */}
      <fieldset className="space-y-4">
        <legend className="text-base font-semibold text-zinc-800 dark:text-zinc-100">
          Contact details
        </legend>

        <div>
          <label
            htmlFor="customerName"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Full name <span aria-hidden="true">*</span>
          </label>
          <input
            id="customerName"
            type="text"
            autoComplete="name"
            required
            value={customerName}
            onChange={(e) => {
              setCustomerName(e.target.value);
              setFieldErrors((prev) => ({ ...prev, customerName: undefined }));
            }}
            aria-invalid={!!fieldErrors.customerName}
            aria-describedby={
              fieldErrors.customerName ? "customerName-error" : undefined
            }
            className={[
              "block w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
              fieldErrors.customerName
                ? "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/20"
                : "border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100",
            ].join(" ")}
          />
          {fieldErrors.customerName && (
            <p
              id="customerName-error"
              role="alert"
              className="mt-1 text-xs text-red-600 dark:text-red-400"
            >
              {fieldErrors.customerName}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="customerEmail"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Email address <span aria-hidden="true">*</span>
          </label>
          <input
            id="customerEmail"
            type="email"
            autoComplete="email"
            required
            value={customerEmail}
            onChange={(e) => {
              setCustomerEmail(e.target.value);
              setFieldErrors((prev) => ({ ...prev, customerEmail: undefined }));
            }}
            aria-invalid={!!fieldErrors.customerEmail}
            aria-describedby={
              fieldErrors.customerEmail ? "customerEmail-error" : undefined
            }
            className={[
              "block w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
              fieldErrors.customerEmail
                ? "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/20"
                : "border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100",
            ].join(" ")}
          />
          {fieldErrors.customerEmail && (
            <p
              id="customerEmail-error"
              role="alert"
              className="mt-1 text-xs text-red-600 dark:text-red-400"
            >
              {fieldErrors.customerEmail}
            </p>
          )}
        </div>
      </fieldset>

      {/* Drop-off */}
      <fieldset className="space-y-4">
        <legend className="text-base font-semibold text-zinc-800 dark:text-zinc-100">
          Drop-off
        </legend>
        <CalendarView
          availability={availability}
          selectedDate={dropOffDate}
          onSelectDate={handleDropOffDateChange}
        />
        {dropOffDate && (
          <TimeSlotPicker
            slots={dropOffSlots}
            label="Select a drop-off time"
            selectedSlotId={dropOffSlotId}
            onSelectSlot={(id) => {
              setDropOffSlotId(id);
              setFieldErrors((prev) => ({ ...prev, dropOffSlotId: undefined }));
            }}
          />
        )}
        {fieldErrors.dropOffSlotId && (
          <p role="alert" className="text-xs text-red-600 dark:text-red-400">
            {fieldErrors.dropOffSlotId}
          </p>
        )}
      </fieldset>

      {/* Pick-up */}
      <fieldset className="space-y-4">
        <legend className="text-base font-semibold text-zinc-800 dark:text-zinc-100">
          Pick-up
        </legend>
        <CalendarView
          availability={availability}
          selectedDate={pickUpDate}
          onSelectDate={handlePickUpDateChange}
        />
        {pickUpDate && (
          <TimeSlotPicker
            slots={pickUpSlots}
            label="Select a pick-up time"
            selectedSlotId={pickUpSlotId}
            onSelectSlot={(id) => {
              setPickUpSlotId(id);
              setFieldErrors((prev) => ({ ...prev, pickUpSlotId: undefined }));
            }}
          />
        )}
        {fieldErrors.pickUpSlotId && (
          <p role="alert" className="text-xs text-red-600 dark:text-red-400">
            {fieldErrors.pickUpSlotId}
          </p>
        )}
      </fieldset>

      {/* Notes */}
      <div>
        <label
          htmlFor="notes"
          className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Notes{" "}
          <span className="text-zinc-400 dark:text-zinc-500">(optional)</span>
        </label>
        <textarea
          id="notes"
          rows={3}
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            setFieldErrors((prev) => ({ ...prev, notes: undefined }));
          }}
          aria-invalid={!!fieldErrors.notes}
          aria-describedby={fieldErrors.notes ? "notes-error" : undefined}
          className={[
            "block w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
            fieldErrors.notes
              ? "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/20"
              : "border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100",
          ].join(" ")}
          placeholder="Special requests or vehicle details…"
        />
        {fieldErrors.notes && (
          <p
            id="notes-error"
            role="alert"
            className="mt-1 text-xs text-red-600 dark:text-red-400"
          >
            {fieldErrors.notes}
          </p>
        )}
      </div>

      {/* Server-level error */}
      {serverError && (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
        >
          <strong>Error: </strong>
          {serverError}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        aria-busy={isPending}
        className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Booking…" : "Confirm booking"}
      </button>
    </form>
  );
}
