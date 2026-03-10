import Link from "next/link";
import { redirect } from "next/navigation";

import { RoleBadge } from "@/components/admin/role-badge";
import { SetRoleForm } from "@/components/admin/set-role-form";
import { WorkspaceMetricCard, WorkspacePageIntro } from "@/components/layout/page-elements";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTeamMembers } from "@/lib/admin/fetchers/get-users";
import { getSession } from "@/lib/auth/session";

export default async function TeamPage() {
  const { tenantId, userId } = await getSession();
  if (!tenantId || !userId) redirect("/sign-in");

  // All roles have access; no role check

  const { members, total } = await getTeamMembers(tenantId);

  return (
    <div className="space-y-6">
      <WorkspacePageIntro
        label="Access"
        title="Team"
        description="Manage tenant membership and keep role assignments tight without leaving the primary workspace flow."
        actions={
          <Button asChild variant="outline">
            <Link href="/admin">Back to Admin</Link>
          </Button>
        }
      />

      <WorkspaceMetricCard
        label="Active Members"
        value={total}
        description={`Currently managing ${total} active member${total === 1 ? "" : "s"}.`}
      />

      <Card className="app-panel">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-neutral-100">Members</CardTitle>
          <CardDescription>
            {total} active member{total === 1 ? "" : "s"}.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {members.length === 0 ? (
            <p className="py-8 text-sm text-neutral-400">No team members found.</p>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/70">
              <Table>
                <TableHeader className="bg-neutral-900/80">
                  <TableRow className="border-neutral-800 hover:bg-neutral-900/80">
                    <TableHead className="px-4 text-[11px] tracking-[0.18em] uppercase">
                      Member
                    </TableHead>
                    <TableHead className="text-[11px] tracking-[0.18em] uppercase">
                      Joined
                    </TableHead>
                    <TableHead className="text-right text-[11px] tracking-[0.18em] uppercase">
                      Access
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow
                      key={member.id}
                      className="border-neutral-800 hover:bg-neutral-900/60"
                    >
                      <TableCell className="px-4 py-4">
                        <div className="min-w-0 space-y-1">
                          <p className="truncate text-sm font-semibold text-neutral-100">
                            {member.clerkUserId}
                          </p>
                          <p className="text-xs text-neutral-500">
                            Scoped to this tenant workspace.
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-sm text-neutral-400">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        {member.clerkUserId !== userId ? (
                          <SetRoleForm clerkUserId={member.clerkUserId} currentRole={member.role} />
                        ) : (
                          <RoleBadge role={member.role} />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
