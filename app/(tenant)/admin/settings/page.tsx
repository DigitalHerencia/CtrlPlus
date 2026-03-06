import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/session";
import { getUserTenantRole } from "@/lib/tenancy/assert";
import { getTenantSettings } from "@/lib/admin/fetchers/get-tenant-settings";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function SettingsPage() {
  const { user, tenantId } = await getSession();
  if (!user) redirect("/sign-in");

  // Only owners can access the settings page
  const role = await getUserTenantRole(tenantId, user.id);
  if (role !== "owner") redirect("/admin");

  const settings = await getTenantSettings(tenantId);
  if (!settings) redirect("/admin");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Configure your tenant settings.
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-lg border p-6 max-w-md">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
