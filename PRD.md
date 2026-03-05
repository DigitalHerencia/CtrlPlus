# CtrlPlus Product Requirements Document

## Product Vision

**CTRL+** is a subdomain-based multi-tenant platform for vehicle wrap businesses. It transforms the customer journey from browsing to booking by making wrap visualization the core differentiator, while preserving strict tenant isolation for multi-business expansion.

---

## Goals

- **Convert browse traffic into paid bookings**: Streamline the path from catalog browsing to payment completion
- **Make wrap visualization the differentiator**: Enable customers to validate their choice quickly and confidently
- **Preserve strict tenant isolation**: Ensure security and scalability for multi-tenant expansion
- **Keep flows fast and reliable**: Optimize performance for both customers and tenant admins

---

## Non-Goals (v1)

- Multi-location route optimization
- CAD-grade 3D rendering with lighting simulation
- Third-party designer marketplace
- Real-time collaboration tools
- Custom design creation (customers select from catalog)

---

## User Personas

### Customer

**Who**: Vehicle owner looking to get their car wrapped
**Goals**:

- Quickly validate how a wrap will look on their vehicle
- Book an appointment with confidence
- Complete payment in one smooth flow
  **Pain Points**:
- Uncertainty about final wrap appearance
- Complex booking processes
- Multiple steps to complete payment

### Tenant Admin

**Who**: Wrap business operator
**Goals**:

- Manage wrap catalog efficiently
- Control availability and capacity
- Track bookings and invoices
- Minimize operational overhead
  **Pain Points**:
- Manual scheduling coordination
- Invoice and payment tracking
- Customer visualization requests

### Platform Admin

**Who**: CtrlPlus platform operator
**Goals**:

- Manage multiple tenant businesses
- Monitor platform health and usage
- Control platform-level configurations
  **Pain Points**:
- Multi-tenant security risks
- Scalability challenges
- Platform maintenance overhead

---

## Core Capabilities

### 1. Catalog Browsing

**Description**: Browse available wrap designs organized by category, style, and vehicle type.

**Requirements (EARS)**:

- `THE SYSTEM SHALL display all active wrap designs for the current tenant`
- `WHEN a user selects a wrap design, THE SYSTEM SHALL display detailed information including price, estimated installation time, and sample images`
- `THE SYSTEM SHALL support filtering wraps by category, price range, and vehicle compatibility`
- `THE SYSTEM SHALL support searching wraps by name or description`
- `THE SYSTEM SHALL paginate catalog results for performance`

**Acceptance Criteria**:

- Catalog loads within 2 seconds
- Filters apply without page refresh
- Search returns results in < 1 second
- Images are optimized and lazy-loaded

### 2. Wrap Visualizer

**Description**: Preview selected wrap on customer's vehicle with two modes: upload-based (best effort) and template-based (fallback).

**Requirements (EARS)**:

- `WHEN a user selects "Preview on My Car", THE SYSTEM SHALL offer upload option for their vehicle photo`
- `IF upload path is selected, THE SYSTEM SHALL process the image and overlay the wrap design`
- `IF upload preview fails OR times out, THE SYSTEM SHALL immediately offer template-based preview using stock vehicle images`
- `THE SYSTEM SHALL cache preview results by deterministic keys for 24 hours`
- `IF preview fails completely, THE SYSTEM SHALL allow user to proceed to scheduling without blocking`

**Acceptance Criteria**:

- Upload preview completes within 30 seconds or falls back
- Template preview is instant (< 1 second)
- Preview failure does not block booking flow
- Cached previews are served in < 500ms

### 3. Scheduling

**Description**: Choose drop-off and pick-up time windows based on availability and capacity rules.

**Requirements (EARS)**:

- `THE SYSTEM SHALL compute available time slots based on tenant availability rules`
- `WHEN a user selects a time slot, THE SYSTEM SHALL reserve it for 15 minutes`
- `THE SYSTEM SHALL validate slot availability server-side at booking confirmation`
- `THE SYSTEM SHALL enforce capacity limits per time slot`
- `THE SYSTEM SHALL release expired reservations automatically`

**Acceptance Criteria**:

- Slot computation is deterministic and unit-tested
- No double-booking possible
- Reservations expire after 15 minutes
- Capacity limits are enforced server-side

### 4. Invoicing & Payment

**Description**: Generate invoice and complete payment via Stripe Checkout.

**Requirements (EARS)**:

- `WHEN a user confirms booking, THE SYSTEM SHALL generate an invoice with line items`
- `THE SYSTEM SHALL create a Stripe Checkout session with invoice details`
- `WHEN Stripe webhook is received, THE SYSTEM SHALL verify signature and enforce idempotency`
- `THE SYSTEM SHALL update invoice and booking status transactionally after payment verification`
- `THE SYSTEM SHALL write audit event for all payment state changes`

**Acceptance Criteria**:

- Invoice generation is deterministic
- Stripe webhook verification is mandatory
- Idempotency prevents duplicate processing
- Payment status updates are transactional

### 5. Tenant-Scoped Admin Operations

**Description**: Tenant admins manage their catalog, availability, bookings, and invoices.

**Requirements (EARS)**:

- `THE SYSTEM SHALL enforce tenant isolation for all admin operations`
- `THE SYSTEM SHALL verify admin permissions server-side for all mutations`
- `WHEN admin creates/updates/deletes catalog item, THE SYSTEM SHALL invalidate catalog cache`
- `THE SYSTEM SHALL provide CRUD operations for wraps, availability rules, and booking management`
- `THE SYSTEM SHALL display booking list with search, filter, sort, and pagination`

