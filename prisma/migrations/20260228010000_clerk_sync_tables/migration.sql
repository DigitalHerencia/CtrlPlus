-- CreateTable
CREATE TABLE "ClerkUser" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "primaryEmail" TEXT,
  "firstName" TEXT,
  "lastName" TEXT,
  "imageUrl" TEXT,
  "isDeleted" BOOLEAN NOT NULL DEFAULT false,
  "lastSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "TenantUserMembership" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "clerkUserId" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TenantUserMembership_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "TenantUserMembership_clerkUserId_fkey" FOREIGN KEY ("clerkUserId") REFERENCES "ClerkUser" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ClerkWebhookEvent" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "clerkEventId" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "clerkUserId" TEXT,
  "tenantId" TEXT,
  "payloadChecksum" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'received',
  "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "processedAt" TIMESTAMP(3),
  CONSTRAINT "ClerkWebhookEvent_clerkUserId_fkey" FOREIGN KEY ("clerkUserId") REFERENCES "ClerkUser" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "ClerkWebhookEvent_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ClerkUser_primaryEmail_idx" ON "ClerkUser"("primaryEmail");

-- CreateIndex
CREATE INDEX "ClerkUser_isDeleted_updatedAt_idx" ON "ClerkUser"("isDeleted", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TenantUserMembership_tenantId_clerkUserId_key" ON "TenantUserMembership"("tenantId", "clerkUserId");

-- CreateIndex
CREATE INDEX "TenantUserMembership_tenantId_isActive_idx" ON "TenantUserMembership"("tenantId", "isActive");

-- CreateIndex
CREATE INDEX "TenantUserMembership_tenantId_role_isActive_idx" ON "TenantUserMembership"("tenantId", "role", "isActive");

-- CreateIndex
CREATE INDEX "TenantUserMembership_clerkUserId_isActive_idx" ON "TenantUserMembership"("clerkUserId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "ClerkWebhookEvent_clerkEventId_key" ON "ClerkWebhookEvent"("clerkEventId");

-- CreateIndex
CREATE INDEX "ClerkWebhookEvent_eventType_receivedAt_idx" ON "ClerkWebhookEvent"("eventType", "receivedAt");

-- CreateIndex
CREATE INDEX "ClerkWebhookEvent_tenantId_receivedAt_idx" ON "ClerkWebhookEvent"("tenantId", "receivedAt");

-- CreateIndex
CREATE INDEX "ClerkWebhookEvent_clerkUserId_receivedAt_idx" ON "ClerkWebhookEvent"("clerkUserId", "receivedAt");
