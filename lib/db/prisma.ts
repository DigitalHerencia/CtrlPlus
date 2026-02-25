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

function createId(prefix: string): string {
  const token = createHash('sha256').update(`${prefix}:${Date.now().toString()}:${Math.random().toString()}`).digest('hex').slice(0, 18);
  return `${prefix}_${token}`;
}

export class TenantScopedPrisma {
  private readonly wrapDesigns = new Map<string, WrapDesignRecord>();
  private readonly bookings = new Map<string, BookingRecord>();
  private readonly invoices = new Map<string, InvoiceRecord>();
  private readonly uploads = new Map<string, UploadRecord>();

  reset(): void {
    this.wrapDesigns.clear();
    this.bookings.clear();
    this.invoices.clear();
    this.uploads.clear();
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
}

export const tenantScopedPrisma = new TenantScopedPrisma();
