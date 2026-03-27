# App Router route boundaries & file conventions (short guide)

This document lists the recommended App Router route boundary files and where to add them in this repo.

Key files per route segment

- `loading.tsx` — route-level initial skeleton (server component)
- `error.tsx` — route-level resettable error boundary (client component with `unstable_retry`)
- `not-found.tsx` — route-level friendly 404 UI (server component)
- `layout.tsx` — segment layout and server-side guards

Guidelines

- Keep `page.tsx` thin: normalize `params` and `searchParams` and hand off to `features/*` orchestration components.
- Put reads inside `lib/*/fetchers` and writes inside `lib/*/actions`.
- Use `loading.tsx` whenever the first-load experience benefits from a skeleton.
- Use `error.tsx` where a segment can be retried independently.
- Use `notFound()` in features when a resource truly must exist and complement with `not-found.tsx` for a friendly UI.
- When introducing `use cache` (Cache Components), never call dynamic APIs (`auth()`, `cookies()`, `headers()`) inside a cached function; call them outside and pass stable args in.

Examples in this repo

- Global fallbacks: `app/loading.tsx`, `app/error.tsx`, `app/not-found.tsx`
- Tenant segment skeleton: `app/(tenant)/catalog/loading.tsx`, `app/(tenant)/catalog/error.tsx`, `app/(tenant)/catalog/not-found.tsx`

Testing

- Add unit tests that assert `not-found` behavior and API route semantics (404 on missing resources).
- Mock server helpers (`getSession`, fetchers) when testing server components that perform redirects.
