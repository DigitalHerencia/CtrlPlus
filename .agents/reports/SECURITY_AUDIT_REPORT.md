# CtrlPlus Security Audit Report

**Date:** January 2025
**Scope:** Clerk Authentication, Authorization, Stripe Billing Integration
**Focus:** Baseline deficiencies and vulnerabilities to remediate before shipping (not hardening)

---

## Executive Summary

CtrlPlus demonstrates **solid foundational security practices** including:

- ✅ Server-side role resolution with proper capability-based authorization
- ✅ Webhook event idempotency tracking with state machines
- ✅ Stripe signature verification and payment authorization
- ✅ Audit logging for sensitive operations
- ✅ Soft-delete retention for compliance

However, **7 baseline deficiencies** require remediation before shipping to prevent data exposure, privilege escalation, and operational issues.

---

## 1. CRITICAL: Stripe Webhook Authorization Gap

### Finding

**Location:** `lib/actions/billing.actions.ts` → `processCheckoutSessionCompleted()` (lines 1350-1450)

The webhook processor updates invoice status and payment records without re-validating customer ownership after claiming the event.

```typescript
// ❌ VULNERABLE: No re-check that customer owns this invoice
const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, deletedAt: null },
    // Missing: booking.customerId !== currentUser check
    select: { id: true, bookingId: true, ... }
})

// Webhook (not authenticated user) can directly mark any invoice as paid
await prisma.$transaction([
    prisma.payment.create({ data: { invoiceId, stripePaymentIntentId, status: 'succeeded' } }),
    prisma.invoice.update({ where: { id: invoice.id }, data: { status: 'paid' } })
])
```

### Risk

- **Privilege Escalation:** A malicious Stripe webhook (or attacker spoofing one) could:
    - Mark any unpaid invoice as paid
    - Record payments for other customers' bookings
    - Bypass payment authorization entirely
- **Financial Impact:** Direct revenue loss if invoices are falsely marked paid without actual Stripe payment confirmation

### Root Cause

Webhook events are system-level operations (no authenticated user context), but the processor doesn't validate that the invoice belongs to an authorized customer or store.

### Remediation

Add customer/store ownership validation in webhook processor:

```typescript
async function processCheckoutSessionCompleted(
    event: Stripe.Event,
    webhookState: WebhookEventState
): Promise<ConfirmPaymentResult> {
    const session = event.data.object as Partial<Stripe.Checkout.Session>
    const invoiceId = resolveInvoiceId(session)

    // Step 1: Verify invoice exists and belongs to THIS store
    const invoice = await prisma.invoice.findFirst({
        where: {
            id: invoiceId,
            deletedAt: null,
            booking: {
                // Verify booking is for configured store (e.g., check parent customer/organization)
                wrapId: { in: await getAuthorizedWrapIds() } // Or similar ownership check
            }
        },
        select: { id: true, bookingId: true, booking: { select: { customerId: true } } }
    })

    if (!invoice) {
        throw new Error(`Invoice not found or access denied: ${invoiceId}`)
    }

    // Step 2: Cross-check Stripe customer ID matches expected customer
    if (session.customer && session.customer !== invoice.stripeCustomerId) {
        // Log potential spoofing attempt
        await prisma.auditLog.create({
            data: {
                userId: 'system:stripe-webhook',
                action: 'WEBHOOK_CUSTOMER_MISMATCH',
                resourceType: 'Invoice',
                resourceId: invoiceId,
                details: JSON.stringify({ eventId: event.id, receivedCustomer: session.customer, expectedCustomer: invoice.stripeCustomerId })
            }
        })
        throw new Error(`Customer mismatch in Stripe webhook: ${invoiceId}`)
    }

    // Proceed with payment confirmation...
}
```

### Priority

**CRITICAL** — Must fix before ANY production payment processing

---

## 2. HIGH: Stripe Webhook Signature Verification Incomplete

### Finding

**Location:** `app/api/stripe/webhook/route.ts` (lines 1-35)

While signature verification is present, error handling doesn't match industry standards:

```typescript
// Current implementation
try {
    const event = constructWebhookEvent(req, body, req.headers.get('stripe-signature') ?? '')
    // ... process event ...
} catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
}
```

### Issues

1. **Invalid Signature → 500 Error**
    - Stripe expects 400 for invalid signatures, not 500
    - 500 triggers Stripe webhook retries indefinitely
    - Correct: Invalid signature = 400, not retryable

