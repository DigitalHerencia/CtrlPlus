'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { wrapCatalogListControlsFormSchema } from '../../../lib/shared/schemas/catalog/schema';
import type { WrapCatalogListRequestContract } from '../../../types/catalog';
import { buttonVariants, Card, CardContent, Input, Select } from '../../ui';

type WrapCatalogListControlsProps = {
  readonly query: WrapCatalogListRequestContract;
};

const SORT_OPTIONS: ReadonlyArray<{
  readonly field: NonNullable<WrapCatalogListRequestContract['sort']>['field'];
  readonly label: string;
}> = [
  { field: 'updatedAt', label: 'Recently updated' },
  { field: 'createdAt', label: 'Recently added' },
  { field: 'name', label: 'Name' },
  { field: 'priceCents', label: 'Price' },
];

const PAGE_SIZE_OPTIONS = [12, 24, 48] as const;
const PAGE_SIZE_VALUES = ['12', '24', '48'] as const;
const DEFAULT_PAGE_SIZE = '12' as const;

type WrapCatalogListControlsFormValues = z.infer<typeof wrapCatalogListControlsFormSchema>;

function toSearchParams(values: WrapCatalogListControlsFormValues): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (values.q.length > 0) {
    searchParams.set('q', values.q);
  }

  if (values.minPriceCents.length > 0) {
    searchParams.set('minPriceCents', values.minPriceCents);
  }

  if (values.maxPriceCents.length > 0) {
    searchParams.set('maxPriceCents', values.maxPriceCents);
  }

  searchParams.set('sort', values.sort);
  searchParams.set('direction', values.direction);
  searchParams.set('pageSize', values.pageSize);
  searchParams.set('page', '1');

  return searchParams;
}

function readPageSizeValue(query: WrapCatalogListRequestContract): (typeof PAGE_SIZE_VALUES)[number] {
  const pageSize = query.pagination.pageSize.toString();
  return PAGE_SIZE_VALUES.includes(pageSize as (typeof PAGE_SIZE_VALUES)[number])
    ? (pageSize as (typeof PAGE_SIZE_VALUES)[number])
    : DEFAULT_PAGE_SIZE;
}

export function WrapCatalogListControls({ query }: WrapCatalogListControlsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const sortField = query.sort?.field ?? 'updatedAt';
  const sortDirection = query.sort?.direction ?? 'desc';
  const form = useForm<WrapCatalogListControlsFormValues>({
    resolver: zodResolver(wrapCatalogListControlsFormSchema),
    defaultValues: {
      q: query.search?.query ?? '',
      minPriceCents: query.filter?.minPriceCents?.toString() ?? '',
      maxPriceCents: query.filter?.maxPriceCents?.toString() ?? '',
      sort: sortField,
      direction: sortDirection,
      pageSize: readPageSizeValue(query),
    },
  });
  const submitHandler = form.handleSubmit((values) => {
    const searchParams = toSearchParams(values);
    router.push(`${pathname}?${searchParams.toString()}`);
  });
  const filterErrorMessage = form.formState.errors.minPriceCents?.message
    ?? form.formState.errors.maxPriceCents?.message;

  return (
    <Card>
      <CardContent className='pt-5'>
        <form
          className='grid gap-3 md:grid-cols-2 lg:grid-cols-3'
          onSubmit={(event) => {
            void submitHandler(event);
          }}
        >
          <Input
            placeholder='Search name or description'
            type='search'
            {...form.register('q')}
          />

          <Input
            inputMode='numeric'
            min={0}
            placeholder='Min price (cents)'
            step={1}
            type='number'
            {...form.register('minPriceCents')}
          />

          <Input
            inputMode='numeric'
            min={0}
            placeholder='Max price (cents)'
            step={1}
            type='number'
            {...form.register('maxPriceCents')}
          />

          <Select {...form.register('sort')}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.field} value={option.field}>
                {option.label}
              </option>
            ))}
          </Select>

          <Select {...form.register('direction')}>
            <option value='desc'>Descending</option>
            <option value='asc'>Ascending</option>
          </Select>

          <Select {...form.register('pageSize')}>
            {PAGE_SIZE_OPTIONS.map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize} per page
              </option>
            ))}
          </Select>

          <div className='flex items-center gap-2 md:col-span-2 lg:col-span-3'>
            <button className={buttonVariants()} type='submit'>
              Apply
            </button>
            <button
              className={buttonVariants({ variant: 'outline' })}
              onClick={() => {
                form.reset({
                  q: '',
                  minPriceCents: '',
                  maxPriceCents: '',
                  sort: 'updatedAt',
                  direction: 'desc',
                  pageSize: DEFAULT_PAGE_SIZE,
                });
                router.push('/catalog/wraps');
              }}
              type='button'
            >
              Reset
            </button>
            <Link className={buttonVariants({ variant: 'secondary' })} href='/catalog/wraps/new'>
              New wrap
            </Link>
          </div>
          {filterErrorMessage ? (
            <p className='md:col-span-2 lg:col-span-3 text-xs text-red-500'>
              {filterErrorMessage}
            </p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
