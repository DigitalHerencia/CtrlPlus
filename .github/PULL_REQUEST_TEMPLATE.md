## Description

<!-- Provide a clear and concise description of your changes -->

## Related Issues

<!-- Link to related issues (e.g., Closes #123, Fixes #456) -->

Closes #

## Type of Change

<!-- Mark the relevant option with an "x" -->

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)
- [ ] Performance improvement
- [ ] Test coverage improvement

## Changes Made

<!-- List the key changes you made -->

-
-
-

## Testing

<!-- Describe the tests you ran to verify your changes -->

### Test Environment

- Node version:
- pnpm version:
- Database: Neon / Local PostgreSQL

### Test Steps

1.
2.
3.

## Screenshots

<!-- If applicable, add screenshots to help explain your changes -->

## Security Checklist

<!-- Verify security-critical architectural rules -->

- [ ] No Prisma imports in `app/**`
- [ ] All database reads via `lib/{domain}/fetchers/`
- [ ] All database writes via `lib/{domain}/actions/`
- [ ] All queries scoped by `tenantId`
- [ ] Authorization checks in place (server-side)
- [ ] Input validation with Zod schemas
- [ ] No `tenantId` accepted from client payloads

## Code Quality Checklist

- [ ] Code follows project conventions (see CONTRIBUTING.md)
- [ ] Self-reviewed my code
- [ ] Commented complex logic
- [ ] Updated documentation (if needed)
- [ ] TypeScript passes (`pnpm typecheck`)
- [ ] Prisma validates (`pnpm prisma:validate`)
- [ ] Production build passes (`pnpm build`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Formatting passes (`pnpm format:check`)
- [ ] Tests added/updated (`pnpm test`)
- [ ] Manual testing completed

## Additional Context

<!-- Add any other context about the pull request here -->
