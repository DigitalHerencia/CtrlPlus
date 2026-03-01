# Design System Contract

Version: 1.0.0
Status: Locked

## Canonical Design Files

1. `.codex/manifests/design/manifest.json`
2. `.codex/docs/61-design-tokens.json`
3. `.codex/docs/60-design-system.md`
4. `app/globals.css`

## Codex Consumption Order

1. Load `.codex/manifests/design/manifest.json`.
2. Load `.codex/docs/61-design-tokens.json`.
3. Apply rules in `.codex/docs/60-design-system.md`.
4. Validate implementation in `app/globals.css`.

## Visual Identity Rules

- Location context: El Paso, Texas.
- No gradients.
- No drop shadows.
- No bevel/emboss effects.
- Flat-color rendering only.

## Typography Rules

- Primary font: `Inter Tight`.
- Headline style: uppercase, weight `700`, tight tracking.
- Avoid serif and decorative font substitutions.

## Layout Rules

- Left-side copy block, right-side framed media block.
- Frame defaults: `2px` border, `18px` radius, `40px` top bar.
- Minimal control styling; no visual effects requiring gradients/shadows.

## Vehicle and Context Rules

Allowed vehicle set includes common production and fleet vehicles only.

Prohibited contexts include luxury showroom and supercar campaign aesthetics.

Wrap visuals must show clear wrap material characteristics (panel seams, edge transitions, matte/gloss differentiation, or geometric graphic transitions).

## Tailwind v4 Authoring Contract

- Tailwind v4 CSS-first mode is required.
- Canonical global stylesheet is `app/globals.css`.
- Do not add `tailwind.config.*` files.
- Define theme tokens via `@theme` in `app/globals.css`.
- Define content scanning via `@source` directives in `app/globals.css`.
- Avoid duplicate global style files for UI styling.

## Change Control

Any design-system change requires:

1. Token/spec updates.
2. Manifest path/version update.
3. Verification that `app/globals.css` remains aligned.
