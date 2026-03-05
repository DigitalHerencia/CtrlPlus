---
name: CtrlPlus Workspace Configuration
description: "Workspace-level instructions for CtrlPlus multi-tenant vehicle wrap platform. Covers Next.js 16 RSC-first patterns, feature-driven DDD architecture, strict data layer boundaries, tenant isolation security, and Clerk-based authorization."
applyTo: "**"
---

# CtrlPlus: Copilot Workspace Configuration

## Project Overview

**CTRL+** is a subdomain-based multi-tenant platform enabling vehicle wrap businesses to manage catalogs, enable customer visualization, handle bookings, and process payments. The architecture prioritizes security through tenant isolation, performance through server components, and maintainability through feature-driven domain organization.

---

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router, React Server Components)
- **Language**: TypeScript 5+ (strict mode mandatory)
- **Runtime**: Node.js 20+ (LTS)
- **UI**: React 19.2.3 + Tailwind CSS 4 + shadcn/ui primitives
- **Database**: Neon PostgreSQL (serverless) + Prisma 7+ ORM
- **Auth**: Clerk (login/signup) + Custom RBAC (`TenantUserMembership`)
- **Payments**: Stripe Checkout + verified webhooks
- **Testing**: Vitest (unit/integration) + Playwright (e2e)
- **Linting**: ESLint (flat config) + Prettier
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (production + preview)

---

## Architecture Principles (CRITICAL)

### 1. RSC-First Development

**Default to React Server Components for all pages and layouts.** Use Client Components only when necessary:

- Interactive forms with validation
- Browser-only APIs (localStorage, geolocation, permissions)
- Complex client-side state (modals, dropdowns, tooltips)
- Animations requiring requestAnimationFrame

**Patterns**:

- Keep data fetching on the server
- Use `async` functions in Server Components
- Pass data down via props, not client-side state
- Minimize client-side JavaScript

**Example**:

```tsx
// ✅ GOOD: Server Component
export default async function CatalogPage() {
  const wraps = await fetchWraps(); // Server-side fetch
  return <WrapGrid wraps={wraps} />;
}

// ✅ GOOD: Client Component only for interactivity
("use client");
export function WrapCard({ wrap }: { wrap: Wrap }) {
  const [isLiked, setIsLiked] = useState(false);
  return (
    <button onClick={() => setIsLiked(!isLiked)}>
      {isLiked ? "❤️" : "🤍"} {wrap.name}
    </button>
  );
}

// ❌ BAD: Unnecessary Client Component
("use client");
const wraps = useEffect(() => {
  /* fetch */
}, []);
```

### 2. Feature-First DDD (Domain-Driven Design)

Organize code by **feature domain**, not technical layer. Each domain is self-contained with its own use-cases, types, and business logic.

**Domain Structure**:

```
lib/
├── auth/                 # Authentication & Authorization
│   ├── clerk.ts         # Clerk client setup
│   ├── session.ts       # Current user/tenant resolution
│   └── rbac.ts          # Permission checking
├── tenancy/             # Tenant management & resolution
│   ├── resolve.ts       # Extract tenant from request
│   ├── types.ts         # Tenant/TenantUser types
│   └── assert.ts        # Tenant scope validation
├── catalog/             # Wrap catalog domain
│   ├── fetchers/        # READ: GetWrapsForTenant, GetWrapById
│   ├── actions/         # WRITE: CreateWrap, UpdateWrap, DeleteWrap
│   ├── types.ts         # Wrap, WrapCategory, WrapImage DTOs
│   └── validation.ts    # Input schemas
├── visualizer/          # Preview generation domain
│   ├── fetchers/        # READ: GetVisualizerPreview
│   ├── actions/         # WRITE: ProcessUpload, CachePreview
│   └── types.ts         # Preview, UploadSession types
├── scheduling/          # Bookings domain
│   ├── fetchers/        # READ: GetAvailability, GetBookings
│   ├── actions/         # WRITE: CreateBooking, CancelBooking
│   └── types.ts         # Booking, Availability, TimeSlot
├── billing/             # Payments & Invoices domain
│   ├── fetchers/        # READ: GetInvoices, GetPaymentStatus
│   ├── actions/         # WRITE: CreateInvoice, ProcessPayment
│   ├── stripe.ts        # Stripe API wrapper
│   └── types.ts         # Invoice, Payment, BillingItem
└── admin/               # Tenant admin operations
    ├── fetchers/        # READ: GetTenantStats, GetUsers
    ├── actions/         # WRITE: UpdateTenantSettings, SetUserRole
    └── types.ts         # TenantSettings, AdminMetrics
```

