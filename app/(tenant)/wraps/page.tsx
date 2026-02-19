import { WrapCatalogList } from '../../../features/catalog/components/wrap-catalog-list';
import { getPublicWraps } from '../../../lib/fetchers/catalog/get-public-wraps';
import { getRequestTenant } from '../../../lib/tenancy/get-request-tenant';

export const revalidate = 60;

export default async function WrapsPage() {
  const tenant = await getRequestTenant();
  const wraps = await getPublicWraps(tenant.tenantId);

  return (
    <main className="mx-auto grid w-full max-w-5xl gap-4 px-5 py-10 md:px-6">
      <h1 className="text-4xl font-semibold tracking-[0.02em] text-[color:var(--text)]">
        {tenant.slug.toUpperCase()} Wrap Catalog
      </h1>
      <p className="max-w-3xl text-[color:var(--text-muted)]">
        Rendered as a server component with cached catalog fetchers.
      </p>
      <WrapCatalogList wraps={wraps} />
    </main>
  );
}
