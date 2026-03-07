import { redirect } from "next/navigation";

import { SettingsForm } from "@/components/admin/settings-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTenantSettings } from "@/lib/admin/fetchers/get-tenant-settings";
import { getSession } from "@/lib/auth/session";
import { getUserTenantRole } from "@/lib/tenancy/assert";

export default async function SettingsPage() {
  const { tenantId, userId } = await getSession();
  if (!tenantId || !userId) redirect("/sign-in");

  const role = await getUserTenantRole(tenantId, userId);
  if (role !== "owner") redirect("/admin");

  const settings = await getTenantSettings(tenantId, userId);
  if (!settings) redirect("/admin");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Tenant Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Configure your tenant identity and default admin preferences.
        </p>
      </div>

      <Card className="max-w-xl border-border/70 bg-card/95">
        <CardHeader>
          <CardTitle>Business Profile</CardTitle>
          <CardDescription>
            These settings affect tenant-wide display and routing metadata.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm settings={settings} />
        </CardContent>
      </Card>
    </div>
  );
}
