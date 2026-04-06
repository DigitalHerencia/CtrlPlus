-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "globalRole" TEXT NOT NULL DEFAULT 'customer',
    "firstName" TEXT,
    "lastName" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClerkWebhookEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'processed',
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "error" TEXT,
    "payload" JSONB,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "lastAttemptedAt" TIMESTAMP(3),

    CONSTRAINT "ClerkWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClerkSession" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "lastEventType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "removedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ClerkSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClerkEmail" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT,
    "status" TEXT,
    "toEmail" TEXT,
    "lastEventType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ClerkEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClerkSms" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT,
    "status" TEXT,
    "toPhone" TEXT,
    "lastEventType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ClerkSms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClerkSubscription" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT,
    "status" TEXT,
    "lastEventType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ClerkSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClerkSubscriptionItem" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "status" TEXT,
    "lastEventType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ClerkSubscriptionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClerkPaymentAttempt" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT,
    "status" TEXT,
    "amount" INTEGER,
    "currency" TEXT,
    "lastEventType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ClerkPaymentAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wrap" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "installationMinutes" INTEGER,
    "aiPromptTemplate" TEXT,
    "aiNegativePrompt" TEXT,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Wrap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WrapCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "WrapCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WrapCategoryMapping" (
    "wrapId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "WrapCategoryMapping_pkey" PRIMARY KEY ("wrapId","categoryId")
);

