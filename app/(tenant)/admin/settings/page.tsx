import Link from "next/link";
import { redirect } from "next/navigation";

import { SettingsForm } from "@/components/admin/settings-form";
import { TenantPageHeader } from "@/components/tenant/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTenantSettings } from "@/lib/admin/fetchers/get-tenant-settings";
import { getSession } from "@/lib/auth/session";

export default async function SettingsPage() {
  const { tenantId, userId } = await getSession();
  if (!tenantId || !userId) redirect("/sign-in");

  // All roles have access; no role check

  const settings = await getTenantSettings(tenantId);
  if (!settings) redirect("/admin");

  return (
    <div className="space-y-6">
      <TenantPageHeader
        eyebrow="Configuration"
        title="Tenant Settings"
        description="Control business identity, route naming, and the metadata that defines your tenant throughout the app."
        actions={
          <Button asChild variant="outline">
            <Link href="/admin">Back to Admin</Link>
          </Button>
        }
      />

      <Card className="app-panel max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-neutral-100">Business Profile</CardTitle>
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
