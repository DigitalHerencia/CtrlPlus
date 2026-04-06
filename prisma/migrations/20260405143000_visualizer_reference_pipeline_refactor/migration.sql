-- Add owner-scoped visualizer uploads for reusable source images.
CREATE TABLE IF NOT EXISTS "VisualizerUpload" (
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
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "VisualizerUpload_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "VisualizerUpload_cloudinaryAssetId_key"
  ON "VisualizerUpload"("cloudinaryAssetId");

CREATE INDEX IF NOT EXISTS "VisualizerUpload_ownerClerkUserId_deletedAt_createdAt_idx"
  ON "VisualizerUpload"("ownerClerkUserId", "deletedAt", "createdAt");

-- Expand previews to reference reusable uploads and persist generation/storage metadata.
ALTER TABLE "VisualizerPreview"
  ADD COLUMN IF NOT EXISTS "uploadId" TEXT,
  ADD COLUMN IF NOT EXISTS "referenceSignature" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "generationMode" TEXT NOT NULL DEFAULT 'reference_edit',
  ADD COLUMN IF NOT EXISTS "generationProvider" TEXT,
  ADD COLUMN IF NOT EXISTS "generationModel" TEXT,
  ADD COLUMN IF NOT EXISTS "generationPromptVersion" TEXT,
  ADD COLUMN IF NOT EXISTS "generationFallbackReason" TEXT,
  ADD COLUMN IF NOT EXISTS "resultLegacyUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "resultCloudinaryAssetId" TEXT,
  ADD COLUMN IF NOT EXISTS "resultCloudinaryPublicId" TEXT,
  ADD COLUMN IF NOT EXISTS "resultCloudinaryVersion" INTEGER,
  ADD COLUMN IF NOT EXISTS "resultCloudinaryResourceType" TEXT,
  ADD COLUMN IF NOT EXISTS "resultCloudinaryDeliveryType" TEXT,
  ADD COLUMN IF NOT EXISTS "resultCloudinaryAssetFolder" TEXT,
  ADD COLUMN IF NOT EXISTS "resultMimeType" TEXT,
  ADD COLUMN IF NOT EXISTS "resultFormat" TEXT,
  ADD COLUMN IF NOT EXISTS "resultBytes" INTEGER,
  ADD COLUMN IF NOT EXISTS "resultWidth" INTEGER,
  ADD COLUMN IF NOT EXISTS "resultHeight" INTEGER;

CREATE UNIQUE INDEX IF NOT EXISTS "VisualizerPreview_resultCloudinaryAssetId_key"
  ON "VisualizerPreview"("resultCloudinaryAssetId");

CREATE INDEX IF NOT EXISTS "VisualizerPreview_uploadId_deletedAt_createdAt_idx"
  ON "VisualizerPreview"("uploadId", "deletedAt", "createdAt");

-- Backfill historical previews into first-class uploads while preserving existing URLs.
INSERT INTO "VisualizerUpload" (
  "id",
  "ownerClerkUserId",
  "legacyUrl",
  "contentHash",
  "createdAt",
  "updatedAt",
  "deletedAt"
)
SELECT
  vp."id",
  vp."ownerClerkUserId",
  vp."customerPhotoUrl",
  '',
  vp."createdAt",
  vp."updatedAt",
  vp."deletedAt"
FROM "VisualizerPreview" vp
WHERE NOT EXISTS (
  SELECT 1
  FROM "VisualizerUpload" vu
  WHERE vu."id" = vp."id"
);

UPDATE "VisualizerPreview"
SET
  "uploadId" = COALESCE("uploadId", "id"),
  "referenceSignature" = CASE
    WHEN COALESCE("referenceSignature", '') <> '' THEN "referenceSignature"
    ELSE CONCAT('legacy:', COALESCE("sourceWrapImageId", "cacheKey"))
  END,
  "generationMode" = CASE
    WHEN COALESCE("generationMode", '') <> '' THEN "generationMode"
    ELSE 'legacy_texture_pipeline'
  END,
  "resultLegacyUrl" = COALESCE("resultLegacyUrl", "processedImageUrl")
WHERE "uploadId" IS NULL
   OR COALESCE("referenceSignature", '') = ''
   OR "resultLegacyUrl" IS NULL;

ALTER TABLE "VisualizerPreview"
  ALTER COLUMN "uploadId" SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'VisualizerPreview_uploadId_fkey'
  ) THEN
    ALTER TABLE "VisualizerPreview"
      ADD CONSTRAINT "VisualizerPreview_uploadId_fkey"
      FOREIGN KEY ("uploadId")
      REFERENCES "VisualizerUpload"("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE;
  END IF;
END $$;
