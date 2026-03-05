"use client";

import { useState, useTransition } from "react";
import { setUserRole } from "@/lib/admin/actions/set-user-role";
import type { TeamMember } from "@/lib/admin/types";
import type { TenantRole } from "@/lib/auth/rbac";
import { RoleBadge, ROLE_LABELS } from "./role-badge";

interface UserManagementTableProps {
  members: TeamMember[];
  /** The role of the currently logged-in user. Only OWNERs can change roles. */
  currentUserRole: TenantRole;
}

const ROLE_OPTIONS: TenantRole[] = ["OWNER", "ADMIN", "MEMBER"];

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function UserManagementTable({
  members,
  currentUserRole,
}: UserManagementTableProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const canChangeRoles = currentUserRole === "OWNER";

  function handleRoleChange(membershipId: string, role: TenantRole) {
    setError(null);
    startTransition(async () => {
      try {
        await setUserRole({ membershipId, role });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update role");
      }
    });
  }

  return (
    <div className="rounded-lg border bg-white dark:bg-neutral-900">
      {error && (
        <div className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
              {canChangeRoles && <th className="px-4 py-3">Change Role</th>}
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-neutral-800">
            {members.length === 0 && (
              <tr>
                <td
                  colSpan={canChangeRoles ? 5 : 4}
                  className="px-4 py-8 text-center text-neutral-400"
                >
                  No team members found.
                </td>
              </tr>
            )}
            {members.map((member) => (
              <tr
                key={member.id}
                className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
              >
                <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">
                  {member.name}
                </td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                  {member.email}
                </td>
                <td className="px-4 py-3">
                  <RoleBadge role={member.role} />
                </td>
                <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                  {formatDate(member.joinedAt)}
                </td>
                {canChangeRoles && (
                  <td className="px-4 py-3">
                    <select
                      defaultValue={member.role}
                      disabled={isPending}
                      onChange={(e) =>
                        handleRoleChange(
                          member.id,
                          e.target.value as TenantRole
                        )
                      }
                      className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                    >
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r} value={r}>
                          {ROLE_LABELS[r]}
                        </option>
                      ))}
                    </select>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
