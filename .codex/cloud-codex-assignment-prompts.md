# Cloud Codex Assignment Prompts (Issues #219-#249)

_Generated: 2026-03-13 (America/Los_Angeles)_

## Issue #219: Epic: Ship-readiness for Catalog + Visualizer domains
```text
Implement #219 Epic: Ship-readiness for Catalog + Visualizer domains;
summary=Deliver catalog and visualizer domains to production-ready quality with secure data handling, role-based management, deterministic CI, and complete owner/customer journeys.
project_status=PS1 (Ship-readiness Program #219 OPEN; projectItems unavailable)
deps=none
wave=W0
milestone=MS0
labels=type:infra, domain:ci, codex
assignment=@Codex/@DigitalHerencia/@DigitalHerencia (issue/review/ci)
proposed_pr=branch:codex/219-ship-readiness-epic-governance base:main title:[#219] Epic: Ship-readiness for Catalog + Visualizer domains closes:#219
execution_lane=scout -> implement -> qa -> review

Global exact requirements block (must be followed verbatim):
- Follow D:/CtrlPlus/.github/workflows/ci.yml gates exactly: fast-quality then domain-e2e.
- PR must use D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md sections and include Closes #<issue>.
- Respect .codex/instructions/* architecture constraints: no Prisma in app/** except webhook routes; reads in lib/{domain}/fetchers; writes in lib/{domain}/actions; server-side authz/ownership checks; Zod input validation.
- Apply existing automations only: issue-template labels (bug, enhancement) where applicable; rely on PR labeler domain labels from D:/CtrlPlus/.github/labeler.yml.
- Local validation before handoff: pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm prisma:validate && pnpm build.
- Do not create any new .toml files in D:/CtrlPlus; keep existing .toml deletions untouched.
```

