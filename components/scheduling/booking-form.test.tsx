import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BookingForm } from "./booking-form";

const mockAvailabilityWindows = [
  {
    id: "window-1",
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "10:00",
    capacity: 2,
  },
];

const mockWraps = [
  {
    id: "wrap-1",
    name: "Standard Wrap",
    price: 10000,
  },
];

describe("BookingForm", () => {
  it("renders calendar and wrap selector", () => {
    render(<BookingForm availabilityWindows={mockAvailabilityWindows} wraps={mockWraps} />);
    expect(screen.getByText(/Select a Date/i)).toBeInTheDocument();
    expect(screen.getByText(/Select a Wrap/i)).toBeInTheDocument();
  });

  it("shows error if no time slot selected", () => {
    render(<BookingForm availabilityWindows={mockAvailabilityWindows} wraps={mockWraps} />);
    fireEvent.submit(screen.getByRole("button", { name: /Confirm Booking/i }));
    return expect(screen.findByText(/Select a time slot/i)).resolves.toBeInTheDocument();
  });

  it("shows error if no wrap selected", () => {
    render(<BookingForm availabilityWindows={mockAvailabilityWindows} wraps={[]} />);
    expect(screen.getByText(/No wrap services are available/i)).toBeInTheDocument();
  });
});
