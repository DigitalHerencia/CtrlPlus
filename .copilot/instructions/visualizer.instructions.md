---
description: "Domain instructions for the vehicle visualizer"
applyTo: "app/(tenant)/visualizer/**,components/visualizer/**,lib/visualizer/**"
---

# Visualizer Domain Instructions

## Domain purpose

The visualizer lets a tenant user choose a wrap, upload or select a vehicle image, generate a preview, and view the resulting render.

## Scope boundaries

This domain owns:

- visualizer page orchestration
- upload flow
- preview creation and retrieval
- mask generation and compositing pipeline
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
- Keep image processing and provider integrations inside `lib/visualizer/**`.
- Keep interactive UI in `components/visualizer/**`.

## Security requirements

- Enforce `visualizer.use` capability server-side.
- Never trust client-provided wrap ownership or preview ownership.
- Preview records must be scoped to the authenticated owner/user identity already used by the repo.
- Treat uploaded vehicle images and generated previews as sensitive user content.
- Avoid exposing raw storage internals to the client.
- Harden remote image fetch behavior and MIME/size validation.

## Product requirements

- Selecting a wrap must use deterministic asset resolution, not incidental image ordering.
- Uploaded photos must not bloat DB rows with large inline payloads.
- Preview generation must have clear status handling: pending, processing, completed, failed.
- UI must show clear validation, progress, failure, retry, and success states.
- The preview experience must feel fast even if generation is asynchronous.

## UI requirements

- `VisualizerClient` is the domain shell, not the pipeline implementation.
- `WrapSelector` should present professional catalog-style selection UI.
- `UploadForm` should validate file type, size, and intent before submit.
- `PreviewCanvas` should render final output first and only fall back to temporary preview behavior when necessary.
- Include explicit empty states and recovery paths.

## Performance requirements

- Do not block the UI on long-running inference if status-based polling is feasible.
- Reuse preview cache keys deterministically.
- Avoid duplicate generation for the same effective input set.
- Prefer storage references over inline base64 strings.

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
