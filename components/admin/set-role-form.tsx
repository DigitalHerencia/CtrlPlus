"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { updateUserRole } from "@/lib/admin/actions/update-user-role";
import { type AssignableRole } from "@/lib/admin/types";
import { type TenantRole } from "@/lib/tenancy/types";
import { ROLE_LABELS } from "./role-badge";

interface SetRoleFormProps {
  clerkUserId: string;
  currentRole: TenantRole;
}

const SELECTABLE_ROLES: AssignableRole[] = ["admin", "member"];

export function SetRoleForm({ clerkUserId, currentRole }: SetRoleFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const role = formData.get("role") as AssignableRole;

    startTransition(async () => {
      try {
        await updateUserRole({ targetClerkUserId: clerkUserId, role });
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update role.");
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <select
          name="role"
          defaultValue={currentRole === "owner" ? "admin" : currentRole}
          disabled={isPending}
          aria-label="Select role"
          className="app-select min-w-32 text-xs"
        >
          {SELECTABLE_ROLES.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role]}
            </option>
          ))}
        </select>

        <Button type="submit" size="sm" variant="outline" disabled={isPending}>
          {isPending ? "Saving…" : "Update"}
        </Button>
      </form>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
