# CtrlPlus Technical Requirements

## Stack

- **Framework**: Next.js v16+ (App Router)
- **Language**: TypeScript (strict mode)
- **Runtime**: Node.js 20+ (LTS)
- **Database**: Neon PostgreSQL (serverless)
- **ORM**: Prisma v7+
- **Authentication**: Clerk (universal components, no organizations)
- **Authorization**: Custom RBAC with tenant membership
- **UI Framework**: React 19+ (Server Components)
- **Styling**: Tailwind CSS v4 + shadcn/ui primitives
- **Payments**: Stripe Checkout + verified webhooks
- **Testing**: Vitest (unit/integration) + Playwright (e2e)
- **Linting**: ESLint (flat config) + Prettier
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (production) + preview deployments

---

## Architecture Principles

### 1. RSC-First Development

- Default to React Server Components for all pages and layouts
- Use Client Components only when necessary:
  - Forms with interactive validation
  - Components with browser-only APIs (localStorage, geolocation)
  - Interactive UI elements (tooltips, dropdowns with complex state)
- Keep data fetching on the server
- Minimize client-side JavaScript bundle

### 2. Feature-First DDD (Domain-Driven Design)

- Organize code by feature domain, not technical layer
- Business logic lives in pure use-cases (testable, framework-agnostic)
- Domain boundaries:
  - `tenancy`: Tenant management, resolution, scoping
  - `auth`: Authentication, authorization, permissions
  - `catalog`: Wrap designs, categories, pricing
  - `visualizer`: Preview generation, caching
  - `scheduling`: Availability, capacity, bookings
  - `billing`: Invoices, payments, Stripe integration
  - `admin`: Tenant admin operations

### 3. Strict Data Layer Boundaries

- **NO Prisma usage in `app/**`\*\*: Routes and layouts must not import Prisma client
- **Reads only in `lib/fetchers/**`\*\*: All database reads go through fetchers
- **Writes only in `lib/actions/**`\*\*: All mutations go through server actions
- Fetchers return explicit DTOs (never raw Prisma models)
- Actions enforce full security pipeline (auth → tenant → permission → validate → mutate → audit)

### 4. Tenant Isolation (Security Critical)

- Tenant resolved server-side from request host/subdomain ONLY
- NEVER accept `tenantId` from client payloads or query params
- All database queries scoped by `tenantId` via Prisma where clauses
- Defensive checks with `assertTenantScope()` for tenant-owned records
- Cross-tenant data access is architectural violation (stop the line)

### 5. Server-Side Authorization

- Clerk handles authentication (session management, user identity)
- Custom RBAC table (`TenantUserMembership`) for permissions
- Authorization checks happen server-side in actions/fetchers
- No authorization logic in client components
- Permission checks throw errors (no silent failures)

---

## Directory Structure

