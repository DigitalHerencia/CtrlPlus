import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import { WrapCatalogDetail } from '../../../../../components/catalog/wrap-catalog-detail';
import { WrapCatalogHeader } from '../../../../../components/catalog/wrap-catalog-header';
import { CatalogDetailSectionSkeleton } from '../../../../../components/shared/feedback/catalog-sections-skeleton';
import { buttonVariants } from '../../../../../components/ui/button';
import { getPublicWrapDesign } from '../../../../../lib/server/fetchers/catalog';
import { getRequestTenant } from '../../../../../lib/tenancy/get-request-tenant';

export const revalidate = 60;

type WrapDetailsPageProps = {
  readonly params: {
    readonly id: string;
  };
};

async function WrapCatalogDetailSection({ tenantId, wrapId }: { readonly tenantId: string; readonly wrapId: string }) {
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
    <>
      <WrapCatalogDetail wrap={wrap} />
      <div className='flex items-center gap-2'>
        <Link className={buttonVariants({ variant: 'outline' })} href={`/catalog/wraps/${wrap.id}/edit`}>
          Edit wrap
        </Link>
      </div>
    </>
  );
}

export default async function WrapDetailsPage({ params }: WrapDetailsPageProps) {
  const tenantContext = await getRequestTenant();

  return (
    <main className='mx-auto grid w-full max-w-4xl gap-4 px-5 py-10 md:px-6'>
      <WrapCatalogHeader
        description='Review wrap details before scheduling or requesting a quote.'
        tenantSlug={tenantContext.tenantSlug}
        title='Wrap detail'
      />
      <Suspense fallback={<CatalogDetailSectionSkeleton />} key={params.id}>
        <WrapCatalogDetailSection tenantId={tenantContext.tenantId} wrapId={params.id} />
      </Suspense>
    </main>
  );
}