2. **Error Details Leakage**
    - If `constructWebhookEvent()` throws with details (e.g., "customer X not found"), attacker gets information about your store structure
    - Correct: Always return generic "Webhook processing failed" for non-signature errors

### Remediation

```typescript
export async function POST(req: Request) {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    // Step 1: Verify signature first
    let event: Stripe.Event
    try {
        event = constructWebhookEvent(req, body, signature ?? '')
    } catch (error) {
        // If signature invalid, return 400 immediately (don't retry)
        if (error instanceof Error && error.message.includes('signature')) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
        }
        // For other errors, still return 500 but don't expose details
        console.error('[Stripe Webhook] Setup error:', error)
        return NextResponse.json({ error: 'Webhook setup error' }, { status: 500 })
    }

    // Step 2: Process event, catch application errors separately
    try {
        const result = await processStripeWebhookEvent({ event, payload: JSON.parse(body) })
        return NextResponse.json({ success: true, result })
    } catch (error) {
        // Application errors (missing invoice, etc) = 400 (don't retry, fix data)
        if (error instanceof Error && error.message.includes('not found')) {
            console.warn('[Stripe Webhook] Data error:', error.message)
            return NextResponse.json({ error: 'Data error' }, { status: 400 })
        }
        // Unexpected errors = 500 (retry, investigate)
        console.error('[Stripe Webhook] Processing failed:', error)
        return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
    }
}
```

### Priority

**HIGH** — Affects webhook reliability and prevents information leakage

---

## 3. HIGH: Stripe Environment Variable Fallback (Non-Standard Naming)

### Finding

**Location:** `lib/integrations/stripe.ts` (lines 1-60)

```typescript
// ❌ Non-standard env var name
const apiKey = process.env.STRIPE_SECRET_KEY ?? process.env.ctrl_plus_STRIPE_SECRET_KEY
```

### Issues

1. **Naming Confusion:** `ctrl_plus_STRIPE_SECRET_KEY` is unusual and easily mistyped
2. **Accidental Exposure:** Developers might commit the fallback value in `.env.local`
3. **Deployment Risk:** CI/CD pipelines might miss the non-standard name during secret validation

### Why It Matters

