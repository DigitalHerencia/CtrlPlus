# .codex/docs

Contains domain specification and requirements files for the active CtrlPlus domains:

- `admin`
- `auth/authz`
- `billing`
- `catalog`
- `platform`
- `scheduling`
- `settings`
- `visualizer`

These files document goals, repo anchors, domain invariants, acceptance signals, and execution-critical contracts before any runtime refactor begins. Cross-domain files such as `prd.md` and `tech-requirements.md` define the shared product and architecture baseline for all domain passes, including cross-domain handoffs like catalog-to-visualizer selection and provider-backed preview generation.
