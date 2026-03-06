import { getSession } from "@/lib/auth/session";

export default async function CatalogPage() {
  const { user, tenantId } = await getSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Catalog</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Browse and manage vehicle wrap designs
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-lg border p-6">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {!!user ? `Authenticated as user ${user?.id}` : "Not authenticated"}
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
          {tenantId ? `Tenant ID: ${tenantId}` : "No tenant context"}
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-4">
          Catalog content coming soon...
        </p>
      </div>
    </div>
  );
}
