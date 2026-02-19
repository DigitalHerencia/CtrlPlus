# CTRL+ Tailwind v4 Contract
Version: 1.0.0
Status: Locked
Intended Consumers: Frontend Engineers, Codex / GPT Coding Agents

## 1. Toolchain Rules
- Tailwind version must be `v4+`.
- PostCSS integration must use `@tailwindcss/postcss` in `postcss.config.mjs`.
- The canonical Tailwind entry file is `app/globals.css`.

## 2. Configuration Mode
- Use CSS-first Tailwind configuration only.
- Do not use `tailwind.config.js`, `tailwind.config.ts`, `tailwind.config.cjs`, or `tailwind.config.mjs`.
- Define theme tokens in `@theme` inside `app/globals.css`.
- Define content scanning paths with `@source` directives inside `app/globals.css`.

## 3. Styling Authoring Rules
- Prefer Tailwind utility classes in JSX/TSX.
- Keep shared semantic classes in `@layer components` within `app/globals.css`.
- Keep base element resets in `app/globals.css`.
- Do not introduce additional global stylesheet files for UI styling.

## 4. File Constraints
- Allowed global styling file: `app/globals.css`.
- Allowed design docs root: `docs/design/`.
- Any new design token source must be versioned and referenced from `docs/design/manifest.json`.

## 5. Prohibited Setup
- No duplicate design-system CSS files.
- No parallel token sources outside `docs/design/`.
- No Tailwind v3 directives (`@tailwind base`, `@tailwind components`, `@tailwind utilities`).

## 6. Codex Execution Checklist
1. Load `docs/design/manifest.json`.
2. Validate `app/globals.css` includes `@import "tailwindcss";`.
3. Validate `app/globals.css` includes required `@source` directives.
4. Validate tokens in `@theme` match `docs/design/system.tokens.v1.json`.
5. Run `pnpm build` before completion.
