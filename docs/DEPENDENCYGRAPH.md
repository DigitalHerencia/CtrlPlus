# Dependency Graph & TSDoc / Doxdocgen Guide

This document explains how to make the codebase friendly to the VS Code
Dependency Graph extension (`sz-p.dependencygraph`) and how to generate
useful TSDoc/TSDoc-like comments (e.g., via `cschlosser.doxdocgen`) so
dependency graph nodes show helpful type and function information.

Prerequisites

- VS Code (recommended)
- Extensions (install in VS Code):
    - aaron-bond.better-comments
    - sz-p.dependencygraph
    - cschlosser.doxdocgen

High-level workflow

1.  Ensure exported types and top-level exported functions are documented
    with TSDoc-style comments (/\*_ ... _/). Dependency graph viewers and
    doc generators surface these comments as hover text and node labels.
2.  Use the Doxdocgen extension to generate or improve doc comments where
    appropriate — trigger it from the Command Palette or the editor context
    menu on the symbol you want to document.
3.  Open the Dependency Graph view (Dependency Graph extension) to scan the
    workspace — hover nodes to verify the comment excerpts and type hints.

Quick tips

- Focus on public surface area: `types/*.ts`, `lib/*` fetchers/actions, and
  domain component props. These yield the biggest value in the dependency
  graph and doxdocgen output.
- Keep comments concise but descriptive. One-line summary first, then
  short `@param` / `@returns` blocks for functions.
- Use `better-comments` to visually distinguish TODOs, NOTE, and IMPORTANT
  blocks in code during reviews.

Dependency Graph specific tags

- The `sz-p.dependencygraph` extension looks for file-level tags in top JSDoc
  blocks. To ensure the right-hand details panel shows information, include
  `@introduction` and `@description` in your file header. Example:

```ts
/**
 * @introduction Wrap form UI helper — brief one-line summary
 *
 * @description Provides the shell and layout for wrap editing forms. Keep
 * this short (1–2 sentences). The dependency graph will show the
 * introduction and description in the file info panel.
 * Domain: catalog
 * Public: yes
 */
```

- The extension also extracts function comments, so keep per-export JSDoc
  concise: one-line summary first, then `@param` / `@returns` / `@throws` as
  needed. Including `Domain:` / `Side effects:` / `Requires capability:` lines
  in the JSDoc body is human-friendly and surfaces in the graph panel.

Automated assistance

We provide a simple developer helper script that scans for exported symbols
and suggests TSDoc comment templates. It is intentionally conservative and
defaults to a dry-run so you can review suggestions before applying them.

Usage

```powershell
# dry-run (no edits)
node ./scripts/tsdoc-suggester.js --dry-run

# Review suggestions in scripts/suggestions.json and then run with --apply
node ./scripts/tsdoc-suggester.js --apply
```

Notes and safety

- The suggester is a helper, not a replacement for manual review. It avoids
  complex AST edits and only handles common, simple export patterns.
- Always run tests / typecheck after applying automated edits:

```powershell
pnpm typecheck
pnpm test
```

If you want us to run the suggester and apply suggestions, mention it and
we will perform it as a separate step (keeping changes minimal and reviewable).

Config file

You can persist Dependency Graph settings in `.dependencygraph/setting.json`.
We include a conservative default that points at the Next.js app entry and
adds the `@` alias mapping used in this repo. Example keys the extension
recognizes:

```json
{
  "entry": "app/page.tsx",
  "resolveExtensions": [".ts", ".tsx", ".js", ".jsx"],
  "resolveAlias": [ { "alias": "@", "path": "./" } ]
}
```

After updating comments or the settings file, reload the Dependency Graph
view (or reload the VS Code window) to force a re-scan.
