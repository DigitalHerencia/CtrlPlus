import { getSession } from "@/lib/auth/session";
import { getTenantSettings } from "@/lib/admin/fetchers/get-tenant-settings";
import { SettingsForm } from "@/components/admin/settings-form";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await getSession();

  // Settings page is accessible to OWNER and ADMIN (ADMIN can view but save is gated server-side)
  if (session.role !== "OWNER" && session.role !== "ADMIN") {
    redirect("/admin");
  }

  const settings = await getTenantSettings(session.tenantId!);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Business Settings</h1>
        <p className="mt-1 text-neutral-500 dark:text-neutral-400">
          Manage your business profile and contact information.
          {session.role === "ADMIN" && (
            <span className="ml-1 text-neutral-400 dark:text-neutral-500">
              (Owner-only changes require an owner account.)
            </span>
          )}
        </p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
