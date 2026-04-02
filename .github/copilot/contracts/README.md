# Contracts Files

Machine-readable YAML contracts that define literal execution constraints for agent-generated code.

## Purpose

Contracts are the enforcement layer: they codify rules that agents MUST follow when generating code, not guidelines or suggestions. Each contract is a YAML file with a clear, machine-parseable structure.

## Contract Categories

### `naming.yaml`

Export naming, file placement, component naming conventions.

**Covers:**

- Export names (actions, fetchers, components, types)
- File naming and organization rules
- No barrel index import pattern (explicit imports only)
- DTO naming (suffix: DTO)
- Schema naming (suffix: Schema)
- Zod validator naming (prefix: parse or prefix: validate)

**Use when:**

- Creating a new file
- Naming exports
- Adding a new type or schema

### `domain-boundaries.yaml`

Domain ownership and cross-domain access boundaries.

**Covers:**

- Which domain owns which capabilities
- Forbidden or constrained cross-domain calls
- Server-side boundary expectations

**Use when:**

- Validating domain ownership
- Reviewing cross-domain dependencies
- Preventing boundary leakage in new features

### `mutations.yaml`

Server action contract shapes, mutation pipeline rules.

**Covers:**

- 5-6 step security pipeline: auth → authz → validate → mutate → audit → return
- Required error handling
- Transaction boundaries
- Ownership checks and tenancy validation

**Use when:**

- Generating a server action
- Validating a mutation against the security pipeline
- Adding new audit requirements

### `domain-map.yaml`

Concrete domain-to-path mapping for route roots, feature roots, component roots,
and canonical read/write boundary files.

**Use when:**

- Verifying placement of new domain code
- Validating fetcher/action entrypoint location
- Auditing domain ownership drift

### `layer-boundaries.contract.yaml`

Layer responsibilities, forbidden behavior, and import direction constraints.

**Use when:**

- Reviewing architecture boundary violations
- Validating dependency direction in refactors
- Confirming route/app/features/components/lib separation

### `route-layer-contract.yaml`

Route-to-feature mapping contract for thin page orchestration.

**Use when:**

- Validating `app/**` page composition targets
- Enforcing route entrypoint thinness
- Auditing route-feature alignment

## Structure

Each YAML file has:

- Top-level keys by domain (or category)
- Sub-keys for specific contracts
- Clear field types and validation rules
- References to Zod schemas or type files
- Examples where relevant

## Update Pattern

When discovering a new rule or constraint:

1. **Add to appropriate `.yaml` file** in `/contracts/`
2. **Update corresponding instruction file** to reference the contract
3. **Document rationale** in relevant `/docs/` domain doc
4. If needed, capture decision rationale in the relevant docs under `/docs`

## Validation

Agents should:

- Check contracts BEFORE generating code
- Validate generated code against contracts AFTER generation
- Report violations as errors, not warnings
- Never override contract rules without explicit user approval (and updating the contract)

## Cross-References

- Architecture and rationale → see `/docs/ARCHITECTURE.md`
- Naming contracts → see `naming.yaml` for examples
- Mutations → see `mutations.yaml` for security pipeline
- Domain ownership → see `domain-boundaries.yaml` for boundaries
- Concrete path mapping → see `domain-map.yaml`
- Layer import constraints → see `layer-boundaries.contract.yaml`
- Route-to-feature mapping → see `route-layer-contract.yaml`
