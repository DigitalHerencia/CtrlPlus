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
    <main className="mx-auto grid w-full max-w-4xl gap-4 px-5 py-10 md:px-6">
      <p className="text-sm uppercase tracking-[0.08em] text-[color:var(--text-muted)]">
        {tenant.slug.toUpperCase()} / Wrap Details
      </p>
      <WrapCatalogDetail wrap={wrap} />
    </main>
  );
}
