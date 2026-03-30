# Security Policy

## Reporting a Vulnerability

Do not open public GitHub issues for security vulnerabilities.

Report vulnerabilities privately through one of these channels:

- the repository security reporting flow on GitHub
- a private maintainer contact channel already established for this project

Include the following when possible:

- affected area or domain
- impact summary
- reproduction steps or proof of concept
- suggested mitigation, if known

## Response Expectations

- Acknowledgement target: within 5 business days
- Triage target: within 10 business days
- Remediation timing depends on severity, exploitability, and deployment risk

## Scope

This policy covers:

- application code in `app/`, `features/`, `components/`, `lib/`, `schemas/`, `types/`, and `prisma/`
- authentication, authorization, billing, upload, preview-generation, and webhook flows
- repository automation and CI configuration under `.github/`

## Secure Development Rules

- Keep Prisma, authz, ownership, billing, and preview authority on the server.
- Do not trust client-provided role, tenant, owner, booking, invoice, wrap, or preview scope.
- Validate all mutation inputs server-side.
- Keep webhook handling idempotent and signature-verified.
- Treat uploads, provider integrations, and admin or platform recovery actions as sensitive surfaces.
