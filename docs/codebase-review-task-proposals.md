# Codebase Review: Proposed Fix Tasks

This review proposes one actionable task in each requested category (typo, bug, documentation discrepancy, and test improvement), based on concrete findings in the current codebase.

## 1) Typo/UI copy task

### Task
Fix the CTA label typo from **"Start Sign Up"** to **"Start Signup"** (or "Start sign-up") on the Contact page.

### Why this matters
The current phrase reads awkwardly and looks like a copy typo in a primary conversion path CTA.

### Evidence
- `app/contact/page.tsx` renders the button label as `Start Sign Up`.

### Definition of done
- Update the button label to approved copy (`Start Signup` recommended for consistency with nearby "Sign Up").
- Validate that no tests/snapshots relying on that exact string break unexpectedly.

---

## 2) Bug fix task

### Task
Enforce integer validation for `slotMinutes` in `computeSlots`.

### Why this is a bug
The function throws an error saying `slotMinutes must be a positive integer`, but currently only checks `<= 0` and accepts fractional values (for example `7.5`). This is a behavior/contract mismatch and can produce unintended scheduling boundaries.

### Evidence
- `features/scheduling/compute-slots.ts` throws an integer-specific message but does not call `Number.isInteger(input.slotMinutes)`.

### Definition of done
- Reject non-integer `slotMinutes` with the existing error message (or a clearer equivalent).
- Add/adjust unit tests to assert rejection for fractional values.

---

## 3) Code comment/documentation discrepancy task

### Task
Align CI E2E trigger documentation with the actual workflow path filters.

### Why this is a discrepancy
`docs/ci-design.md` says E2E should run when `proxy.ts`, `.github/workflows/**`, and several `lib/server/actions/*` and `lib/server/fetchers/*` paths change, but `.github/workflows/pr-quality-gates.yml` currently does not include all of those filters.

### Evidence
- `docs/ci-design.md` Section 3 lists trigger paths including `proxy.ts` and `.github/workflows/**`.
- `.github/workflows/pr-quality-gates.yml` `changes` job includes a narrower set and omits several documented paths.

### Definition of done
- Either:
  - update workflow filters to match documentation, **or**
  - update documentation to match the intended narrower trigger set.
- Add a short rationale in the same PR describing the chosen source of truth.

---

## 4) Test improvement task

### Task
Add a unit test that verifies `computeSlots` rejects fractional `slotMinutes`.

### Why this improves tests
Current scheduling tests cover happy path and overlap behavior, but should include guard-rail coverage for contract validation. This is a low-cost regression test that protects core booking behavior.

### Evidence
- `tests/unit/scheduling.test.ts` currently does not assert fractional-minute rejection.

### Definition of done
- Add a test case using a fractional input (e.g., `slotMinutes: 7.5`) and assert that the function throws.
- Keep test focused and deterministic.
