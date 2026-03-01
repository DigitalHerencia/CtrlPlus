import Link from 'next/link';

import { toWrapCatalogSearchParams } from '../../features/catalog/use-cases';
import type {
  WrapCatalogListRequestContract,
  WrapCatalogListResponseContract,
} from '../../types/catalog';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type WrapCatalogPaginationProps = {
  readonly query: WrapCatalogListRequestContract;
  readonly result: WrapCatalogListResponseContract;
};

function toPageHref(query: WrapCatalogListRequestContract, page: number): string {
  const searchParams = toWrapCatalogSearchParams({
    ...query,
    pagination: {
      ...query.pagination,
      page,
    },
  });

  return `/catalog/wraps?${searchParams.toString()}`;
}

export function WrapCatalogPagination({ query, result }: WrapCatalogPaginationProps) {
  if (result.total === 0) {
    return null;
  }

  const previousPage = query.pagination.page - 1;
  const nextPage = query.pagination.page + 1;
  const hasPreviousPage = query.pagination.page > 1;

  return (
    <Card>
      <CardContent className='flex flex-wrap items-center justify-between gap-3 pt-5'>
        <p className='text-sm text-[color:var(--text-muted)]'>
          Page {result.page} of {Math.max(result.pageCount, 1)} ({result.total} total)
        </p>

        <div className='flex items-center gap-2'>
          {hasPreviousPage ? (
            <Link className={buttonVariants({ variant: 'outline', size: 'sm' })} href={toPageHref(query, previousPage)}>
              Previous
            </Link>
          ) : (
            <span
              aria-disabled='true'
              className={buttonVariants({ className: 'cursor-not-allowed opacity-60', variant: 'outline', size: 'sm' })}
            >
              Previous
            </span>
          )}

          {result.hasNextPage ? (
            <Link className={buttonVariants({ variant: 'outline', size: 'sm' })} href={toPageHref(query, nextPage)}>
              Next
            </Link>
          ) : (
            <span
              aria-disabled='true'
              className={buttonVariants({ className: 'cursor-not-allowed opacity-60', variant: 'outline', size: 'sm' })}
            >
              Next
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
