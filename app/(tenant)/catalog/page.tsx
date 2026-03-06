import { getSession } from "@/lib/auth/session";

export default async function CatalogPage() {
  const session = await getSession();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-100">Catalog</h1>
        <p className="text-neutral-400 mt-2">
          Browse and manage vehicle wrap designs
        </p>
      </div>

      <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
        <p className="text-sm text-neutral-400">
          {session.isAuthenticated
            ? `Authenticated as user ${session.userId}`
            : "Not authenticated"}
        </p>
        <p className="text-sm text-neutral-400 mt-2">
          {session.tenantId ? `Tenant ID: ${session.tenantId}` : "No tenant context"}
        </p>
        <p className="text-sm text-neutral-400 mt-4">
          Catalog content coming soon...
        </p>
      </div>
    </div>
  );
}
