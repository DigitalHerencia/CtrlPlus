import { redirect } from "next/navigation";

import { RoleBadge } from "@/components/admin/role-badge";
import { SetRoleForm } from "@/components/admin/set-role-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTeamMembers } from "@/lib/admin/fetchers/get-users";
import { getSession } from "@/lib/auth/session";
import { getUserTenantRole } from "@/lib/tenancy/assert";

export default async function TeamPage() {
  const { tenantId, userId } = await getSession();
  if (!tenantId || !userId) redirect("/sign-in");

  const role = await getUserTenantRole(tenantId, userId);
  if (!role || !["admin", "owner"].includes(role)) redirect("/catalog");

  const { members, total } = await getTeamMembers(tenantId, userId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Team</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage tenant membership and maintain least-privilege roles.
        </p>
      </div>

      <Card className="border-border/70 bg-card/95">
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>
            {total} active member{total === 1 ? "" : "s"}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <p className="text-sm text-muted-foreground">No team members found.</p>
          ) : (
            <div className="divide-y divide-border rounded-lg border border-border/70">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {member.clerkUserId}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Member since {new Date(member.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {member.clerkUserId !== userId ? (
                      <SetRoleForm userId={member.clerkUserId} currentRole={member.role} />
                    ) : (
                      <RoleBadge role={member.role} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
