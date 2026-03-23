---
description: 'Domain instructions for the vehicle visualizer'
applyTo: 'app/(tenant)/visualizer/**,components/visualizer/**,lib/visualizer/**'
---

# Visualizer Domain Instructions

## Domain purpose

The visualizer lets a tenant user choose a visualizer-ready wrap, upload a vehicle image, generate a preview, and view the resulting render.

## Scope boundaries

This domain owns:

- visualizer page orchestration
- upload flow
- preview creation and retrieval
- mask generation and compositing pipeline
- Hugging Face preview generation adapter
- preview caching and storage
- visualizer-specific UI state

This domain does not own:

- catalog CRUD
- billing creation
- scheduling workflows
- platform recovery tooling

## Required patterns

- Keep `app/(tenant)/visualizer/page.tsx` thin.
- Put reads in `lib/visualizer/fetchers/**`.
- Put writes in `lib/visualizer/actions/**`.
- Future refactors should move page composition into `features/visualizer/**`.
- Keep image processing and provider integrations inside `lib/visualizer/**`.
- Keep interactive UI in `components/visualizer/**`.
- Use catalog-backed visualizer selection fetchers rather than reading raw wrap/image lists in the page.

## Security requirements

- Enforce `visualizer.use` capability server-side.
- Never trust client-provided wrap ownership or preview ownership.
- Preview records must be scoped to the authenticated owner/user identity already used by the repo.
- Treat uploaded vehicle images and generated previews as sensitive user content.
- Avoid exposing raw storage internals to the client.
- Harden remote image fetch behavior and MIME/size validation.
- Keep hidden-wrap access restricted to owner/platform admin on the server boundary.

## Product requirements

- Selecting a wrap must use deterministic asset resolution, not incidental image ordering.
- Uploaded photos must not bloat DB rows with large inline payloads.
- Customer-facing selection must exclude wraps that are not visualizer-ready.
- Preview generation must have clear status handling: pending, processing, completed, failed.
- UI must show clear validation, progress, failure, retry, and success states.
- The preview experience must feel fast even if generation is asynchronous.
- Preview generation should reuse cache hits before recomputing.
- Hugging Face generation is primary but must fail fast to deterministic compositing.

## UI requirements

- `VisualizerClient` is the domain shell, not the pipeline implementation.
- `WrapSelector` should present professional catalog-style selection UI.
- `UploadForm` should validate file type, size, and intent before submit.
- `PreviewCanvas` should render final output first and only fall back to temporary preview behavior when necessary.
- Include explicit empty states and recovery paths.
- The catalog handoff path is `/visualizer?wrapId=...`, and the selected wrap should load server-side before the client shell renders.

## Performance requirements

- Do not block the UI on long-running inference if status-based polling is feasible.
- Reuse preview cache keys deterministically.
- Avoid duplicate generation for the same effective input set.
- Prefer storage references over inline base64 strings.
- Cache keys should include normalized vehicle bytes, source wrap image id/version, generation mode/model, and prompt version.
- Preserve room for background processing and signed or short-lived preview delivery called out in `DOMAIN_AUDIT.md`.

## Testing requirements

Add or update tests when changing:

- upload validation
- preview generation behavior
- cache-key behavior
- preview ownership rules
- fallback rendering behavior
- visualizer page happy path and failure path

## Refactor priorities

1. move photo ingestion to durable storage references
2. make preview generation resilient and status-driven
3. unify asset-role resolution across UI and pipeline
4. tighten server-side validation and ownership checks
5. improve visualizer usability and operational clarity
