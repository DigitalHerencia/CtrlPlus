"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateTenantSettings } from "@/lib/admin/actions/update-tenant-settings";
import { type TenantSettingsDTO } from "@/lib/admin/types";

interface SettingsFormProps {
  settings: TenantSettingsDTO;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.currentTarget);
    const name = (formData.get("name") as string).trim();
    const slug = (formData.get("slug") as string).trim();

    startTransition(async () => {
      try {
        await updateTenantSettings({ name, slug });
        setSuccess(true);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save settings.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Business Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          defaultValue={settings.name}
          required
          maxLength={100}
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Tenant Slug</Label>
        <Input
          id="slug"
          name="slug"
          type="text"
          defaultValue={settings.slug}
          required
          disabled={isPending}
          maxLength={63}
          pattern="^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$"
        />
        <p className="text-xs text-neutral-500">Lowercase letters, numbers, and hyphens only.</p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">
          Settings saved successfully.
        </p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Save Changes"}
      </Button>
    </form>
  );
}
