---
applyTo: "lib/*/fetchers/**/*.ts"
description: "Enforce DTO pattern and server-side ownership scoping in all data fetchers."
---

# Fetcher Rules

## Mandatory

1. Return DTOs only (never raw Prisma models).
2. Apply `deletedAt: null` where soft-delete exists.
3. Enforce ownership scope for customer data (`customerId`/`clerkUserId`).
4. Do not accept role or ownership trust values from clients.

## Pattern

```ts
export async function getInvoices(scope: { customerId?: string; includeAll?: boolean }) {
  const where = {
    deletedAt: null,
    ...(scope.includeAll ? {} : { booking: { customerId: scope.customerId } }),
  };

  const rows = await prisma.invoice.findMany({ where });
  return rows.map(toInvoiceDto);
}
```