```
app/                        # Routes, layouts, pages, route handlers ONLY
├── (public)/               # Public marketing pages (no auth required)
│   ├── layout.tsx          # Public layout with PublicNav + PublicFooter
│   ├── page.tsx            # Homepage
│   ├── about/              # About page
│   ├── contact/            # Contact page
│   └── features/           # Features page
├── (auth)/                 # Clerk auth catch-all routes
│   ├── layout.tsx          # Auth layout (minimal nav)
│   ├── sign-in/            # Clerk sign-in catch-all
│   └── sign-up/            # Clerk sign-up catch-all
├── (tenant)/               # Tenant-scoped app routes (auth required)
│   ├── layout.tsx          # Tenant layout with TenantNav
│   ├── catalog/            # Wrap catalog
│   ├── visualizer/         # Wrap preview
│   ├── scheduling/         # Booking flow
│   ├── billing/            # Invoices and payments
│   └── admin/              # Tenant admin operations
├── api/                    # Route handlers (webhooks, etc.)
│   ├── clerk/              # Clerk webhook handler
│   └── stripe/             # Stripe webhook handler
├── error.tsx               # Global error boundary
├── layout.tsx              # Root layout (HTML structure, globals)
├── loading.tsx             # Global loading state
└── globals.css             # Tailwind directives + brand tokens

features/                   # Domain modules (DDD)
├── <domain>/
│   ├── components/
│   │   ├── server/         # RSC components (data fetching, composition)
│   │   └── client/         # Client components ("use client")
│   └── use-cases/          # Pure business logic functions (framework-agnostic)

lib/
├── fetchers/               # Read-only DB access (explicit DTOs)
│   ├── <domain>/           # Domain-specific fetchers
│   └── shared/             # Cross-domain read helpers
├── actions/                # Write-only mutations (server actions)
│   ├── <domain>/           # Domain-specific actions
│   └── shared/             # Cross-domain write helpers
├── auth/                   # Auth config and presentation helpers
├── tenancy/                # Tenant resolution, authz checks, scope assertions
├── db/                     # DB client, transaction helpers
├── cache/                  # Cache policies, tags, revalidation
├── audit/                  # Audit event helpers
├── rate-limit/             # Rate limiting (token bucket)
├── storage/                # File storage utilities (S3-compatible)
└── observability/          # Logging, monitoring, tracing

components/
├── ui/                     # shadcn primitives ONLY (no business logic)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── ...                 # All shadcn components
├── shared/                 # Reusable layout components
│   ├── nav/                # Navigation components
│   ├── layout/             # Headers, footers
│   ├── feedback/           # Loading, error, skeleton states
│   ├── blocks/             # Reusable UI blocks
│   └── providers/          # React context providers
└── <domain>/               # Domain-specific render components
    └── ...

schemas/                    # Zod input validation schemas
├── <domain>.ts             # Domain-specific schemas
└── shared.ts               # Cross-domain schemas

types/                      # TypeScript DTO contracts
├── <domain>.ts             # Domain-specific types
└── shared.ts               # Cross-domain types

prisma/
├── schema.prisma           # Database schema
└── migrations/             # Schema migrations

tests/
├── unit/                   # Pure function tests
├── integration/            # DB + auth + fetcher/action tests
└── e2e/                    # End-to-end Playwright tests
```

---

## Data Model (Prisma Schema)

### Core Tables

#### Tenant

```prisma
model Tenant {
  id        String   @id @default(cuid())
  slug      String   @unique // Subdomain (e.g., "acme" for acme.ctrlplus.com)
  name      String
  status    TenantStatus @default(ACTIVE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  wraps     Wrap[]
  bookings  Booking[]
  memberships TenantUserMembership[]
  // ... other relations
}
```

#### ClerkUser (Synced from Clerk webhook)

```prisma
model ClerkUser {
  id          String   @id @default(cuid())
  clerkUserId String   @unique // Clerk user ID
  email       String   @unique
  firstName   String?
  lastName    String?
  imageUrl    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  memberships TenantUserMembership[]
}
```

#### TenantUserMembership (Custom RBAC)

```prisma
model TenantUserMembership {
  id        String   @id @default(cuid())
  tenantId  String
  userId    String
  role      TenantRole
  status    MembershipStatus @default(ACTIVE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  tenant Tenant     @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  user   ClerkUser  @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([tenantId, userId])
  @@index([userId])
  @@index([tenantId, role])
}
```

#### Wrap (Catalog Item)

```prisma
model Wrap {
  id              String   @id @default(cuid())
  tenantId        String
  name            String
  description     String?
  price           Decimal  @db.Decimal(10, 2)
  estimatedHours  Int      // Installation time
  status          WrapStatus @default(ACTIVE)
  imageUrls       String[] // Array of image URLs
  category        WrapCategory
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  tenant   Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  bookings Booking[]

  @@index([tenantId, status])
  @@index([tenantId, category])
}
```

#### Booking

```prisma
model Booking {
  id            String   @id @default(cuid())
  tenantId      String
  customerId    String
  wrapId        String
  dropOffStart  DateTime
  dropOffEnd    DateTime
  pickUpStart   DateTime
  pickUpEnd     DateTime
  status        BookingStatus @default(PENDING)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  tenant   Tenant  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  wrap     Wrap    @relation(fields: [wrapId], references: [id])
  invoice  Invoice?

  @@index([tenantId, status])
  @@index([tenantId, dropOffStart])
}
```

