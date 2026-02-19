# CTRL+ Design Docs
Version: 1.0.0
Status: Locked
Last Updated: 2026-02-19

## Canonical Files
1. `docs/design/manifest.json`
2. `docs/design/system.tokens.v1.json`
3. `docs/design/visual-system.spec.v1.md`
4. `docs/design/tailwind-v4.contract.v1.md`

## Codex Consumption Order
1. Load `docs/design/manifest.json`.
2. Load `docs/design/system.tokens.v1.json`.
3. Load `docs/design/visual-system.spec.v1.md`.
4. Load `docs/design/tailwind-v4.contract.v1.md`.

## Conflict Rules
1. For literal values (hex, px, font names), `system.tokens.v1.json` is source of truth.
2. For usage constraints and approval criteria, `visual-system.spec.v1.md` is source of truth.
3. For implementation constraints and authoring rules, `tailwind-v4.contract.v1.md` is source of truth.
4. No deviation is allowed without version bump and manifest update.
