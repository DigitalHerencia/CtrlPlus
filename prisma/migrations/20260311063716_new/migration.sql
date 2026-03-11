-- DropIndex
DROP INDEX "TenantUserMembership_single_owner_per_tenant_active_key";

-- DropIndex
DROP INDEX "User_single_platform_admin_active_key";

-- CreateIndex
CREATE INDEX "User_globalRole_deletedAt_idx" ON "User"("globalRole", "deletedAt");
