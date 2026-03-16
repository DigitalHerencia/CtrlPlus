# Copilot Delegation Prompt — Visualizer

Goal: implement visualizer.issue.md.

## Operating rules

Use subagents to manage context.

Subagents:

1 repo-research

Inspect:

- app/(tenant)/visualizer
- components/visualizer
- lib/visualizer

Summarize architecture before coding.

2 pipeline-agent

Focus on:

- preview pipeline
- cache keys
- upload validation

3 ui-agent

Refactor:

- VisualizerClient
- UploadForm
- WrapSelector
- PreviewCanvas

4 security-agent

Audit:

- file validation
- preview ownership
- wrap ownership

## Skills to use

- refactor
- security review
- domain fetchers/actions
- playwright testing

## Completion checklist

- issue tasks complete
- tests pass
- lint + typecheck clean
