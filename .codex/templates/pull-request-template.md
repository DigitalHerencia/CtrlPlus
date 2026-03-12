## Description

<!-- Describe the change clearly -->

## Related Issues

Closes #

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement
- [ ] Test coverage improvement

## Validation

- [ ] `pnpm format:check`
- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm prisma:validate`
- [ ] `pnpm test`
- [ ] `pnpm build`

## Security Checklist

- [ ] No Prisma imports in `app/**` outside webhook handlers
- [ ] Reads stay in `lib/{domain}/fetchers`
- [ ] Writes stay in `lib/{domain}/actions`
- [ ] Ownership checks are server enforced
- [ ] No role or ownership scope is accepted from the client
