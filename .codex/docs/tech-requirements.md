# CtrlPlus Technical Requirements

## Stack constraints

- Next.js App Router
- React 19
- TypeScript
- Clerk auth
- Prisma ORM
- Neon Postgres
- Stripe
- existing repo fetcher/action architecture
- existing shadcn/ui primitives in `components/ui/**`

## Active codex domains

- admin
- auth/authz
- billing
- catalog
- platform
- scheduling
- settings
- visualizer

## Required architectural rules

- no Prisma imports in `app/**`
- reads only through `lib/{domain}/fetchers/**`
- writes only through `lib/{domain}/actions/**`
- thin `app/**` routes that hand off to feature orchestration
- validation contracts live in domain schemas or established validation modules
- auth and ownership checks server-side
- `lib/auth/**` and `lib/authz/**` remain server-boundary concerns, not client concerns
- input validation for all mutations
- Server Components first
- client components only for interactive UI

## Security requirements

- enforce capability and ownership checks server-side
- do not trust client scope identifiers
- validate uploads and external provider inputs
- keep webhook handling idempotent and auditable
- protect sensitive operational actions

## Performance requirements

- avoid duplicate queries and oversized payloads
- prefer targeted revalidation and cache-aware reads
- keep blocking long-running tasks out of critical UI paths when practical
- minimize client state duplication

## UI requirements

- professional, production-ready SaaS quality
- explicit loading, empty, error, success, and denied states
- accessible forms, tables, cards, badges, dialogs, and navigation
- strong information hierarchy

## Catalog-specific technical constraints

- the catalog is the authoritative source for wrap discovery, wrap detail presentation, publish-readiness, and visualizer handoff
- image meaning must be role-driven through `WrapImage.kind`, not raw array ordering
- preserve explicit catalog DTO boundaries for browse, detail, manager, publish-readiness, and visualizer selection flows
- publish-readiness rules must remain server-side and explainable
- hero and visualizer texture selection must be deterministic and exclusive-active for MVP
- customer-visible preview entry points should resolve through `/visualizer?wrapId=...` and server-side wrap validation

## Visualizer-specific technical constraints

- treat the catalog-selected visualizer texture as the authoritative design reference for preview generation
- treat the uploaded vehicle photo as the structural base for generation
- persist original uploads and generated outputs in Cloudinary rather than inline in database rows
- keep Hugging Face image generation behind a dedicated adapter layer with model selection controlled by environment variables
- support `HF_API_KEY`, `HF_IMAGE_TO_IMAGE_MODEL`, and `HF_TIMEOUT_MS`
- implement status-driven preview lifecycle with `pending`, `processing`, `complete`, and `failed`
- provide an automatic fallback composite mode when free HF generation is unavailable or unstable
- keep preview cache keys deterministic across wrap source metadata, normalized vehicle image inputs, generation mode, model, and prompt version

## Provider and storage expectations

- Cloudinary is the system of record for catalog imagery, customer vehicle uploads, and generated preview outputs when the visualizer flow is involved
- Cloudinary folder organization and metadata should preserve wrap id, owner identity, source wrap image id/version, mode, and model where relevant
- external provider assumptions must be encoded in domain docs or prompts rather than scattered across implementation notes

## Testing requirements

At minimum preserve or improve:

- lint
- typecheck
- prisma validate
- build
- unit/integration coverage for changed domain logic
- Playwright domain smoke coverage for affected flows

## Done criteria

Work is complete only when:

- implementation follows repo boundaries
- auth/authz boundaries are preserved server-side
- tests are updated where needed
- CI expectations remain satisfied
- security checklist items in existing PR template remain true
- behavior is documented where contracts or workflows changed
