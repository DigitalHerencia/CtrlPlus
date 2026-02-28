import { notFound } from 'next/navigation';

import { getPublicWrapDesign } from '../../../../lib/fetchers/catalog';
import { WrapCatalogDetail, WrapCatalogHeader } from '../../../../components/domains/catalog';

type WrapCatalogDetailPageProps = {
  readonly tenantId: string;
  readonly tenantSlug: string;
  readonly wrapId: string;
};

export async function WrapCatalogDetailPage({
  tenantId,
  tenantSlug,
  wrapId,
}: WrapCatalogDetailPageProps) {
  const wrap = await getPublicWrapDesign({
    query: {
      tenantId,
      id: wrapId,
    },
  });

  if (!wrap) {
    notFound();
  }

  return (
    <main className='mx-auto grid w-full max-w-4xl gap-4 px-5 py-10 md:px-6'>
      <WrapCatalogHeader
        description='Review wrap details before scheduling or requesting a quote.'
        tenantSlug={tenantSlug}
        title='Wrap detail'
      />
      <WrapCatalogDetail wrap={wrap} />
    </main>
  );
}
