# Ship-Readiness Inventory (GitHub #219-#249)

_Generated: 2026-03-13 (America/Los_Angeles)_

## Summary
- Keep current `.toml` deletions as-is; do not create any new `.toml` files.
- Source of truth: GitHub MCP + GitHub CLI inventory for 31 open issues (#219-#249).
- Current state observed: 0 assignees, 0 labels, 0 milestones on this issue set.
- GitHub Project item fields are not accessible with current token scope; project status tracked via epic #219 + wave orchestration.

## Global Project and Automation Baseline
- `PS1`: Ship-readiness Program (`#219`), status `OPEN`, project linkage unavailable from current token.
- Issue template automations: template-created issues auto-label as `bug` or `enhancement`.
- PR label automation: [labeler.yml](D:/CtrlPlus/.github/labeler.yml) applies `domain:*` labels by changed paths.
- CI workflow: [ci.yml](D:/CtrlPlus/.github/workflows/ci.yml) requires `fast-quality` then `domain-e2e`.
- PR requirements: [PULL_REQUEST_TEMPLATE.md](D:/CtrlPlus/.github/PULL_REQUEST_TEMPLATE.md) requires `Closes #...`, security checklist, and code quality checklist.

## Milestones (Proposed New)
- `MS0`: Program Setup
- `MS1`: CI + DB Foundation
- `MS2`: Catalog + Security Build
- `MS3`: UX + Visualizer Alignment
- `MS4`: Test + Release Gates
- `MS5`: Ops Sync

## Inventory Table

| # | Title | Summary | Project Status | Milestone (proposed) | Labels (proposed; existing taxonomy) | Assignment (issue/review/ci) | Proposed PR (closes issue) | Orchestration |
|---|---|---|---|---|---|---|---|---|
| 219 | Epic: Ship-readiness for Catalog + Visualizer domains | Deliver catalog and visualizer domains to production-ready quality with secure data handling, role-based management, deterministic CI, and complete owner/customer journeys. | PS1 | MS0 | `type:infra, domain:ci, codex` | @Codex/@DigitalHerencia/@DigitalHerencia | `codex/219-ship-readiness-epic-governance` (`Closes #219`) | W0 (parallel) |
| 220 | QA-101 Add `.codex/**` ignores to ESLint, Prettier, and TypeScript | Add `.codex/**` to lint/format/typecheck ignore surfaces so internal artifacts never fail quality gates. | PS1 | MS1 | `type:infra, domain:ci, codex` | @Codex/@DigitalHerencia/@DigitalHerencia | `codex/220-codex-ignore-surfaces` (`Closes #220`) | W1 (parallel) |
| 221 | QA-102 Add `.codex-global-edit/**` ignore coverage for deterministic checks | Ensure `.codex-global-edit/**` artifacts do not affect lint/format/type pipelines. | PS1 | MS1 | `type:infra, domain:ci, codex` | @Codex/@DigitalHerencia/@DigitalHerencia | `codex/221-codex-global-edit-ignore` (`Closes #221`) | W1 (parallel) |
| 222 | QA-103 Add Playwright browser install preflight for CI/local | Guarantee Playwright runs do not fail due to missing browser binaries. | PS1 | MS1 | `type:infra, domain:ci, codex` | @Codex/@DigitalHerencia/@DigitalHerencia | `codex/222-playwright-preflight` (`Closes #222`) | W2 (after 220/221) |
| 223 | QA-104 Replace legacy API-mock E2E tests with App Router/server-action flows | Modernize E2E coverage to reflect current App Router + server action behavior. | PS1 | MS1 | `type:test, domain:ci, codex` | @Codex/@DigitalHerencia/@DigitalHerencia | `codex/223-modernize-e2e-flows` (`Closes #223`) | W3 (after 222) |
| 224 | QA-105 Split CI into `fast-quality` and `domain-e2e` jobs | Separate fast quality validation from slower browser coverage. | PS1 | MS4 | `type:infra, domain:ci, codex` | @Codex/@DigitalHerencia/@DigitalHerencia | `codex/224-split-ci-jobs` (`Closes #224`) | W7 (after tests) |
| 225 | CAT-101 Gate `WrapImageManager` rendering by capability | Only catalog managers (owner/admin capability) can access image-management controls. | PS1 | MS2 | `type:security, domain:catalog, scope:frontend, codex` | @Codex/@DigitalHerencia/@DigitalHerencia | `codex/225-gate-wrap-image-manager` (`Closes #225`) | W3 (parallel) |
| 226 | CAT-102 Build owner/admin catalog management surfaces for wrap/category CRUD | Expose complete owner/admin management UI for wraps, categories, and mappings using existing server actions. | PS1 | MS2 | `type:feature, domain:catalog, scope:frontend, codex` | @Codex/@DigitalHerencia/@DigitalHerencia | `codex/226-catalog-manage-crud` (`Closes #226`) | W3 (parallel) |
| 227 | CAT-103 Add owner/admin empty-state CTAs into management flows | Guide owners/admins from empty catalog/visualizer states into setup flows. | PS1 | MS2 | `type:feature, domain:catalog, scope:frontend, codex` | @Codex/@DigitalHerencia/@DigitalHerencia | `codex/227-empty-state-ctas` (`Closes #227`) | W4 (after 226) |
| 228 | CAT-105 Align internal docs to single-store architecture | Remove stale tenant-scoping guidance and align instructions with single-store runtime. | PS1 | MS3 | `type:docs, domain:catalog, codex` | @Codex/@DigitalHerencia/@DigitalHerencia | `codex/228-single-store-doc-alignment` (`Closes #228`) | W7 (after CAT/VIS stabilize) |
| 229 | CAT-104 Implement soft-delete-safe category slug lifecycle | Allow reusing category slugs after soft delete while preserving active uniqueness. | PS1 | MS2 | `type:feature, domain:catalog, scope:db, codex` | @Codex/@DigitalHerencia/@DigitalHerencia | `codex/229-soft-delete-slug-lifecycle` (`Closes #229`) | W3 (parallel) |
| 230 | DB-201 Evolve wrap asset schema to role-aware metadata | Upgrade wrap image schema from generic gallery to role-aware assets. | PS1 | MS1 | `type:infra, domain:catalog, scope:db, codex` | @Codex/@DigitalHerencia/@DigitalHerencia | `codex/230-wrap-asset-schema-role-aware` (`Closes #230`) | W1 (parallel) |
| 231 | DB-202 Backfill wrap image metadata and preserve ordering/publish behavior | Backfill existing records to maintain published ordering and functional defaults post-schema upgrade. | PS1 | MS1 | `type:infra, domain:catalog, scope:db, codex` | @Codex/@DigitalHerencia/@DigitalHerencia | `codex/231-wrap-image-metadata-backfill` (`Closes #231`) | W2 (after 230) |
| 232 | CAT-201 Replace local filesystem wrap storage with Cloudinary-first adapter | Persist wrap assets to Cloudinary by default with safe local fallback for non-cloud dev contexts. | PS1 | MS2 | `type:infra, domain:catalog, scope:backend, codex` | @Codex/@DigitalHerencia/@DigitalHerencia | `codex/232-cloudinary-first-wrap-storage` (`Closes #232`) | W3 (after 230) |
| 233 | VIS-101 Restrict `customerPhotoUrl` to safe trusted sources | Block arbitrary server-side fetch targets and enforce approved upload source rules. | PS1 | MS2 | `type:security, domain:visualizer, scope:backend, codex` | @Codex/@DigitalHerencia/@DigitalHerencia | `codex/233-restrict-customer-photo-url` (`Closes #233`) | W3 (parallel) |
| 234 | CAT-202 Enforce required asset roles before publish | Prevent publishing wraps without required visualizer/catalog asset roles. | PS1 | MS2 | `type:feature, domain:catalog, scope:backend, codex` | @Codex/@DigitalHerencia/@DigitalHerencia | `codex/234-enforce-required-asset-roles` (`Closes #234`) | W4 (after 226/230/231/232) |
| 235 | VIS-102 Enforce owner/user isolation on preview paths | Ensure preview read/update/generate paths are scoped to owning user. | PS1 | MS2 | `type:security, domain:visualizer, scope:backend, codex` | @Codex/@DigitalHerencia/@DigitalHerencia | `codex/235-preview-owner-isolation` (`Closes #235`) | W3 (parallel) |
| 236 | VIS-103 Include ownership and asset version in preview cache identity | Prevent cross-user or stale-asset cache reuse in visualizer previews. | PS1 | MS2 | `type:security, domain:visualizer, scope:backend, codex` | @Codex/@DigitalHerencia/@DigitalHerencia | `codex/236-preview-cache-identity` (`Closes #236`) | W4 (after 235/230) |
| 237 | VIS-104 Resolve compositing texture from catalog `visualizer_texture` first | Use catalog-managed visualizer texture assets as authoritative server compositing source. | PS1 | MS2 | `type:feature, domain:visualizer, domain:catalog, scope:backend, codex` | @Codex/@DigitalHerencia/@DigitalHerencia | `codex/237-visualizer-texture-authority` (`Closes #237`) | W4 (after 230/231/232) |
| 238 | VIS-105 Remove/gate extra client overlay when processed preview is authoritative | Avoid double-render artifacts by gating client overlay visuals when server-processed output exists. | PS1 | MS3 | `type:refactor, domain:visualizer, scope:frontend, codex` | @Codex/@DigitalHerencia/@DigitalHerencia | `codex/238-gate-client-overlay` (`Closes #238`) | W5 (after 237) |
| 239 | VIS-106 Align Hugging Face model lock docs with runtime config | Keep model lock contract consistent between documentation and runtime configuration. | PS1 | MS3 | `type:docs, domain:visualizer, codex` | @Codex/@DigitalHerencia/@DigitalHerencia | `codex/239-hf-model-lock-alignment` (`Closes #239`) | W5 (after 236) |
| 240 | TEST-101 Add unit tests for catalog/visualizer authz boundaries | Add targeted unit coverage for owner/admin/customer authorization behavior. | PS1 | MS4 | `type:test, domain:catalog, domain:visualizer, codex` | @Codex/@DigitalHerencia/@DigitalHerencia | `codex/240-unit-authz-boundaries` (`Closes #240`) | W6 (after 225/226/235) |
| 241 | TEST-102 Add security tests for visualizer URL validation and ownership isolation | Prove visualizer input safety and cross-user access protections. | PS1 | MS4 | `type:test, type:security, domain:visualizer, codex` | @Codex/@DigitalHerencia/@DigitalHerencia | `codex/241-security-tests-visualizer` (`Closes #241`) | W6 (after 233/235) |
| 242 | TEST-103 Add integration tests for asset-role resolution and cache invalidation | Validate role-priority texture resolution and cache behavior when assets change. | PS1 | MS4 | `type:test, domain:catalog, domain:visualizer, codex` | @Codex/@DigitalHerencia/@DigitalHerencia | `codex/242-integration-role-cache-tests` (`Closes #242`) | W6 (after 230/231/234/236/237) |
| 243 | TEST-104 Add owner/customer E2E journeys for catalog -> visualizer -> scheduling | Cover core production user flows across desktop and mobile viewport configs. | PS1 | MS4 | `type:test, domain:catalog, domain:visualizer, domain:scheduling, codex` | @Codex/@DigitalHerencia/@DigitalHerencia | `codex/243-owner-customer-e2e-journeys` (`Closes #243`) | W6 (after W3-W5 features) |
| 244 | UX-101 Add Suspense/loading/skeleton and optimistic UX in interactive flows | Improve perceived performance and clarity in high-interaction catalog/visualizer surfaces. | PS1 | MS3 | `type:feature, scope:frontend, domain:catalog, domain:visualizer, codex` | @Codex/@DigitalHerencia/@DigitalHerencia | `codex/244-suspense-skeleton-optimistic-ux` (`Closes #244`) | W5 (parallel) |
| 245 | UX-102 Migrate raw `<img>` usage to `next/image` where appropriate | Improve image performance and consistency while preserving intentional exceptions. | PS1 | MS3 | `type:refactor, scope:frontend, domain:catalog, domain:visualizer, codex` | @Codex/@DigitalHerencia/@DigitalHerencia | `codex/245-next-image-migration` (`Closes #245`) | W5 (parallel) |
| 246 | REL-101 Publish release checklist + rollback/smoke/monitoring gates in `.codex` | Establish explicit ship criteria and rollback readiness for catalog/visualizer rollout. | PS1 | MS4 | `type:docs, domain:ci, codex` | @Codex/@DigitalHerencia/@DigitalHerencia | `codex/246-release-gates-checklist` (`Closes #246`) | W8 (final gate) |
| 247 | OPS-101 Create and maintain epic/milestone issue structure for ship-readiness | Maintain a clear execution hierarchy across QA/CAT/DB/VIS/TEST/UX/REL tracks. | PS1 | MS0 | `type:infra, domain:ci, codex` | @Codex/@DigitalHerencia/@DigitalHerencia | `codex/247-epic-milestone-structure` (`Closes #247`) | W0 (parallel) |
| 248 | OPS-102 Maintain `.codex` implementation artifacts (roadmap/runbook/matrix/checklist) | Keep implementation artifacts current in `.codex` for execution and review. | PS1 | MS0 | `type:docs, domain:ci, codex` | @Codex/@DigitalHerencia/@DigitalHerencia | `codex/248-codex-artifact-maintenance` (`Closes #248`) | W0 (parallel, continuous) |
| 249 | OPS-103 Mirror GitHub execution plan into Notion when MCP is enabled | Sync GitHub epic/issues into Notion OKR/roadmap/task/checklist views once Notion MCP is available. | PS1 | MS5 | `type:infra, documentation, codex` | @Codex/@DigitalHerencia/@DigitalHerencia | `codex/249-github-notion-sync` (`Closes #249`) | W7 (after 247/248 + Notion MCP) |

## Wave Execution Plan
- `W0`: #219, #247, #248
- `W1`: #220, #221, #230
- `W2`: #222, #231
- `W3`: #223, #225, #226, #229, #232, #233, #235
- `W4`: #227, #234, #236, #237
- `W5`: #238, #239, #244, #245
- `W6`: #240, #241, #242, #243
- `W7`: #224, #228, #249
- `W8`: #246

Critical path: `#219 -> #220/#221 -> #222 -> #223 -> #226 -> #234 -> #243 -> #224 -> #246`

