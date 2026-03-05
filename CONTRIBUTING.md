# Contributing to CTRL+

Thank you for your interest in contributing to CTRL+! We welcome contributions from the community and are excited to have you join us.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Architecture Guidelines](#architecture-guidelines)

---

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

---

## Getting Started

### Prerequisites

- Node.js 20+ (LTS)
- pnpm 9+
- Git
- A Neon PostgreSQL database
- Clerk and Stripe accounts for testing

### Setup

1. **Fork and clone**

   ```bash
   git clone https://github.com/YOUR_USERNAME/CtrlPlus.git
   cd CtrlPlus
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment**

   ```bash
   cp .env.example .env.local
   # Fill in your credentials
   ```

4. **Run migrations**

   ```bash
   pnpm prisma migrate dev
   pnpm prisma generate
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

---

## Development Workflow

### Branch Naming

Use descriptive branch names:

- `feature/add-wrap-filters`
- `fix/tenant-isolation-bug`
- `docs/update-readme`
- `refactor/simplify-auth-flow`

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add wrap category filtering
fix: resolve tenant scope validation error
docs: update installation instructions
refactor: extract fetcher logic to domain
test: add unit tests for booking actions
```

### Making Changes

1. Create a feature branch

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our [coding standards](#coding-standards)

3. Write or update tests

   ```bash
   pnpm test
   ```

4. Run linting and formatting

   ```bash
   pnpm lint
   pnpm format
   ```

5. Commit your changes

   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

6. Push to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

---

## Coding Standards

### TypeScript

- Use **strict mode** (no `any` types)
- Define explicit types for all functions and props
- Use Zod for runtime validation and type inference

### React Patterns

- **Default to Server Components** unless client interactivity is required
- Client Components only for:
  - Forms with validation
  - Browser APIs (localStorage, geolocation)
  - Interactive UI (modals, dropdowns)
- Use `async/await` in Server Components for data fetching

### Data Layer Rules (CRITICAL)

These are security-critical architectural boundaries:

1. **NO Prisma imports in `app/**`\*\*
   - Routes and pages must use `lib/{domain}/fetchers/` or `lib/{domain}/actions/`

2. **All reads via fetchers**
   - Database reads in `lib/{domain}/fetchers/`
   - Return explicit DTOs, never raw Prisma models

3. **All writes via actions**
   - Mutations in `lib/{domain}/actions/`
   - Enforce security pipeline: auth → tenant → permission → validate → mutate

4. **Tenant scope ALL queries**
   - Every Prisma query must include `where: { tenantId }`
   - Use `assertTenantScope()` for defensive checks

### File Organization

```
lib/{domain}/
├── fetchers/           # READ: GetWraps, GetBookings, etc.
├── actions/            # WRITE: CreateWrap, UpdateBooking, etc.
├── types.ts            # DTOs, Zod schemas, interfaces
└── __tests__/          # Unit and integration tests
```

### Testing

- Write tests for all business logic
- Test security boundaries (auth, tenant isolation)
- Unit tests in `lib/{domain}/__tests__/`
- E2E tests in `e2e/`

---

## Pull Request Process

1. **Update documentation** if you've changed APIs or added features

2. **Ensure tests pass**

   ```bash
   pnpm test
   pnpm lint
   ```

3. **Fill out PR template** completely
   - Description of changes
   - Related issue numbers
   - Testing steps
   - Screenshots (if UI changes)

4. **Request review** from maintainers

5. **Address feedback** promptly and professionally

6. **Squash commits** before merging (or we'll squash on merge)

### PR Checklist

- [ ] Code follows project conventions
- [ ] No Prisma imports in `app/**`
- [ ] All queries scoped by `tenantId`
- [ ] Tests added/updated
- [ ] Linting passes (`pnpm lint`)
- [ ] TypeScript compiles (`pnpm build`)
- [ ] Documentation updated
- [ ] PR title follows Conventional Commits

---

## Issue Guidelines

### Before Creating an Issue

1. Search existing issues to avoid duplicates
2. Check if the issue is already fixed in `main`
3. Gather relevant information (version, environment, steps to reproduce)

### Bug Reports

Use the bug report template and include:

- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node version, OS)
- Screenshots or error logs

### Feature Requests

Use the feature request template and include:

- Problem you're trying to solve
- Proposed solution
- Alternatives considered
- How it fits project goals

---

## Architecture Guidelines

### Domain-Driven Design

Organize code by feature domain:

- `auth/` - Authentication & authorization
- `tenancy/` - Tenant resolution & scoping
- `catalog/` - Wrap designs & pricing
- `scheduling/` - Bookings & availability
- `billing/` - Payments & invoices

### Security First

- Never accept `tenantId` from client
- Resolve tenant server-side from request host
- Validate all inputs with Zod
- Throw errors on auth failures (no silent failures)

### Performance

- Use React Server Components by default
- Minimize client-side JavaScript
- Optimize database queries (use indexes)
- Cache static data appropriately

---

## Questions?

Feel free to:

- Open a discussion on GitHub
- Ask in pull request comments
- Reach out to maintainers

We appreciate your contributions and look forward to working with you!

---

**Thank you for contributing to CTRL+!**