### 3. Strict Data Layer Boundaries (Security Critical)

**NO EXCEPTIONS**: These boundaries prevent data leaks and are architecturally enforced.

```
┌─────────────────────────────────────┐
│  app/**  (Routes, Pages, Handlers)  │
│  ↓ Do NOT import Prisma directly    │
├─────────────────────────────────────┤
│ lib/domain/{fetchers,actions}       │
│ ↓ Query control, auth enforcement   │
├─────────────────────────────────────┤
│  Prisma Client                      │
│  ↓ Database queries (scoped)        │
├─────────────────────────────────────┤
│  PostgreSQL                         │
└─────────────────────────────────────┘
```

**Rules**:

1. **`app/**`MUST NOT import Prisma**: Routes, layouts, page handlers import ONLY from`lib/domain/fetchers`and`lib/domain/actions`.
2. **Reads only in `lib/domain/{domain}/fetchers/**`\*\*: All database reads go through typed fetcher functions. Never expose raw Prisma models—return explicit DTOs.
3. **Writes only in `lib/domain/{domain}/actions/**`\*\*: All mutations go through server actions. Enforce full security pipeline: auth → tenant → permission → validate → mutate → audit.
4. **Fetchers return explicit DTOs**: Type defs in `types.ts` ensure frontend receives only intended fields.
5. **Actions enforce security pipeline**:

   ```tsx
   // lib/catalog/actions.ts
   "use server";
   export async function createWrap(input: CreateWrapInput) {
     // 1. Get authenticated user & tenant
     const { user, tenantId } = await getSession();
     if (!user) throw new Error("Unauthorized");

     // 2. Check permission
     await assertTenantMembership(tenantId, user.id, "admin");

     // 3. Validate input
     const parsed = createWrapSchema.parse(input);

     // 4. Mutate (scoped by tenantId)
     return await prisma.wrap.create({
       data: { ...parsed, tenantId }, // Always scope!
     });
   }
   ```

### 4. Tenant Isolation (Security Critical)

Tenant is determined **server-side from request context ONLY**. Never accept `tenantId` from client.

**Rules**:

- Tenant resolved via host/subdomain in `lib/tenancy/resolve.ts`
- NEVER accept `tenantId` from URL query params, request body, or cookies
- ALL database queries scoped by `tenantId` via Prisma `where` clauses
- Defensive checks with `assertTenantScope()` for tenant-owned records

**Example**:

```tsx
// ✅ GOOD: Tenant resolved server-side
async function getBookingsForTenant() {
  const { tenantId } = await resolveTenant(request.headers.get("host"));
  return prisma.booking.findMany({
    where: { tenantId }, // ALWAYS scoped
  });
}

// ❌ BAD: Accepting tenantId from client
async function getBookings(req: Request) {
  const { tenantId } = await req.json(); // DATA LEAK!
  return prisma.booking.findMany({ where: { tenantId } });
}

// ❌ BAD: Missing tenant scope
async function deleteWrap(wrapId: string) {
  return prisma.wrap.delete({
    where: { id: wrapId }, // What if user is from different tenant?
  });
}

// ✅ GOOD: Defensive scope + permission check
async function deleteWrap(wrapId: string) {
  const { tenantId, user } = await getSession();
  const wrap = await prisma.wrap.findUnique({ where: { id: wrapId } });

  if (wrap.tenantId !== tenantId) {
    throw new Error("Forbidden"); // Stop the line
  }

  await assertTenantMembership(tenantId, user.id, "admin");
  return prisma.wrap.delete({ where: { id: wrapId } });
}
```

