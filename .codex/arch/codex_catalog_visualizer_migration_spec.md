---
title: Catalog Visualizer Migration Spec
status: Draft
owner: Codex
last_updated: 2026-03-29
---

# Catalog Visualizer Migration Spec

This spec defines the shared refactor boundary between the catalog storefront and the visualizer preview flow.

## Shared Contract

- Catalog owns wrap discovery, wrap detail, asset intent, and visualizer selection eligibility.
- Visualizer owns vehicle upload, preview generation, preview polling, and preview review.
- The handoff remains `/visualizer?wrapId=...` with server-side wrap validation.

## Migration Priorities

1. Keep catalog asset meaning explicit and deterministic.
2. Keep visualizer generation status-driven and server-authoritative.
3. Avoid collapsing catalog and visualizer into a single overloaded feature layer.

## Acceptance

- Catalog continues to decide which wraps are eligible for visualizer selection.
- Visualizer continues to operate on server-validated wrap and upload inputs.
- Shared contracts remain documented in markdown, YAML, and JSON as the program evolves.
