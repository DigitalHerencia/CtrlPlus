# Visualizer Preview Pipeline

## Overview

The preview pipeline is server-authoritative and single-store scoped.

## Storage Key

- `visualizer/previews/{previewId}.png`

## Security

- Input validation is server-side.
- Wrap visibility is enforced by role (customers cannot use hidden wraps).
- No client-provided ownership scope is trusted.

## Monitoring

- Track status mix: `pending`, `processing`, `complete`, `failed`.
- Monitor failure ratio and latency over time.
