import { getSession } from "@/lib/auth/session";
import { getUsersForTenant } from "@/lib/admin/fetchers/get-users";
import { UserManagementTable } from "@/components/admin/user-management-table";

export default async function TeamPage() {
  const session = await getSession();

  const members = await getUsersForTenant(session.tenantId!);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Team Management</h1>
        <p className="mt-1 text-neutral-500 dark:text-neutral-400">
          View and manage team member roles.{" "}
          {session.role === "OWNER"
            ? "As an owner, you can change any member's role."
            : "Contact an owner to change roles."}
        </p>
      </div>

      <UserManagementTable members={members} currentUserRole={session.role!} />
    </div>
  );
}
