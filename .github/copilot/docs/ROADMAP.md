## Roadmap purpose

This roadmap defines phased priorities for evolving CtrlPlus into a more
production-ready, domain-consistent platform.

## Planning principles

- Prioritize security and correctness before UX polish.
- Keep work domain-bounded and incrementally shippable.
- Validate each phase with lint, type, build, and test gates.

## Phase 1: Foundation hardening

### Objectives

- Enforce server-first boundaries across active domains.
- Remove remaining boundary leaks and inconsistent data access paths.
- Normalize schema/action/fetcher validation patterns.

### Milestones

- Reads and writes consistently routed through canonical `lib` boundaries.
- Zod validation coverage for all critical mutations.
- Auth/authz checks verified for tenant-sensitive flows.

## Phase 2: Catalog and visualizer reliability

### Objectives

- Complete wrap asset-role normalization across UI and pipeline.
- Improve preview generation lifecycle resilience and status handling.
- Strengthen media handling and persistence contracts.

### Milestones

- Catalog publish-readiness rules enforced consistently.
- Visualizer handoff contract from catalog stabilized.
- Preview lifecycle instrumentation established.

## Phase 3: Scheduling and billing maturity

### Objectives

- Improve lifecycle consistency and operator UX.
- Reduce data contract drift between schema and fetcher/action layers.
- Strengthen payment and invoice workflow robustness.

### Milestones

- Booking and availability contracts aligned.
- Billing workflow edge cases covered in tests.
- Domain metrics available for operational monitoring.

## Phase 4: Admin/platform excellence

### Objectives

- Improve privileged operations safety and observability.
- Expand admin analytics and governance tooling.
- Harden webhook and recovery workflows.

### Milestones

- Sensitive operations have audit coverage.
- Platform diagnostics and incident workflows documented.
- Admin surfaces aligned with capability model.

## Ongoing workstream priorities

- Documentation governance and contract clarity.
- Test coverage expansion for high-risk domain paths.
- Performance tuning for read-heavy and generation-heavy workflows.

## Prioritization model

When priorities conflict, prefer work that maximizes:

1. Security and tenant isolation
2. Data correctness and migration safety
3. Operational reliability and observability
4. UX and productivity improvements
