-- Normalize minor-unit money columns away from floating point.
ALTER TABLE "Wrap"
ALTER COLUMN "price" TYPE INTEGER USING ROUND("price")::integer;

ALTER TABLE "Booking"
ALTER COLUMN "totalPrice" TYPE INTEGER USING ROUND("totalPrice")::integer;

ALTER TABLE "Invoice"
ALTER COLUMN "totalAmount" TYPE INTEGER USING ROUND("totalAmount")::integer;

ALTER TABLE "InvoiceLineItem"
ALTER COLUMN "unitPrice" TYPE INTEGER USING ROUND("unitPrice")::integer;

ALTER TABLE "InvoiceLineItem"
ALTER COLUMN "totalPrice" TYPE INTEGER USING ROUND("totalPrice")::integer;

ALTER TABLE "Payment"
ALTER COLUMN "amount" TYPE INTEGER USING ROUND("amount")::integer;

ALTER TABLE "ClerkPaymentAttempt"
ALTER COLUMN "amount" TYPE INTEGER USING CASE
  WHEN "amount" IS NULL THEN NULL
  ELSE ROUND("amount")::integer
END;

-- Remove redundant or low-value indexes before replacing them with query-shape indexes.
DROP INDEX IF EXISTS "Tenant_slug_idx";

DROP INDEX IF EXISTS "TenantUserMembership_tenantId_idx";
DROP INDEX IF EXISTS "TenantUserMembership_userId_idx";
DROP INDEX IF EXISTS "TenantUserMembership_deletedAt_idx";

DROP INDEX IF EXISTS "Wrap_tenantId_idx";
DROP INDEX IF EXISTS "Wrap_deletedAt_idx";
DROP INDEX IF EXISTS "Wrap_tenantId_id_key";

DROP INDEX IF EXISTS "WrapCategory_tenantId_idx";
DROP INDEX IF EXISTS "WrapCategory_deletedAt_idx";

DROP INDEX IF EXISTS "WrapImage_wrapId_idx";
DROP INDEX IF EXISTS "WrapImage_deletedAt_idx";

DROP INDEX IF EXISTS "AvailabilityRule_tenantId_idx";
DROP INDEX IF EXISTS "AvailabilityRule_dayOfWeek_idx";
DROP INDEX IF EXISTS "AvailabilityRule_deletedAt_idx";

DROP INDEX IF EXISTS "Booking_tenantId_idx";
DROP INDEX IF EXISTS "Booking_customerId_idx";
DROP INDEX IF EXISTS "Booking_status_idx";
DROP INDEX IF EXISTS "Booking_deletedAt_idx";
DROP INDEX IF EXISTS "Booking_tenantId_id_key";

DROP INDEX IF EXISTS "VisualizerPreview_tenantId_idx";
DROP INDEX IF EXISTS "VisualizerPreview_status_idx";
DROP INDEX IF EXISTS "VisualizerPreview_expiresAt_idx";
DROP INDEX IF EXISTS "VisualizerPreview_deletedAt_idx";

DROP INDEX IF EXISTS "Invoice_tenantId_idx";
DROP INDEX IF EXISTS "Invoice_status_idx";
DROP INDEX IF EXISTS "Invoice_deletedAt_idx";

DROP INDEX IF EXISTS "Payment_invoiceId_idx";
DROP INDEX IF EXISTS "Payment_stripePaymentIntentId_idx";
DROP INDEX IF EXISTS "Payment_deletedAt_idx";

DROP INDEX IF EXISTS "AuditLog_tenantId_idx";
DROP INDEX IF EXISTS "AuditLog_userId_idx";
DROP INDEX IF EXISTS "AuditLog_timestamp_idx";

DROP INDEX IF EXISTS "ClerkWebhookEvent_status_idx";
DROP INDEX IF EXISTS "ClerkWebhookEvent_processedAt_idx";

DROP INDEX IF EXISTS "StripeWebhookEvent_status_idx";
DROP INDEX IF EXISTS "StripeWebhookEvent_processedAt_idx";