### 5. Server-Side Authorization

- **Clerk** handles user authentication (login/signup, session management)
- **Custom RBAC** table (`TenantUserMembership`) stores permissions
- Roles: `owner`, `admin`, `member`
- All authorization happens server-side in actions/fetchers
- Permission checks throw errors (no silent failures)

**Pattern**:

```tsx
async function restrictedOperation(input: Input) {
  const { user, tenantId } = await getSession();

  // Check membership with role
  await assertTenantMembership(tenantId, user.id, ["admin"]);

  // Proceed with operation...
}
```

---

## Directory Structure

```
d:\CtrlPlus/
├── app/                              # Routes, Layouts, Pages (RSC)
│   ├── (public)/                     # Public pages (no auth)
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Homepage
│   │   ├── about/
│   │   ├── features/
│   │   └── contact/
│   ├── (auth)/                       # Clerk auth flow
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (tenant)/                     # Tenant routes (auth required)
│   │   ├── layout.tsx                # TenantLayout + TenantNav
│   │   ├── catalog/                  # Browse wraps
│   │   ├── visualizer/               # Preview on car
│   │   ├── scheduling/               # Booking flow
│   │   ├── billing/                  # Invoices/payments
│   │   └── admin/                    # Tenant admin panel
│   ├── api/                          # Route handlers (webhooks)
│   │   ├── clerk/[...webhook]/       # Clerk sync webhook
│   │   └── stripe/[...webhook]/      # Stripe payment webhook
│   ├── error.tsx                     # Global error boundary
│   ├── layout.tsx                    # Root layout
│   ├── loading.tsx                   # Global loading
│   └── globals.css                   # Tailwind + brand tokens
├── lib/                              # Business logic, data access
│   ├── auth/                         # Auth utilities
│   ├── tenancy/                      # Tenant resolution
│   ├── catalog/                      # Catalog domain
│   │   ├── fetchers/
│   │   ├── actions/
│   │   └── types.ts
│   ├── visualizer/                   # Preview domain
│   ├── scheduling/                   # Booking domain
│   ├── billing/                      # Payment domain
│   └── admin/                        # Admin domain
├── components/                       # Reusable React components
│   ├── ui/                           # shadcn/ui primitives
│   ├── catalog/                      # Domain-specific components
│   └── common/                       # Layout, nav, etc.
├── public/                           # Static assets
├── scripts/                          # Utilities (migrations, seeds)
├── .github/
│   └── copilot-instructions.md       # This file
├── .next/                            # Build output
├── node_modules/
├── .env.local                        # Local env (do NOT commit)
├── .env.example                      # Template for .env
├── .eslintrc.json                    # ESLint config
├── .prettierrc                       # Prettier config
├── eslint.config.mjs                 # ESLint flat config
├── next.config.ts                    # Next.js configuration
├── postcss.config.mjs                # PostCSS configuration
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── migrations/                   # DB migrations
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies & scripts
├── pnpm-workspace.yaml               # Monorepo config (if used)
├── PRD.md                            # Product Requirements Document
├── TECH-REQUIREMENTS.md              # Technical specification
└── README.md                         # Project overview
```

---

## Code Organization & Patterns

### Component Structure

```tsx
// components/catalog/WrapCard.tsx
"use client";
import { Wrap } from "@/lib/catalog/types";

interface WrapCardProps {
  wrap: Wrap;
  onSelect?: (wrapId: string) => void;
}

export function WrapCard({ wrap, onSelect }: WrapCardProps) {
  return (
    <div className="card">
      <img src={wrap.imageUrl} alt={wrap.name} />
      <h3>{wrap.name}</h3>
      <p>${wrap.price}</p>
      <button onClick={() => onSelect?.(wrap.id)}>Preview</button>
    </div>
  );
}
```

