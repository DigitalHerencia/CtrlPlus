# Sitewide Copy QA Checklist

Use this checklist for issue-level copy consistency passes and for PR review of user-facing route changes.

## Route coverage

Validate the following route groups:

- Public marketing routes (`/`, `/about`, `/features`, `/contact`)
- Auth routes (`/sign-in`, `/sign-up`)
- Tenant routes with user-facing text (`/wraps`, `/wraps/[id]`, `/admin` when copy changes)

## Consistency checks

- [ ] CTA labels are standardized (`Create Account`, `Sign In`, `View Features`, `Contact Us` where applicable)
- [ ] Repeated workflow statements use consistent wording
- [ ] Similar sections use consistent nouns (`customers`, `wraps`, `bookings`, `invoices`)
- [ ] No route introduces contradictory terminology for the same action

## Tone checks

- [ ] Copy remains minimalist, clean, and professional
- [ ] No hype/luxury words are present (`premium`, `luxury`, `elite`, etc.)
- [ ] Claims are operationally verifiable (no inflated promises)

## UI safety checks

- [ ] Copy edits do not alter component hierarchy or class tokens
- [ ] No visual-system deviations introduced during text changes
- [ ] Accessibility labels remain accurate after wording changes

## Verification commands

Run the project quality gates after copy updates:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