-- Enforce core data integrity in the database instead of only at the app boundary.
ALTER TABLE "AvailabilityRule"
DROP CONSTRAINT IF EXISTS "AvailabilityRule_dayOfWeek_check";
ALTER TABLE "AvailabilityRule"
ADD CONSTRAINT "AvailabilityRule_dayOfWeek_check"
CHECK ("dayOfWeek" BETWEEN 0 AND 6);

ALTER TABLE "AvailabilityRule"
DROP CONSTRAINT IF EXISTS "AvailabilityRule_capacitySlots_check";
ALTER TABLE "AvailabilityRule"
ADD CONSTRAINT "AvailabilityRule_capacitySlots_check"
CHECK ("capacitySlots" > 0);

ALTER TABLE "AvailabilityRule"
DROP CONSTRAINT IF EXISTS "AvailabilityRule_time_window_check";
ALTER TABLE "AvailabilityRule"
ADD CONSTRAINT "AvailabilityRule_time_window_check"
CHECK ("startTime"::time < "endTime"::time);

ALTER TABLE "Booking"
DROP CONSTRAINT IF EXISTS "Booking_time_window_check";
ALTER TABLE "Booking"
ADD CONSTRAINT "Booking_time_window_check"
CHECK ("startTime" < "endTime");

ALTER TABLE "Booking"
DROP CONSTRAINT IF EXISTS "Booking_status_check";
ALTER TABLE "Booking"
ADD CONSTRAINT "Booking_status_check"
CHECK ("status" IN ('pending', 'confirmed', 'completed', 'cancelled'));

ALTER TABLE "Invoice"
DROP CONSTRAINT IF EXISTS "Invoice_status_check";
ALTER TABLE "Invoice"
ADD CONSTRAINT "Invoice_status_check"
CHECK ("status" IN ('draft', 'sent', 'paid', 'failed', 'refunded'));

ALTER TABLE "Payment"
DROP CONSTRAINT IF EXISTS "Payment_status_check";
ALTER TABLE "Payment"
ADD CONSTRAINT "Payment_status_check"
CHECK ("status" IN ('pending', 'succeeded', 'failed'));

ALTER TABLE "VisualizerPreview"
DROP CONSTRAINT IF EXISTS "VisualizerPreview_status_check";
ALTER TABLE "VisualizerPreview"
ADD CONSTRAINT "VisualizerPreview_status_check"
CHECK ("status" IN ('pending', 'processing', 'complete', 'failed'));

ALTER TABLE "ClerkWebhookEvent"
DROP CONSTRAINT IF EXISTS "ClerkWebhookEvent_status_check";
ALTER TABLE "ClerkWebhookEvent"
ADD CONSTRAINT "ClerkWebhookEvent_status_check"
CHECK ("status" IN ('processing', 'processed', 'failed'));

ALTER TABLE "StripeWebhookEvent"
DROP CONSTRAINT IF EXISTS "StripeWebhookEvent_status_check";
ALTER TABLE "StripeWebhookEvent"
ADD CONSTRAINT "StripeWebhookEvent_status_check"
CHECK ("status" IN ('processing', 'processed', 'failed'));

ALTER TABLE "Wrap"
DROP CONSTRAINT IF EXISTS "Wrap_price_non_negative_check";
ALTER TABLE "Wrap"
ADD CONSTRAINT "Wrap_price_non_negative_check"
CHECK ("price" >= 0);

ALTER TABLE "Booking"
DROP CONSTRAINT IF EXISTS "Booking_totalPrice_non_negative_check";
ALTER TABLE "Booking"
ADD CONSTRAINT "Booking_totalPrice_non_negative_check"
CHECK ("totalPrice" >= 0);

ALTER TABLE "Invoice"
DROP CONSTRAINT IF EXISTS "Invoice_totalAmount_non_negative_check";
ALTER TABLE "Invoice"
ADD CONSTRAINT "Invoice_totalAmount_non_negative_check"
CHECK ("totalAmount" >= 0);

ALTER TABLE "InvoiceLineItem"
DROP CONSTRAINT IF EXISTS "InvoiceLineItem_quantity_positive_check";
ALTER TABLE "InvoiceLineItem"
ADD CONSTRAINT "InvoiceLineItem_quantity_positive_check"
CHECK ("quantity" > 0);

