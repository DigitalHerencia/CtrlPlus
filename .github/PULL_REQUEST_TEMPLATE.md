## Summary

- [ ] Briefly describe the scope and intent of this change.

## Validation

- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm test:e2e` (when required by CI path rules)

## Standard PR Checklist

- [ ] No Prisma usage inside `app/`
- [ ] Tenant isolation enforced
- [ ] Auth + permission validated server-side
- [ ] Zod validation added (if input)
- [ ] Unit tests added
- [ ] Integration tests added (if DB involved)
- [ ] E2E updated (if user flow affected)
- [ ] Lint passes
- [ ] Typecheck passes
- [ ] No `console.log`s
