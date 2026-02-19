import { headers } from 'next/headers';

import { requirePermission } from '../../../lib/auth/require-permission';
import { bookingStore } from '../../../lib/fetchers/booking-store';
import { invoiceStore } from '../../../lib/fetchers/get-invoice';
import { listWrapDesigns } from '../../../lib/fetchers/catalog/list-wrap-designs';
import { getRequestTenant } from '../../../lib/tenancy/get-request-tenant';

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

  await requirePermission({
    headers: headerMap,
    tenantId: tenant.tenantId,
    tenantClerkOrgId: tenant.clerkOrgId,
    permission: 'admin:read'
  });

  const wraps = listWrapDesigns({ tenantId: tenant.tenantId });
  const bookings = bookingStore.listByTenant(tenant.tenantId);
  const invoices = invoiceStore.listByTenant(tenant.tenantId);
  const paidInvoices = invoices.filter((invoice) => invoice.status === 'paid').length;

  return (
    <main className="mx-auto grid w-full max-w-5xl gap-6 px-5 py-10 md:px-6">
      <header className="grid gap-2">
        <h1 className="text-4xl font-semibold tracking-[0.02em] text-[color:var(--text)]">
          {tenant.slug.toUpperCase()} Admin Dashboard
        </h1>
        <p className="max-w-3xl text-[color:var(--text-muted)]">
          RSC shell for internal operations, metrics, and pending actions.
        </p>
      </header>

      <section className="grid gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
        <h2 className="text-2xl font-semibold text-[color:var(--text)]">Operational Snapshot</h2>
        <ul className="grid list-none gap-2 p-0 text-[color:var(--text-muted)]">
          <li>Published wraps: {wraps.length}</li>
          <li>Scheduled bookings: {bookings.length}</li>
          <li>Invoices: {invoices.length}</li>
          <li>Paid invoices: {paidInvoices}</li>
        </ul>
      </section>

      <section className="grid gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
        <h2 className="text-2xl font-semibold text-[color:var(--text)]">Next Actions</h2>
        <ul className="grid list-none gap-2 p-0 text-[color:var(--text-muted)]">
          <li>Review today&apos;s drop-off and pick-up windows.</li>
          <li>Issue checkout links for unpaid invoices.</li>
          <li>Publish any queued wrap designs.</li>
        </ul>
      </section>
    </main>
  );
}
