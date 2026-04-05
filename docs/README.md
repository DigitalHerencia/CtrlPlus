# End-User Documentation

This directory is reserved for end-user documentation only.

All internal agent governance artifacts, implementation notes, and runbooks must live
under `.agents/` exclusively.

## Documentation Suite Structure

This docs suite powers the public `/docs` experience in the app and includes:

- Getting Started
    - Quick Start
    - Create an Account
    - Onboarding Walkthrough
- Feature Walkthroughs
    - Features Overview
    - Authentication
    - Catalog
    - Visualizer
    - Scheduling
    - Billing
    - Settings
    - Admin
    - Platform
- Support
    - FAQ
    - Troubleshooting

## Source of Truth

- Navigation and page ordering: `docs/content.tsx` (`DOC_SECTIONS`)
- Page content and metadata: `docs/content.tsx` (`DOC_PAGES`)
- Shared docs types: `docs/types.ts`
