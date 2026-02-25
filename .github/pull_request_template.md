## Summary

- Describe the change and why it is needed.

## Linked Issue

- Closes #<issue-number>

## Architecture / Security Checklist

- [ ] No Prisma usage was added in `app/`.
- [ ] Tenant scope is resolved server-side from host/subdomain.
- [ ] Server-side authz checks were added/updated where required.
- [ ] Inputs for mutations are validated with Zod in server actions.

## Testing

- [ ] Unit tests added/updated.
- [ ] Integration tests added/updated.
- [ ] E2E tests added/updated (if user flow changed).
