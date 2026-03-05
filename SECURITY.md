# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability within CTRL+, please send an email to security@example.com. All security vulnerabilities will be promptly addressed.

Please include the following information:

- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### What to Expect

- **Acknowledgment**: We will acknowledge your email within 48 hours
- **Assessment**: We will assess the vulnerability and determine its impact
- **Updates**: We will keep you informed of our progress
- **Resolution**: We will work to fix the vulnerability and release a patch
- **Credit**: We will credit you in the release notes (unless you prefer to remain anonymous)

## Security Best Practices for Contributors

When contributing to CTRL+, please ensure:

1. **Never commit secrets** (API keys, passwords, tokens)
2. **Tenant isolation** - All queries must be scoped by `tenantId`
3. **Server-side authorization** - Never trust client-provided `tenantId`
4. **Input validation** - Use Zod schemas for all user inputs
5. **No Prisma in routes** - Respect data layer boundaries
6. **Use prepared statements** - Prisma handles this automatically
7. **HTTPS only** - Never transmit sensitive data over HTTP
8. **Secure webhooks** - Always verify Clerk and Stripe webhook signatures

## Known Security Considerations

### Multi-Tenant Architecture

CTRL+ is a multi-tenant platform where tenant isolation is critical:

- Tenant is resolved server-side from subdomain/host only
- All database queries MUST include `where: { tenantId }`
- Cross-tenant data access is an architectural violation
- See `TECH-REQUIREMENTS.md` for detailed security architecture

### Authentication & Authorization

- Clerk handles authentication (login, sessions)
- Custom RBAC table (`TenantUserMembership`) handles authorization
- All permission checks happen server-side
- JWT tokens are validated by Clerk middleware

### Payment Processing

- Stripe handles all payment card data (PCI compliant)
- Webhook signatures are verified using Stripe SDK
- Payment records scoped by `tenantId`

## Security Updates

Security updates will be released as soon as possible after a vulnerability is confirmed. We will:

1. Release a patch version
2. Publish security advisory on GitHub
3. Notify users via release notes
4. Update this security policy if needed

Thank you for helping keep CTRL+ and its users safe!
