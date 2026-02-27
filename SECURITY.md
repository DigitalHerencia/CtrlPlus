# Security Policy

## Supported Versions

Security updates are applied to the latest version on `main`.

## Reporting a Vulnerability

Please do not open public GitHub issues for suspected security vulnerabilities.

Report vulnerabilities privately by emailing `security@ctrlplus.local` with:

- A clear description of the issue.
- Reproduction steps or proof-of-concept details.
- Impact assessment (what data or systems might be affected).
- Any suggested mitigation if available.

You should receive an acknowledgement within 2 business days.

## Scope Priorities

The following areas are highest priority for this repository:

- Tenant isolation and cross-tenant data access controls.
- Authentication and authorization boundaries.
- Stripe webhook signature verification and idempotency.
- Secrets handling and environment configuration.
- CI/CD and supply-chain risks in dependency updates.

## Safe Harbor

We support good-faith security research and coordinated disclosure. Please avoid:

- Accessing data that does not belong to you.
- Disrupting service availability.
- Public disclosure before remediation is completed.
