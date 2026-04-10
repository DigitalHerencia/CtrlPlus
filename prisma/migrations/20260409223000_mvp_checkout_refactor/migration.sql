-- AlterTable
ALTER TABLE "Booking"
ADD COLUMN "billingAddressLine1" TEXT,
ADD COLUMN "billingAddressLine2" TEXT,
ADD COLUMN "billingCity" TEXT,
ADD COLUMN "billingCountry" TEXT,
ADD COLUMN "billingPostalCode" TEXT,
ADD COLUMN "billingState" TEXT,
ADD COLUMN "customerEmail" TEXT,
ADD COLUMN "customerName" TEXT,
ADD COLUMN "customerPhone" TEXT,
ADD COLUMN "notes" TEXT,
ADD COLUMN "preferredContact" TEXT,
ADD COLUMN "previewImageUrl" TEXT,
ADD COLUMN "previewPromptUsed" TEXT,
ADD COLUMN "vehicleMake" TEXT,
ADD COLUMN "vehicleModel" TEXT,
ADD COLUMN "vehicleTrim" TEXT,
ADD COLUMN "vehicleYear" TEXT,
ADD COLUMN "wrapNameSnapshot" TEXT,
ADD COLUMN "wrapPriceSnapshot" INTEGER,
ALTER COLUMN "status" SET DEFAULT 'requested';

-- AlterTable
ALTER TABLE "Invoice"
ADD COLUMN "dueDate" TIMESTAMP(3),
ADD COLUMN "issuedAt" TIMESTAMP(3),
ADD COLUMN "stripeCheckoutSessionId" TEXT,
ADD COLUMN "stripeCustomerId" TEXT,
ADD COLUMN "subtotalAmount" INTEGER,
ADD COLUMN "taxAmount" INTEGER;

-- AlterTable
ALTER TABLE "WebsiteSettings"
ADD COLUMN "billingAddressLine1" TEXT,
ADD COLUMN "billingAddressLine2" TEXT,
ADD COLUMN "billingCity" TEXT,
ADD COLUMN "billingCountry" TEXT,
ADD COLUMN "billingPostalCode" TEXT,
ADD COLUMN "billingState" TEXT,
ADD COLUMN "email" TEXT,
ADD COLUMN "fullName" TEXT,
ADD COLUMN "phone" TEXT,
ADD COLUMN "stripeCustomerId" TEXT,
ADD COLUMN "stripeDefaultPaymentMethodBrand" TEXT,
ADD COLUMN "stripeDefaultPaymentMethodId" TEXT,
ADD COLUMN "stripeDefaultPaymentMethodLast4" TEXT,
ADD COLUMN "vehicleMake" TEXT,
ADD COLUMN "vehicleModel" TEXT,
ADD COLUMN "vehicleTrim" TEXT,
ADD COLUMN "vehicleYear" TEXT;

-- CreateTable
CREATE TABLE "BookingDraft" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "wrapId" TEXT NOT NULL,
    "wrapNameSnapshot" TEXT NOT NULL,
    "wrapPriceSnapshot" INTEGER NOT NULL,
    "vehicleMake" TEXT,
    "vehicleModel" TEXT,
    "vehicleYear" TEXT,
    "vehicleTrim" TEXT,
    "previewImageUrl" TEXT,
    "previewPromptUsed" TEXT,
    "previewStatus" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookingDraft_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookingDraft_customerId_key" ON "BookingDraft"("customerId");

-- CreateIndex
CREATE INDEX "BookingDraft_wrapId_updatedAt_idx" ON "BookingDraft"("wrapId", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_stripeCheckoutSessionId_key" ON "Invoice"("stripeCheckoutSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteSettings_stripeCustomerId_key" ON "WebsiteSettings"("stripeCustomerId");

-- AddForeignKey
ALTER TABLE "BookingDraft" ADD CONSTRAINT "BookingDraft_wrapId_fkey"
FOREIGN KEY ("wrapId") REFERENCES "Wrap"("id") ON DELETE CASCADE ON UPDATE CASCADE;
