-- AlterTable
ALTER TABLE "ClerkWebhookEvent" ADD COLUMN     "error" TEXT,
ADD COLUMN     "lastAttemptedAt" TIMESTAMP(3),
ADD COLUMN     "payload" JSONB,
ADD COLUMN     "retryCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "StripeWebhookEvent" ADD COLUMN     "error" TEXT,
ADD COLUMN     "lastAttemptedAt" TIMESTAMP(3),
ADD COLUMN     "payload" JSONB,
ADD COLUMN     "retryCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "WrapCategory_slug_idx" ON "WrapCategory"("slug");
