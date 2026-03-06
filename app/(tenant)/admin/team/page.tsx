import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/session";
import { getUserTenantRole } from "@/lib/tenancy/assert";
import { getUsersForTenant } from "@/lib/admin/fetchers/get-users";
import { RoleBadge } from "@/components/admin/role-badge";
import { SetRoleForm } from "@/components/admin/set-role-form";

export default async function TeamPage() {
  const { user, tenantId } = await getSession();
  if (!user) redirect("/sign-in");

  // Only admins and owners can access the team page
  const role = await getUserTenantRole(tenantId, user.id);
  if (!role || role === "member") redirect("/catalog");

  const members = await getUsersForTenant(tenantId);
  const isOwner = role === "owner";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Manage your team members and their roles.
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-lg border">
        {members.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">No team members found.</div>
        ) : (
          <div className="divide-y">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate font-mono text-xs">
                      {member.userId}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Member since {member.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {isOwner && member.userId !== user.id ? (
                    <SetRoleForm userId={member.userId} currentRole={member.role} />
                  ) : (
                    <RoleBadge role={member.role} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
