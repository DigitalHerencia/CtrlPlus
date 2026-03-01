# Product Requirements (CtrlPlus)

## Product

**CTRL+** is a subdomain-based multi-tenant platform for a vehicle wrap business. It supports catalog browsing, preview workflows, scheduling, invoicing, and Stripe payment completion.

## Goals

- Convert browse traffic into booked and paid appointments.
- Make wrap visualization the core differentiator.
- Preserve strict tenant isolation for expansion.
- Keep flows fast, reliable, and operationally clear for both customers and tenant admins.

## Non-Goals (v1)

- Multi-location route optimization.
- CAD-grade rendering.
- Third-party designer marketplace.

## Personas

- Customer: validates look quickly, books confidently, pays in one flow.
- Tenant admin: manages catalog, availability, bookings, and invoices.
- Platform admin: manages tenants and platform controls.

## Core Capabilities

1. Catalog browsing and wrap detail pages.
2. Visualizer with upload path and template fallback path.
3. Scheduling with capacity and availability rules.
4. Invoicing and Stripe checkout completion.
5. Tenant-scoped admin operations.

## Primary User Flow

1. Visit tenant subdomain.
2. Browse wraps.
3. Preview selected wrap (upload or template fallback).
4. Choose drop-off and pick-up windows.
5. Confirm invoice.
6. Complete Stripe payment.
7. Receive confirmation.

## Fallback Flow

If upload preview fails or times out, immediately offer template-based preview and continue to scheduling. Preview failure must not block booking.

## Product Objects

- Tenant
- User (Clerk identity)
- Customer profile
- Wrap design
- Wrap preview artifact
- Booking
- Availability/capacity rule set
- Invoice
- Payment reference
- Audit event

## Success Metrics

- Visualizer entry rate
- Visualizer completion rate
- Booking conversion rate
- Paid booking rate
- Time to preview
- Admin effort reduction per booking/invoice

## Release Theme

Milestone sequence remains: foundation -> visualizer -> scheduling -> invoicing/payments -> admin operations -> hardening -> observability.
