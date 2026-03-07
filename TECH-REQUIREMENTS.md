# CtrlPlus Technical Requirements

The detailed technical specification lives in [`.github/instructions/TECH-REQUIREMENTS.md`](./.github/instructions/TECH-REQUIREMENTS.md).

This top-level document exists so public repository links resolve correctly and contributors have a stable entry point.

## Non-Negotiables

- No Prisma imports in `app/**` outside the allowed webhook handlers.
- All tenant-owned queries must stay scoped by `tenantId` and soft-delete filters where applicable.
- `tenantId` is resolved server-side from request context, never from client input.
- Mutations follow `Auth -> Authorize -> Validate -> Mutate -> Audit`.
- Fetchers return explicit DTOs instead of raw Prisma models.

## Operational Extensions

- Release workflow, Notion planning structure, and ship checklist are documented in [`OPERATIONS.md`](./OPERATIONS.md).
- Visualizer model-selection and Hugging Face evaluation guidance for v1 are also documented in [`OPERATIONS.md`](./OPERATIONS.md).
