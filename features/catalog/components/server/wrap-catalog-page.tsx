import { listPublicWrapDesigns } from '../../../../lib/server/fetchers/catalog';
import {
  buildWrapCatalogListQuery,
  type WrapCatalogRouteSearchParams,
} from '../../use-cases';
import { WrapCatalogHeader } from '../../../../components/catalog/wrap-catalog-header';
import { WrapCatalogList } from '../../../../components/catalog/wrap-catalog-list';
import { WrapCatalogListControls } from '../../../../components/catalog/wrap-catalog-list-controls';
import { WrapCatalogPagination } from '../../../../components/catalog/wrap-catalog-pagination';

type WrapCatalogPageProps = {
  readonly tenantId: string;
  readonly tenantSlug: string;
  readonly searchParams: WrapCatalogRouteSearchParams | undefined;
};

export async function WrapCatalogPage({
  tenantId,
  tenantSlug,
  searchParams,
}: WrapCatalogPageProps) {
  const listQuery = buildWrapCatalogListQuery(tenantId, searchParams);
  const wrapsResult = await listPublicWrapDesigns({
    query: listQuery,
  });

  return (
    <main className='mx-auto grid w-full max-w-5xl gap-4 px-5 py-10 md:px-6'>
      <WrapCatalogHeader
        description='Search, filter, and sort wraps before opening details.'
        tenantSlug={tenantSlug}
        title='Wrap catalog'
      />
      <WrapCatalogListControls query={listQuery} />
      <WrapCatalogList wraps={wrapsResult.items} />
      <WrapCatalogPagination query={listQuery} result={wrapsResult} />
    </main>
  );
}
