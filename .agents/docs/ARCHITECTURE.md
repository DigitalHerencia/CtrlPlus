## Purpose

Describe the architecture intent for CtrlPlus and the responsibilities of each
layer. This document explains the target shape of the system; execution rules are
defined in `.agents/contracts/*` and interpreted in `.agents/instructions/*`.

## System design summary

CtrlPlus uses a server-first Next.js App Router architecture where routes are thin,
domain logic is explicit, and security boundaries are enforced at server entry points.

## Architectural intent by layer

### Route orchestration (`app/**`)

- Define route structure, layouts, loading/error UX, and segment composition.
- Keep page surfaces thin and delegate non-trivial logic to feature/server layers.

### Feature composition (`features/**`)

- Assemble domain views and interaction flows.
- Bridge route-level intent with domain UI and server capabilities.

### Presentation (`components/**`, `components/ui/**`)

- Render reusable domain and primitive UI.
- Keep data ownership and mutation authority out of UI-only components.

### Server authority (`lib/**`)

- `lib/fetchers/**`: read orchestration and DTO shaping.
- `lib/actions/**`: write orchestration and mutation lifecycle.
- `lib/auth/**`, `lib/authz/**`: identity and capability decisions.
- `lib/db/**`, `lib/cache/**`, `lib/integrations/**`, `lib/uploads/**`: persistence,
  caching, integration, and media operations.

### Contracts and schemas (`types/**`, `schemas/**`)

- `types/**` captures domain DTO contracts.
- `schemas/**` captures runtime validation intent.

## Cross-domain architectural principles

- Catalog is source of truth for wrap product and asset semantics.
- Catalog wrap storefront imagery persists as Cloudinary-backed media with authority
  fields stored on catalog assets.
- Catalog hands the visualizer an explicit reference set built from active `hero`
  and `gallery` assets only.
- Visualizer owns owner-scoped uploads, preview generation lifecycle, and preview
  output traceability.
- Visualizer preview delivery remains server-authoritative through signed
  application routes that redirect to authenticated Cloudinary assets.
- Scheduling owns availability and booking state progression.
- Billing owns invoice/payment lifecycle with integration resiliency.
- Admin/platform own privileged operations and diagnostics.

## Visualizer pipeline intent

- Treat the visualizer as reference-guided image editing, not texture-only synthesis
  and not pure text-to-image generation.
- The base image is the authenticated, owner-scoped visualizer upload.
- Catalog reference imagery is composed from the selected wrap's active `hero` plus
  zero or more active `gallery` images.
- Provider-specific conditioning details belong in `lib/integrations/**` and
  `lib/visualizer/**`; they must not leak into catalog DTOs or route parameters.
- Generated previews are persisted as authenticated Cloudinary assets with stable
  authority fields stored in the database.

## Security and reliability intent

- Keep authentication and authorization server-side.
- Assume client input is untrusted for scope/ownership assertions.
- Favor explicit state transitions and auditable mutation outcomes.
- Do not treat raw `secure_url` values as a privacy boundary for visualizer media.
- Issue short-lived signed application URLs for upload and preview access.

## Caching and responsiveness intent

- Favor server-managed caching in read paths.
- Keep invalidation strategy aligned with mutation boundaries.
- Design route and component composition for progressive rendering.

## Change intent

Architectural changes should preserve:

- Thin route orchestration.
- Stable domain boundaries.
- Server-authoritative read/write control.
- Clear separation between intent, interpretation, execution, and reporting layers.

## Related files

- Product intent: `PRD.md`
- Stack and tooling intent: `TECHNOLOGY-REQUIREMENTS.md`
- Persistence intent: `DATA-MODEL.md`
- Delivery intent: `ROADMAP.md`
