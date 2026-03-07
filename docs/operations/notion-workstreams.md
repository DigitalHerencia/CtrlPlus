# Notion Workstreams

CtrlPlus delivery now follows a fixed loop:

`spec -> implement -> verify -> document`

## Workspace Shape

Create a dedicated Notion workspace section for CtrlPlus delivery with two databases.

### `Workstreams`

One row per domain:

- `admin`
- `auth`
- `billing`
- `scheduling`
- `catalog`
- `tenancy`
- `visualizer`

Recommended properties:

- `Domain`
- `Status`
- `Risk`
- `Owner agent/thread`
- `PR link`
- `CI status`
- `Release target`
- `Notes`

Recommended views:

- Kanban by `Status`
- Table grouped by `Domain`
- Timeline by `Release target`
- Blocked view where `Status = Blocked` or `CI status = failing`

### `Tasks`

Many rows, each related to one `Workstream`.

Recommended properties:

- `Workstream` (relation)
- `Scope`
- `Type` (`bug`, `feature`, `security`, `perf`)
- `Test coverage`
- `Definition of done`
- `Reviewer`
- `Link to code location`

## Operating Rules

- Every PR should map back to one `Workstream`.
- Every scoped code change should have a task row before implementation starts.
- CI status in Notion should mirror the current GitHub status, not a manual guess.
- Blocked work must move into the blocked view immediately when CI fails, credentials are missing, or a dependency is unresolved.

## Canva Handoff

Canva is treated as the design-source layer for marketing and visual reference work.

- Link final Canva artifacts from the relevant `Workstream` or `Task`.
- Store implementation-ready notes in Notion, not only in Canva comments.
- For visualizer or admin UI work, attach the final design reference before review starts.
