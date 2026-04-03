---
description: "Next.js App Router server-first architecture for CtrlPlus. Use when building pages, features, components, server actions, or fetchers. Foundational patterns for all domains."
applyTo: "app/**, features/**, components/**, lib/**, types/**, schemas/**"
---

# CtrlPlus Server-First Architecture

This instruction defines the foundational architecture that all CtrlPlus domains inherit. It is the baseline; domain-specific instructions extend but never override these rules.

## Core Mental Model

**CtrlPlus is server-first:**
- `app/` = route orchestration only (no business logic)
- `features/` = page/view assembly and client orchestration
- `components/` = pure presentational UI
- `lib/` = all server authority (reads, writes, auth, integrations)
- `types/` + `schemas/` = contracts and validation

**Current operating model:** CtrlPlus is single-store and auth-scoped. Do not invent `tenantId`
filters or membership checks for models that do not have tenant columns.

## Architectural Laws

### Law 1: `app/**` is orchestration-only

Use `app/` for:
- Route segments and groups
- `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`
- Thin `page.tsx` files
- API `route.ts` handlers

Do NOT use `app/` for:
- Prisma access (goes in `lib/fetchers/` or `lib/actions/`)
- Business logic (goes in `lib/` or `features/`)
- Complex component composition (goes in `features/`)
- Validation or DTO shaping (goes in `schemas/` and `types/`)

**Pattern: page.tsx file**
```typescript
// ✅ Good
export default async function TenantCatalogPage(props: PageProps) {
  return <CatalogFeature {...props} />;
}

// ❌ Wrong
export default async function TenantCatalogPage(props: PageProps) {
  const wraps = await prisma.wrap.findMany(...); // Don't do this!
  return <CatalogCards wraps={wraps} />;
}
```

### Law 2: pages are thin

A route `page.tsx` should only:
1. Accept `params` / `searchParams` and validate them
2. Perform route-level auth redirect if needed (rare)
3. Import a feature component
4. Return the feature

**Rule:** Line count should be ≤ 20 lines. If it's longer, move logic to the feature.

### Law 3: features own page orchestration

Features in `features/{domain}/{view}/` are responsible for:
- Calling fetchers to prepare data
- Composing domain components into a page
- Managing Suspense boundaries
- Owning route-specific client interactivity (forms, polling, optimistic UI)
- Calling server actions indirectly through forms or client-side effects

Features MAY NOT:
- Directly import Prisma
- Bypass lib/fetchers or lib/actions
- Invent new UI primitives (use components/ui or components/{domain})

**Pattern: feature composition**
```typescript
// ✅ Good
export async function CatalogFeature(props: FeatureProps) {
  const wraps = await getCatalogWraps(params);

  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <CatalogContent wraps={wraps} />
    </Suspense>
  );
}

// Within CatalogContent (client component):
"use client";
export function CatalogContent({ wraps }: Props) {
  const [filtered, setFiltered] = useState(wraps);

  return (
    <>
      <CatalogFilters onFilter={setFiltered} />
      <CatalogGrid items={filtered} />
    </>
  );
}
```

### Law 4: components are pure UI

Components in `components/{domain}/` are reusable UI blocks:
- Accept data and callbacks as props (no fetching)
- Render presentational UI (cards, tables, forms)
- Use shadcn primitives from `components/ui/` for low-level building blocks
- Delegate mutations to parent via callbacks

**Rule:** Never import Prisma, prisma types, or server actions directly. Pass everything as props.

```typescript
// ✅ Good
export function WrapCard({ wrap }: { wrap: WrapCardDTO }) {
  return (
    <Card>
      <CardImage src={wrap.heroUrl} alt={wrap.name} />
      <CardTitle>{wrap.name}</CardTitle>
      <CardText>{wrap.description}</CardText>
      <Button onClick={() => onPreview(wrap.id)}>Preview</Button>
    </Card>
  );
}

// ❌ Wrong
export function WrapCard({ wrapId }: { wrapId: string }) {
  const wrap = await getWrapById(wrapId); // Don't do this in a component!
  return <Card>...</Card>;
}
```

### Law 5: lib/fetchers/* owns server reads

Every read from the database, cache, or external system goes through `lib/fetchers/{domain}/*.ts`.

**Responsibilities:**
- Execute Prisma queries
- Shape results into DTOs (from `types/{domain}.types.ts`)
- Attach cache tags and revalidation hints
- Return cached or fresh data

**Pattern: fetcher function**
```typescript
// lib/fetchers/catalog.ts
import { unstable_cache } from "next/cache";
import { WrapListDTO } from "@/types/catalog.types";

const getCatalogWraps = unstable_cache(
  async () => {
    const wraps = await prisma.wrap.findMany({
      where: { isHidden: false, deletedAt: null },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        images: { where: { kind: "hero" } },
      },
    });

    return mapToWrapListDTO(wraps);
  },
  ["catalog:wraps"],
  { tags: ["catalog", "wraps"], revalidate: 3600 }
);

export { getCatalogWraps };
```

### Law 6: lib/actions/* owns server mutations

Every write to the database goes through `lib/actions/{domain}/*.ts`.

**Mutation Pipeline (6 steps):**
1. **Authenticate** - `const session = await getSession()`
2. **Authorize** - Enforce capability and ownership filters on the server
3. **Validate** - Parse input with Zod: `const payload = createWrapSchema.parse(input)`
4. **Mutate** - Write to the database with record-level scoping where applicable
5. **Audit** - Log the action: `await auditLog.create(...)`
6. **Return** - Return the DTO result

