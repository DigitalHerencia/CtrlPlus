import { WebsiteSettingsForm } from "@/components/settings/website-settings-form";
import { WorkspacePageIntro } from "@/components/shared/tenant-elements";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import { getUserWebsiteSettings } from "@/lib/settings/fetchers/get-user-website-settings";
import { redirect } from "next/navigation";

export default async function WebsiteSettingsPage() {
  const session = await getSession();
  if (!session.isAuthenticated || !session.userId) {
    redirect("/sign-in");
  }

  let settings: Awaited<ReturnType<typeof getUserWebsiteSettings>> | null = null;
  let error: string | null = null;

  try {
    settings = await getUserWebsiteSettings(session.userId);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load settings.";
  }

  return (
    <div className="space-y-6">
      <WorkspacePageIntro
        label="Website Settings"
        title="My Website Options"
        description="Manage your notification and contact preferences for your customer portal."
      />

      {/* Loading/Error/Empty States */}
      {!settings && !error && (
        <div className="py-12 text-center text-neutral-400">Loading website settings...</div>
      )}
      {error && (
        <div className="border border-red-950/60 bg-red-950/30 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}
      {settings && (
        <Card className="max-w-6xl border-neutral-700 bg-neutral-950/80 text-neutral-100">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-neutral-100">Preferences</CardTitle>
            <CardDescription>These options apply only to your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <WebsiteSettingsForm settings={settings} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
