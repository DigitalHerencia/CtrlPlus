import { Suspense } from 'react';

import { WrapCatalogHeader } from '../../../../components/catalog/wrap-catalog-header';
import { WrapCatalogList } from '../../../../components/catalog/wrap-catalog-list';
import { WrapCatalogListControls } from '../../../../components/catalog/wrap-catalog-list-controls';
import { WrapCatalogPagination } from '../../../../components/catalog/wrap-catalog-pagination';
import { CatalogListSectionSkeleton } from '../../../../components/shared/feedback/catalog-sections-skeleton';
import { buildWrapCatalogListQuery } from '../../../../features/catalog/use-cases';
import { listPublicWrapDesigns } from '../../../../lib/server/fetchers/catalog';
import { getRequestTenant } from '../../../../lib/tenancy/get-request-tenant';
import type { WrapCatalogListRequestContract } from '../../../../types/catalog';

export const revalidate = 60;

type WrapsPageProps = {
  readonly searchParams?: Readonly<Record<string, string | readonly string[] | undefined>>;
};

function toListBoundaryKey(query: WrapCatalogListRequestContract): string {
  return [
    query.tenantId,
    query.search?.query ?? '',
    query.filter?.minPriceCents?.toString() ?? '',
    query.filter?.maxPriceCents?.toString() ?? '',
    query.sort?.field ?? '',
    query.sort?.direction ?? '',
    query.pagination.page.toString(),
    query.pagination.pageSize.toString(),
  ].join(':');
}

async function WrapCatalogListSection({ query }: { readonly query: WrapCatalogListRequestContract }) {
  const wrapsResult = await listPublicWrapDesigns({
    query,
  });
  const wraps = wrapsResult.items;

  return (
    <>
      <WrapCatalogList wraps={wraps} />
      <WrapCatalogPagination query={query} result={wrapsResult} />
    </>
  );
}

export default async function WrapsPage({ searchParams }: WrapsPageProps) {
  const tenantContext = await getRequestTenant();
  const listQuery = buildWrapCatalogListQuery(tenantContext.tenantId, searchParams);
  const listBoundaryKey = toListBoundaryKey(listQuery);

  return (
    <main className='mx-auto grid w-full max-w-5xl gap-4 px-5 py-10 md:px-6'>
      <WrapCatalogHeader
        description='Review available wrap options and open details to continue planning.'
        tenantSlug={tenantContext.tenantSlug}
        title='Wrap catalog'
      />

      <WrapCatalogListControls query={listQuery} />
      <Suspense fallback={<CatalogListSectionSkeleton />} key={listBoundaryKey}>
        <WrapCatalogListSection query={listQuery} />
      </Suspense>
    </main>
  );
}
