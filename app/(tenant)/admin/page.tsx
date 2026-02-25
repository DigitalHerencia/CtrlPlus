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
    permission: 'admin:read'
  });

  const wraps = listWrapDesigns({ tenantId: tenant.tenantId });
  const bookings = bookingStore.listByTenant(tenant.tenantId);
  const invoices = invoiceStore.listByTenant(tenant.tenantId);
  const paidInvoices = invoices.filter((invoice) => invoice.status === 'paid').length;

  return (
    <main className="mx-auto grid w-full max-w-5xl gap-6 px-5 py-10 md:px-6">
      <header className="grid gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
        <p className="text-sm uppercase tracking-[0.08em] text-[color:var(--text-muted)]">Admin / Operations</p>
        <h1 className="text-4xl font-semibold tracking-[0.02em] text-[color:var(--text)]">
          {tenant.slug.toUpperCase()} Operations Dashboard
        </h1>
        <p className="max-w-3xl text-[color:var(--text-muted)]">
          Monitor wrap inventory, booking volume, and invoice collection in one operational view.
        </p>
      </header>

      <section className="grid gap-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
        <h2 className="text-2xl font-semibold text-[color:var(--text)]">Performance Snapshot</h2>
        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-1 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-3">
            <dt className="text-sm uppercase tracking-[0.08em] text-[color:var(--text-muted)]">Published wraps</dt>
            <dd className="text-2xl font-semibold text-[color:var(--text)]">{wraps.length}</dd>
          </div>
          <div className="grid gap-1 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-3">
            <dt className="text-sm uppercase tracking-[0.08em] text-[color:var(--text-muted)]">Scheduled bookings</dt>
            <dd className="text-2xl font-semibold text-[color:var(--text)]">{bookings.length}</dd>
          </div>
          <div className="grid gap-1 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-3">
            <dt className="text-sm uppercase tracking-[0.08em] text-[color:var(--text-muted)]">Total invoices</dt>
            <dd className="text-2xl font-semibold text-[color:var(--text)]">{invoices.length}</dd>
          </div>
          <div className="grid gap-1 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-3">
            <dt className="text-sm uppercase tracking-[0.08em] text-[color:var(--text-muted)]">Paid invoices</dt>
            <dd className="text-2xl font-semibold text-[color:var(--text)]">{paidInvoices}</dd>
          </div>
        </dl>
      </section>

      <section className="grid gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
        <h2 className="text-2xl font-semibold text-[color:var(--text)]">Operational Priorities</h2>
        <ul className="grid list-none gap-2 p-0 text-[color:var(--text-muted)]">
          <li>Confirm today&apos;s vehicle intake and release schedule.</li>
          <li>Send payment links for all open invoices before end of day.</li>
          <li>Publish approved wrap designs queued for release.</li>
        </ul>
      </section>
    </main>
  );
}