-- CreateTable
CREATE TABLE "WrapImage" (
    "id" TEXT NOT NULL,
    "wrapId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'gallery',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,
    "contentHash" TEXT NOT NULL DEFAULT '',
    "cloudinaryAssetId" TEXT,
    "cloudinaryPublicId" TEXT,
    "cloudinaryVersion" INTEGER,
    "cloudinaryResourceType" TEXT,
    "cloudinaryDeliveryType" TEXT,
    "cloudinaryAssetFolder" TEXT,
    "mimeType" TEXT,
    "format" TEXT,
    "bytes" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "originalFileName" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "WrapImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailabilityRule" (
    "id" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "capacitySlots" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AvailabilityRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "wrapId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "totalPrice" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingReservation" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "reservedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingReservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisualizerUpload" (
    "id" TEXT NOT NULL,
    "ownerClerkUserId" TEXT NOT NULL,
    "legacyUrl" TEXT,
    "cloudinaryAssetId" TEXT,
    "cloudinaryPublicId" TEXT,
    "cloudinaryVersion" INTEGER,
    "cloudinaryResourceType" TEXT,
    "cloudinaryDeliveryType" TEXT,
    "cloudinaryAssetFolder" TEXT,
    "mimeType" TEXT,
    "format" TEXT,
    "bytes" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "contentHash" TEXT NOT NULL DEFAULT '',
    "originalFileName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "VisualizerUpload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisualizerPreview" (
    "id" TEXT NOT NULL,
    "wrapId" TEXT NOT NULL,
    "uploadId" TEXT NOT NULL,
    "ownerClerkUserId" TEXT NOT NULL DEFAULT 'legacy',
    "customerPhotoUrl" TEXT NOT NULL,
    "processedImageUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "cacheKey" TEXT NOT NULL,
    "referenceSignature" TEXT NOT NULL DEFAULT '',
    "generationMode" TEXT NOT NULL DEFAULT 'reference_edit',
    "generationProvider" TEXT,
    "generationModel" TEXT,
    "generationPromptVersion" TEXT,
    "generationFallbackReason" TEXT,
    "resultLegacyUrl" TEXT,
    "resultCloudinaryAssetId" TEXT,
    "resultCloudinaryPublicId" TEXT,
    "resultCloudinaryVersion" INTEGER,
    "resultCloudinaryResourceType" TEXT,
    "resultCloudinaryDeliveryType" TEXT,
    "resultCloudinaryAssetFolder" TEXT,
    "resultMimeType" TEXT,
    "resultFormat" TEXT,
    "resultBytes" INTEGER,
    "resultWidth" INTEGER,
    "resultHeight" INTEGER,
    "sourceWrapImageId" TEXT,
    "sourceWrapImageVersion" INTEGER,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "VisualizerPreview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "totalAmount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceLineItem" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,

    CONSTRAINT "InvoiceLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeWebhookEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'processed',
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "error" TEXT,
    "payload" JSONB,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "lastAttemptedAt" TIMESTAMP(3),

    CONSTRAINT "StripeWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteSettings" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "preferredContact" TEXT NOT NULL DEFAULT 'email',
    "appointmentReminders" BOOLEAN NOT NULL DEFAULT true,
    "marketingOptIn" BOOLEAN NOT NULL DEFAULT false,
    "timezone" TEXT NOT NULL DEFAULT 'America/Denver',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "WebsiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "details" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");

-- CreateIndex
CREATE INDEX "User_globalRole_deletedAt_idx" ON "User"("globalRole", "deletedAt");

-- CreateIndex
CREATE INDEX "ClerkWebhookEvent_type_idx" ON "ClerkWebhookEvent"("type");

-- CreateIndex
CREATE INDEX "ClerkWebhookEvent_status_processedAt_idx" ON "ClerkWebhookEvent"("status", "processedAt");

-- CreateIndex
CREATE INDEX "ClerkSession_clerkUserId_idx" ON "ClerkSession"("clerkUserId");

-- CreateIndex
CREATE INDEX "ClerkSession_status_idx" ON "ClerkSession"("status");

-- CreateIndex
CREATE INDEX "ClerkSession_deletedAt_idx" ON "ClerkSession"("deletedAt");

-- CreateIndex
CREATE INDEX "ClerkEmail_clerkUserId_idx" ON "ClerkEmail"("clerkUserId");

-- CreateIndex
CREATE INDEX "ClerkEmail_status_idx" ON "ClerkEmail"("status");

-- CreateIndex
CREATE INDEX "ClerkEmail_deletedAt_idx" ON "ClerkEmail"("deletedAt");

-- CreateIndex
CREATE INDEX "ClerkSms_clerkUserId_idx" ON "ClerkSms"("clerkUserId");

-- CreateIndex
CREATE INDEX "ClerkSms_status_idx" ON "ClerkSms"("status");

-- CreateIndex
CREATE INDEX "ClerkSms_deletedAt_idx" ON "ClerkSms"("deletedAt");

-- CreateIndex
CREATE INDEX "ClerkSubscription_clerkUserId_idx" ON "ClerkSubscription"("clerkUserId");

-- CreateIndex
CREATE INDEX "ClerkSubscription_status_idx" ON "ClerkSubscription"("status");

-- CreateIndex
CREATE INDEX "ClerkSubscription_deletedAt_idx" ON "ClerkSubscription"("deletedAt");

-- CreateIndex
CREATE INDEX "ClerkSubscriptionItem_subscriptionId_idx" ON "ClerkSubscriptionItem"("subscriptionId");

-- CreateIndex
CREATE INDEX "ClerkSubscriptionItem_status_idx" ON "ClerkSubscriptionItem"("status");

-- CreateIndex
CREATE INDEX "ClerkSubscriptionItem_deletedAt_idx" ON "ClerkSubscriptionItem"("deletedAt");

-- CreateIndex
CREATE INDEX "ClerkPaymentAttempt_clerkUserId_idx" ON "ClerkPaymentAttempt"("clerkUserId");

-- CreateIndex
CREATE INDEX "ClerkPaymentAttempt_status_idx" ON "ClerkPaymentAttempt"("status");

-- CreateIndex
CREATE INDEX "ClerkPaymentAttempt_deletedAt_idx" ON "ClerkPaymentAttempt"("deletedAt");

-- CreateIndex
CREATE INDEX "Wrap_deletedAt_createdAt_idx" ON "Wrap"("deletedAt", "createdAt");

-- CreateIndex
CREATE INDEX "Wrap_isHidden_deletedAt_createdAt_idx" ON "Wrap"("isHidden", "deletedAt", "createdAt");

-- CreateIndex
CREATE INDEX "WrapCategory_deletedAt_createdAt_idx" ON "WrapCategory"("deletedAt", "createdAt");

-- CreateIndex
CREATE INDEX "WrapCategory_slug_idx" ON "WrapCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "WrapImage_cloudinaryAssetId_key" ON "WrapImage"("cloudinaryAssetId");

-- CreateIndex
CREATE INDEX "WrapImage_wrapId_deletedAt_displayOrder_idx" ON "WrapImage"("wrapId", "deletedAt", "displayOrder");

-- CreateIndex
CREATE INDEX "WrapImage_wrapId_kind_isActive_deletedAt_idx" ON "WrapImage"("wrapId", "kind", "isActive", "deletedAt");

-- CreateIndex
CREATE INDEX "AvailabilityRule_dayOfWeek_deletedAt_startTime_endTime_idx" ON "AvailabilityRule"("dayOfWeek", "deletedAt", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "Booking_deletedAt_status_startTime_idx" ON "Booking"("deletedAt", "status", "startTime");

-- CreateIndex
CREATE INDEX "Booking_customerId_deletedAt_status_idx" ON "Booking"("customerId", "deletedAt", "status");

-- CreateIndex
CREATE INDEX "Booking_deletedAt_startTime_endTime_idx" ON "Booking"("deletedAt", "startTime", "endTime");

-- CreateIndex
CREATE UNIQUE INDEX "BookingReservation_bookingId_key" ON "BookingReservation"("bookingId");

-- CreateIndex
CREATE INDEX "BookingReservation_expiresAt_idx" ON "BookingReservation"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "VisualizerUpload_cloudinaryAssetId_key" ON "VisualizerUpload"("cloudinaryAssetId");

-- CreateIndex
CREATE INDEX "VisualizerUpload_ownerClerkUserId_deletedAt_createdAt_idx" ON "VisualizerUpload"("ownerClerkUserId", "deletedAt", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "VisualizerPreview_cacheKey_key" ON "VisualizerPreview"("cacheKey");

-- CreateIndex
CREATE UNIQUE INDEX "VisualizerPreview_resultCloudinaryAssetId_key" ON "VisualizerPreview"("resultCloudinaryAssetId");

-- CreateIndex
CREATE INDEX "VisualizerPreview_wrapId_deletedAt_expiresAt_createdAt_idx" ON "VisualizerPreview"("wrapId", "deletedAt", "expiresAt", "createdAt");

-- CreateIndex
CREATE INDEX "VisualizerPreview_status_expiresAt_idx" ON "VisualizerPreview"("status", "expiresAt");

-- CreateIndex
CREATE INDEX "VisualizerPreview_ownerClerkUserId_deletedAt_expiresAt_idx" ON "VisualizerPreview"("ownerClerkUserId", "deletedAt", "expiresAt");

-- CreateIndex
CREATE INDEX "VisualizerPreview_uploadId_deletedAt_createdAt_idx" ON "VisualizerPreview"("uploadId", "deletedAt", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_bookingId_key" ON "Invoice"("bookingId");

-- CreateIndex
CREATE INDEX "Invoice_deletedAt_status_createdAt_idx" ON "Invoice"("deletedAt", "status", "createdAt");

-- CreateIndex
CREATE INDEX "Invoice_bookingId_deletedAt_idx" ON "Invoice"("bookingId", "deletedAt");

-- CreateIndex
CREATE INDEX "InvoiceLineItem_invoiceId_idx" ON "InvoiceLineItem"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_stripePaymentIntentId_key" ON "Payment"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "Payment_invoiceId_deletedAt_createdAt_idx" ON "Payment"("invoiceId", "deletedAt", "createdAt");

-- CreateIndex
CREATE INDEX "StripeWebhookEvent_type_idx" ON "StripeWebhookEvent"("type");

-- CreateIndex
CREATE INDEX "StripeWebhookEvent_status_processedAt_idx" ON "StripeWebhookEvent"("status", "processedAt");

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteSettings_clerkUserId_key" ON "WebsiteSettings"("clerkUserId");

-- CreateIndex
CREATE INDEX "WebsiteSettings_deletedAt_idx" ON "WebsiteSettings"("deletedAt");

-- CreateIndex
CREATE INDEX "WebsiteSettings_clerkUserId_deletedAt_idx" ON "WebsiteSettings"("clerkUserId", "deletedAt");

-- CreateIndex
CREATE INDEX "AuditLog_timestamp_idx" ON "AuditLog"("timestamp");

-- CreateIndex
CREATE INDEX "AuditLog_userId_timestamp_idx" ON "AuditLog"("userId", "timestamp");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_deletedAt_idx" ON "AuditLog"("deletedAt");

-- AddForeignKey
ALTER TABLE "ClerkSubscriptionItem" ADD CONSTRAINT "ClerkSubscriptionItem_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "ClerkSubscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WrapCategoryMapping" ADD CONSTRAINT "WrapCategoryMapping_wrapId_fkey" FOREIGN KEY ("wrapId") REFERENCES "Wrap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WrapCategoryMapping" ADD CONSTRAINT "WrapCategoryMapping_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "WrapCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WrapImage" ADD CONSTRAINT "WrapImage_wrapId_fkey" FOREIGN KEY ("wrapId") REFERENCES "Wrap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_wrapId_fkey" FOREIGN KEY ("wrapId") REFERENCES "Wrap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingReservation" ADD CONSTRAINT "BookingReservation_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisualizerPreview" ADD CONSTRAINT "VisualizerPreview_wrapId_fkey" FOREIGN KEY ("wrapId") REFERENCES "Wrap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisualizerPreview" ADD CONSTRAINT "VisualizerPreview_uploadId_fkey" FOREIGN KEY ("uploadId") REFERENCES "VisualizerUpload"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceLineItem" ADD CONSTRAINT "InvoiceLineItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
