/**
 * Shared billing display utilities.
 *
 * Kept separate so both server and client components can import
 * these pure functions without pulling in "use client" boundaries.
 */

/**
 * Formats an invoice or booking ID for display.
 * Shows the last 8 characters, upper-cased, to keep the UI compact.
 *
 * @example formatId("inv_abc123xyz") → "ABC123XY"
 */
export function formatId(id: string): string {
  return id.slice(-8).toUpperCase();
}

/**
 * Formats a monetary amount as a USD currency string.
 *
 * NOTE: The underlying Prisma `Invoice.amount` is stored as Decimal(10,2).
 * The stub represents it as `number` for simplicity.  At the Stripe
 * boundary, always convert to integer cents (`Math.round(amount * 100)`)
 * to avoid floating-point precision issues.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/** Formats a Date (or date-like value) as a short locale string. */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}
