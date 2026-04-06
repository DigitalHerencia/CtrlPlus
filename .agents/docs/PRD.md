## Purpose

Define product intent for CtrlPlus: who the platform serves, what outcomes it must
deliver, and what is explicitly out of scope. This document is an intent layer and
does not define implementation constraints.

## Product vision

CtrlPlus is a secure, server-first operations platform for a single wrap shop that
unifies storefront, preview generation, scheduling, billing, settings, and admin
operations in one maintainable system.

## Product goals

- Deliver a professional storefront and internal operations experience.
- Enable reference-guided visualizer previews from a user vehicle upload plus
  catalog `hero` and `gallery` reference assets.
- Keep scheduling and billing lifecycles correct, auditable, and operator-friendly.
- Maintain high trust through strong security posture and operational reliability.

## Non-goals

- Manufacturing-grade physical simulation of real-world wrap outcomes.
- Client-authoritative decisions for identity, ownership, role, or billing scope.
- Unbounded cross-domain coupling that weakens maintainability.

## Personas and jobs-to-be-done

### Owner / Admin

- Curate and publish catalog inventory.
- Execute scheduling and billing workflows without context switching.
- Maintain day-to-day service throughput with low operational friction.

### Customer

- Discover wraps quickly.
- Generate a concept preview from a vehicle image.
- Book installation and complete payment with confidence.

### Platform operator / developer

- Keep integrations, reliability, and diagnostics healthy.
- Evolve the platform safely with clear boundaries and traceability.

## Domain outcomes

### Catalog

- Wraps are discoverable with clear media semantics.
- Publish state reflects readiness and policy.

### Visualizer

- Preview requests are traceable through explicit lifecycle states.
- User uploads and generated previews remain owner-scoped and server-delivered.
- Output quality degrades gracefully when external inference is unstable.

### Scheduling

- Availability and booking transitions are predictable and auditable.

### Billing

- Invoice and payment states are accurate and resilient to webhook timing/order.

### Settings, admin, platform

- User/shop preferences are reliable.
- Privileged actions remain controlled, observable, and reviewable.

## Critical product stories

### Publish a wrap confidently

- Owner can publish only when required inputs are complete.
- Catalog browse surfaces reflect publish state consistently.

### Generate a preview with clear status

- Customer can submit preview request from a valid wrap selection.
- Status transitions are transparent (`pending`, `processing`, `complete`, `failed`).

### Execute secure write operations

- Sensitive writes are authenticated, authorized, validated, and auditable.

## Product success signals

- Faster path from draft wrap to published wrap.
- Higher preview completion rate and lower failed preview ratio.
- No cross-user data exposure incidents.
- Reduced scheduling and billing turnaround time.

## Related intent documents

- `ARCHITECTURE.md` for system design intent.
- `TECHNOLOGY-REQUIREMENTS.md` for stack and tooling intent.
- `DATA-MODEL.md` for persistence intent.
- `ROADMAP.md` for phased delivery intent.
