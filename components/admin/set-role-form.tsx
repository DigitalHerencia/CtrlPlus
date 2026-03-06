"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { setUserRole } from "@/lib/admin/actions/set-user-role";
import { type TenantRole } from "@/lib/tenancy/types";
import { ROLE_LABELS } from "./role-badge";

interface SetRoleFormProps {
  userId: string;
  currentRole: TenantRole;
}

const SELECTABLE_ROLES: TenantRole[] = ["owner", "admin", "member"];

export function SetRoleForm({ userId, currentRole }: SetRoleFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const role = formData.get("role") as TenantRole;

    startTransition(async () => {
      try {
        await setUserRole({ targetUserId: userId, role });
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
          defaultValue={currentRole}
          disabled={isPending}
          className="flex h-8 rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          {SELECTABLE_ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
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
