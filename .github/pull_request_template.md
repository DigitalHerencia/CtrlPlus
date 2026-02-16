## Summary

- Describe the change and why it is needed.

## Architecture / Security Checklist

- [ ] No Prisma usage was added in `app/`.
- [ ] Tenant scope is resolved server-side from host/subdomain.
- [ ] Server-side authz checks were added/updated where required.
- [ ] Inputs for mutations are validated with Zod in server actions.

## Testing

- [ ] Unit tests added/updated.
- [ ] Integration tests added/updated.
- [ ] E2E tests added/updated (if user flow changed).

## Performance Metrics (Required for wraps page + visualizer changes)

Reference: `docs/performance-validation.md`

### Baseline

- Wraps page p95 / p99 (ms):
- Visualizer template action p95 (ms):
- Visualizer upload action p95 (ms):
- Visualizer fallback success rate (%):

### Post-change

- Wraps page p95 / p99 (ms):
- Visualizer template action p95 (ms):
- Visualizer upload action p95 (ms):
- Visualizer fallback success rate (%):

### Delta

- Wraps page p95 / p99 delta:
- Visualizer template p95 delta:
- Visualizer upload p95 delta:
- Visualizer fallback success delta:

## SLA Gate (Must Pass)

- [ ] Wraps page p95 <= 900ms and p99 <= 1200ms.
- [ ] Visualizer template action p95 <= 1000ms.
- [ ] Visualizer upload action p95 <= 20000ms.
- [ ] Visualizer fallback success rate >= 99%.
- [ ] `pnpm perf:assert` passed in CI.
