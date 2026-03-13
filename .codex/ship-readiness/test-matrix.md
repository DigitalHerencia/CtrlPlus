# Test Matrix

## Unit
- Catalog action authz: create/update/delete wrap, category mapping, image operations.
- Visualizer action authz and ownership isolation.
- Visualizer URL-source validation and cache-key isolation.

## Integration
- Catalog asset-role resolution (`hero`, `visualizer_texture`, optional hints).
- Visualizer pipeline source selection and fallback behavior.
- Category soft-delete slug reuse semantics.

## E2E
- Public/auth redirects.
- Owner flow: manage catalog assets + categories.
- Customer flow: browse catalog -> visualizer -> scheduling handoff.

## CI Gates
- Fast quality: format/lint/typecheck/unit/prisma validate.
- Domain e2e: Playwright browsers installed, route-aligned smoke tests.
