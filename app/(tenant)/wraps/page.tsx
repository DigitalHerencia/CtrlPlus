import { WrapCatalogList } from '../../../features/catalog/components/wrap-catalog-list';
import { getPublicWraps } from '../../../lib/server/fetchers/catalog/get-public-wraps';
import { getRequestTenant } from '../../../lib/server/tenancy/get-request-tenant';

export const revalidate = 60;

export default async function WrapsPage() {
  const tenant = await getRequestTenant();
  const wraps = await getPublicWraps(tenant.tenantId);

  return (
    <main>
      <h1>{tenant.slug.toUpperCase()} Wrap Catalog</h1>
      <p>Rendered as a server component with cached catalog fetchers.</p>
      <WrapCatalogList wraps={wraps} />
    </main>
  );
}
