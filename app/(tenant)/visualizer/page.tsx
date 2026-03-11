import { VisualizerClient } from "@/components/visualizer/VisualizerClient";
import { WorkspaceMetricCard, WorkspacePageIntro } from "@/components/nav/workspace-page-elements";
import { getSession } from "@/lib/auth/session";
import { hasCapability } from "@/lib/authz/policy";
import { getWraps } from "@/lib/catalog/fetchers/get-wraps";
import { redirect } from "next/navigation";

export default async function VisualizerPage() {
  const session = await getSession();
  if (!session.isAuthenticated) {
    redirect("/sign-in");
  }
  const wraps = await getWraps({
    includeHidden: hasCapability(session.authz, "catalog.manage"),
  });

  return (
    <div className="space-y-6">
      <WorkspacePageIntro
        label="Preview"
        title="Wrap Visualizer"
        description="Compare designs on your vehicle, switch between upload and template preview flows, and keep booking momentum even when preview processing falls back."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <WorkspaceMetricCard
          label="Live Wraps"
          value={wraps.length}
          description="Wrap options available for preview."
        />
        <WorkspaceMetricCard
          label="Modes"
          value="2"
          description="Upload a vehicle photo or use template fallback."
        />
        <WorkspaceMetricCard
          label="Booking Ready"
          value="Yes"
          description="Preview issues never block the next scheduling step."
        />
      </div>

      <VisualizerClient wraps={wraps} />
    </div>
  );
}
