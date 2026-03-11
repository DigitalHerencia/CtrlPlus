import { WebsiteSettingsForm } from "@/components/settings/website-settings-form";
import { WorkspacePageIntro } from "@/components/nav/workspace-page-elements";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import { getUserWebsiteSettings } from "@/lib/settings/fetchers/get-user-website-settings";
import { redirect } from "next/navigation";

export default async function WebsiteSettingsPage() {
  const session = await getSession();
  if (!session.isAuthenticated || !session.userId) {
    redirect("/sign-in");
  }

  const settings = await getUserWebsiteSettings(session.userId);

  return (
    <div className="space-y-6">
      <WorkspacePageIntro
        label="Website Settings"
        title="My Website Options"
        description="Manage your own notification and contact preferences for the customer portal."
      />

      <Card className="max-w-2xl border-neutral-700 bg-neutral-900 text-neutral-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-neutral-100">Preferences</CardTitle>
          <CardDescription>These options apply only to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <WebsiteSettingsForm settings={settings} />
        </CardContent>
      </Card>
    </div>
  );
}
