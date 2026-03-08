<div align="center">

# CTRL+

**Transform Vehicle Wrap Visualization into Bookings**

A subdomain-based multi-tenant SaaS platform for vehicle wrap businesses to showcase catalogs, enable real-time visualization, manage bookings, and process payments—all with enterprise-grade tenant isolation.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

[Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [Architecture](#architecture) • [Operations](./OPERATIONS.md) • [Contributing](#contributing)

</div>

---

## Overview

**CTRL+** streamlines the vehicle wrap customer journey from browsing to booking completion. By making wrap visualization the core differentiator, customers can validate their choices instantly, leading to faster conversions and higher satisfaction.

Built with strict tenant isolation, RSC-first patterns, and domain-driven design, CTRL+ delivers security, performance, and maintainability at scale.

---

## Features

### For Customers

- **Interactive Wrap Catalog**: Browse vehicle wraps by category, style, and price
- **Real-Time Visualization**: Upload car photos and preview wraps instantly
- **Seamless Booking**: Check availability and schedule installation appointments
- **Secure Payments**: Complete transactions via Stripe Checkout

### For Tenant Admins

- **Catalog Management**: Add, edit, and organize wrap designs
- **Availability Control**: Manage capacity and booking slots
- **Invoice Tracking**: Monitor payments and billing history
- **Multi-Tenant Isolation**: Complete data segregation per business

---

## Tech Stack

**Framework & Language**

- Next.js 16.1.6 (App Router, React Server Components)
- TypeScript 5+ (strict mode)
- React 19.2.3

**Database & ORM**

- Neon PostgreSQL (Serverless)
- Prisma 7+ with Neon adapter

**Authentication & Payments**

- Clerk (auth & session management)
- Stripe (checkout & webhooks)

**UI & Styling**

- Tailwind CSS 4
- shadcn/ui components
- Lucide icons

**DevOps**

- Vercel (production + preview)
- GitHub Actions (CI/CD)
- ESLint + Prettier + Husky

**Testing**

- Vitest (unit/integration)
- Playwright (e2e)

---

## Getting Started

### Prerequisites

- Node.js 20+ (LTS)
- pnpm 10.24+
- PostgreSQL database (Neon recommended)
- Clerk account for authentication
- Stripe account for payments

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/DigitalHerencia/CtrlPlus.git
   cd CtrlPlus
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Configure the following:

   ```env
   # Database
   DATABASE_URL="postgresql://..."
   DATABASE_URL_UNPOOLED="postgresql://..."

   # Clerk Auth
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
   CLERK_SECRET_KEY="sk_..."
   CLERK_WEBHOOK_SIGNING_SECRET="whsec_..."

   # Stripe
   STRIPE_SECRET_KEY="sk_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
   ```

4. **Run database migrations**

   ```bash
   pnpm prisma migrate dev
   pnpm prisma generate
   ```

5. **Start the development server**

   ```bash
   pnpm dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## Architecture

### RSC-First Development

CTRL+ defaults to React Server Components for all pages and layouts. Client Components are used only when necessary for interactive UI, browser APIs, or complex client-side state.

### Domain-Driven Design

Code is organized by feature domain, not technical layer:

```
lib/
├── auth/           # Authentication & authorization
├── tenancy/        # Tenant resolution & scoping
├── catalog/        # Wrap designs & pricing
├── visualizer/     # Preview generation
├── scheduling/     # Bookings & availability
├── billing/        # Payments & invoices
└── admin/          # Tenant admin operations
```

### Data Layer Boundaries

**Security-critical rule**: The `app/` directory MUST NOT import Prisma directly.

- **Reads**: `lib/{domain}/fetchers/` (returns explicit DTOs)
- **Writes**: `lib/{domain}/actions/` (enforces auth → tenant → permission → validate → mutate)

### Tenant Isolation

- Tenant resolved server-side from subdomain/host ONLY
- All queries scoped by `tenantId` via Prisma `where` clauses
- Cross-tenant access prevented architecturally

---

## Development

### Available Scripts

```bash
pnpm dev          # Start dev server (http://localhost:3000)
pnpm build        # Build for production
pnpm start        # Run production server
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
pnpm format:check # Check formatting without writing files
pnpm typecheck    # Run TypeScript compiler
pnpm prisma:validate # Validate Prisma schema and config
pnpm check        # Run the same quality gates as CI (format, lint, types, tests, Prisma, build)
pnpm test         # Run Vitest unit/integration tests
pnpm test:e2e     # Run Playwright tests
```

### Quality Workflow

- `pnpm install` automatically enables Husky hooks via `prepare`
- Pre-commit runs `lint-staged` on staged files
- Commit messages are validated with Commitlint and must use `type(scope): subject`
- Before opening a PR, run `pnpm check`

### Operational Workflow

CtrlPlus now uses `spec -> implement -> verify -> document` as the default release loop.

- Notion workstreams and task schema: [docs/operations/notion-workstreams.md](./docs/operations/notion-workstreams.md)
- Ship gate and webhook checklist: [docs/operations/ship-readiness.md](./docs/operations/ship-readiness.md)
- Visualizer model lock for v1: [docs/visualizer/huggingface-v1.md](./docs/visualizer/huggingface-v1.md)

### Database Commands

```bash
pnpm prisma migrate dev --name <name>   # Create migration
pnpm db:migrate:deploy                  # Apply committed migrations in production
pnpm prisma generate                    # Generate Prisma client
pnpm prisma studio                      # Open Prisma Studio
```

### Project Structure

```
d:\CtrlPlus/
├── app/                    # Routes, layouts, pages (RSC)
│   ├── (public)/          # Marketing pages (no auth)
│   ├── (auth)/            # Clerk auth flows
│   ├── (tenant)/          # Tenant-scoped app
│   └── api/               # Webhooks & route handlers
├── components/            # React components
│   ├── ui/               # shadcn/ui primitives
│   ├── auth/             # Auth-related components
│   └── layout/           # Headers, footers, nav
├── lib/                   # Business logic & data access
│   ├── auth/             # Auth utilities
│   ├── tenancy/          # Tenant resolution
│   └── {domain}/         # Feature domains
│       ├── fetchers/     # Read operations
│       ├── actions/      # Write operations
│       └── types.ts      # DTOs & schemas
├── prisma/               # Database schema & migrations
└── public/               # Static assets
```

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Quick Start

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Security

Security is critical for multi-tenant platforms. Please review:

- [Security Best Practices](./.github/instructions/TECH-REQUIREMENTS.md)
- Tenant isolation requirements in [Architecture docs](./.github/instructions/TECH-REQUIREMENTS.md)

Found a security issue? Please email security@example.com instead of using the issue tracker.

---

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## Acknowledgments

Built with:

- [Next.js](https://nextjs.org/) - The React Framework
- [Clerk](https://clerk.com/) - Authentication & User Management
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [Stripe](https://stripe.com/) - Payment Processing
- [Vercel](https://vercel.com/) - Deployment Platform
- [shadcn/ui](https://ui.shadcn.com/) - UI Components

---

<div align="center">

**[Documentation](./.github/instructions/TECH-REQUIREMENTS.md)** • **[Product Requirements](./.github/instructions/PRD.md)** • **[Operations](./docs/operations/ship-readiness.md)** • **[Issues](https://github.com/DigitalHerencia/CtrlPlus/issues)**

Made with ❤️ by Digital Herencia

</div>
