import { VisualizerClient } from "@/components/visualizer/VisualizerClient";
import { getSession } from "@/lib/auth/session";
import { getWrapsForTenant } from "@/lib/catalog/fetchers/get-wraps";

export default async function VisualizerPage() {
  const { tenantId } = await getSession();
  const wraps = tenantId ? await getWrapsForTenant(tenantId) : [];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-neutral-800 bg-linear-to-r from-neutral-950 to-neutral-900 p-6">
        <h1 className="text-3xl font-black tracking-tight text-neutral-100">Wrap Visualizer</h1>
        <p className="mt-2 max-w-2xl text-neutral-300">
          Compare designs on your vehicle, or use instant fallback templates when upload processing
          is unavailable. Preview errors never block your ability to continue booking.
        </p>
      </div>

      <VisualizerClient wraps={wraps} />
    </div>
  );
}
