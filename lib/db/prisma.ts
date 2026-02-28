import { createHash } from 'node:crypto';

export interface WrapDesignRecord {
  readonly id: string;
  readonly tenantId: string;
  readonly name: string;
  readonly description?: string;
  readonly priceCents: number;
  readonly isPublished: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CreateWrapDesignInput {
  readonly tenantId: string;
  readonly name: string;
  readonly description?: string;
  readonly priceCents: number;
  readonly isPublished: boolean;
}

export interface UpdateWrapDesignInput {
  readonly tenantId: string;
  readonly id: string;
  readonly name?: string;
  readonly description?: string;
  readonly priceCents?: number;
  readonly isPublished?: boolean;
}

export interface BookingRecord {
  readonly id: string;
  readonly tenantId: string;
  readonly startsAtIso: string;
  readonly endsAtIso: string;
  readonly customerName: string;
}

export interface CreateBookingInput {
  readonly tenantId: string;
  readonly startsAtIso: string;
  readonly endsAtIso: string;
  readonly customerName: string;
}

export interface InvoiceRecord {
  readonly id: string;
  readonly tenantId: string;
  readonly bookingId?: string;
  readonly customerEmail: string;
  readonly amountCents: number;
  readonly status: 'draft' | 'open' | 'paid';
  readonly stripeCheckoutSessionId?: string;
  readonly stripePaymentIntentId?: string;
}

export interface CreateInvoiceInput {
  readonly tenantId: string;
  readonly bookingId?: string;
  readonly customerEmail: string;
  readonly amountCents: number;
}

export interface CreateUploadInput {
  readonly tenantId: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly bytes: Uint8Array;
}

export interface UploadRecord {
  readonly id: string;
  readonly tenantId: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly byteLength: number;
  readonly checksum: string;
  readonly storageUrl: string;
}

export interface ClerkUserRecord {
  readonly id: string;
  readonly primaryEmail?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly imageUrl?: string;
  readonly isDeleted: boolean;
  readonly lastSyncedAt: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface UpsertClerkUserInput {
  readonly id: string;
  readonly primaryEmail?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly imageUrl?: string;
  readonly isDeleted: boolean;
  readonly lastSyncedAt: Date;
}

export interface TenantUserMembershipRecord {
  readonly id: string;
  readonly tenantId: string;
  readonly clerkUserId: string;
  readonly role: string;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface UpsertTenantUserMembershipInput {
  readonly tenantId: string;
  readonly clerkUserId: string;
  readonly role: string;
  readonly isActive: boolean;
}

export interface ClerkWebhookEventRecord {
  readonly id: string;
  readonly clerkEventId: string;
  readonly eventType: string;
  readonly clerkUserId?: string;
  readonly tenantId?: string;
  readonly payloadChecksum: string;
  readonly status: string;
  readonly receivedAt: Date;
  readonly processedAt?: Date;
}

export interface CreateClerkWebhookEventInput {
  readonly clerkEventId: string;
  readonly eventType: string;
  readonly clerkUserId?: string;
  readonly tenantId?: string;
  readonly payloadChecksum: string;
  readonly status?: string;
}

function createId(prefix: string): string {
  const token = createHash('sha256').update(`${prefix}:${Date.now().toString()}:${Math.random().toString()}`).digest('hex').slice(0, 18);
  return `${prefix}_${token}`;
}

function createTenantMembershipKey(tenantId: string, clerkUserId: string): string {
  return `${tenantId}:${clerkUserId}`;
}

export class TenantScopedPrisma {
  private readonly wrapDesigns = new Map<string, WrapDesignRecord>();
  private readonly bookings = new Map<string, BookingRecord>();
  private readonly invoices = new Map<string, InvoiceRecord>();
  private readonly uploads = new Map<string, UploadRecord>();
  private readonly clerkUsers = new Map<string, ClerkUserRecord>();
  private readonly tenantUserMemberships = new Map<string, TenantUserMembershipRecord>();
  private readonly clerkWebhookEvents = new Map<string, ClerkWebhookEventRecord>();

  reset(): void {
    this.wrapDesigns.clear();
    this.bookings.clear();
    this.invoices.clear();
    this.uploads.clear();
    this.clerkUsers.clear();
    this.tenantUserMemberships.clear();
    this.clerkWebhookEvents.clear();
  }

  createWrapDesign(input: CreateWrapDesignInput): WrapDesignRecord {
    const now = new Date();
    const record: WrapDesignRecord = {
      id: createId('wrap'),
      tenantId: input.tenantId,
      name: input.name,
      description: input.description,
      priceCents: input.priceCents,
      isPublished: input.isPublished,
      createdAt: now,
      updatedAt: now
    };

    this.wrapDesigns.set(record.id, record);
    return record;
  }

