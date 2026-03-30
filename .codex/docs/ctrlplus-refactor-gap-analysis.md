---
title: CtrlPlus Refactor Gap Analysis
version: 1.0
date_created: 2026-03-29
last_updated: 2026-03-29
owner: Codex
tags:
  - gap-analysis
  - refactor
  - architecture
---

# Introduction

This file records the structural gaps between the live repo and the target server-first blueprint.

## Current vs Target

| Area | Current State | Target State | Gap |
|------|---------------|--------------|-----|
| `.codex` | only profile script exists | full doc, contract, and execution scaffold | no durable agent resources |
| `app/**` | route groups exist and are mostly thin | thin page-only route layer with explicit conventions | route naming and param naming need normalization plan |
| `features/**` | per-domain feature files exist | page features plus explicit client containers | naming and granularity are inconsistent |
| `components/**` | strong domain split exists | pure UI blocks only | some naming implies workflow ownership rather than pure presentation |
| `lib/**` | already close to target | keep as server authority | lowest-risk area; mostly contract documentation needed |

## Specific Friction Points

- `billing` is the live domain name while the source blueprint sometimes refers to `invoices`.
- Route params such as `catalog/[id]` are less expressive than the target `catalog/[wrapId]`.
- Existing feature file names such as `visualizer-workspace-client.tsx` and `catalog-manager-client.tsx` do not consistently use the `.client.tsx` suffix pattern from the blueprint.
- Existing components such as `WrapCard.tsx`, `CheckoutButton.tsx`, and `PreviewCanvas.tsx` mix naming styles.

## Refactor Implications

- The first refactor step should define naming and ownership contracts before moving files.
- Billing route and domain naming needs an explicit decision before broad renames.
- Feature extraction should be sequenced before component re-homing so orchestration and presentation do not move at the same time.