#### Invoice

```prisma
model Invoice {
  id         String   @id @default(cuid())
  tenantId   String
  bookingId  String   @unique
  amount     Decimal  @db.Decimal(10, 2)
  status     InvoiceStatus @default(PENDING)
  stripeCheckoutSessionId String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  // Relations
  booking Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)

  @@index([tenantId, status])
}
```

#### AuditEvent (Immutable log)

```prisma
model AuditEvent {
  id        String   @id @default(cuid())
  tenantId  String?
  userId    String?
  action    String   // e.g., "booking.created", "invoice.paid"
  resource  String   // e.g., "booking:abc123"
  metadata  Json     // Contextual data
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())

  @@index([tenantId, createdAt])
  @@index([userId, createdAt])
  @@index([action, createdAt])
}
```

---

## API Contracts

### Fetcher Contract

All fetchers in `lib/fetchers/**` must follow this pattern:

```typescript
/**
 * Read-only database access with explicit DTO output
 *
 * @param params - Search/filter/sort/pagination parameters
 * @param context - Tenant and auth context
 * @returns Explicit DTO (never raw Prisma model)
 */
export async function fetchWrapList(
  params: WrapListParams,
  context: { tenantId: string; userId?: string },
): Promise<WrapListResult> {
  // 1. Optional: Check read permissions
  if (requiresAuth) {
    await requirePermission('catalog:read', { tenantId: context.tenantId, userId: context.userId });
  }

  // 2. Build query with tenant scope
  const wraps = await prisma.wrap.findMany({
    where: {
      tenantId: context.tenantId, // MANDATORY
      status: 'ACTIVE',
      ...(params.category && { category: params.category }),
      ...(params.search && {
        OR: [
          { name: { contains: params.search, mode: 'insensitive' } },
          { description: { contains: params.search, mode: 'insensitive' } },
        ],
      }),
    },
    orderBy: { [params.sortBy]: params.sortOrder },
    skip: (params.page - 1) * params.pageSize,
    take: params.pageSize,
  });

  // 3. Transform to DTO
  return {
    items: wraps.map((w) => toWrapDTO(w)),
    page: params.page,
    pageSize: params.pageSize,
    total: await prisma.wrap.count({ where: { tenantId: context.tenantId, status: 'ACTIVE' } }),
  };
}
```

### Action Contract

All actions in `lib/actions/**` must follow this pipeline:

```typescript
'use server';

/**
 * Server action with full security pipeline
 *
 * Pipeline: auth → tenant → permission → validate → mutate → audit
 *
 * @param input - User input (validated with Zod)
 * @returns Minimal DTO or error
 */
export async function createWrapAction(input: unknown): Promise<ActionResult<WrapDTO>> {
  try {
    // 1. Resolve auth
    const { userId, clerkUserId } = await requireAuth();

    // 2. Resolve tenant from host/subdomain
    const { tenantId } = await requireTenant();

    // 3. Check permissions
    await requirePermission('catalog:write', { tenantId, userId });

    // 4. Validate input with Zod
    const validated = createWrapSchema.parse(input);

    // 5. Perform mutation (transactional if needed)
    const wrap = await prisma.wrap.create({
      data: {
        tenantId, // MANDATORY
        name: validated.name,
        description: validated.description,
        price: validated.price,
        // ... other fields
      },
    });

    // 6. Invalidate cache
    revalidateTag(`catalog:${tenantId}`);

    // 7. Write audit event
    await writeAuditEvent({
      tenantId,
      userId,
      action: 'wrap.created',
      resource: `wrap:${wrap.id}`,
      metadata: { name: wrap.name },
    });

    // 8. Return minimal DTO
    return { success: true, data: toWrapDTO(wrap) };
  } catch (error) {
    // Error handling
    if (error instanceof ZodError) {
      return { success: false, error: 'Invalid input', details: error.errors };
    }
    throw error; // Re-throw unexpected errors
  }
}
```

