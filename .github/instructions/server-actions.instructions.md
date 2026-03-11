---
applyTo: "lib/*/actions/**/*.ts"
description: "Enforce security pipeline in server actions: auth -> authorize -> validate -> mutate -> audit."
---

# Server Action Rules

## Mandatory Pipeline

1. Authenticate user (`getSession` / `requireAuth`).
2. Authorize by capability/role.
3. Validate input with Zod.
4. Mutate via Prisma.
5. Write audit log for sensitive mutations.

## Authorization

- Roles: `customer`, `owner`, `admin`.
- Owner/admin IDs are environment-configured only.
- Customer operations must enforce resource ownership server-side.

## Example

```ts
"use server";

export async function cancelBooking(input: CancelInput) {
  const session = await requireAuth();
  const parsed = cancelSchema.parse(input);

  requireCustomerOwnedResourceAccess(session.authz, parsed.customerId);

  const booking = await prisma.booking.update({ ... });
  await prisma.auditLog.create({ data: { ... } });
  return toBookingDto(booking);
}
```
