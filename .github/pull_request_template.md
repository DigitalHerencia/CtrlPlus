## Summary

- Describe the change and why it is needed.

## Linked Issue

- Closes #57

## Architecture / Security Checklist

- [ ] No Prisma usage was added in `app/`.
- [ ] Tenant scope is resolved server-side from host/subdomain.
- [ ] Server-side authz checks were added/updated where required.
- [ ] Inputs for mutations are validated with Zod in server actions.
- [ ] Validation failures return deterministic, safe action errors.

## Testing

- [ ] Unit tests added/updated.
- [ ] Integration tests added/updated.
- [ ] E2E tests added/updated (if user flow changed).
