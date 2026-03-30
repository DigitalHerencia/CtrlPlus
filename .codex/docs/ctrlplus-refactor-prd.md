---
title: CtrlPlus Refactor PRD
version: 1.0
date_created: 2026-03-29
last_updated: 2026-03-29
owner: Codex
tags:
  - prd
  - refactor
  - architecture
---

# Introduction

CtrlPlus needs a durable refactor program that converts the existing server-first architecture intent into an executable, traceable, multi-session plan for `app`, `features`, and `components`.

## 1. Purpose & Scope

This PRD defines the product-level goals for the refactor program itself. The consumers are maintainers and agents working on CtrlPlus. The scope covers architecture normalization, execution tracking, and reusable scaffolding for future work.

## 2. Problem Statement

- The architectural intent exists, but it is mostly stored in large narrative documents.
- The repo lacks machine-consumable contracts for agents to follow consistently.
- The repo lacks durable task and progress state for long-running refactor work.
- Current naming and file placement only partially match the target page/feature/component model.

## 3. Goals

- Create a repo-local scaffold that preserves architecture intent and execution state.
- Define deterministic contracts for route, feature, component, and server boundaries.
- Make large refactor work resumable across sessions and agents.
- Reduce architectural drift during a multi-wave refactor.

## 4. Non-Goals

- This scaffold does not perform the full refactor itself.
- This scaffold does not change runtime behavior by itself.
- This scaffold does not replace repo instructions, tests, or code review.

## 5. Users

- Primary: Codex and other agents operating in this repo
- Secondary: maintainers using the scaffold to plan and review refactor work

## 6. Success Metrics

- Every major refactor wave has a YAML contract and JSON task state.
- Route, feature, and component work can be planned without re-reading the entire external blueprint.
- Agents can identify current state, target state, dependencies, and open decisions from `.codex/**` alone.

## 7. Acceptance Criteria

- A repo-local `.codex` scaffold exists with markdown, YAML, and JSON layers.
- The repo `AGENTS.md` instructs agents to use those layers in a defined order.
- The execution layer contains an initial backlog, progress summary, and decision log for the refactor program.