ALTER TABLE "InvoiceLineItem"
DROP CONSTRAINT IF EXISTS "InvoiceLineItem_unitPrice_non_negative_check";
ALTER TABLE "InvoiceLineItem"
ADD CONSTRAINT "InvoiceLineItem_unitPrice_non_negative_check"
CHECK ("unitPrice" >= 0);

ALTER TABLE "InvoiceLineItem"
DROP CONSTRAINT IF EXISTS "InvoiceLineItem_totalPrice_non_negative_check";
ALTER TABLE "InvoiceLineItem"
ADD CONSTRAINT "InvoiceLineItem_totalPrice_non_negative_check"
CHECK ("totalPrice" >= 0);

ALTER TABLE "Payment"
DROP CONSTRAINT IF EXISTS "Payment_amount_non_negative_check";
ALTER TABLE "Payment"
ADD CONSTRAINT "Payment_amount_non_negative_check"
CHECK ("amount" >= 0);

ALTER TABLE "ClerkPaymentAttempt"
DROP CONSTRAINT IF EXISTS "ClerkPaymentAttempt_amount_non_negative_check";
ALTER TABLE "ClerkPaymentAttempt"
ADD CONSTRAINT "ClerkPaymentAttempt_amount_non_negative_check"
CHECK ("amount" IS NULL OR "amount" >= 0);

-- Add composite indexes aligned with tenant-scoped hot paths.
CREATE INDEX "TenantUserMembership_tenantId_deletedAt_role_idx"
ON "TenantUserMembership"("tenantId", "deletedAt", "role");

CREATE INDEX "TenantUserMembership_userId_deletedAt_createdAt_idx"
ON "TenantUserMembership"("userId", "deletedAt", "createdAt");

CREATE INDEX "Wrap_tenantId_deletedAt_createdAt_idx"
ON "Wrap"("tenantId", "deletedAt", "createdAt");

CREATE INDEX "WrapCategory_tenantId_deletedAt_createdAt_idx"
ON "WrapCategory"("tenantId", "deletedAt", "createdAt");

CREATE INDEX "WrapImage_wrapId_deletedAt_displayOrder_idx"
ON "WrapImage"("wrapId", "deletedAt", "displayOrder");

CREATE INDEX "AvailabilityRule_tenantId_dayOfWeek_deletedAt_window_idx"
ON "AvailabilityRule"("tenantId", "dayOfWeek", "deletedAt", "startTime", "endTime");

CREATE INDEX "Booking_tenantId_deletedAt_status_startTime_idx"
ON "Booking"("tenantId", "deletedAt", "status", "startTime");

CREATE INDEX "Booking_tenantId_customerId_deletedAt_status_idx"
ON "Booking"("tenantId", "customerId", "deletedAt", "status");

CREATE INDEX "Booking_tenantId_deletedAt_time_window_idx"
ON "Booking"("tenantId", "deletedAt", "startTime", "endTime");

CREATE INDEX "VisualizerPreview_tenant_wrap_deleted_expiry_created_idx"
ON "VisualizerPreview"("tenantId", "wrapId", "deletedAt", "expiresAt", "createdAt");

CREATE INDEX "VisualizerPreview_status_expiresAt_idx"
ON "VisualizerPreview"("status", "expiresAt");

CREATE INDEX "Invoice_tenantId_deletedAt_status_createdAt_idx"
ON "Invoice"("tenantId", "deletedAt", "status", "createdAt");

CREATE INDEX "Invoice_tenantId_bookingId_deletedAt_idx"
ON "Invoice"("tenantId", "bookingId", "deletedAt");

CREATE INDEX "Payment_invoiceId_deletedAt_createdAt_idx"
ON "Payment"("invoiceId", "deletedAt", "createdAt");

CREATE INDEX "AuditLog_tenantId_timestamp_idx"
ON "AuditLog"("tenantId", "timestamp");

CREATE INDEX "AuditLog_userId_timestamp_idx"
ON "AuditLog"("userId", "timestamp");

CREATE INDEX "ClerkWebhookEvent_status_processedAt_idx"
ON "ClerkWebhookEvent"("status", "processedAt");

CREATE INDEX "StripeWebhookEvent_status_processedAt_idx"
ON "StripeWebhookEvent"("status", "processedAt");