In incident response, non-standard naming delays discovery of where the secret is configured. Standard names (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`) make it obvious where to rotate on compromise.

### Remediation

Remove the fallback and use standard Stripe environment variable names:

```typescript
export function getStripeClient() {
    const apiKey = process.env.STRIPE_SECRET_KEY
    if (!apiKey) {
        throw new Error('STRIPE_SECRET_KEY not configured')
    }

    return new Stripe(apiKey, { apiVersion: '2026-02-25.clover' })
}
```

If you need development-specific config:

- Use `.env.local` locally (standard convention)
- Add validation script to CI that checks for required env vars
- Document setup in `CONTRIBUTING.md`

### Priority

**HIGH** — Operational security; prevents accidental secret exposure

---

## 4. MEDIUM: Sensitive Data Exposure in Error Responses

### Finding

**Locations:**

- `lib/actions/billing.actions.ts` → `createCheckoutSession()` (line 67)
- Various guards in `lib/authz/guards.ts`

```typescript
// ❌ Leaks that invoice exists for this ID
if (!invoice) {
    throw new Error('Forbidden: invoice not found')
}

// ❌ Tells attacker which customers exist
const booking = await prisma.booking.findFirst({
    where: { id: bookingId, deletedAt: null }
})
if (!booking) {
    throw new Error('Forbidden: booking not found')
}

// ❌ Reveals store structure
requireInvoiceWriteAccess(access, invoice.booking.customerId)
// If fails: "Forbidden: insufficient capabilities"
```

### Risk

**Information Disclosure:** Attackers can enumerate:

- Which invoice IDs exist
- Which booking IDs correspond to customers
- Which customer IDs have been accessed

### Remediation

Standardize error messages to never leak resource discovery:

```typescript
// ✅ Generic response for both "not found" and "access denied"
if (!invoice || invoice.booking.customerId !== accessContext.userId) {
    throw new Error('Forbidden')  // Same error for both cases
}

// For server actions parsing errors, validate input first:
const { invoiceId } = createCheckoutSessionSchema.parse(rawInput)  // Zod throws early

// For authorization, don't throw; log and return generic error:
if (!hasCapability(userCapabilities, 'billing.write')) {
    await logSecurityEvent('AUTHORIZATION_DENIED', { userId, action: 'createCheckoutSession' })
    throw new Error('Forbidden')
}
```

### Priority

**MEDIUM** — Long-term recon attack surface; not immediate data exposure

---

## 5. MEDIUM: Webhook Event Types Not Strictly Validated

### Finding

**Location:** `lib/actions/auth-webhook.actions.ts` → `processClerkWebhookEvent()` (lines 50-100)

```typescript
// Current: Only checks if event type is in a list
const SUPPORTED_WEBHOOK_EVENTS = ['user.created', 'user.updated', 'user.deleted', ...]

if (!SUPPORTED_WEBHOOK_EVENTS.includes(eventType)) {
    // Skip, but no logging or metrics
    return
}
```

### Issues

1. **No Enforcement:** Unsupported event types silently ignored (no alarm for new Clerk events you should handle)
2. **Schema Validation Missing:** Event payload structure not validated before processing
3. **Type Safety:** `event.data.object` cast as `unknown` without struct validation

### Remediation

Add schema validation with audit logging:

```typescript
// 1. Define supported events with required fields
const WEBHOOK_EVENTS = {
    'user.created': z.object({
        id: z.string(),
        email_addresses: z.array(z.object({ email_address: z.string() })).min(1),
        first_name: z.string().optional(),
    }),
    'user.deleted': z.object({
        id: z.string(),
    }),
    // ... other events
}

// 2. Validate and parse
type SupportedEventType = keyof typeof WEBHOOK_EVENTS

function isSupportedEventType(type: string): type is SupportedEventType {
    return type in WEBHOOK_EVENTS
}

export async function processClerkWebhookEvent(input: ClerkWebhookInput) {
    const { eventId, eventType, data } = input

    if (!isSupportedEventType(eventType)) {
        // Log unexpected event types (useful for debugging schema changes)
        await prisma.auditLog.create({
            data: {
                userId: 'system:clerk-webhook',
                action: 'UNSUPPORTED_WEBHOOK_EVENT',
                resourceType: 'ClerkWebhookEvent',
                resourceId: eventId,
                details: JSON.stringify({ eventType, dataKeys: Object.keys(data) })
            }
        })
        return
    }

    // 3. Parse with Zod
    const schema = WEBHOOK_EVENTS[eventType]
    const parsed = schema.parse(data)

    // 4. Process with validated data
    switch (eventType) {
        case 'user.created':
            return handleUserCreated(parsed)
        // ...
    }
}
```

### Priority

**MEDIUM** — Prevents silent failures when Clerk updates webhook schema

---

## 6. MEDIUM: Clerk Webhook Event Cache Missing Constraints

### Finding

**Location:** `prisma/schema.prisma` (lines 65-90)

Clerk event records (ClerkSession, ClerkEmail, ClerkSms, ClerkSubscription, ClerkPaymentAttempt) are stored from webhook payloads with **no schema constraints**:

```prisma
model ClerkEmail {
  id            String    @id // Clerk email ID
  clerkUserId   String?   // ⚠️ Can be NULL
  status        String?   // ⚠️ No enum constraint
  toEmail       String?   // ⚠️ No validation
  lastEventType String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?
}
```

### Issues

1. **NULL clerkUserId:** Orphaned records if Clerk event omits user ID
2. **No Email Validation:** `toEmail` stored without format check (could be garbage from corrupted webhook)
3. **Status Enum Missing:** Clerk's status values not constrained (e.g., if Clerk adds new status, DB accepts it silently)

### Remediation

Add constraints to catch data quality issues:

```prisma
model ClerkEmail {
  id            String    @id
  clerkUserId   String    // ✅ Not nullable - enforce at schema level
  status        String    // ✅ Could validate against Clerk's known statuses
  toEmail       String    // ✅ Add regex validation
  lastEventType String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?

  @@index([clerkUserId])
  @@index([status])
  @@index([deletedAt])
  // Validate: email format, status enum
}
```

And in the webhook handler:

```typescript
const emailSchema = z.object({
    id: z.string().min(1),
    user_id: z.string().min(1), // Reject if missing
    status: z.enum(['verified', 'unverified', 'primary', 'deleted']), // Known Clerk values
    email_address: z.string().email(), // Validated format
})

await prisma.clerkEmail.upsert({
    where: { id: parsed.id },
    create: emailSchema.parse(payload),
    update: emailSchema.parse(payload)
})
```

### Priority

**MEDIUM** — Data quality; silent corruption detection

---

## 7. LOW: Post-Auth Redirect Sanitization Works But Could Be Stricter

### Finding

**Location:** `lib/auth/redirect.ts` (examined in security review)

✅ **Current Implementation:** Already validates protocol before redirecting

```typescript
// ✅ Good: Checks for safe protocol (http/https only)
if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Invalid redirect protocol')
}
```

### Observation

This is **correctly implemented** but worth documenting that it prevents open redirect attacks.

### Recommendation

Add security audit comments to make it clear this is intentional:

```typescript
/**
 * Validates redirect URLs to prevent open redirect attacks.
 * Only allows http:// and https:// protocols (no javascript:, data:, etc)
 * Relative URLs are allowed (URL constructor will throw if parsing fails).
 *
 * Security: Do NOT remove protocol validation or allow additional schemes.
 */
