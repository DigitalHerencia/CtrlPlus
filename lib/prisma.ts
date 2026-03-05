/**
 * Prisma client stub.
 *
 * Provides an in-memory store that mirrors the Invoice, Booking,
 * StripeWebhookEvent, and AuditLog Prisma models.  Replace with
 * the real `@prisma/client` PrismaClient once `prisma generate` has been run
 * against a provisioned database.
 *
 * All tests mock this module via `vi.mock('@/lib/prisma')`, so the stub is
 * only exercised when running the application without a real database.
 */

import type { InvoiceStatus } from "@/lib/billing/types";

// ---------------------------------------------------------------------------
// Minimal record types (mirrors prisma/schema.prisma)
// ---------------------------------------------------------------------------

export interface PrismaInvoiceRecord {
  id: string;
  tenantId: string;
  bookingId: string;
  /** Stored as Decimal(10,2) in production; represented as number in stub. */
  amount: number;
  status: InvoiceStatus;
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrismaBookingRecord {
  id: string;
  tenantId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrismaStripeWebhookEventRecord {
  id: string;
  type: string;
  processedAt: Date;
  payload: Record<string, unknown>;
}

export interface PrismaAuditLogRecord {
  id: string;
  tenantId: string;
  userId?: string;
  action: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

// ---------------------------------------------------------------------------
// In-memory stores (reset between test suites if needed)
// ---------------------------------------------------------------------------

const invoiceStore: PrismaInvoiceRecord[] = [];
const bookingStore: PrismaBookingRecord[] = [];
const stripeEventStore: PrismaStripeWebhookEventRecord[] = [];
const auditLogStore: PrismaAuditLogRecord[] = [];

// ---------------------------------------------------------------------------
// Utility: shallow filter helper
// ---------------------------------------------------------------------------

function matchesWhere<T extends object>(record: T, where: Partial<T>): boolean {
  return (Object.keys(where) as (keyof T)[]).every(
    (k) => record[k] === where[k]
  );
}

// ---------------------------------------------------------------------------
// Stub Prisma client
// ---------------------------------------------------------------------------

type TransactionFn<T> = (tx: typeof prismaBase) => Promise<T>;

const prismaBase = {
  invoice: {
    findFirst: async (args: {
      where?: Partial<PrismaInvoiceRecord>;
    }): Promise<PrismaInvoiceRecord | null> =>
      invoiceStore.find((r) => matchesWhere(r, args.where ?? {})) ?? null,

    findUnique: async (args: {
      where: { id: string };
    }): Promise<PrismaInvoiceRecord | null> =>
      invoiceStore.find((r) => r.id === args.where.id) ?? null,

    findMany: async (args: {
      where?: Partial<PrismaInvoiceRecord>;
      orderBy?: Partial<Record<keyof PrismaInvoiceRecord, "asc" | "desc">>;
    }): Promise<PrismaInvoiceRecord[]> =>
      invoiceStore.filter((r) => matchesWhere(r, args.where ?? {})),

    create: async (args: {
      data: Omit<PrismaInvoiceRecord, "id" | "createdAt" | "updatedAt">;
    }): Promise<PrismaInvoiceRecord> => {
      const record: PrismaInvoiceRecord = {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...args.data,
      };
      invoiceStore.push(record);
      return record;
    },

    update: async (args: {
      where: { id: string };
      data: Partial<PrismaInvoiceRecord>;
    }): Promise<PrismaInvoiceRecord> => {
      const idx = invoiceStore.findIndex((r) => r.id === args.where.id);
      if (idx === -1) throw new Error("Invoice not found");
      invoiceStore[idx] = {
        ...invoiceStore[idx],
        ...args.data,
        updatedAt: new Date(),
      };
      return invoiceStore[idx];
    },
  },

  booking: {
    findFirst: async (args: {
      where?: Partial<PrismaBookingRecord>;
    }): Promise<PrismaBookingRecord | null> =>
      bookingStore.find((r) => matchesWhere(r, args.where ?? {})) ?? null,

    update: async (args: {
      where: Partial<PrismaBookingRecord>;
      data: Partial<PrismaBookingRecord>;
    }): Promise<PrismaBookingRecord> => {
      const idx = bookingStore.findIndex((r) => matchesWhere(r, args.where));
      if (idx === -1) throw new Error("Booking not found");
      bookingStore[idx] = {
        ...bookingStore[idx],
        ...args.data,
        updatedAt: new Date(),
      };
      return bookingStore[idx];
    },
  },

  stripeWebhookEvent: {
    findUnique: async (args: {
      where: { id: string };
    }): Promise<PrismaStripeWebhookEventRecord | null> =>
      stripeEventStore.find((r) => r.id === args.where.id) ?? null,

    create: async (args: {
      data: PrismaStripeWebhookEventRecord;
    }): Promise<PrismaStripeWebhookEventRecord> => {
      stripeEventStore.push(args.data);
      return args.data;
    },
  },

  auditLog: {
    create: async (args: {
      data: Omit<PrismaAuditLogRecord, "id">;
    }): Promise<PrismaAuditLogRecord> => {
      const record: PrismaAuditLogRecord = {
        id: crypto.randomUUID(),
        ...args.data,
      };
      auditLogStore.push(record);
      return record;
    },
  },
};

export const prisma = {
  ...prismaBase,
  $transaction: async <T>(fn: TransactionFn<T>): Promise<T> => fn(prismaBase),
};