**Acceptance Criteria**:

- Tenant data is completely isolated
- Permission checks happen server-side
- Cache invalidation is deterministic
- Admin UI is responsive and performant

---

## Primary User Flow

1. **Visit tenant subdomain**: `{tenant}.ctrlplus.com`
2. **Browse wraps**: View catalog with filters and search
3. **View wrap details**: See pricing, installation time, images
4. **Preview wrap**:
   - Option A: Upload vehicle photo (best effort)
   - Option B: Use template with stock vehicle image (fallback/fast)
5. **Choose time slots**: Select drop-off and pick-up windows
6. **Review invoice**: Confirm booking details and pricing
7. **Complete payment**: Stripe Checkout
8. **Receive confirmation**: Booking confirmation email with details

---

## Fallback Flow

**IF** upload preview fails or times out:

- **THEN** immediately offer template-based preview
- **AND** allow user to continue to scheduling

**Critical**: Preview failure MUST NOT block booking flow.

---

## Product Objects

### Core Entities

- **Tenant**: Multi-tenant business unit (subdomain-based)
- **User**: Clerk identity with cross-tenant memberships
- **Customer Profile**: Tenant-scoped customer information
- **Wrap Design**: Catalog item with pricing and details
- **Wrap Preview**: Cached visualization artifact
- **Booking**: Scheduled appointment with time slots
- **Availability Rule**: Capacity and schedule constraints
- **Invoice**: Payment request with line items
- **Payment Reference**: Stripe payment tracking
- **Audit Event**: Immutable log of sensitive operations

### Relationships

- Tenant → many Wraps (one-to-many)
- Tenant → many Bookings (one-to-many)
- User → many TenantMemberships (many-to-many with role)
- Booking → one Invoice (one-to-one)
- Invoice → one Payment Reference (one-to-one)
- Wrap → many Previews (one-to-many, cached)

---

## Success Metrics

### Conversion Metrics

- **Visualizer Entry Rate**: % of catalog viewers who try preview
- **Visualizer Completion Rate**: % of preview attempts that succeed
- **Booking Conversion Rate**: % of previews that lead to booking
- **Paid Booking Rate**: % of bookings that complete payment

### Performance Metrics

- **Time to Preview**: P95 time from preview initiation to result
- **Catalog Load Time**: P95 time for catalog page to be interactive
- **Checkout Flow Time**: Median time from booking start to payment

### Operational Metrics

- **Admin Effort per Booking**: Time spent on manual booking/invoice tasks
- **Preview Fallback Rate**: % of previews that use template instead of upload

### Targets (v1)

- Visualizer completion rate > 80%
- Booking conversion rate > 40%
- Paid booking rate > 95%
- Time to preview < 10 seconds (P95)
- Catalog load time < 2 seconds (P95)

---

## Release Milestones

### Milestone 1: Foundation (Complete)

- Database schema and migrations
- Auth and tenant isolation
- Basic CRUD operations

### Milestone 2: Visualizer (Complete)

- Upload-based preview (best effort)
- Template-based preview (fallback)
- Preview caching

### Milestone 3: Scheduling (Complete)

- Availability and capacity rules
- Slot computation and reservation
- Booking workflow

### Milestone 4: Invoicing & Payments (Complete)

- Invoice generation
- Stripe Checkout integration
- Webhook verification and idempotency

### Milestone 5: Admin Operations (Complete)

- Tenant admin dashboard
- Catalog management
- Booking and invoice management

### Milestone 6: Hardening (Current)

- Documentation consolidation
- Performance optimization
- Security audit
- Test coverage improvements

### Milestone 7: Observability (Planned)

- Logging and monitoring
- Error tracking
- Performance telemetry
- Usage analytics

---

## Security & Privacy

### Data Protection

- All tenant data is isolated by `tenantId` in database
- No cross-tenant data access possible
- Customer PII encrypted at rest
- Payment data handled exclusively by Stripe (PCI DSS compliant)

### Authentication & Authorization

- Clerk handles authentication (no password storage)
- Custom RBAC for tenant permissions
- All authorization checks happen server-side
- No client-trusted security decisions

### Webhook Security

- Clerk webhook signature verification mandatory
- Stripe webhook signature verification mandatory
- Idempotency tables prevent replay attacks
- Failed verification results in rejected webhook

---

## Accessibility

- WCAG 2.1 AA compliance target
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast ratios
- Responsive design for mobile accessibility

---

## Localization (Future)

- v1 ships English-only
- Architecture supports future i18n
- Date/time formatting respects locale
- Currency formatting for multi-currency support (future)

---

## Constraints

### Technical Constraints

- Next.js v16+ App Router required
- Neon PostgreSQL (serverless, no stored procedures)
- Clerk for auth (no custom auth backend)
- Stripe for payments (no alternative payment processors in v1)

### Business Constraints

- Single-tenant per subdomain
- Booking requires payment upfront (no quote/invoice workflow)
- Wrap designs are predefined (no custom design builder)
- US-only in v1 (timezone and payment considerations)

---

## Future Considerations (Beyond v1)

- Multi-location support for tenant businesses
- Real-time booking calendar with live updates
- SMS notifications for appointment reminders
- Mobile app (React Native)
- Integration with external scheduling tools
- Wholesale/B2B pricing tiers
- Designer marketplace for custom wraps