## Issue #220: QA-101 Add `.codex/**` ignores to ESLint, Prettier, and TypeScript
```text
Implement #220 QA-101 Add `.codex/**` ignores to ESLint, Prettier, and TypeScript;
summary=Add `.codex/**` to lint/format/typecheck ignore surfaces so internal artifacts never fail quality gates.
project_status=PS1 (Ship-readiness Program #219 OPEN; projectItems unavailable)
deps=none
wave=W1
milestone=MS1
labels=type:infra, domain:ci, codex
assignment=@Codex/@DigitalHerencia/@DigitalHerencia (issue/review/ci)
proposed_pr=branch:codex/220-codex-ignore-surfaces base:main title:[#220] QA-101 Add `.codex/**` ignores to ESLint, Prettier, and TypeScript closes:#220
execution_lane=scout -> implement -> qa -> review

Global exact requirements block (must be followed verbatim):
- Follow D:/CtrlPlus/.github/workflows/ci.yml gates exactly: fast-quality then domain-e2e.
- PR must use D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md sections and include Closes #<issue>.
- Respect .codex/instructions/* architecture constraints: no Prisma in app/** except webhook routes; reads in lib/{domain}/fetchers; writes in lib/{domain}/actions; server-side authz/ownership checks; Zod input validation.
- Apply existing automations only: issue-template labels (bug, enhancement) where applicable; rely on PR labeler domain labels from D:/CtrlPlus/.github/labeler.yml.
- Local validation before handoff: pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm prisma:validate && pnpm build.
- Do not create any new .toml files in D:/CtrlPlus; keep existing .toml deletions untouched.
```

## Issue #221: QA-102 Add `.codex-global-edit/**` ignore coverage for deterministic checks
```text
Implement #221 QA-102 Add `.codex-global-edit/**` ignore coverage for deterministic checks;
summary=Ensure `.codex-global-edit/**` artifacts do not affect lint/format/type pipelines.
project_status=PS1 (Ship-readiness Program #219 OPEN; projectItems unavailable)
deps=none
wave=W1
milestone=MS1
labels=type:infra, domain:ci, codex
assignment=@Codex/@DigitalHerencia/@DigitalHerencia (issue/review/ci)
proposed_pr=branch:codex/221-codex-global-edit-ignore base:main title:[#221] QA-102 Add `.codex-global-edit/**` ignore coverage for deterministic checks closes:#221
execution_lane=scout -> implement -> qa -> review

Global exact requirements block (must be followed verbatim):
- Follow D:/CtrlPlus/.github/workflows/ci.yml gates exactly: fast-quality then domain-e2e.
- PR must use D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md sections and include Closes #<issue>.
- Respect .codex/instructions/* architecture constraints: no Prisma in app/** except webhook routes; reads in lib/{domain}/fetchers; writes in lib/{domain}/actions; server-side authz/ownership checks; Zod input validation.
- Apply existing automations only: issue-template labels (bug, enhancement) where applicable; rely on PR labeler domain labels from D:/CtrlPlus/.github/labeler.yml.
- Local validation before handoff: pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm prisma:validate && pnpm build.
- Do not create any new .toml files in D:/CtrlPlus; keep existing .toml deletions untouched.
```

## Issue #222: QA-103 Add Playwright browser install preflight for CI/local
```text
Implement #222 QA-103 Add Playwright browser install preflight for CI/local;
summary=Guarantee Playwright runs do not fail due to missing browser binaries.
project_status=PS1 (Ship-readiness Program #219 OPEN; projectItems unavailable)
deps=#220, #221
wave=W2
milestone=MS1
labels=type:infra, domain:ci, codex
assignment=@Codex/@DigitalHerencia/@DigitalHerencia (issue/review/ci)
proposed_pr=branch:codex/222-playwright-preflight base:main title:[#222] QA-103 Add Playwright browser install preflight for CI/local closes:#222
execution_lane=scout -> implement -> qa -> review

Global exact requirements block (must be followed verbatim):
- Follow D:/CtrlPlus/.github/workflows/ci.yml gates exactly: fast-quality then domain-e2e.
- PR must use D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md sections and include Closes #<issue>.
- Respect .codex/instructions/* architecture constraints: no Prisma in app/** except webhook routes; reads in lib/{domain}/fetchers; writes in lib/{domain}/actions; server-side authz/ownership checks; Zod input validation.
- Apply existing automations only: issue-template labels (bug, enhancement) where applicable; rely on PR labeler domain labels from D:/CtrlPlus/.github/labeler.yml.
- Local validation before handoff: pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm prisma:validate && pnpm build.
- Do not create any new .toml files in D:/CtrlPlus; keep existing .toml deletions untouched.
```

## Issue #223: QA-104 Replace legacy API-mock E2E tests with App Router/server-action flows
```text
Implement #223 QA-104 Replace legacy API-mock E2E tests with App Router/server-action flows;
summary=Modernize E2E coverage to reflect current App Router + server action behavior.
project_status=PS1 (Ship-readiness Program #219 OPEN; projectItems unavailable)
deps=#222
wave=W3
milestone=MS1
labels=type:test, domain:ci, codex
assignment=@Codex/@DigitalHerencia/@DigitalHerencia (issue/review/ci)
proposed_pr=branch:codex/223-modernize-e2e-flows base:main title:[#223] QA-104 Replace legacy API-mock E2E tests with App Router/server-action flows closes:#223
execution_lane=scout -> implement -> qa -> review

Global exact requirements block (must be followed verbatim):
- Follow D:/CtrlPlus/.github/workflows/ci.yml gates exactly: fast-quality then domain-e2e.
- PR must use D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md sections and include Closes #<issue>.
- Respect .codex/instructions/* architecture constraints: no Prisma in app/** except webhook routes; reads in lib/{domain}/fetchers; writes in lib/{domain}/actions; server-side authz/ownership checks; Zod input validation.
- Apply existing automations only: issue-template labels (bug, enhancement) where applicable; rely on PR labeler domain labels from D:/CtrlPlus/.github/labeler.yml.
- Local validation before handoff: pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm prisma:validate && pnpm build.
- Do not create any new .toml files in D:/CtrlPlus; keep existing .toml deletions untouched.
```

## Issue #224: QA-105 Split CI into `fast-quality` and `domain-e2e` jobs
```text
Implement #224 QA-105 Split CI into `fast-quality` and `domain-e2e` jobs;
summary=Separate fast quality validation from slower browser coverage.
project_status=PS1 (Ship-readiness Program #219 OPEN; projectItems unavailable)
deps=#223, #240, #241, #242, #243
wave=W7
milestone=MS4
labels=type:infra, domain:ci, codex
assignment=@Codex/@DigitalHerencia/@DigitalHerencia (issue/review/ci)
proposed_pr=branch:codex/224-split-ci-jobs base:main title:[#224] QA-105 Split CI into `fast-quality` and `domain-e2e` jobs closes:#224
execution_lane=scout -> implement -> qa -> review

Global exact requirements block (must be followed verbatim):
- Follow D:/CtrlPlus/.github/workflows/ci.yml gates exactly: fast-quality then domain-e2e.
- PR must use D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md sections and include Closes #<issue>.
- Respect .codex/instructions/* architecture constraints: no Prisma in app/** except webhook routes; reads in lib/{domain}/fetchers; writes in lib/{domain}/actions; server-side authz/ownership checks; Zod input validation.
- Apply existing automations only: issue-template labels (bug, enhancement) where applicable; rely on PR labeler domain labels from D:/CtrlPlus/.github/labeler.yml.
- Local validation before handoff: pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm prisma:validate && pnpm build.
- Do not create any new .toml files in D:/CtrlPlus; keep existing .toml deletions untouched.
```

## Issue #225: CAT-101 Gate `WrapImageManager` rendering by capability
```text
Implement #225 CAT-101 Gate `WrapImageManager` rendering by capability;
summary=Only catalog managers (owner/admin capability) can access image-management controls.
project_status=PS1 (Ship-readiness Program #219 OPEN; projectItems unavailable)
deps=none
wave=W3
milestone=MS2
labels=type:security, domain:catalog, scope:frontend, codex
assignment=@Codex/@DigitalHerencia/@DigitalHerencia (issue/review/ci)
proposed_pr=branch:codex/225-gate-wrap-image-manager base:main title:[#225] CAT-101 Gate `WrapImageManager` rendering by capability closes:#225
execution_lane=scout -> implement -> qa -> review -> security

Global exact requirements block (must be followed verbatim):
- Follow D:/CtrlPlus/.github/workflows/ci.yml gates exactly: fast-quality then domain-e2e.
- PR must use D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md sections and include Closes #<issue>.
- Respect .codex/instructions/* architecture constraints: no Prisma in app/** except webhook routes; reads in lib/{domain}/fetchers; writes in lib/{domain}/actions; server-side authz/ownership checks; Zod input validation.
- Apply existing automations only: issue-template labels (bug, enhancement) where applicable; rely on PR labeler domain labels from D:/CtrlPlus/.github/labeler.yml.
- Local validation before handoff: pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm prisma:validate && pnpm build.
- Do not create any new .toml files in D:/CtrlPlus; keep existing .toml deletions untouched.
```

## Issue #226: CAT-102 Build owner/admin catalog management surfaces for wrap/category CRUD
```text
Implement #226 CAT-102 Build owner/admin catalog management surfaces for wrap/category CRUD;
summary=Expose complete owner/admin management UI for wraps, categories, and mappings using existing server actions.
project_status=PS1 (Ship-readiness Program #219 OPEN; projectItems unavailable)
deps=none
wave=W3
milestone=MS2
labels=type:feature, domain:catalog, scope:frontend, codex
assignment=@Codex/@DigitalHerencia/@DigitalHerencia (issue/review/ci)
proposed_pr=branch:codex/226-catalog-manage-crud base:main title:[#226] CAT-102 Build owner/admin catalog management surfaces for wrap/category CRUD closes:#226
execution_lane=scout -> implement -> qa -> review

Global exact requirements block (must be followed verbatim):
- Follow D:/CtrlPlus/.github/workflows/ci.yml gates exactly: fast-quality then domain-e2e.
- PR must use D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md sections and include Closes #<issue>.
- Respect .codex/instructions/* architecture constraints: no Prisma in app/** except webhook routes; reads in lib/{domain}/fetchers; writes in lib/{domain}/actions; server-side authz/ownership checks; Zod input validation.
- Apply existing automations only: issue-template labels (bug, enhancement) where applicable; rely on PR labeler domain labels from D:/CtrlPlus/.github/labeler.yml.
- Local validation before handoff: pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm prisma:validate && pnpm build.
- Do not create any new .toml files in D:/CtrlPlus; keep existing .toml deletions untouched.
```

## Issue #227: CAT-103 Add owner/admin empty-state CTAs into management flows
```text
Implement #227 CAT-103 Add owner/admin empty-state CTAs into management flows;
summary=Guide owners/admins from empty catalog/visualizer states into setup flows.
project_status=PS1 (Ship-readiness Program #219 OPEN; projectItems unavailable)
deps=#226
wave=W4
milestone=MS2
labels=type:feature, domain:catalog, scope:frontend, codex
assignment=@Codex/@DigitalHerencia/@DigitalHerencia (issue/review/ci)
proposed_pr=branch:codex/227-empty-state-ctas base:main title:[#227] CAT-103 Add owner/admin empty-state CTAs into management flows closes:#227
execution_lane=scout -> implement -> qa -> review

Global exact requirements block (must be followed verbatim):
- Follow D:/CtrlPlus/.github/workflows/ci.yml gates exactly: fast-quality then domain-e2e.
- PR must use D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md sections and include Closes #<issue>.
- Respect .codex/instructions/* architecture constraints: no Prisma in app/** except webhook routes; reads in lib/{domain}/fetchers; writes in lib/{domain}/actions; server-side authz/ownership checks; Zod input validation.
- Apply existing automations only: issue-template labels (bug, enhancement) where applicable; rely on PR labeler domain labels from D:/CtrlPlus/.github/labeler.yml.
- Local validation before handoff: pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm prisma:validate && pnpm build.
- Do not create any new .toml files in D:/CtrlPlus; keep existing .toml deletions untouched.
```

## Issue #228: CAT-105 Align internal docs to single-store architecture
```text
Implement #228 CAT-105 Align internal docs to single-store architecture;
summary=Remove stale tenant-scoping guidance and align instructions with single-store runtime.
project_status=PS1 (Ship-readiness Program #219 OPEN; projectItems unavailable)
deps=#226, #227, #234, #237, #238
wave=W7
milestone=MS3
labels=type:docs, domain:catalog, codex
assignment=@Codex/@DigitalHerencia/@DigitalHerencia (issue/review/ci)
proposed_pr=branch:codex/228-single-store-doc-alignment base:main title:[#228] CAT-105 Align internal docs to single-store architecture closes:#228
execution_lane=scout -> implement -> qa -> review

Global exact requirements block (must be followed verbatim):
- Follow D:/CtrlPlus/.github/workflows/ci.yml gates exactly: fast-quality then domain-e2e.
- PR must use D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md sections and include Closes #<issue>.
- Respect .codex/instructions/* architecture constraints: no Prisma in app/** except webhook routes; reads in lib/{domain}/fetchers; writes in lib/{domain}/actions; server-side authz/ownership checks; Zod input validation.
- Apply existing automations only: issue-template labels (bug, enhancement) where applicable; rely on PR labeler domain labels from D:/CtrlPlus/.github/labeler.yml.
- Local validation before handoff: pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm prisma:validate && pnpm build.
- Do not create any new .toml files in D:/CtrlPlus; keep existing .toml deletions untouched.
```

## Issue #229: CAT-104 Implement soft-delete-safe category slug lifecycle
```text
Implement #229 CAT-104 Implement soft-delete-safe category slug lifecycle;
summary=Allow reusing category slugs after soft delete while preserving active uniqueness.
project_status=PS1 (Ship-readiness Program #219 OPEN; projectItems unavailable)
deps=none
wave=W3
milestone=MS2
labels=type:feature, domain:catalog, scope:db, codex
assignment=@Codex/@DigitalHerencia/@DigitalHerencia (issue/review/ci)
proposed_pr=branch:codex/229-soft-delete-slug-lifecycle base:main title:[#229] CAT-104 Implement soft-delete-safe category slug lifecycle closes:#229
execution_lane=scout -> implement -> qa -> review

Global exact requirements block (must be followed verbatim):
- Follow D:/CtrlPlus/.github/workflows/ci.yml gates exactly: fast-quality then domain-e2e.
- PR must use D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md sections and include Closes #<issue>.
- Respect .codex/instructions/* architecture constraints: no Prisma in app/** except webhook routes; reads in lib/{domain}/fetchers; writes in lib/{domain}/actions; server-side authz/ownership checks; Zod input validation.
- Apply existing automations only: issue-template labels (bug, enhancement) where applicable; rely on PR labeler domain labels from D:/CtrlPlus/.github/labeler.yml.
- Local validation before handoff: pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm prisma:validate && pnpm build.
- Do not create any new .toml files in D:/CtrlPlus; keep existing .toml deletions untouched.
```

## Issue #230: DB-201 Evolve wrap asset schema to role-aware metadata
```text
Implement #230 DB-201 Evolve wrap asset schema to role-aware metadata;
summary=Upgrade wrap image schema from generic gallery to role-aware assets.
project_status=PS1 (Ship-readiness Program #219 OPEN; projectItems unavailable)
deps=none
wave=W1
milestone=MS1
labels=type:infra, domain:catalog, scope:db, codex
assignment=@Codex/@DigitalHerencia/@DigitalHerencia (issue/review/ci)
proposed_pr=branch:codex/230-wrap-asset-schema-role-aware base:main title:[#230] DB-201 Evolve wrap asset schema to role-aware metadata closes:#230
execution_lane=scout -> implement -> qa -> review

Global exact requirements block (must be followed verbatim):
- Follow D:/CtrlPlus/.github/workflows/ci.yml gates exactly: fast-quality then domain-e2e.
- PR must use D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md sections and include Closes #<issue>.
- Respect .codex/instructions/* architecture constraints: no Prisma in app/** except webhook routes; reads in lib/{domain}/fetchers; writes in lib/{domain}/actions; server-side authz/ownership checks; Zod input validation.
- Apply existing automations only: issue-template labels (bug, enhancement) where applicable; rely on PR labeler domain labels from D:/CtrlPlus/.github/labeler.yml.
- Local validation before handoff: pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm prisma:validate && pnpm build.
- Do not create any new .toml files in D:/CtrlPlus; keep existing .toml deletions untouched.
```

## Issue #231: DB-202 Backfill wrap image metadata and preserve ordering/publish behavior
```text
Implement #231 DB-202 Backfill wrap image metadata and preserve ordering/publish behavior;
summary=Backfill existing records to maintain published ordering and functional defaults post-schema upgrade.
project_status=PS1 (Ship-readiness Program #219 OPEN; projectItems unavailable)
deps=#230
wave=W2
milestone=MS1
labels=type:infra, domain:catalog, scope:db, codex
assignment=@Codex/@DigitalHerencia/@DigitalHerencia (issue/review/ci)
proposed_pr=branch:codex/231-wrap-image-metadata-backfill base:main title:[#231] DB-202 Backfill wrap image metadata and preserve ordering/publish behavior closes:#231
execution_lane=scout -> implement -> qa -> review

Global exact requirements block (must be followed verbatim):
- Follow D:/CtrlPlus/.github/workflows/ci.yml gates exactly: fast-quality then domain-e2e.
- PR must use D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md sections and include Closes #<issue>.
- Respect .codex/instructions/* architecture constraints: no Prisma in app/** except webhook routes; reads in lib/{domain}/fetchers; writes in lib/{domain}/actions; server-side authz/ownership checks; Zod input validation.
- Apply existing automations only: issue-template labels (bug, enhancement) where applicable; rely on PR labeler domain labels from D:/CtrlPlus/.github/labeler.yml.
- Local validation before handoff: pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm prisma:validate && pnpm build.
- Do not create any new .toml files in D:/CtrlPlus; keep existing .toml deletions untouched.
```

## Issue #232: CAT-201 Replace local filesystem wrap storage with Cloudinary-first adapter
```text
Implement #232 CAT-201 Replace local filesystem wrap storage with Cloudinary-first adapter;
summary=Persist wrap assets to Cloudinary by default with safe local fallback for non-cloud dev contexts.
project_status=PS1 (Ship-readiness Program #219 OPEN; projectItems unavailable)
deps=#230
wave=W3
milestone=MS2
labels=type:infra, domain:catalog, scope:backend, codex
assignment=@Codex/@DigitalHerencia/@DigitalHerencia (issue/review/ci)
proposed_pr=branch:codex/232-cloudinary-first-wrap-storage base:main title:[#232] CAT-201 Replace local filesystem wrap storage with Cloudinary-first adapter closes:#232
execution_lane=scout -> implement -> qa -> review

Global exact requirements block (must be followed verbatim):
- Follow D:/CtrlPlus/.github/workflows/ci.yml gates exactly: fast-quality then domain-e2e.
- PR must use D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md sections and include Closes #<issue>.
- Respect .codex/instructions/* architecture constraints: no Prisma in app/** except webhook routes; reads in lib/{domain}/fetchers; writes in lib/{domain}/actions; server-side authz/ownership checks; Zod input validation.
- Apply existing automations only: issue-template labels (bug, enhancement) where applicable; rely on PR labeler domain labels from D:/CtrlPlus/.github/labeler.yml.
- Local validation before handoff: pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm prisma:validate && pnpm build.
- Do not create any new .toml files in D:/CtrlPlus; keep existing .toml deletions untouched.
```

## Issue #233: VIS-101 Restrict `customerPhotoUrl` to safe trusted sources
```text
Implement #233 VIS-101 Restrict `customerPhotoUrl` to safe trusted sources;
summary=Block arbitrary server-side fetch targets and enforce approved upload source rules.
project_status=PS1 (Ship-readiness Program #219 OPEN; projectItems unavailable)
deps=none
wave=W3
milestone=MS2
labels=type:security, domain:visualizer, scope:backend, codex
assignment=@Codex/@DigitalHerencia/@DigitalHerencia (issue/review/ci)
proposed_pr=branch:codex/233-restrict-customer-photo-url base:main title:[#233] VIS-101 Restrict `customerPhotoUrl` to safe trusted sources closes:#233
execution_lane=scout -> implement -> qa -> review -> security

Global exact requirements block (must be followed verbatim):
- Follow D:/CtrlPlus/.github/workflows/ci.yml gates exactly: fast-quality then domain-e2e.
- PR must use D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md sections and include Closes #<issue>.
- Respect .codex/instructions/* architecture constraints: no Prisma in app/** except webhook routes; reads in lib/{domain}/fetchers; writes in lib/{domain}/actions; server-side authz/ownership checks; Zod input validation.
- Apply existing automations only: issue-template labels (bug, enhancement) where applicable; rely on PR labeler domain labels from D:/CtrlPlus/.github/labeler.yml.
- Local validation before handoff: pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm prisma:validate && pnpm build.
- Do not create any new .toml files in D:/CtrlPlus; keep existing .toml deletions untouched.
```

## Issue #234: CAT-202 Enforce required asset roles before publish
```text
Implement #234 CAT-202 Enforce required asset roles before publish;
summary=Prevent publishing wraps without required visualizer/catalog asset roles.
project_status=PS1 (Ship-readiness Program #219 OPEN; projectItems unavailable)
deps=#226, #230, #231, #232
wave=W4
milestone=MS2
labels=type:feature, domain:catalog, scope:backend, codex
assignment=@Codex/@DigitalHerencia/@DigitalHerencia (issue/review/ci)
proposed_pr=branch:codex/234-enforce-required-asset-roles base:main title:[#234] CAT-202 Enforce required asset roles before publish closes:#234
execution_lane=scout -> implement -> qa -> review

Global exact requirements block (must be followed verbatim):
- Follow D:/CtrlPlus/.github/workflows/ci.yml gates exactly: fast-quality then domain-e2e.
- PR must use D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md sections and include Closes #<issue>.
- Respect .codex/instructions/* architecture constraints: no Prisma in app/** except webhook routes; reads in lib/{domain}/fetchers; writes in lib/{domain}/actions; server-side authz/ownership checks; Zod input validation.
- Apply existing automations only: issue-template labels (bug, enhancement) where applicable; rely on PR labeler domain labels from D:/CtrlPlus/.github/labeler.yml.
- Local validation before handoff: pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm prisma:validate && pnpm build.
- Do not create any new .toml files in D:/CtrlPlus; keep existing .toml deletions untouched.
```

## Issue #235: VIS-102 Enforce owner/user isolation on preview paths
```text
Implement #235 VIS-102 Enforce owner/user isolation on preview paths;
summary=Ensure preview read/update/generate paths are scoped to owning user.
project_status=PS1 (Ship-readiness Program #219 OPEN; projectItems unavailable)
deps=none
wave=W3
milestone=MS2
labels=type:security, domain:visualizer, scope:backend, codex
assignment=@Codex/@DigitalHerencia/@DigitalHerencia (issue/review/ci)
proposed_pr=branch:codex/235-preview-owner-isolation base:main title:[#235] VIS-102 Enforce owner/user isolation on preview paths closes:#235
execution_lane=scout -> implement -> qa -> review -> security

Global exact requirements block (must be followed verbatim):
- Follow D:/CtrlPlus/.github/workflows/ci.yml gates exactly: fast-quality then domain-e2e.
- PR must use D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md sections and include Closes #<issue>.
- Respect .codex/instructions/* architecture constraints: no Prisma in app/** except webhook routes; reads in lib/{domain}/fetchers; writes in lib/{domain}/actions; server-side authz/ownership checks; Zod input validation.
- Apply existing automations only: issue-template labels (bug, enhancement) where applicable; rely on PR labeler domain labels from D:/CtrlPlus/.github/labeler.yml.
- Local validation before handoff: pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm prisma:validate && pnpm build.
- Do not create any new .toml files in D:/CtrlPlus; keep existing .toml deletions untouched.
```

## Issue #236: VIS-103 Include ownership and asset version in preview cache identity
```text
Implement #236 VIS-103 Include ownership and asset version in preview cache identity;
summary=Prevent cross-user or stale-asset cache reuse in visualizer previews.
project_status=PS1 (Ship-readiness Program #219 OPEN; projectItems unavailable)
deps=#235, #230
wave=W4
milestone=MS2
labels=type:security, domain:visualizer, scope:backend, codex
assignment=@Codex/@DigitalHerencia/@DigitalHerencia (issue/review/ci)
proposed_pr=branch:codex/236-preview-cache-identity base:main title:[#236] VIS-103 Include ownership and asset version in preview cache identity closes:#236
execution_lane=scout -> implement -> qa -> review -> security

Global exact requirements block (must be followed verbatim):
- Follow D:/CtrlPlus/.github/workflows/ci.yml gates exactly: fast-quality then domain-e2e.
- PR must use D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md sections and include Closes #<issue>.
- Respect .codex/instructions/* architecture constraints: no Prisma in app/** except webhook routes; reads in lib/{domain}/fetchers; writes in lib/{domain}/actions; server-side authz/ownership checks; Zod input validation.
- Apply existing automations only: issue-template labels (bug, enhancement) where applicable; rely on PR labeler domain labels from D:/CtrlPlus/.github/labeler.yml.
- Local validation before handoff: pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm prisma:validate && pnpm build.
- Do not create any new .toml files in D:/CtrlPlus; keep existing .toml deletions untouched.
```

## Issue #237: VIS-104 Resolve compositing texture from catalog `visualizer_texture` first
```text
Implement #237 VIS-104 Resolve compositing texture from catalog `visualizer_texture` first;
summary=Use catalog-managed visualizer texture assets as authoritative server compositing source.
project_status=PS1 (Ship-readiness Program #219 OPEN; projectItems unavailable)
deps=#230, #231, #232
wave=W4
milestone=MS2
labels=type:feature, domain:visualizer, domain:catalog, scope:backend, codex
assignment=@Codex/@DigitalHerencia/@DigitalHerencia (issue/review/ci)
proposed_pr=branch:codex/237-visualizer-texture-authority base:main title:[#237] VIS-104 Resolve compositing texture from catalog `visualizer_texture` first closes:#237
execution_lane=scout -> implement -> qa -> review

Global exact requirements block (must be followed verbatim):
- Follow D:/CtrlPlus/.github/workflows/ci.yml gates exactly: fast-quality then domain-e2e.
- PR must use D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md sections and include Closes #<issue>.
- Respect .codex/instructions/* architecture constraints: no Prisma in app/** except webhook routes; reads in lib/{domain}/fetchers; writes in lib/{domain}/actions; server-side authz/ownership checks; Zod input validation.
- Apply existing automations only: issue-template labels (bug, enhancement) where applicable; rely on PR labeler domain labels from D:/CtrlPlus/.github/labeler.yml.
- Local validation before handoff: pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm prisma:validate && pnpm build.
- Do not create any new .toml files in D:/CtrlPlus; keep existing .toml deletions untouched.
```

## Issue #238: VIS-105 Remove/gate extra client overlay when processed preview is authoritative
```text
Implement #238 VIS-105 Remove/gate extra client overlay when processed preview is authoritative;
summary=Avoid double-render artifacts by gating client overlay visuals when server-processed output exists.
project_status=PS1 (Ship-readiness Program #219 OPEN; projectItems unavailable)
deps=#237
wave=W5
milestone=MS3
labels=type:refactor, domain:visualizer, scope:frontend, codex
assignment=@Codex/@DigitalHerencia/@DigitalHerencia (issue/review/ci)
proposed_pr=branch:codex/238-gate-client-overlay base:main title:[#238] VIS-105 Remove/gate extra client overlay when processed preview is authoritative closes:#238
execution_lane=scout -> implement -> qa -> review

Global exact requirements block (must be followed verbatim):
- Follow D:/CtrlPlus/.github/workflows/ci.yml gates exactly: fast-quality then domain-e2e.
- PR must use D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md sections and include Closes #<issue>.
- Respect .codex/instructions/* architecture constraints: no Prisma in app/** except webhook routes; reads in lib/{domain}/fetchers; writes in lib/{domain}/actions; server-side authz/ownership checks; Zod input validation.
- Apply existing automations only: issue-template labels (bug, enhancement) where applicable; rely on PR labeler domain labels from D:/CtrlPlus/.github/labeler.yml.
- Local validation before handoff: pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm prisma:validate && pnpm build.
- Do not create any new .toml files in D:/CtrlPlus; keep existing .toml deletions untouched.
```

## Issue #239: VIS-106 Align Hugging Face model lock docs with runtime config
```text
Implement #239 VIS-106 Align Hugging Face model lock docs with runtime config;
summary=Keep model lock contract consistent between documentation and runtime configuration.
project_status=PS1 (Ship-readiness Program #219 OPEN; projectItems unavailable)
deps=#236
wave=W5
milestone=MS3
labels=type:docs, domain:visualizer, codex
assignment=@Codex/@DigitalHerencia/@DigitalHerencia (issue/review/ci)
proposed_pr=branch:codex/239-hf-model-lock-alignment base:main title:[#239] VIS-106 Align Hugging Face model lock docs with runtime config closes:#239
execution_lane=scout -> implement -> qa -> review

Global exact requirements block (must be followed verbatim):
- Follow D:/CtrlPlus/.github/workflows/ci.yml gates exactly: fast-quality then domain-e2e.
- PR must use D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md sections and include Closes #<issue>.
- Respect .codex/instructions/* architecture constraints: no Prisma in app/** except webhook routes; reads in lib/{domain}/fetchers; writes in lib/{domain}/actions; server-side authz/ownership checks; Zod input validation.
- Apply existing automations only: issue-template labels (bug, enhancement) where applicable; rely on PR labeler domain labels from D:/CtrlPlus/.github/labeler.yml.
- Local validation before handoff: pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm prisma:validate && pnpm build.
- Do not create any new .toml files in D:/CtrlPlus; keep existing .toml deletions untouched.
```

## Issue #240: TEST-101 Add unit tests for catalog/visualizer authz boundaries
```text
Implement #240 TEST-101 Add unit tests for catalog/visualizer authz boundaries;
summary=Add targeted unit coverage for owner/admin/customer authorization behavior.
project_status=PS1 (Ship-readiness Program #219 OPEN; projectItems unavailable)
deps=#225, #226, #235
wave=W6
milestone=MS4
labels=type:test, domain:catalog, domain:visualizer, codex
assignment=@Codex/@DigitalHerencia/@DigitalHerencia (issue/review/ci)
proposed_pr=branch:codex/240-unit-authz-boundaries base:main title:[#240] TEST-101 Add unit tests for catalog/visualizer authz boundaries closes:#240
execution_lane=scout -> implement -> qa -> review

Global exact requirements block (must be followed verbatim):
- Follow D:/CtrlPlus/.github/workflows/ci.yml gates exactly: fast-quality then domain-e2e.
- PR must use D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md sections and include Closes #<issue>.
- Respect .codex/instructions/* architecture constraints: no Prisma in app/** except webhook routes; reads in lib/{domain}/fetchers; writes in lib/{domain}/actions; server-side authz/ownership checks; Zod input validation.
- Apply existing automations only: issue-template labels (bug, enhancement) where applicable; rely on PR labeler domain labels from D:/CtrlPlus/.github/labeler.yml.
- Local validation before handoff: pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm prisma:validate && pnpm build.
- Do not create any new .toml files in D:/CtrlPlus; keep existing .toml deletions untouched.
```

## Issue #241: TEST-102 Add security tests for visualizer URL validation and ownership isolation
```text
Implement #241 TEST-102 Add security tests for visualizer URL validation and ownership isolation;
summary=Prove visualizer input safety and cross-user access protections.
project_status=PS1 (Ship-readiness Program #219 OPEN; projectItems unavailable)
deps=#233, #235
wave=W6
milestone=MS4
labels=type:test, type:security, domain:visualizer, codex
assignment=@Codex/@DigitalHerencia/@DigitalHerencia (issue/review/ci)
proposed_pr=branch:codex/241-security-tests-visualizer base:main title:[#241] TEST-102 Add security tests for visualizer URL validation and ownership isolation closes:#241
execution_lane=scout -> implement -> qa -> review -> security

Global exact requirements block (must be followed verbatim):
- Follow D:/CtrlPlus/.github/workflows/ci.yml gates exactly: fast-quality then domain-e2e.
- PR must use D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md sections and include Closes #<issue>.
- Respect .codex/instructions/* architecture constraints: no Prisma in app/** except webhook routes; reads in lib/{domain}/fetchers; writes in lib/{domain}/actions; server-side authz/ownership checks; Zod input validation.
- Apply existing automations only: issue-template labels (bug, enhancement) where applicable; rely on PR labeler domain labels from D:/CtrlPlus/.github/labeler.yml.
- Local validation before handoff: pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm prisma:validate && pnpm build.
- Do not create any new .toml files in D:/CtrlPlus; keep existing .toml deletions untouched.
```

## Issue #242: TEST-103 Add integration tests for asset-role resolution and cache invalidation
```text
Implement #242 TEST-103 Add integration tests for asset-role resolution and cache invalidation;
summary=Validate role-priority texture resolution and cache behavior when assets change.
project_status=PS1 (Ship-readiness Program #219 OPEN; projectItems unavailable)
deps=#230, #231, #234, #236, #237
wave=W6
milestone=MS4
labels=type:test, domain:catalog, domain:visualizer, codex
assignment=@Codex/@DigitalHerencia/@DigitalHerencia (issue/review/ci)
proposed_pr=branch:codex/242-integration-role-cache-tests base:main title:[#242] TEST-103 Add integration tests for asset-role resolution and cache invalidation closes:#242
execution_lane=scout -> implement -> qa -> review

Global exact requirements block (must be followed verbatim):
- Follow D:/CtrlPlus/.github/workflows/ci.yml gates exactly: fast-quality then domain-e2e.
- PR must use D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md sections and include Closes #<issue>.
- Respect .codex/instructions/* architecture constraints: no Prisma in app/** except webhook routes; reads in lib/{domain}/fetchers; writes in lib/{domain}/actions; server-side authz/ownership checks; Zod input validation.
- Apply existing automations only: issue-template labels (bug, enhancement) where applicable; rely on PR labeler domain labels from D:/CtrlPlus/.github/labeler.yml.
- Local validation before handoff: pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm prisma:validate && pnpm build.
- Do not create any new .toml files in D:/CtrlPlus; keep existing .toml deletions untouched.
```

## Issue #243: TEST-104 Add owner/customer E2E journeys for catalog -> visualizer -> scheduling
```text
Implement #243 TEST-104 Add owner/customer E2E journeys for catalog -> visualizer -> scheduling;
summary=Cover core production user flows across desktop and mobile viewport configs.
project_status=PS1 (Ship-readiness Program #219 OPEN; projectItems unavailable)
deps=#223, #226, #227, #234, #233, #235, #236, #237, #238, #244, #245
wave=W6
milestone=MS4
labels=type:test, domain:catalog, domain:visualizer, domain:scheduling, codex
assignment=@Codex/@DigitalHerencia/@DigitalHerencia (issue/review/ci)
proposed_pr=branch:codex/243-owner-customer-e2e-journeys base:main title:[#243] TEST-104 Add owner/customer E2E journeys for catalog -> visualizer -> scheduling closes:#243
execution_lane=scout -> implement -> qa -> review

Global exact requirements block (must be followed verbatim):
- Follow D:/CtrlPlus/.github/workflows/ci.yml gates exactly: fast-quality then domain-e2e.
- PR must use D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md sections and include Closes #<issue>.
- Respect .codex/instructions/* architecture constraints: no Prisma in app/** except webhook routes; reads in lib/{domain}/fetchers; writes in lib/{domain}/actions; server-side authz/ownership checks; Zod input validation.
- Apply existing automations only: issue-template labels (bug, enhancement) where applicable; rely on PR labeler domain labels from D:/CtrlPlus/.github/labeler.yml.
- Local validation before handoff: pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm prisma:validate && pnpm build.
- Do not create any new .toml files in D:/CtrlPlus; keep existing .toml deletions untouched.
```

## Issue #244: UX-101 Add Suspense/loading/skeleton and optimistic UX in interactive flows
```text
Implement #244 UX-101 Add Suspense/loading/skeleton and optimistic UX in interactive flows;
summary=Improve perceived performance and clarity in high-interaction catalog/visualizer surfaces.
project_status=PS1 (Ship-readiness Program #219 OPEN; projectItems unavailable)
deps=none
wave=W5
milestone=MS3
labels=type:feature, scope:frontend, domain:catalog, domain:visualizer, codex
assignment=@Codex/@DigitalHerencia/@DigitalHerencia (issue/review/ci)
proposed_pr=branch:codex/244-suspense-skeleton-optimistic-ux base:main title:[#244] UX-101 Add Suspense/loading/skeleton and optimistic UX in interactive flows closes:#244
execution_lane=scout -> implement -> qa -> review

Global exact requirements block (must be followed verbatim):
- Follow D:/CtrlPlus/.github/workflows/ci.yml gates exactly: fast-quality then domain-e2e.
- PR must use D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md sections and include Closes #<issue>.
- Respect .codex/instructions/* architecture constraints: no Prisma in app/** except webhook routes; reads in lib/{domain}/fetchers; writes in lib/{domain}/actions; server-side authz/ownership checks; Zod input validation.
- Apply existing automations only: issue-template labels (bug, enhancement) where applicable; rely on PR labeler domain labels from D:/CtrlPlus/.github/labeler.yml.
- Local validation before handoff: pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm prisma:validate && pnpm build.
- Do not create any new .toml files in D:/CtrlPlus; keep existing .toml deletions untouched.
```

## Issue #245: UX-102 Migrate raw `<img>` usage to `next/image` where appropriate
```text
Implement #245 UX-102 Migrate raw `<img>` usage to `next/image` where appropriate;
summary=Improve image performance and consistency while preserving intentional exceptions.
project_status=PS1 (Ship-readiness Program #219 OPEN; projectItems unavailable)
deps=none
wave=W5
milestone=MS3
labels=type:refactor, scope:frontend, domain:catalog, domain:visualizer, codex
assignment=@Codex/@DigitalHerencia/@DigitalHerencia (issue/review/ci)
proposed_pr=branch:codex/245-next-image-migration base:main title:[#245] UX-102 Migrate raw `<img>` usage to `next/image` where appropriate closes:#245
execution_lane=scout -> implement -> qa -> review

Global exact requirements block (must be followed verbatim):
- Follow D:/CtrlPlus/.github/workflows/ci.yml gates exactly: fast-quality then domain-e2e.
- PR must use D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md sections and include Closes #<issue>.
- Respect .codex/instructions/* architecture constraints: no Prisma in app/** except webhook routes; reads in lib/{domain}/fetchers; writes in lib/{domain}/actions; server-side authz/ownership checks; Zod input validation.
- Apply existing automations only: issue-template labels (bug, enhancement) where applicable; rely on PR labeler domain labels from D:/CtrlPlus/.github/labeler.yml.
- Local validation before handoff: pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm prisma:validate && pnpm build.
- Do not create any new .toml files in D:/CtrlPlus; keep existing .toml deletions untouched.
```

## Issue #246: REL-101 Publish release checklist + rollback/smoke/monitoring gates in `.codex`
```text
Implement #246 REL-101 Publish release checklist + rollback/smoke/monitoring gates in `.codex`;
summary=Establish explicit ship criteria and rollback readiness for catalog/visualizer rollout.
project_status=PS1 (Ship-readiness Program #219 OPEN; projectItems unavailable)
deps=#224, #243, #248
wave=W8
milestone=MS4
labels=type:docs, domain:ci, codex
assignment=@Codex/@DigitalHerencia/@DigitalHerencia (issue/review/ci)
proposed_pr=branch:codex/246-release-gates-checklist base:main title:[#246] REL-101 Publish release checklist + rollback/smoke/monitoring gates in `.codex` closes:#246
execution_lane=scout -> implement -> qa -> review

Global exact requirements block (must be followed verbatim):
- Follow D:/CtrlPlus/.github/workflows/ci.yml gates exactly: fast-quality then domain-e2e.
- PR must use D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md sections and include Closes #<issue>.
- Respect .codex/instructions/* architecture constraints: no Prisma in app/** except webhook routes; reads in lib/{domain}/fetchers; writes in lib/{domain}/actions; server-side authz/ownership checks; Zod input validation.
- Apply existing automations only: issue-template labels (bug, enhancement) where applicable; rely on PR labeler domain labels from D:/CtrlPlus/.github/labeler.yml.
- Local validation before handoff: pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm prisma:validate && pnpm build.
- Do not create any new .toml files in D:/CtrlPlus; keep existing .toml deletions untouched.
```

## Issue #247: OPS-101 Create and maintain epic/milestone issue structure for ship-readiness
```text
Implement #247 OPS-101 Create and maintain epic/milestone issue structure for ship-readiness;
summary=Maintain a clear execution hierarchy across QA/CAT/DB/VIS/TEST/UX/REL tracks.
project_status=PS1 (Ship-readiness Program #219 OPEN; projectItems unavailable)
deps=none
wave=W0
milestone=MS0
labels=type:infra, domain:ci, codex
assignment=@Codex/@DigitalHerencia/@DigitalHerencia (issue/review/ci)
proposed_pr=branch:codex/247-epic-milestone-structure base:main title:[#247] OPS-101 Create and maintain epic/milestone issue structure for ship-readiness closes:#247
execution_lane=scout -> implement -> qa -> review

Global exact requirements block (must be followed verbatim):
- Follow D:/CtrlPlus/.github/workflows/ci.yml gates exactly: fast-quality then domain-e2e.
- PR must use D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md sections and include Closes #<issue>.
- Respect .codex/instructions/* architecture constraints: no Prisma in app/** except webhook routes; reads in lib/{domain}/fetchers; writes in lib/{domain}/actions; server-side authz/ownership checks; Zod input validation.
- Apply existing automations only: issue-template labels (bug, enhancement) where applicable; rely on PR labeler domain labels from D:/CtrlPlus/.github/labeler.yml.
- Local validation before handoff: pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm prisma:validate && pnpm build.
- Do not create any new .toml files in D:/CtrlPlus; keep existing .toml deletions untouched.
```

## Issue #248: OPS-102 Maintain `.codex` implementation artifacts (roadmap/runbook/matrix/checklist)
```text
Implement #248 OPS-102 Maintain `.codex` implementation artifacts (roadmap/runbook/matrix/checklist);
summary=Keep implementation artifacts current in `.codex` for execution and review.
project_status=PS1 (Ship-readiness Program #219 OPEN; projectItems unavailable)
deps=none
wave=W0
milestone=MS0
labels=type:docs, domain:ci, codex
assignment=@Codex/@DigitalHerencia/@DigitalHerencia (issue/review/ci)
proposed_pr=branch:codex/248-codex-artifact-maintenance base:main title:[#248] OPS-102 Maintain `.codex` implementation artifacts (roadmap/runbook/matrix/checklist) closes:#248
execution_lane=scout -> implement -> qa -> review

Global exact requirements block (must be followed verbatim):
- Follow D:/CtrlPlus/.github/workflows/ci.yml gates exactly: fast-quality then domain-e2e.
- PR must use D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md sections and include Closes #<issue>.
- Respect .codex/instructions/* architecture constraints: no Prisma in app/** except webhook routes; reads in lib/{domain}/fetchers; writes in lib/{domain}/actions; server-side authz/ownership checks; Zod input validation.
- Apply existing automations only: issue-template labels (bug, enhancement) where applicable; rely on PR labeler domain labels from D:/CtrlPlus/.github/labeler.yml.
- Local validation before handoff: pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm prisma:validate && pnpm build.
- Do not create any new .toml files in D:/CtrlPlus; keep existing .toml deletions untouched.
```

## Issue #249: OPS-103 Mirror GitHub execution plan into Notion when MCP is enabled
```text
Implement #249 OPS-103 Mirror GitHub execution plan into Notion when MCP is enabled;
summary=Sync GitHub epic/issues into Notion OKR/roadmap/task/checklist views once Notion MCP is available.
project_status=PS1 (Ship-readiness Program #219 OPEN; projectItems unavailable)
deps=#247, #248
wave=W7
milestone=MS5
labels=type:infra, documentation, codex
assignment=@Codex/@DigitalHerencia/@DigitalHerencia (issue/review/ci)
proposed_pr=branch:codex/249-github-notion-sync base:main title:[#249] OPS-103 Mirror GitHub execution plan into Notion when MCP is enabled closes:#249
execution_lane=scout -> implement -> qa -> review

Global exact requirements block (must be followed verbatim):
- Follow D:/CtrlPlus/.github/workflows/ci.yml gates exactly: fast-quality then domain-e2e.
- PR must use D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md sections and include Closes #<issue>.
- Respect .codex/instructions/* architecture constraints: no Prisma in app/** except webhook routes; reads in lib/{domain}/fetchers; writes in lib/{domain}/actions; server-side authz/ownership checks; Zod input validation.
- Apply existing automations only: issue-template labels (bug, enhancement) where applicable; rely on PR labeler domain labels from D:/CtrlPlus/.github/labeler.yml.
- Local validation before handoff: pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm prisma:validate && pnpm build.
- Do not create any new .toml files in D:/CtrlPlus; keep existing .toml deletions untouched.
```


