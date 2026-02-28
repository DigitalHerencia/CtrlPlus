import { Suspense } from 'react';
import { headers } from 'next/headers';

import { requirePermission } from '../../../../lib/auth/require-permission';
import { listWrapDesigns } from '../../../../lib/fetchers/catalog';
import { listBookings } from '../../../../lib/fetchers/scheduling';
import { listInvoices } from '../../../../lib/fetchers/billing';
import { getRequestTenant } from '../../../../lib/tenancy/get-request-tenant';
import { BookingCountMetric } from '../../../../features/scheduling/components/server';
import { Badge, Card, CardHeader } from '../../../../components/ui';
import { SectionBlock } from '../../../../components/shared-ui/blocks/section-block';
import { OperationsSnapshotSkeleton } from '../../../../components/shared-ui/feedback';

export const dynamic = 'force-dynamic';

function toHeaderMap(requestHeaders: Headers): Record<string, string | undefined> {
  const values: Record<string, string | undefined> = {};
  for (const [key, value] of requestHeaders.entries()) {
    values[key] = value;
  }

  return values;
}

async function OperationsSnapshotSection({
  headers,
  tenantId,
}: {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly tenantId: string;
}) {
  const [wraps, bookings, invoices] = await Promise.all([
    listWrapDesigns({
      headers,
      query: {
        tenantId,
        filter: {
          isPublished: true,
        },
        sort: {
          field: 'updatedAt',
          direction: 'desc',
        },
        pagination: {
          page: 1,
          pageSize: 200,
        },
      },
    }),
    listBookings({
      headers,
      query: {
        tenantId,
        sort: {
          field: 'startsAtIso',
          direction: 'asc',
        },
        pagination: {
          page: 1,
          pageSize: 200,
        },
      },
    }),
    listInvoices({
      headers,
      query: {
        tenantId,
        sort: {
          field: 'id',
          direction: 'asc',
        },
        pagination: {
          page: 1,
          pageSize: 200,
        },
      },
    }),
  ]);
  const paidInvoices = invoices.items.filter((invoice) => invoice.status === 'paid').length;

  return (
    <SectionBlock title='Performance Snapshot'>
      <dl className='grid gap-3 sm:grid-cols-2'>
        <div className='grid gap-1 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-3'>
          <dt className='text-sm uppercase tracking-[0.08em] text-[color:var(--text-muted)]'>Published wraps</dt>
          <dd className='text-2xl font-semibold text-[color:var(--text)]'>{wraps.total}</dd>
        </div>
        <BookingCountMetric totalBookings={bookings.total} />
        <div className='grid gap-1 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-3'>
          <dt className='text-sm uppercase tracking-[0.08em] text-[color:var(--text-muted)]'>Total invoices</dt>
          <dd className='text-2xl font-semibold text-[color:var(--text)]'>{invoices.total}</dd>
        </div>
        <div className='grid gap-1 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-3'>
          <dt className='text-sm uppercase tracking-[0.08em] text-[color:var(--text-muted)]'>Paid invoices</dt>
          <dd className='text-2xl font-semibold text-[color:var(--text)]'>{paidInvoices}</dd>
        </div>
      </dl>
    </SectionBlock>
  );
}

export default async function AdminDashboardPage() {
  const requestHeaders = await headers();
  const headerMap = toHeaderMap(requestHeaders);
  const tenantContext = await getRequestTenant();
  const tenantId = tenantContext.tenantId;
  const tenantSlug = tenantContext.tenantSlug;

  await requirePermission({
    headers: headerMap,
    tenantId,
    permission: 'admin:read'
  });

  return (
    <main className='mx-auto grid w-full max-w-5xl gap-6 px-5 py-10 md:px-6'>
      <Card>
        <CardHeader className='gap-3'>
          <Badge variant='outline'>Admin / Operations</Badge>
          <h1 className='text-4xl font-semibold tracking-[0.02em] text-[color:var(--text)]'>
            {tenantSlug.toUpperCase()} Operations Dashboard
          </h1>
          <p className='max-w-3xl text-[color:var(--text-muted)]'>
            Monitor wrap inventory, booking volume, and invoice collection in one operational view.
          </p>
        </CardHeader>
      </Card>

      <Suspense fallback={<OperationsSnapshotSkeleton />}>
        <OperationsSnapshotSection headers={headerMap} tenantId={tenantId} />
      </Suspense>

      <SectionBlock title='Operational Priorities'>
        <ul className='grid list-none gap-2 p-0 text-[color:var(--text-muted)]'>
          <li>Confirm today&apos;s vehicle intake and release schedule.</li>
          <li>Send payment links for all open invoices before end of day.</li>
          <li>Publish approved wrap designs queued for release.</li>
        </ul>
      </SectionBlock>
    </main>
  );
}
