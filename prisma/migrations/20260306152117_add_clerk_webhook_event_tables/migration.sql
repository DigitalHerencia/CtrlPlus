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
    "tenantId" TEXT,
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
    "amount" DOUBLE PRECISION,
    "currency" TEXT,
    "lastEventType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ClerkPaymentAttempt_pkey" PRIMARY KEY ("id")
);

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
CREATE INDEX "ClerkSubscription_tenantId_idx" ON "ClerkSubscription"("tenantId");

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
CREATE INDEX "ClerkWebhookEvent_processedAt_idx" ON "ClerkWebhookEvent"("processedAt");

-- AddForeignKey
ALTER TABLE "ClerkSubscription" ADD CONSTRAINT "ClerkSubscription_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClerkSubscriptionItem" ADD CONSTRAINT "ClerkSubscriptionItem_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "ClerkSubscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