### Server Action Pattern

```tsx
// lib/catalog/actions.ts
"use server";

import { getSession } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { createWrapSchema, type CreateWrapInput } from "./types";
import { prisma } from "@/lib/prisma";

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

### Fetcher Pattern

```tsx
// lib/catalog/fetchers/get-wraps.ts
import { prisma } from "@/lib/prisma";
import { type Wrap } from "../types";

export async function getWrapsForTenant(tenantId: string): Promise<Wrap[]> {
  const wraps = await prisma.wrap.findMany({
    where: { tenantId, deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

  return wraps.map((w) => ({
    id: w.id,
    name: w.name,
    price: w.price,
    imageUrl: w.imageUrl,
    description: w.description,
  }));
}
```

### Type Definition Pattern

```tsx
// lib/catalog/types.ts
import { z } from "zod";

export const createWrapSchema = z.object({
  name: z.string().min(1, "Name required").max(100),
  price: z.number().positive("Price must be positive"),
  description: z.string().optional(),
  imageUrl: z.string().url(),
});

export type CreateWrapInput = z.infer<typeof createWrapSchema>;

export interface Wrap {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl: string;
  createdAt: Date;
}
```

---

## Typing Guidelines

- **Use TypeScript strict mode** (`strict: true` in tsconfig.json)
- **Avoid `any`**: Use generics (`T`) or `unknown` with type guards
- **Export explicit types**: DTOs in `types.ts` per domain
- **Type Server Component props**: Even though they're rarely passed, keep typing consistent
- **Use Zod for validation**: Schema inference with `z.infer<typeof schema>`

**Example**:

```tsx
// ✅ GOOD
async function CatalogPage({ params }: { params: { tenantId: string } }) {
  const wraps = await getWraps(params.tenantId);
  return <WrapGrid wraps={wraps} />;
}

// ❌ BAD
async function CatalogPage(params: any) {
  const wraps = await getWraps(params.tenantId);
  return <WrapGrid wraps={wraps} />;
}
```

---

## Testing Strategy

### Unit Tests (Vitest)

Test business logic in isolation—use-cases, utilities, validation.

```tsx
// lib/catalog/__tests__/validation.test.ts
import { describe, it, expect } from "vitest";
import { createWrapSchema } from "../types";

describe("createWrapSchema", () => {
  it("validates valid wrap input", () => {
    const result = createWrapSchema.parse({
      name: "Carbon Fiber",
      price: 1200,
      imageUrl: "https://example.com/cf.jpg",
    });
    expect(result.name).toBe("Carbon Fiber");
  });

  it("rejects missing name", () => {
    expect(() =>
      createWrapSchema.parse({
        price: 1200,
        imageUrl: "https://example.com/cf.jpg",
      })
    ).toThrow();
  });
});
```

### Integration Tests (Vitest + Mocked Prisma)

Test actions with security checks, data mutations.

```tsx
// lib/catalog/__tests__/actions.test.ts
vi.mock('@/lib/auth/session');
vi.mock('@/lib/tenancy/assert');
vi.mock('@/lib/prisma');

describe('createWrap', () => {
  it('creates wrap for authorized user', async () => {
    const result = await createWrap({
      name: 'Carbon Fiber',
      price: 1200,
      imageUrl: 'https://example.com/cf.jpg',
    });
    expect(result.id).toBeDefined();
  });

  it('rejects unauthorized user', async () => {
    vi.mocked(getSession).mockResolvedValue({ user: null, tenantId: '' });
    await expect(createWrap({...})).rejects.toThrow('Unauthorized');
  });
});
```

### E2E Tests (Playwright)

Test user journeys: browse catalog → select wrap → preview → book → pay.

```tsx
// e2e/catalog.spec.ts
import { test, expect } from "@playwright/test";

test("customer browses catalog and previews wrap", async ({ page }) => {
  await page.goto("http://localhost:3000/catalog");

  const firstWrap = page.locator('[data-testid="wrap-card"]').first();
  await firstWrap.click();

  const modal = page.locator('[data-testid="preview-modal"]');
  await expect(modal).toBeVisible();

  const uploadButton = page.locator('button:has-text("Upload Photo")');
  await uploadButton.click();
});
```

---

## Common Development Workflows

### Adding a New Feature

1. **Define domain types** in `lib/{domain}/types.ts`
2. **Create fetchers** in `lib/{domain}/fetchers/` for reads
3. **Create actions** in `lib/{domain}/actions/` for writes
4. **Add UI components** in `components/{domain}/`
5. **Create page/route** in `app/(tenant)/{domain}/`
6. **Write tests** in `lib/{domain}/__tests__/`
7. **Update Prisma schema** if new database entities needed

### Debugging Tenant Issues

1. Check `lib/tenancy/resolve.ts` — How is tenant extracted from request?
2. Verify all Prisma queries have `where: { tenantId }` filter
3. Check `assertTenantScope()` calls in actions
4. Review Clerk sync webhook in `app/api/clerk/`

### Adding a New Domain

1. Create `lib/{domain}/` with:
   - `types.ts` (types & Zod schemas)
   - `fetchers/` (named functions per query)
   - `actions/` (server actions for mutations)
   - `__tests__/` (unit + integration tests)
2. Create `components/{domain}/` for UI
3. Create `app/(tenant)/{domain}/` for pages
4. Update Prisma schema if needed

---

## Important Files & Commands

### Development

```bash
# Install dependencies
pnpm install

# Run dev server (http://localhost:3000)
pnpm dev

# Run linting
pnpm lint

# Fix formatting
pnpm format

# Run tests
pnpm test

# Build for production
pnpm build

# Start production server
pnpm start
```

### Database

```bash
# Prisma migrations
pnpm prisma migrate dev --name {migration_name}
pnpm prisma generate
pnpm prisma studio
```

### Key Files to Know

- `TECH-REQUIREMENTS.md` — Detailed tech stack & architecture
- `PRD.md` — Product requirements & user flows
- `prisma/schema.prisma` — Database schema
- `next.config.ts` — Next.js configuration
- `tsconfig.json` — TypeScript strict mode settings

---

## Checklist: Before Merging PR

- [ ] No `import Prisma` in `app/**`
- [ ] All data reads via `lib/*/fetchers/`
- [ ] All data writes via `lib/*/actions/`
- [ ] Tenant scoped on all Prisma queries
- [ ] Authorization checked server-side
- [ ] TypeScript strict mode passes (`pnpm tsc --noEmit`)
- [ ] ESLint passes (`pnpm lint`)
- [ ] Unit tests pass (`pnpm test`)
- [ ] No hardcoded secrets in code/comments

---

## Common Mistakes to Avoid

| Mistake                                         | Impact                       | Fix                                               |
| ----------------------------------------------- | ---------------------------- | ------------------------------------------------- |
| Importing Prisma in `app/**`                    | Data layer violation         | Move logic to `lib/*/fetchers` or `lib/*/actions` |
| Accepting `tenantId` from client                | Tenant isolation breach      | Always resolve tenant server-side from host       |
| Missing `where: { tenantId }` in Prisma queries | Cross-tenant data leak       | Add defensive check + `assertTenantScope()`       |
| Authorization only in client                    | Security bypass              | Move all permission checks to actions/fetchers    |
| Exposing raw Prisma models                      | Type unsafe, may leak fields | Return explicit DTO types from fetchers           |
| Using `any` types                               | Type safety lost             | Use generics, `unknown` + type guards, or Zod     |
| Not testing security critical paths             | Authorization bypass         | Test actions with mocked auth/tenancy             |

---

## Questions?

Refer to:

- **Architecture**: `TECH-REQUIREMENTS.md`
- **Product Goals**: `PRD.md`
- **TypeScript**: `tsconfig.json`
- **Database**: `prisma/schema.prisma`
- **Clerk Docs**: https://clerk.com/docs
- **Next.js 16**: https://nextjs.org/docs