**Pattern: server action**
```typescript
"use server";

export async function updateWrap(input: unknown) {
  // 1. Authenticate
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  // 2. Authorize
  requireCapability(session.authz, "catalog.manage");
  const userId = session.userId;
  const { wrapId, ...payload } = input as any;

  // 3. Validate
  const validated = updateWrapSchema.parse(payload);

  // 4. Mutate
  const wrap = await prisma.wrap.update({
    where: { id: wrapId, deletedAt: null },
    data: validated,
  });

  // 5. Audit
  await auditLog.create({
    userId,
    action: "wrap.updated",
    resourceType: "Wrap",
    resourceId: wrap.id,
    details: JSON.stringify({ before: "...", after: "..." }),
  });

  // 6. Return
  revalidateTag("catalog:wraps");
  return mapToWrapDTO(wrap);
}
```

### Law 7: authorization scope is non-negotiable

Every database query, mutation, and authorization check must enforce server-derived scope.

**Rules:**
- Never trust ownership, role, or record scope from the client
- Always derive identity and capability from `getSession()`
- When a model is user-owned, include the ownership filter in the Prisma query
- When a model is global/shared, rely on capability checks rather than fake tenant filters

**Anti-pattern:**
```typescript
// ❌ WRONG: trusts client-provided scope
const wrap = await prisma.wrap.findUnique({
  where: { id: wrapIdFromClient }, // Missing server-side authz check!
});
```

**Correct:**
```typescript
// ✅ CORRECT: authenticated and capability-gated
requireCapability(session.authz, "catalog.manage");
const wrap = await prisma.wrap.findUnique({
  where: { id: wrapId },
});
```

## Server Components vs. Client Components

### Use Server Components (default)

Use `async` Server Components for:
- Pages that fetch data
- Features that call fetchers
- Layout boundaries
- Static shells

```typescript
// features/CatalogFeature.tsx (Server Component, default)
export async function CatalogFeature(props) {
  const wraps = await getCatalogWraps();
  return <CatalogContent wraps={wraps} />;
}
```

### Use Client Components (sparingly)

Add `"use client"` for:
- Interactive forms (React Hook Form)
- State management (useState, useCallback)
- Event handlers
- Real-time polling or WebSocket

**Rule:** Move client components as deep as possible (leaf nodes, not root). Never make a whole feature client-only if only a button is interactive.

```typescript
// features/CatalogFeature.tsx (Server Component, root)
export async function CatalogFeature(props) {
  const wraps = await getCatalogWraps();

  return (
    <>
      <CatalogHeader /> {/* Server Component */}
      <CatalogContent wraps={wraps} /> {/* Server Component */}
      <CatalogFilterClient /> {/* "use client" - leaf only */}
    </>
  );
}

// components/CatalogFilterClient.tsx
"use client";
export function CatalogFilterClient() {
  const [filter, setFilter] = useState("");
  return <input onChange={(e) => setFilter(e.target.value)} />;
}
```

## Common Patterns

### Form Handling (React Hook Form + Zod)

```typescript
// components/WrapForm.tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWrapSchema } from "@/schemas/catalog.schemas";
import { createWrap } from "@/lib/actions/catalog";

export function WrapForm() {
  const form = useForm({
    resolver: zodResolver(createWrapSchema),
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const result = await createWrap(data);
    // Handle result...
  });

  return <form onSubmit={onSubmit}>...</form>;
}
```

### Suspense Boundaries

```typescript
// features/CatalogFeature.tsx
export async function CatalogFeature() {
  return (
    <>
      <Suspense fallback={<CatalogHeaderSkeleton />}>
        <CatalogHeader />
      </Suspense>

      <Suspense fallback={<CatalogGridSkeleton />}>
        <CatalogGrid />
      </Suspense>
    </>
  );
}
```

### Cache Invalidation

```typescript
// lib/actions/catalog.ts
export async function createWrap(input: any) {
  // ... validation and mutation ...

  // Invalidate specific tags
  revalidateTag("catalog:wraps");
  revalidateTag(`wrap:${wrap.id}`);

  // Or invalidate paths (less precise)
  revalidatePath("/catalog");

  return wrap;
}
```

## Anti-Patterns to Avoid

| Anti-Pattern | Why | Fix |
|---|---|---|
| Prisma in components | No server boundary | Move to `lib/fetchers/` |
| `await fetch()` in components | Blocks rendering | Move to Server Component or fetcher |
| Client trusts ownership or scope | Authorization leak | Always derive scope from session and server filters |
| `images[0]` for asset selection | Brittle, no role semantics | Use explicit asset roles (hero, texture, etc.) |
| Large components (>500 lines) | Hard to maintain | Extract into smaller features/components |
| Direct Prisma in pages | No business logic layer | Move to `features/` or `lib/actions/` |
| Nested "use client" directives | Confusing | Place at leaf level only |
| Bypassing Zod validation | Security risk | Always validate with schema.parse() |

## Related Files

- Architecture docs: [`docs/ARCHITECTURE.md`](../../docs/ARCHITECTURE.md)
- Domain-specific rules: See `{domain}.instructions.md`
- Naming conventions: See `contracts/naming.yaml`
- Mutation pipeline: See `contracts/mutations.yaml`
- Type contracts: See `types/*.types.ts`
- Schema validation: See `schemas/*.schemas.ts`
