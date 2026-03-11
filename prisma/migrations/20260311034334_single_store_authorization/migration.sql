-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "AvailabilityRule" DROP CONSTRAINT "AvailabilityRule_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "ClerkSubscription" DROP CONSTRAINT "ClerkSubscription_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "TenantUserMembership" DROP CONSTRAINT "TenantUserMembership_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "TenantUserMembership" DROP CONSTRAINT "TenantUserMembership_userId_fkey";

-- DropForeignKey
ALTER TABLE "VisualizerPreview" DROP CONSTRAINT "VisualizerPreview_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Wrap" DROP CONSTRAINT "Wrap_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "WrapCategory" DROP CONSTRAINT "WrapCategory_tenantId_fkey";

-- DropIndex
DROP INDEX "AuditLog_tenantId_timestamp_idx";

-- DropIndex
DROP INDEX "AvailabilityRule_tenantId_dayOfWeek_deletedAt_startTime_end_idx";

-- DropIndex
DROP INDEX "Booking_tenantId_customerId_deletedAt_status_idx";

-- DropIndex
DROP INDEX "Booking_tenantId_deletedAt_startTime_endTime_idx";

-- DropIndex
DROP INDEX "Booking_tenantId_deletedAt_status_startTime_idx";

-- DropIndex
DROP INDEX "ClerkSubscription_tenantId_idx";

-- DropIndex
DROP INDEX "Invoice_tenantId_bookingId_deletedAt_idx";

-- DropIndex
DROP INDEX "Invoice_tenantId_deletedAt_status_createdAt_idx";

-- DropIndex
DROP INDEX "VisualizerPreview_tenantId_wrapId_deletedAt_expiresAt_creat_idx";

-- DropIndex
DROP INDEX "Wrap_tenantId_deletedAt_createdAt_idx";

-- DropIndex
DROP INDEX "WrapCategory_tenantId_deletedAt_createdAt_idx";

-- DropIndex
DROP INDEX "WrapCategory_tenantId_slug_key";

-- AlterTable
ALTER TABLE "AuditLog" DROP COLUMN "tenantId";

-- AlterTable
ALTER TABLE "AvailabilityRule" DROP COLUMN "tenantId";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "tenantId";

-- AlterTable
ALTER TABLE "ClerkSubscription" DROP COLUMN "tenantId";

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "tenantId";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "globalRole" SET DEFAULT 'customer';

-- AlterTable
ALTER TABLE "VisualizerPreview" DROP COLUMN "tenantId";

-- AlterTable
ALTER TABLE "Wrap" DROP COLUMN "tenantId",
ADD COLUMN     "isHidden" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "WrapCategory" DROP COLUMN "tenantId";

-- DropTable
DROP TABLE "Tenant";

-- DropTable
DROP TABLE "TenantUserMembership";

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

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteSettings_clerkUserId_key" ON "WebsiteSettings"("clerkUserId");

-- CreateIndex
CREATE INDEX "WebsiteSettings_deletedAt_idx" ON "WebsiteSettings"("deletedAt");

-- CreateIndex
CREATE INDEX "WebsiteSettings_clerkUserId_deletedAt_idx" ON "WebsiteSettings"("clerkUserId", "deletedAt");

-- CreateIndex
CREATE INDEX "AuditLog_timestamp_idx" ON "AuditLog"("timestamp");

-- CreateIndex
CREATE INDEX "AvailabilityRule_dayOfWeek_deletedAt_startTime_endTime_idx" ON "AvailabilityRule"("dayOfWeek", "deletedAt", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "Booking_deletedAt_status_startTime_idx" ON "Booking"("deletedAt", "status", "startTime");

-- CreateIndex
CREATE INDEX "Booking_customerId_deletedAt_status_idx" ON "Booking"("customerId", "deletedAt", "status");

-- CreateIndex
CREATE INDEX "Booking_deletedAt_startTime_endTime_idx" ON "Booking"("deletedAt", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "Invoice_deletedAt_status_createdAt_idx" ON "Invoice"("deletedAt", "status", "createdAt");

-- CreateIndex
CREATE INDEX "Invoice_bookingId_deletedAt_idx" ON "Invoice"("bookingId", "deletedAt");

-- CreateIndex
CREATE INDEX "VisualizerPreview_wrapId_deletedAt_expiresAt_createdAt_idx" ON "VisualizerPreview"("wrapId", "deletedAt", "expiresAt", "createdAt");

-- CreateIndex
CREATE INDEX "Wrap_deletedAt_createdAt_idx" ON "Wrap"("deletedAt", "createdAt");

-- CreateIndex
CREATE INDEX "Wrap_isHidden_deletedAt_createdAt_idx" ON "Wrap"("isHidden", "deletedAt", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "WrapCategory_slug_key" ON "WrapCategory"("slug");

-- CreateIndex
CREATE INDEX "WrapCategory_deletedAt_createdAt_idx" ON "WrapCategory"("deletedAt", "createdAt");

