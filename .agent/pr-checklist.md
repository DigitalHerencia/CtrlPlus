# Standard Pull Request Checklist

Use this checklist for every PR.

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
