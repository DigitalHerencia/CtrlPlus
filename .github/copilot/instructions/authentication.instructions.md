---
description: "Auth and authorization patterns for CtrlPlus. Use when implementing identity checks, capability validation, role guards, or authentication flows in proxies, lib/auth/**, lib/authz/**, or any server action."
applyTo: "proxy.ts, lib/auth/**, lib/authz/**, middleware/**"
---

# Auth & Authorization Instructions

The auth layer is centralized and server-side only. No client-side trust of identity or roles.

## Architecture Pattern

```
Request
  ↓
Clerk Middleware (proxy.ts)
  ↓
Server Component / Server Action
  ↓
getSession() → validate Clerk token
  ↓
assertTenantMembership() → check tenancy + role
  ↓
Proceed with authorization ✓
```

## Clerk Integration (proxy.ts)

**Middleware Routes Protected:**
- All `/(tenant)/**` routes → require authenticated session
- `/(auth)/**` routes → handled by Clerk sign-in/sign-up pages
- Public routes: `/`, `/catalog`, `/visualizer` (no auth required)

**Session Object:**
```typescript
interface Session {
  userId: string;              // Internal user ID (Clerk userId)
  clerkUserId: string;        // Redundant for compatibility
  email: string;
  tenantIds: string[];        // Tenant IDs user belongs to
  tenantId?: string;          // Current tenant (from route params or session cookie)
}
```

## Session Extraction (lib/auth/session.ts)

**Always use this in server actions:**
```typescript
const session = await getSession();
if (!session) throw new Error("Unauthorized");

// Now you have: userId, email, tenantIds
```

## Tenancy Assertion (lib/authz/assert.ts)

**Before any mutation or data fetch:**
```typescript
await assertTenantMembership(tenantId, userId, requiredRole);
// Throws if user not member, or role insufficient
```

**Signature:**
```typescript
async function assertTenantMembership(
  tenantId: string,
  userId: string,
  requiredRole: "owner" | "admin" | "member"  // Minimum required role
): Promise<void>;
```

**Role Hierarchy:**
- `owner` satisfies all checks (owner > admin > member)
- `admin` satisfies admin and member checks
- `member` satisfies member checks only

## Capability-Based Access (Future)

Not yet implemented; reserved for fine-grained permissions:
```typescript
async function requireCapability(
  userId: string,
  tenantId: string,
  capability: "wrap.edit" | "booking.create" | "invoice.view"
): Promise<void>;
```

## Key Patterns

### Pattern 1: Protect a Page
```typescript
// app/(tenant)/layout.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

export default async function TenantLayout({ children }) {
  const session = await getSession();
  if (!session) {
    redirect("/sign-in");
  }

  return <>{children}</>;
}
```

### Pattern 2: Authorize a Server Action
```typescript
"use server";

export async function updateWrap(input: unknown) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const { tenantId, wrapId } = input as any;

  await assertTenantMembership(tenantId, session.userId, "owner");

  // Safe to proceed; user is owner of tenantId
  // ...
}
```

### Pattern 3: Owner-Only Operation
```typescript
await assertTenantMembership(tenantId, userId, "owner");
// Throws if user is not owner
```

### Pattern 4: Mixed Permissions
```typescript
// Owner can edit; admin can view but not delete
if (operation === "delete") {
  await assertTenantMembership(tenantId, userId, "owner");
} else if (operation === "view") {
  await assertTenantMembership(tenantId, userId, "admin"); // admin or owner
}
```

## Related Resources

- Server-first architecture: [`server-first.instructions.md`](./server-first.instructions.md)
- Mutation pipeline: [`contracts/mutations.yaml`](../../contracts/mutations.yaml)
- Domain boundaries: [`contracts/domain-boundaries.yaml`](../../contracts/domain-boundaries.yaml)
- Clerk setup: `lib/integrations/clerk.ts`
