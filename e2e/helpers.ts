/**
 * E2E helpers and shared selectors for CTRL+ tests.
 *
 * These utilities are intentionally selector-agnostic — they rely on
 * ARIA roles, accessible labels, and data-testid attributes so tests
 * remain resilient to styling changes.
 */

/** Route paths used across the tenant-scoped application. */
export const ROUTES = {
  home: "/",
  catalog: "/catalog",
  catalogWrap: (wrapId: string) => `/catalog/${wrapId}`,
  visualizer: "/visualizer",
  scheduling: "/scheduling",
  booking: "/scheduling/book",
  billingCheckout: "/billing/checkout",
  billingSuccess: "/billing/success",
  billingCancel: "/billing/cancel",
  adminDashboard: "/admin",
  adminCatalog: "/admin/catalog",
  signIn: "/sign-in",
  signUp: "/sign-up",
} as const;

/** Accessible selectors / data-testid values. */
export const TEST_IDS = {
  // Catalog
  catalogGrid: "catalog-grid",
  wrapCard: "wrap-card",
  wrapCardTitle: "wrap-card-title",
  wrapCardPrice: "wrap-card-price",
  wrapCardCTA: "wrap-card-cta",
  wrapDetailTitle: "wrap-detail-title",
  wrapDetailPrice: "wrap-detail-price",
  wrapDetailDescription: "wrap-detail-description",
  previewBtn: "preview-btn",
  bookBtn: "book-btn",

  // Catalog filters
  categoryFilter: "category-filter",
  priceFilter: "price-filter",
  searchInput: "search-input",

  // Visualizer
  visualizerContainer: "visualizer-container",
  uploadInput: "upload-input",
  uploadBtn: "upload-btn",
  previewCanvas: "preview-canvas",
  previewImage: "preview-image",
  proceedToBookingBtn: "proceed-to-booking-btn",

  // Scheduling / Booking
  schedulingCalendar: "scheduling-calendar",
  timeSlot: "time-slot",
  bookingForm: "booking-form",
  bookingNameInput: "booking-name-input",
  bookingEmailInput: "booking-email-input",
  bookingPhoneInput: "booking-phone-input",
  bookingNoteInput: "booking-note-input",
  bookingSubmitBtn: "booking-submit-btn",
  bookingConfirmation: "booking-confirmation",
  bookingConfirmationId: "booking-confirmation-id",

  // Payment / Billing
  checkoutContainer: "checkout-container",
  checkoutSummary: "checkout-summary",
  payNowBtn: "pay-now-btn",
  paymentSuccess: "payment-success",
  paymentCancel: "payment-cancel",

  // Nav / Layout
  navCatalog: "nav-catalog",
  navVisualizer: "nav-visualizer",
  navScheduling: "nav-scheduling",
  navBilling: "nav-billing",
  navAdmin: "nav-admin",
} as const;
