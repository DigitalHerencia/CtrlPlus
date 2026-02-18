import { notFound } from 'next/navigation';

import { WrapCatalogDetail } from '../../../../features/catalog/components/wrap-catalog-detail';
import { getPublicWrapById } from '../../../../lib/server/fetchers/catalog/get-public-wraps';
import { getRequestTenant } from '../../../../lib/server/tenancy/get-request-tenant';

export const revalidate = 60;

export interface WrapDetailsPageProps {
  readonly params: {
    readonly id: string;
  };
}

export default async function WrapDetailsPage({ params }: WrapDetailsPageProps) {
  const tenant = await getRequestTenant();
  const wrap = await getPublicWrapById(tenant.tenantId, params.id);

  if (!wrap) {
    notFound();
  }

  return (
    <main>
      <WrapCatalogDetail wrap={wrap} />
    </main>
  );
}
