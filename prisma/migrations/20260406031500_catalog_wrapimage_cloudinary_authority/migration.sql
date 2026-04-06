-- Persist Cloudinary authority fields for catalog wrap imagery.
ALTER TABLE "WrapImage"
  ADD COLUMN IF NOT EXISTS "cloudinaryAssetId" TEXT,
  ADD COLUMN IF NOT EXISTS "cloudinaryPublicId" TEXT,
  ADD COLUMN IF NOT EXISTS "cloudinaryVersion" INTEGER,
  ADD COLUMN IF NOT EXISTS "cloudinaryResourceType" TEXT,
  ADD COLUMN IF NOT EXISTS "cloudinaryDeliveryType" TEXT,
  ADD COLUMN IF NOT EXISTS "cloudinaryAssetFolder" TEXT,
  ADD COLUMN IF NOT EXISTS "mimeType" TEXT,
  ADD COLUMN IF NOT EXISTS "format" TEXT,
  ADD COLUMN IF NOT EXISTS "bytes" INTEGER,
  ADD COLUMN IF NOT EXISTS "width" INTEGER,
  ADD COLUMN IF NOT EXISTS "height" INTEGER,
  ADD COLUMN IF NOT EXISTS "originalFileName" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "WrapImage_cloudinaryAssetId_key"
  ON "WrapImage"("cloudinaryAssetId");
