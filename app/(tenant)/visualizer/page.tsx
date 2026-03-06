import { getSession } from "@/lib/auth/session";
import { getWrapsForTenant } from "@/lib/catalog/fetchers/get-wraps";
import { VisualizerClient } from "@/components/visualizer/VisualizerClient";

export default async function VisualizerPage() {
  const { user, tenantId } = await getSession();

  // Fetch available wraps for the tenant to populate the wrap selector
  const wraps = tenantId ? await getWrapsForTenant(tenantId) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wrap Visualizer</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Choose a wrap, upload a photo of your vehicle, and see how it looks before you commit.
        </p>
        {user && (
          <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
            Signed in as {user.email}
          </p>
        )}
      </div>

      <VisualizerClient wraps={wraps} />
    </div>
  );
}