---

## Security Requirements

### Authentication (Clerk)

- Clerk universal components for sign-in/up/out
- NO Clerk organizations (custom RBAC instead)
- Session management handled by Clerk
- User menu component from Clerk
- Email verification required

### Authorization (Custom RBAC)

- Tenant memberships stored in `TenantUserMembership` table
- Roles: `OWNER`, `ADMIN`, `MEMBER`
- Permissions checked server-side in actions/fetchers
- Permission format: `{domain}:{operation}` (e.g., `catalog:write`)
- Helper functions:
  - `requireAuth()`: Throws if not authenticated
  - `requireTenant()`: Resolves tenant from host, throws if invalid
  - `requirePermission(permission, context)`: Throws if user lacks permission
  - `assertTenantScope(tenantId, recordTenantId)`: Defensive check for tenant-owned records

### Tenant Isolation (Critical)

- Tenant resolved from subdomain (`{slug}.ctrlplus.com`)
- All database queries MUST include `tenantId` in where clause
- Cross-tenant queries are architectural violations
- Defensive `assertTenantScope()` checks before sensitive operations

### Webhook Security

#### Clerk Webhook (`POST /api/clerk/webhook`)

- Signature verification with `verifyWebhook` from `@clerk/nextjs/webhooks`
- Idempotency: Check `ClerkWebhookEvent` table before processing
- Transaction for user + membership upserts
- Events: `user.created`, `user.updated`, `user.deleted`

#### Stripe Webhook (`POST /api/stripe/webhook`)

- Signature verification with `stripe.webhooks.constructEvent()`
- Idempotency: Check `StripeWebhookEvent` table before processing
- Transaction for invoice + booking status updates
- Events: `checkout.session.completed`, `payment_intent.succeeded`

### Input Validation

- All action inputs validated with Zod schemas
- Sanitize user input to prevent XSS
- Rate limiting on public endpoints (token bucket)
- CSRF protection via Next.js (POST requests only for mutations)

---

## Performance Requirements

### Response Time Targets

- Catalog page load: < 2 seconds (P95)
- Preview generation: < 30 seconds or fallback (P95)
- Template preview: < 1 second (P95)
- Booking submission: < 3 seconds (P95)
- Admin dashboard: < 2 seconds (P95)

### Caching Strategy

- RSC caching: Use `revalidateTag` for targeted invalidation
- Preview caching: Deterministic keys, 24-hour TTL
- Static pages: ISR with 1-hour revalidation
- API routes: No caching (dynamic by nature)

### Database Optimization

- Indexes on all foreign keys
- Composite indexes for common query patterns (`tenantId + status`, `tenantId + category`)
- Connection pooling via Prisma (Neon serverless adapter)
- Pagination for all list endpoints

### Bundle Size

- Client JS budget: < 200KB gzipped (excluding Next.js runtime)
- Minimize client components
- Code splitting by route
- Image optimization (Next.js Image component)

---

## Testing Strategy

### Unit Tests (Vitest)

- Pure use-cases in `features/**/use-cases/**`
- Utility functions
- Schema validation
- Target: > 80% coverage

### Integration Tests (Vitest + Test DB)

- Fetchers with permission checks
- Actions with full pipeline (auth → mutate → audit)
- Webhook handlers with signature verification
- Target: > 70% coverage

### E2E Tests (Playwright)

- Critical user flows:
  - Sign up → Browse catalog → Preview → Book → Pay
  - Admin: Create wrap → Manage bookings
- Cross-browser (Chrome, Firefox, Safari)
- Run on: Changes to `app/`, `features/`, `lib/`, `schemas/`, `prisma/`

### Quality Gates (CI)

All PRs must pass:

1. `pnpm lint` (ESLint)
2. `pnpm typecheck` (TypeScript)
3. `pnpm test` (unit + integration)
4. `pnpm test:e2e` (conditional on file changes)

---

## Deployment & Infrastructure

### Hosting

