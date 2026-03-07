ALTER TABLE "ClerkWebhookEvent"
ADD COLUMN "status" TEXT NOT NULL DEFAULT 'processed';

CREATE INDEX "ClerkWebhookEvent_status_idx" ON "ClerkWebhookEvent"("status");
