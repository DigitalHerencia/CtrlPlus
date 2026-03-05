---
name: Server Actions - Security Pipeline
description: "Enforce security pipeline in all server actions: authentication → tenant resolution → permission check → validation → mutation → audit. Use when creating or reviewing lib/*/actions/* files."
applyTo: "lib/*/actions/**"
---

# Server Actions: Security Pipeline

All server actions **MUST** follow this security pipeline in order:

```
1. Authenticate   → Get user & tenant from session
2. Authorize      → Check permission against role/permissions
3. Validate       → Parse & validate input with Zod
4. Mutate         → Execute database operation (scoped by tenantId)
5. Audit          → Log sensitive operations
```

## Template

```tsx
"use server";

import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";
import { type YourDTOType } from "./types";

// 1. Define validation schema
const inputSchema = z.object({
  name: z.string().min(1).max(100),
  // ... other fields
});

type ActionInput = z.infer<typeof inputSchema>;

// 2. Server action with security pipeline
export async function yourAction(input: ActionInput): Promise<YourDTOType> {
  // Step 1: AUTHENTICATE
  const { user, tenantId } = await getSession();
  if (!user) throw new Error("Unauthorized: not authenticated");

  // Step 2: AUTHORIZE
  // Check specific permission (role-based or capability-based)
  await assertTenantMembership(tenantId, user.id, "admin");
  // OR for multiple roles:
  // await assertTenantMembership(tenantId, user.id, ['admin', 'editor']);

  // Step 3: VALIDATE
  const parsed = inputSchema.parse(input);

  // Step 4: MUTATE (always scope by tenantId)
  const record = await prisma.yourTable.create({
    data: {
      ...parsed,
      tenantId, // 🚨 NEVER forget this
    },
  });

  // Step 5: AUDIT (optional, crucial for sensitive ops)
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId: user.id,
      action: "CREATE_RECORD",
      resourceId: record.id,
      details: { ...parsed },
      timestamp: new Date(),
    },
  });

  return {
    id: record.id,
    name: record.name,
    // Return only necessary fields (DTO pattern)
  };
}
```

## Security Checks

### ✅ Authentication Present

```tsx
const { user, tenantId } = await getSession();
if (!user) throw new Error("Unauthorized");
```

### ✅ Tenant Scope Present

Every Prisma query MUST include `where: { tenantId, ... }`:

```tsx
// ✅ GOOD
await prisma.wrap.findFirst({
  where: { id: wrapId, tenantId },
});

await prisma.booking.deleteMany({
  where: { tenantId, status: "cancelled" },
});

// ❌ BAD - Missing tenantId scope
await prisma.wrap.findFirst({
  where: { id: wrapId },
});
```

### ✅ Authorization Check Present

```tsx
// Role-based
await assertTenantMembership(tenantId, user.id, "admin");

// Multiple roles
await assertTenantMembership(tenantId, user.id, ["admin", "editor"]);

// Capability-based (if using granular permissions)
const member = await getTenantMember(tenantId, user.id);
if (!member?.permissions.includes("write:wraps")) {
  throw new Error("Forbidden: insufficient permissions");
}
```

### ✅ Input Validation Present

```tsx
const parsed = createWrapSchema.parse(input);
// OR
const parsed = inputSchema.safeParse(input);
if (!parsed.success) {
  throw new Error(`Validation error: ${parsed.error.message}`);
}
```

### ✅ No Hardcoded Role Strings

```tsx
// ❌ BAD
if (userRole === "admin") {
}

// ✅ GOOD - Use enum or constant
const ADMIN_ROLES = ["owner", "admin"] as const;
if (ADMIN_ROLES.includes(user.role)) {
}
```

## Common Patterns

### Create with Tenant Scope

```tsx
export async function createWrap(input: CreateWrapInput) {
  const { user, tenantId } = await getSession();
  if (!user) throw new Error("Unauthorized");

  await assertTenantMembership(tenantId, user.id, "admin");

  const parsed = createWrapSchema.parse(input);

  const wrap = await prisma.wrap.create({
    data: { ...parsed, tenantId },
  });

  return wrap;
}
```

### Update with Ownership Check

```tsx
export async function updateWrap(wrapId: string, input: UpdateWrapInput) {
  const { user, tenantId } = await getSession();
  if (!user) throw new Error("Unauthorized");

  await assertTenantMembership(tenantId, user.id, "admin");

  // Verify wrap belongs to tenant
  const wrap = await prisma.wrap.findUnique({
    where: { id: wrapId },
  });

  if (wrap?.tenantId !== tenantId) {
    throw new Error("Forbidden: resource not found");
  }

  const parsed = updateWrapSchema.parse(input);

  return prisma.wrap.update({
    where: { id: wrapId },
    data: parsed,
  });
}
```

### Delete with Audit

```tsx
export async function deleteWrap(wrapId: string) {
  const { user, tenantId } = await getSession();
  if (!user) throw new Error("Unauthorized");

  await assertTenantMembership(tenantId, user.id, "owner");

  const wrap = await prisma.wrap.findUnique({
    where: { id: wrapId },
  });

  if (wrap?.tenantId !== tenantId) {
    throw new Error("Forbidden: resource not found");
  }

  // Soft delete (preferred)
  const result = await prisma.wrap.update({
    where: { id: wrapId },
    data: { deletedAt: new Date() },
  });

  // Audit
  await auditLog(tenantId, user.id, "DELETE_WRAP", wrapId);

  return result;
}
```

### Handle Optional Permissions

```tsx
export async function shareWrap(wrapId: string, email: string) {
  const { user, tenantId } = await getSession();
  if (!user) throw new Error("Unauthorized");

  // Only admins can share
  const member = await prisma.tenantUserMembership.findFirst({
    where: { tenantId, userId: user.id },
  });

  if (member?.role !== "admin") {
    throw new Error("Forbidden: only admins can share");
  }

  // Validate email is within tenant domain (optional)
  // ... proceed with sharing
}
```

## What NOT to Do

| Anti-Pattern                                       | Why                    | Fix                                               |
| -------------------------------------------------- | ---------------------- | ------------------------------------------------- |
| `export async function deleteWrap(wrapId: string)` | No auth check          | Add `getSession()` and `assertTenantMembership()` |
| `.delete({ where: { id } })`                       | Missing tenant scope   | Add `{ where: { id, tenantId } }`                 |
| `if (input.tenantId) { }`                          | Accepting client input | Always resolve server-side from session           |
| `.create({ ...input })`                            | Might miss tenantId    | Explicitly add `tenantId` to data                 |
| No try-catch                                       | Error leaks secrets    | Let Zod + session throw, handle in caller         |
| `const role = input.role`                          | Client can fake role   | Get role from database/session                    |

---

See [copilot-instructions.md](../copilot-instructions.md) for full architecture guide.
