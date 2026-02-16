#!/usr/bin/env bash
set -euo pipefail

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) is required to bootstrap labels." >&2
  exit 1
fi

# type labels
gh label create "type:feature" --color "0E8A16" --description "New product functionality" --force
gh label create "type:infra" --color "5319E7" --description "Infrastructure or platform work" --force
gh label create "type:refactor" --color "1D76DB" --description "Behavior-preserving code improvements" --force
gh label create "type:security" --color "B60205" --description "Security hardening or remediation" --force
gh label create "type:test" --color "FBCA04" --description "Test additions or harness changes" --force
gh label create "type:docs" --color "0075CA" --description "Documentation-only changes" --force
gh label create "type:bug" --color "D73A4A" --description "Defect fix or regression" --force

# domain labels
gh label create "domain:tenancy" --color "C2E0C6" --description "Tenant resolution and data isolation" --force
gh label create "domain:auth" --color "C5DEF5" --description "Authentication and authorization" --force
gh label create "domain:catalog" --color "E4E669" --description "Catalog and wrap inventory" --force
gh label create "domain:visualizer" --color "FEF2C0" --description "Wrap preview and visualizer" --force
gh label create "domain:scheduling" --color "D4C5F9" --description "Booking and slot availability" --force
gh label create "domain:billing" --color "F9D0C4" --description "Payments, invoices, and Stripe" --force
gh label create "domain:admin" --color "BFDADC" --description "Admin console and internal ops" --force
gh label create "domain:ci" --color "24292E" --description "CI/CD and delivery automation" --force

# scope labels
gh label create "scope:backend" --color "0366D6" --description "Server-side changes" --force
gh label create "scope:frontend" --color "0052CC" --description "Client-side UI changes" --force
gh label create "scope:db" --color "006B75" --description "Data model and migrations" --force
gh label create "scope:rsc" --color "5319E7" --description "React Server Components surface" --force
gh label create "scope:webhook" --color "B60205" --description "Webhook endpoints and processors" --force
gh label create "scope:e2e" --color "FBCA04" --description "End-to-end test coverage" --force
gh label create "scope:security" --color "D93F0B" --description "Security boundary hardening" --force
gh label create "scope:docs" --color "0E8A16" --description "Documentation scope" --force

# priority labels
gh label create "p0" --color "B60205" --description "Critical priority" --force
gh label create "p1" --color "D93F0B" --description "High priority" --force
gh label create "p2" --color "FBCA04" --description "Normal priority" --force

# workflow labels
gh label create "status:triage" --color "D4C5F9" --description "Awaiting triage" --force

echo "Labels bootstrapped successfully."
