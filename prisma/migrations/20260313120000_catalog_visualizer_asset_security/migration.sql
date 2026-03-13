-- Add role-aware wrap image metadata
ALTER TABLE "WrapImage"
  ADD COLUMN IF NOT EXISTS "kind" TEXT NOT NULL DEFAULT 'gallery',
  ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "version" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS "contentHash" TEXT NOT NULL DEFAULT '';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'WrapImage_kind_check'
  ) THEN
    ALTER TABLE "WrapImage"
      ADD CONSTRAINT "WrapImage_kind_check"
      CHECK ("kind" IN ('hero', 'visualizer_texture', 'visualizer_mask_hint', 'gallery')) NOT VALID;
  END IF;
END $$;

ALTER TABLE "WrapImage" VALIDATE CONSTRAINT "WrapImage_kind_check";

CREATE INDEX IF NOT EXISTS "WrapImage_wrapId_kind_isActive_deletedAt_idx"
  ON "WrapImage"("wrapId", "kind", "isActive", "deletedAt");

-- Add ownership and source-asset traceability to visualizer previews
ALTER TABLE "VisualizerPreview"
  ADD COLUMN IF NOT EXISTS "ownerClerkUserId" TEXT,
  ADD COLUMN IF NOT EXISTS "sourceWrapImageId" TEXT,
  ADD COLUMN IF NOT EXISTS "sourceWrapImageVersion" INTEGER;

UPDATE "VisualizerPreview"
SET "ownerClerkUserId" = COALESCE("ownerClerkUserId", 'legacy')
WHERE "ownerClerkUserId" IS NULL;

ALTER TABLE "VisualizerPreview"
  ALTER COLUMN "ownerClerkUserId" SET NOT NULL;

CREATE INDEX IF NOT EXISTS "VisualizerPreview_ownerClerkUserId_deletedAt_expiresAt_idx"
  ON "VisualizerPreview"("ownerClerkUserId", "deletedAt", "expiresAt");

-- Allow reusing category slugs after soft-delete while preserving active uniqueness
DROP INDEX IF EXISTS "WrapCategory_slug_key";

CREATE UNIQUE INDEX IF NOT EXISTS "WrapCategory_slug_active_key"
  ON "WrapCategory"("slug")
  WHERE "deletedAt" IS NULL;
