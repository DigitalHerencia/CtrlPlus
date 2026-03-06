import { redirect } from "next/navigation";

import { SettingsForm } from "@/components/admin/settings-form";
import { getTenantSettings } from "@/lib/admin/fetchers/get-tenant-settings";
import { getSession } from "@/lib/auth/session";
import { getUserTenantRole } from "@/lib/tenancy/assert";

export default async function SettingsPage() {
  const { tenantId, userId } = await getSession();
  if (!tenantId || !userId) redirect("/sign-in");

  const role = await getUserTenantRole(userId, tenantId);
  if (!role) redirect("/");

  const settings = await getTenantSettings(tenantId, userId);
  if (!settings) redirect("/");

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
