-- Rebuild RBAC for single-store operation.
-- 1) Add persisted global role on users.
-- 2) Normalize tenant roles to owner|user.
-- 3) Enforce single active owner per tenant and single active platform admin globally.

ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "globalRole" TEXT NOT NULL DEFAULT 'user';

ALTER TABLE "TenantUserMembership"
ALTER COLUMN "role" SET DEFAULT 'user';

UPDATE "TenantUserMembership"
SET "role" = CASE
  WHEN lower("role") IN ('owner', 'admin', 'staff') THEN 'owner'
  ELSE 'user'
END;

WITH ranked_owners AS (
  SELECT
    "id",
    ROW_NUMBER() OVER (
      PARTITION BY "tenantId"
      ORDER BY "createdAt" ASC, "id" ASC
    ) AS owner_rank
  FROM "TenantUserMembership"
  WHERE "deletedAt" IS NULL
    AND "role" = 'owner'
)
UPDATE "TenantUserMembership" m
SET "role" = 'user'
FROM ranked_owners r
WHERE m."id" = r."id"
  AND r.owner_rank > 1;

CREATE UNIQUE INDEX IF NOT EXISTS "TenantUserMembership_single_owner_per_tenant_active_key"
ON "TenantUserMembership" ("tenantId")
WHERE "deletedAt" IS NULL
  AND "role" = 'owner';

CREATE UNIQUE INDEX IF NOT EXISTS "User_single_platform_admin_active_key"
ON "User" ("globalRole")
WHERE "deletedAt" IS NULL
  AND "globalRole" = 'admin';
