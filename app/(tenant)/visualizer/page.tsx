import type { Metadata } from "next";
import { getPreviewSessionsForTenant } from "@/lib/visualizer/fetchers/get-sessions";
import { SessionList } from "@/components/visualizer/SessionList";
import { VisualizerPanel } from "@/components/visualizer/VisualizerPanel";

export const metadata: Metadata = {
  title: "Visualizer",
  description:
    "Preview your vehicle wrap before booking. Upload a photo of your car to see how different designs look.",
};

/**
 * Visualizer page — server component.
 *
 * Fetches saved preview sessions server-side and renders the interactive
 * upload + preview panel as a client component subtree.
 *
 * Tenant is resolved server-side from headers (TODO: wire up host resolution
 * via lib/tenancy/resolve.ts once Clerk middleware is configured).
 */
export default async function VisualizerPage() {
  // TODO: Replace hardcoded tenantId with server-side host resolution:
  // const { tenantId } = await resolveTenant(headers().get("host"));
  const tenantId = "dev-tenant-001";

  const sessions = await getPreviewSessionsForTenant(tenantId);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          Wrap Visualizer
        </h1>
        <p className="mt-2 text-base text-zinc-600">
          Upload a photo of your vehicle to preview how a wrap design will look.
          Choose from our catalog or use any wrap color to get started.
        </p>
      </div>

      {/* Interactive upload + preview panel (client component) */}
      <section aria-label="Preview your vehicle" className="mb-12">
        <VisualizerPanel />
      </section>

      {/* Saved sessions (server-rendered list) */}
      <SessionList sessions={sessions} />
    </div>
  );
}