- **Primary**: Vercel (production + preview deployments)
- **Database**: Neon PostgreSQL (serverless, auto-scaling)
- **File Storage**: Vercel Blob (preview images)
- **CDN**: Vercel Edge Network

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://...

# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
CLERK_WEBHOOK_SECRET=whsec_...

# Payments (Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=https://ctrlplus.com
NEXT_PUBLIC_TENANT_DOMAIN_SUFFIX=.ctrlplus.com

# Observability (Optional)
SENTRY_DSN=https://...
NEXT_PUBLIC_POSTHOG_KEY=phc_...
```

### CI/CD Pipeline (GitHub Actions)

```yaml
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  quality-gates:
    - Lint (ESLint)
    - Typecheck (TypeScript)
    - Test (unit + integration)
    - E2E (conditional)

  deploy:
    - Vercel preview (on PR)
    - Vercel production (on main merge)
```

---

## Observability (Planned)

### Logging

- Structured JSON logs
- Log levels: DEBUG, INFO, WARN, ERROR
- Context: tenantId, userId, requestId
- Sensitive data redaction

### Monitoring

- Uptime monitoring (Vercel)
- Error tracking (Sentry)
- Performance metrics (Vercel Analytics)
- Real User Monitoring (Web Vitals)

### Tracing

- Distributed tracing for webhook flows
- Database query performance
- External API call latency (Clerk, Stripe)

---

## Accessibility Requirements

- **WCAG 2.1 AA Compliance**
- Keyboard navigation for all interactive elements
- Screen reader compatibility (semantic HTML, ARIA labels)
- Color contrast ratios min 4.5:1 for text
- Focus indicators on all focusable elements
- Responsive design (mobile, tablet, desktop)

---

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile Safari (iOS 15+)
- Chrome Mobile (Android 12+)

---

## Development Workflow

### Setup

```bash
# Install dependencies
pnpm install

# Setup database
pnpm db:push

# Generate Prisma client
pnpm db:generate

# Run dev server
pnpm dev
```

### Commands

```bash
# Development
pnpm dev                 # Start dev server
pnpm build               # Build for production
pnpm start               # Start production server

# Database
pnpm db:push             # Push schema changes (dev)
pnpm db:migrate          # Create migration
pnpm db:studio           # Open Prisma Studio
pnpm db:seed             # Seed database

# Testing
pnpm lint                # Run ESLint
pnpm typecheck           # Run TypeScript compiler
pnpm test                # Run unit + integration tests
pnpm test:unit           # Run unit tests only
pnpm test:integration    # Run integration tests only
pnpm test:e2e            # Run E2E tests (Playwright)

# Code Generation
pnpm codegen             # Generate types and clients
```

---

## Migration & Rollback Strategy

### Database Migrations

- Use Prisma Migrate for schema changes
- Test migrations on preview environment first
- Backup database before production migrations
- Rollback plan: Revert migration + redeploy previous version

### Feature Flags (Future)

- Will implement feature flags for gradual rollouts
- Use environment variables or database config
- Toggle features without deployment

---

## Technical Debt Management

See CHANGELOG.md for current technical debt items.

**High Priority**:

- Distributed preview cache (Redis)
- Distributed rate limiting (Upstash)

**Medium Priority**:

- E2E test coverage for admin flows
- Performance profiling and optimization
- Structured logging implementation

**Low Priority**:

- Advanced booking conflict detection
- Preview quality improvements
- Multi-language support

---

## Decision Log

Major technical decisions are documented in CHANGELOG.md under their respective dates. Key architectural decisions:

1. **Clerk for auth, custom RBAC for authz** (balances DX with flexibility)
2. **No Prisma in app/ directory** (clear data layer boundaries)
3. **RSC-first with minimal client JS** (performance and SEO)
4. **Feature-first DDD structure** (domain alignment, reduced coupling)
5. **Subdomain-based tenant isolation** (security and UX)
6. **Stripe Checkout v1** (simplicity over customization)
7. **Vercel deployment** (DX, performance, Next.js optimization)
