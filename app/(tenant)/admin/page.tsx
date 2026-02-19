import { headers } from 'next/headers';

import { listWrapDesigns } from '../../../lib/server/fetchers/catalog/list-wrap-designs';
import { bookingStore } from '../../../lib/server/fetchers/booking-store';
import { invoiceStore } from '../../../lib/server/fetchers/get-invoice';
import { requirePermission } from '../../../lib/server/auth/require-permission';
import { getRequestTenant } from '../../../lib/server/tenancy/get-request-tenant';

export const dynamic = 'force-dynamic';

function toHeaderMap(requestHeaders: Headers): Record<string, string | undefined> {
  const values: Record<string, string | undefined> = {};
  for (const [key, value] of requestHeaders.entries()) {
    values[key] = value;
  }

  return values;
}

export default async function AdminDashboardPage() {
  const requestHeaders = await headers();
  const headerMap = toHeaderMap(requestHeaders);
  const tenant = await getRequestTenant();

  requirePermission({
    headers: headerMap,
    tenantId: tenant.tenantId,
    permission: 'admin:read'
  });

  const wraps = listWrapDesigns({ tenantId: tenant.tenantId });
  const bookings = bookingStore.listByTenant(tenant.tenantId);
  const invoices = invoiceStore.listByTenant(tenant.tenantId);
  const paidInvoices = invoices.filter((invoice) => invoice.status === 'paid').length;

  return (
    <main>
      <h1>{tenant.slug.toUpperCase()} Admin Dashboard</h1>
      <p>RSC shell for internal operations, metrics, and pending actions.</p>

      <section>
        <h2>Operational Snapshot</h2>
        <ul>
          <li>Published wraps: {wraps.length}</li>
          <li>Scheduled bookings: {bookings.length}</li>
          <li>Invoices: {invoices.length}</li>
          <li>Paid invoices: {paidInvoices}</li>
        </ul>
      </section>

      <section>
        <h2>Next Actions</h2>
        <ul>
          <li>Review today&apos;s drop-off and pick-up windows.</li>
          <li>Issue checkout links for unpaid invoices.</li>
          <li>Publish any queued wrap designs.</li>
        </ul>
      </section>
    </main>
  );
}