  listWrapDesignsByTenant(tenantId: string): readonly WrapDesignRecord[] {
    return Array.from(this.wrapDesigns.values()).filter((record) => record.tenantId === tenantId);
  }

  getWrapDesignByTenant(tenantId: string, id: string): WrapDesignRecord | null {
    const record = this.wrapDesigns.get(id);
    return record && record.tenantId === tenantId ? record : null;
  }

  updateWrapDesign(input: UpdateWrapDesignInput): WrapDesignRecord | null {
    const existing = this.getWrapDesignByTenant(input.tenantId, input.id);
    if (!existing) {
      return null;
    }

    const updated: WrapDesignRecord = {
      ...existing,
      name: input.name ?? existing.name,
      description: input.description ?? existing.description,
      priceCents: input.priceCents ?? existing.priceCents,
      isPublished: input.isPublished ?? existing.isPublished,
      updatedAt: new Date()
    };

    this.wrapDesigns.set(updated.id, updated);
    return updated;
  }

  deleteWrapDesign(tenantId: string, id: string): boolean {
    const existing = this.getWrapDesignByTenant(tenantId, id);
    if (!existing) {
      return false;
    }

    return this.wrapDesigns.delete(id);
  }

  createBooking(input: CreateBookingInput): BookingRecord {
    const record: BookingRecord = {
      id: createId('booking'),
      tenantId: input.tenantId,
      startsAtIso: input.startsAtIso,
      endsAtIso: input.endsAtIso,
      customerName: input.customerName
    };

    this.bookings.set(record.id, record);
    return record;
  }

  listBookingsByTenant(tenantId: string): readonly BookingRecord[] {
    return Array.from(this.bookings.values()).filter((record) => record.tenantId === tenantId);
  }

  createInvoice(input: CreateInvoiceInput): InvoiceRecord {
    const record: InvoiceRecord = {
      id: createId('invoice'),
      tenantId: input.tenantId,
      bookingId: input.bookingId,
      customerEmail: input.customerEmail,
      amountCents: input.amountCents,
      status: 'draft'
    };

    this.invoices.set(record.id, record);
    return record;
  }

  listInvoicesByTenant(tenantId: string): readonly InvoiceRecord[] {
    return Array.from(this.invoices.values()).filter((record) => record.tenantId === tenantId);
  }

  getInvoiceByTenant(tenantId: string, invoiceId: string): InvoiceRecord | null {
    const record = this.invoices.get(invoiceId);
    return record && record.tenantId === tenantId ? record : null;
  }

  markInvoiceCheckoutSession(tenantId: string, invoiceId: string, checkoutSessionId: string): InvoiceRecord | null {
    const invoice = this.getInvoiceByTenant(tenantId, invoiceId);
    if (!invoice) {
      return null;
    }

    const updated: InvoiceRecord = {
      ...invoice,
      stripeCheckoutSessionId: checkoutSessionId,
      status: 'open'
    };

    this.invoices.set(invoiceId, updated);
    return updated;
  }

  markInvoicePaid(tenantId: string, invoiceId: string, checkoutSessionId: string, paymentIntentId: string): InvoiceRecord | null {
    const invoice = this.getInvoiceByTenant(tenantId, invoiceId);
    if (!invoice) {
      return null;
    }

    const updated: InvoiceRecord = {
      ...invoice,
      stripeCheckoutSessionId: checkoutSessionId,
      stripePaymentIntentId: paymentIntentId,
      status: 'paid'
    };

    this.invoices.set(invoiceId, updated);
    return updated;
  }

  createUpload(input: CreateUploadInput): UploadRecord {
    const id = createId('upload');
    const checksum = createHash('sha256').update(input.bytes).digest('hex');

    const record: UploadRecord = {
      id,
      tenantId: input.tenantId,
      fileName: input.fileName,
      mimeType: input.mimeType,
      byteLength: input.bytes.byteLength,
      checksum,
      storageUrl: `/storage/${input.tenantId}/${id}`
    };

    this.uploads.set(id, record);
    return record;
  }

  getUploadByTenant(tenantId: string, id: string): UploadRecord | null {
    const record = this.uploads.get(id);
    return record && record.tenantId === tenantId ? record : null;
  }

  getClerkUserById(clerkUserId: string): ClerkUserRecord | null {
    return this.clerkUsers.get(clerkUserId) ?? null;
  }