export function validateRedirectUrl(url: string): string {
    try {
        const parsed = new URL(url, getAppBaseUrl())

        // Whitelist only safe protocols
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            throw new Error('Invalid redirect protocol')
        }

        return parsed.href
    } catch {
        throw new Error('Invalid redirect URL')
    }
}
```

### Priority

**LOW** — Already implemented correctly; just document it

---

## Summary Table

| #   | Issue                                 | Severity    | Effort | Impact                            |
| --- | ------------------------------------- | ----------- | ------ | --------------------------------- |
| 1   | Stripe Webhook Authorization Gap      | 🔴 CRITICAL | 2hr    | Financial loss via false payments |
| 2   | Webhook Signature Error Handling      | 🟠 HIGH     | 1hr    | Infinite retries, info leakage    |
| 3   | Non-Standard Env Var Naming           | 🟠 HIGH     | 30m    | Accidental secret exposure        |
| 4   | Sensitive Data in Error Responses     | 🟡 MEDIUM   | 2hr    | User/resource enumeration         |
| 5   | Webhook Event Schema Validation       | 🟡 MEDIUM   | 2hr    | Silent data corruption            |
| 6   | Clerk Event Cache Missing Constraints | 🟡 MEDIUM   | 1hr    | Data quality issues               |
| 7   | Post-Auth Redirect Sanitization       | 🟢 LOW      | 15m    | Documentation only                |

**Total Effort:** ~11 hours for all remediations
**Shipping Readiness:** Not ready (must address CRITICAL #1 at minimum)

---

## Remediation Priority Order

1. **FIRST:** Fix #1 (Stripe Webhook Authorization) — Direct financial impact
2. **SECOND:** Fix #2 (Webhook Error Handling) — Operational stability
3. **THIRD:** Fix #3 (Env Vars) + #4 (Error Leakage) — Deployment safety + recon surface
4. **FOURTH:** Fix #5 + #6 (Validation) — Data integrity
5. **FIFTH:** Document #7 — Security confirmation

---

## What's Working Well ✅

1. **Clerk Authentication:**
    - Proper signal-based API usage (`useSignUp`, `useSignIn` hooks)
    - Webhook integration with idempotent event claiming
    - User deletion transaction properly cascades to related records

2. **Authorization Model:**
    - Hybrid role resolution with env overrides for dev
    - Capability-based permissions (customer, owner, admin roles)
    - Server-side role authority (never trusts client claims)

3. **Billing Operations:**
    - Authorization checks verify customer ownership before creating checkout sessions
    - Audit logging for sensitive operations
    - Soft deletes with retention for compliance

4. **Middleware & Routing:**
    - Clerk middleware properly protects private routes
    - Public routes explicitly whitelisted (webhooks)
    - Redirect URL sanitization prevents open redirects

---

## Next Steps

1. **Create tickets for each remediation** with code review requirements
2. **Add security tests** to verify fixes (especially webhook authorization)
3. **Schedule follow-up security review** after remediations are complete
4. **Document final changes** in `SECURITY.md` for future developers

---

## Questions?

Refer to:

- `.agents/docs/design.md` for UI/UX patterns
- `.agents/instructions/` for development workflow
- `CONTRIBUTING.md` for code review process
