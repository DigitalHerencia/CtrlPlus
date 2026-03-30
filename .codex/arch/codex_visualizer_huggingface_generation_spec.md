---
title: Visualizer Hugging Face Generation Spec
status: Draft
owner: Codex
last_updated: 2026-03-29
---

# Visualizer Hugging Face Generation Spec

This spec captures the provider-specific constraints that matter during visualizer refactor work.

## Provider Boundary

- Hugging Face generation remains behind a dedicated adapter boundary.
- The client must not own model selection, provider credentials, or fallback logic.
- Storage persistence remains durable and traceable through server-managed metadata.

## Preview Rules

- The visualizer texture selected from catalog assets is the authoritative design reference.
- The uploaded vehicle image is the structural base for generation.
- Fallback preview generation remains required when external inference is unavailable or unstable.

## Refactor Guidance

- Preserve preview lifecycle state through DTOs and fetchers.
- Keep provider requests, timeouts, and retries inside server-side integration layers.
- Keep UI optimistic behavior bounded to status display rather than fake synchronous completion.
