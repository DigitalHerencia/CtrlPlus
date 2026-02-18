-- AlterTable
ALTER TABLE "WrapDesign" ADD COLUMN "priceCents" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "WrapDesign" ADD COLUMN "isPublished" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "WrapDesign_tenantId_name_key" ON "WrapDesign"("tenantId", "name");
