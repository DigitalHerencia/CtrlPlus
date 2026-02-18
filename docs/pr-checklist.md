# Standard Pull Request Checklist

Use this checklist for every PR.

## Quality gates must be green

- [ ] Lint passes
- [ ] Typecheck passes
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated (if DB involved)
- [ ] E2E updated (if user flow affected)

## Verification and release safety

- [ ] No Prisma usage inside `app/`
- [ ] Tenant isolation enforced
- [ ] Auth + permission validated server-side
- [ ] Zod validation added (if input)
- [ ] No `console.log`s
