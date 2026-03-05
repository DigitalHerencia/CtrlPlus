import { resolveTenant } from "@/lib/tenancy/resolve";
import { getWrapsForTenant } from "@/lib/catalog/fetchers/get-wraps";
import { WrapGrid } from "@/components/catalog/WrapGrid";
import { CatalogEmpty } from "@/components/catalog/CatalogEmpty";

export const metadata = {
  title: "Catalog | CTRL+",
  description: "Browse available vehicle wrap packages",
};

/**
 * Catalog listing page.
 *
 * Runs entirely on the server – tenantId is resolved server-side from the
 * request host and is NEVER accepted from URL params or the request body.
 */
export default async function CatalogPage() {
  const { tenantId } = await resolveTenant();
  const wraps = await getWrapsForTenant(tenantId);

  return (
    <section aria-labelledby="catalog-heading">
      <h1
        id="catalog-heading"
        className="mb-6 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
      >
        Wrap Catalog
      </h1>

      {wraps.length === 0 ? <CatalogEmpty /> : <WrapGrid wraps={wraps} />}
    </section>
  );
}
