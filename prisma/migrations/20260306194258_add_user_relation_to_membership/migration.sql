-- AddForeignKey
ALTER TABLE "TenantUserMembership" ADD CONSTRAINT "TenantUserMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
