# Demo Audit GitHub Issue Packet

This packet translates `docs/demo-visual-audit.md` remediation items into trackable GitHub issues aligned with:

- label taxonomy in `.github/labels.json`
- project fields in `.github/project-v2.json`
- issue templates in `.github/ISSUE_TEMPLATE/*.yml`
- roadmap source of truth in `.github/task-manifest.json`

## How to apply

1. Run governance bootstrap after installing/authenticating GitHub CLI (`gh`).
2. Sync labels + milestones + tasks from task manifest:

```bash
pnpm bootstrap:github
```

3. Confirm the `M9` milestone and `DEMO-*` issues are present and attached to the GitHub project.

---

## Issue Definitions (Template-aligned)

### DEMO-001 — Replace in-memory stores with Prisma-backed repositories

- **Template**: Feature Request
- **Labels**: `type:feature`, `domain:catalog`, `scope:backend`, `scope:db`, `p0`, `status:triage`
- **Project fields**:
  - Domain: `Catalog`
  - Risk Level: `Critical`
  - Requires Migration: `Yes`
  - Requires E2E: `Yes`

**Problem Statement**
Runtime data for catalog, bookings, invoices, and uploads is held in memory, which is non-durable and blocks reliable demo and production behavior.

**Proposed Solution**
Implement repository adapters backed by Prisma for all runtime data paths, remove in-memory stores from runtime execution, and add integration + e2e coverage for persistence and tenant boundaries.

---

### DEMO-002 — Migrate Prisma datasource from SQLite to Neon Postgres

- **Template**: Infrastructure Request
- **Labels**: `type:infra`, `domain:tenancy`, `scope:db`, `p0`, `status:triage`
- **Project fields**:
  - Domain: `Tenancy`
  - Risk Level: `Critical`
  - Requires Migration: `Yes`
  - Requires E2E: `No`

**Summary**
Current Prisma datasource is SQLite while technical requirements mandate Neon Postgres.

**Proposed Changes / Mitigation Plan**
Switch provider to Postgres, validate migration chain against Neon, and document runtime env contract for local + CI.

---

### DEMO-003 — Align Clerk authorization model with no-org requirement

- **Template**: Feature Request
- **Labels**: `type:feature`, `domain:auth`, `scope:backend`, `scope:security`, `p0`, `status:triage`
- **Project fields**:
  - Domain: `Auth`
  - Risk Level: `Critical`
  - Requires Migration: `Yes`
  - Requires E2E: `Yes`

**Problem Statement**
Authorization currently depends on Clerk org context, conflicting with “no orgs” architecture rules.

**Proposed Solution**
Resolve tenant membership and role server-side via trusted storage and metadata strategy that does not rely on active Clerk org context.

---

### DEMO-004 — Fix sign-up catch-all route segment naming and auth route regression coverage

- **Template**: Bug Report
- **Labels**: `type:bug`, `domain:auth`, `scope:frontend`, `scope:e2e`, `p0`, `status:triage`
- **Project fields**:
  - Domain: `Auth`
  - Risk Level: `Critical`
  - Requires Migration: `No`
  - Requires E2E: `Yes`

**Reproduction Steps**
1. Inspect auth route directory tree under `app/(auth)/sign-up`.
2. Observe catch-all directory named `[[...sign-out]]` under sign-up path.
3. Validate routing/callback behavior for sign-up edge paths.

**Expected Behavior**
Sign-up catch-all segment naming should reflect sign-up route convention and be covered by regression tests.

---

### DEMO-005 — Realign PR e2e path filters to current repository topology

- **Template**: Infrastructure Request
- **Labels**: `type:infra`, `domain:ci`, `scope:ci`, `p1`, `status:triage`
- **Project fields**:
  - Domain: `CI`
  - Risk Level: `High`
  - Requires Migration: `No`
  - Requires E2E: `No`

**Summary**
Conditional e2e trigger globs are partially stale and do not fully map to current file layout.

**Proposed Changes / Mitigation Plan**
Update workflow globs and CI design docs together; add governance test coverage for trigger-critical paths.

---

### DEMO-006 — Enforce Zod validation for all server action inputs

- **Template**: Infrastructure Request
- **Labels**: `type:security`, `domain:ci`, `scope:backend`, `scope:security`, `p1`, `status:triage`
- **Project fields**:
  - Domain: `CI`
  - Risk Level: `High`
  - Requires Migration: `No`
  - Requires E2E: `No`

**Summary**
Server actions contain ad-hoc validation and must be standardized to explicit Zod schemas.

**Proposed Changes / Mitigation Plan**
Define Zod schemas per action input contract, fail fast before side effects, and add integration tests for invalid payloads.

---

### DEMO-007 — Introduce baseline structured logging with request correlation

- **Template**: Infrastructure Request
- **Labels**: `type:infra`, `domain:ci`, `scope:backend`, `p2`, `status:triage`
- **Project fields**:
  - Domain: `CI`
  - Risk Level: `Medium`
  - Requires Migration: `No`
  - Requires E2E: `No`

**Summary**
The codebase lacks a baseline structured logging contract for tenant-safe diagnosis.

**Proposed Changes / Mitigation Plan**
Introduce structured logs, request correlation IDs, and redaction-safe error context across server actions, fetchers, and webhooks.

---

### DEMO-008 — Ship environment template and deployment runbook for demo-critical infrastructure

- **Template**: Infrastructure Request
- **Labels**: `type:docs`, `domain:ci`, `scope:docs`, `p2`, `status:triage`
- **Project fields**:
  - Domain: `CI`
  - Risk Level: `Medium`
  - Requires Migration: `No`
  - Requires E2E: `No`

**Summary**
Deployment and runtime environment setup is not codified enough for reliable handoff and demo operations.

**Proposed Changes / Mitigation Plan**
Add `.env.example`, deployment runbook, rollback steps, and governance-sync operator checklist.