  upsertClerkUser(input: UpsertClerkUserInput): ClerkUserRecord {
    const existing = this.getClerkUserById(input.id);
    const record: ClerkUserRecord = existing
      ? {
        ...existing,
        primaryEmail: input.primaryEmail ?? existing.primaryEmail,
        firstName: input.firstName ?? existing.firstName,
        lastName: input.lastName ?? existing.lastName,
        imageUrl: input.imageUrl ?? existing.imageUrl,
        isDeleted: input.isDeleted,
        lastSyncedAt: input.lastSyncedAt,
        updatedAt: input.lastSyncedAt
      }
      : {
        id: input.id,
        primaryEmail: input.primaryEmail,
        firstName: input.firstName,
        lastName: input.lastName,
        imageUrl: input.imageUrl,
        isDeleted: input.isDeleted,
        lastSyncedAt: input.lastSyncedAt,
        createdAt: input.lastSyncedAt,
        updatedAt: input.lastSyncedAt
      };

    this.clerkUsers.set(record.id, record);
    return record;
  }

  upsertTenantUserMembership(input: UpsertTenantUserMembershipInput): TenantUserMembershipRecord {
    const key = createTenantMembershipKey(input.tenantId, input.clerkUserId);
    const existing = this.tenantUserMemberships.get(key);
    const now = new Date();
    const record: TenantUserMembershipRecord = existing
      ? {
        ...existing,
        role: input.role,
        isActive: input.isActive,
        updatedAt: now
      }
      : {
        id: createId('membership'),
        tenantId: input.tenantId,
        clerkUserId: input.clerkUserId,
        role: input.role,
        isActive: input.isActive,
        createdAt: now,
        updatedAt: now
      };

    this.tenantUserMemberships.set(key, record);
    return record;
  }

  listTenantUserMembershipsByClerkUser(clerkUserId: string): readonly TenantUserMembershipRecord[] {
    return Array.from(this.tenantUserMemberships.values()).filter((record) => record.clerkUserId === clerkUserId);
  }

  deactivateMembershipsForClerkUser(clerkUserId: string): number {
    let changedCount = 0;

    for (const record of this.tenantUserMemberships.values()) {
      if (record.clerkUserId !== clerkUserId || !record.isActive) {
        continue;
      }

      this.tenantUserMemberships.set(createTenantMembershipKey(record.tenantId, record.clerkUserId), {
        ...record,
        isActive: false,
        updatedAt: new Date()
      });
      changedCount += 1;
    }

    return changedCount;
  }

  deactivateMembershipsForClerkUserExcludingTenants(
    clerkUserId: string,
    activeTenantIds: ReadonlySet<string>
  ): number {
    let changedCount = 0;

    for (const record of this.tenantUserMemberships.values()) {
      if (record.clerkUserId !== clerkUserId || activeTenantIds.has(record.tenantId) || !record.isActive) {
        continue;
      }

      this.tenantUserMemberships.set(createTenantMembershipKey(record.tenantId, record.clerkUserId), {
        ...record,
        isActive: false,
        updatedAt: new Date()
      });
      changedCount += 1;
    }

    return changedCount;
  }

  listClerkWebhookEvents(): readonly ClerkWebhookEventRecord[] {
    return Array.from(this.clerkWebhookEvents.values());
  }

  getClerkWebhookEventByEventId(clerkEventId: string): ClerkWebhookEventRecord | null {
    return this.clerkWebhookEvents.get(clerkEventId) ?? null;
  }

  createClerkWebhookEvent(input: CreateClerkWebhookEventInput): ClerkWebhookEventRecord | null {
    if (this.clerkWebhookEvents.has(input.clerkEventId)) {
      return null;
    }

    const record: ClerkWebhookEventRecord = {
      id: createId('clerk_evt'),
      clerkEventId: input.clerkEventId,
      eventType: input.eventType,
      clerkUserId: input.clerkUserId,
      tenantId: input.tenantId,
      payloadChecksum: input.payloadChecksum,
      status: input.status ?? 'received',
      receivedAt: new Date()
    };

    this.clerkWebhookEvents.set(record.clerkEventId, record);
    return record;
  }

  markClerkWebhookEventStatus(clerkEventId: string, status: string): ClerkWebhookEventRecord | null {
    const existing = this.getClerkWebhookEventByEventId(clerkEventId);
    if (!existing) {
      return null;
    }

    const updated: ClerkWebhookEventRecord = {
      ...existing,
      status,
      processedAt: status === 'processed' ? new Date() : existing.processedAt
    };

    this.clerkWebhookEvents.set(clerkEventId, updated);
    return updated;
  }
}

export const tenantScopedPrisma = new TenantScopedPrisma();
