---
description: "Auth and authorization patterns for CtrlPlus. Use when implementing identity checks, capability validation, role guards, or authentication flows in proxy.ts, app/(auth)/**, features/auth/**, lib/auth/**, lib/authz/**, or server actions."
applyTo: "proxy.ts, app/(auth)/**, features/auth/**, lib/auth/**, lib/authz/**, middleware/**"
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
requireCapability() / ownership filter → check role and record scope
  ↓
Proceed with authorization ✓
```

## Clerk Integration (proxy.ts)

**Middleware Routes Protected:**
- All `/(tenant)/**` routes → require authenticated session
- `/(auth)/**` routes → handled by Clerk sign-in/sign-up pages
- Public routes: `/`, `/docs`, marketing pages, sign-in/sign-up, and public webhooks
- Authenticated routes: `/catalog`, `/catalog/[wrapId]`, `/visualizer`, `/scheduling`, `/billing`, `/settings`, `/admin`, `/platform`

**Session Object:**
```typescript
interface Session {
  userId: string | null;
  isAuthenticated: boolean;
  role: "customer" | "owner" | "admin";
  authz: AuthzContext;
}
```

## Session Extraction (lib/auth/session.ts)

**Always use this in server actions:**
```typescript
const session = await getSession();
if (!session) throw new Error("Unauthorized");

// Now you have: userId, role, authz
```

## Authorization Pattern (lib/authz/policy.ts)

**Before any mutation or data fetch:**
```typescript
requireCapability(session.authz, "catalog.manage");
// Throws if the current role lacks the required capability
```

Use ownership filters in Prisma queries when records are user-owned.
Do not introduce synthetic `tenantId` checks when the schema does not contain tenant columns.

## Capability-Based Access (Future)

Not yet implemented; reserved for fine-grained permissions:
```typescript
function requireCapability(
  authz: AuthzContext,
  capability: string
): void;
```

## Key Patterns

### Pattern 1: Protect a Page
```typescript
// app/(tenant)/layout.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

export default async function TenantLayout({ children }) {
  const session = await getSession();
  if (!session.isAuthenticated) {
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

  requireCapability(session.authz, "catalog.manage");
  // Safe to proceed; action is authorized for the current user
  // ...
}
```

### Pattern 3: Owner-Only Operation
```typescript
requireCapability(session.authz, "catalog.manage");
// Throws if the current role cannot manage catalog records
```

### Pattern 4: Mixed Permissions
```typescript
// Customer can use the visualizer; owner/admin can manage catalog
if (operation === "manage_catalog") {
  requireCapability(session.authz, "catalog.manage");
} else if (operation === "use_visualizer") {
  requireCapability(session.authz, "visualizer.use");
}
```

## Related Resources

- Server-first architecture: [`server-first.instructions.md`](./server-first.instructions.md)
- Mutation pipeline: [`contracts/mutations.yaml`](../contracts/mutations.yaml)
- Domain boundaries: [`contracts/domain-boundaries.yaml`](../contracts/domain-boundaries.yaml)
- Clerk setup: `lib/integrations/clerk.ts`
