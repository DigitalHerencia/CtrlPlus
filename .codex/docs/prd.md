# CtrlPlus PRD

## Product goal

Ship CtrlPlus as a professional, production-ready single-store operations platform with strong tenant isolation, clear owner workflows, and reliable domain behavior across admin, auth/authz, catalog, visualizer, scheduling, billing, settings, and platform.

## Core users

- tenant customer
- tenant owner
- platform admin

## Primary outcomes

- users can browse wraps, preview wraps on vehicles, book services, and complete billing flows
- owners can manage wraps, scheduling, settings, and admin workflows confidently
- platform admins can monitor and recover integration/platform issues safely

## Domain goals

### Auth/Authz

- secure sign-in and sign-up flows
- server-authoritative session resolution and role mapping
- strict capability and ownership enforcement across all domains

### Catalog

- professional wrap browsing and management
- deterministic asset roles
- safe publish/hide workflow

### Visualizer

- reliable preview generation
- secure image handling
- clear progress and failure states

### Scheduling

- accurate availability and booking lifecycle
- clean slot reservation and confirmation flow

### Billing

- trustworthy invoice and checkout flow
- server-authoritative payment state

### Admin

- useful owner dashboard and quick actions
- coherent owner-scoped operational visibility without duplicating domain rules

### Settings

- clear current-user or owner-scoped configuration flows
- strong validation, save feedback, and permission boundaries

### Platform

- clear system status
- safe recovery and webhook tooling

## UX goals

- production-ready SaaS quality
- simple navigation
- clear states and validation
- minimal confusion between domains
- admin/owner actions feel intentional and safe

## Non-goals

- multi-organization abstraction redesign
- major auth-provider replacement
- generic marketplace behavior
- visual novelty over operational clarity

## Success criteria

- all domains use consistent fetcher/action boundaries
- auth/authz remains a hard server boundary across every domain
- authz is enforced server-side everywhere
- critical flows have usable loading/error/empty/success states
- CI, tests, and build pass cleanly
- major domain UIs are professional enough to ship without prototype-level roughness
