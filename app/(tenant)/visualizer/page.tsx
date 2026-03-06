import { VisualizerClient } from "@/components/visualizer/VisualizerClient";
import { getSession } from "@/lib/auth/session";
import { getWrapsForTenant } from "@/lib/catalog/fetchers/get-wraps";

export default async function VisualizerPage() {
  const { tenantId } = await getSession();

  // Fetch available wraps for the tenant to populate the wrap selector
  const wraps = tenantId ? await getWrapsForTenant(tenantId) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-100">Wrap Visualizer</h1>
        <p className="mt-2 text-neutral-400">
          Choose a wrap, upload a photo of your vehicle, and see how it looks before you commit.
        </p>
      </div>

      <VisualizerClient wraps={wraps} />
    </div>
  );
}
