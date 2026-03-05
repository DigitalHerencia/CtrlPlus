/**
 * Prisma client singleton.
 *
 * Production: replace the stub below with the real PrismaClient once
 * `@prisma/client` is generated from `prisma/schema.prisma`.
 *
 * The interface exported here matches the Invoice-related slice of the
 * generated client so the rest of the billing domain can import it
 * without the actual package being present in this early phase.
 */

import type { InvoiceStatus } from "@/lib/billing/types";

// ---------------------------------------------------------------------------
// Minimal Prisma-compatible stub types
// ---------------------------------------------------------------------------

export interface PrismaInvoiceRecord {
  id: string;
  tenantId: string;
  bookingId: string;
  amount: number; // Decimal stored as number for simplicity in stub
  status: InvoiceStatus;
  stripeCheckoutSessionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrismaAuditLogRecord {
  id: string;
  tenantId: string;
  userId: string;
  action: string;
  resourceId: string;
  details: Record<string, unknown>;
  timestamp: Date;
}

// ---------------------------------------------------------------------------
// In-memory store used by the stub (replaced by real DB at runtime)
// ---------------------------------------------------------------------------

const invoiceStore: PrismaInvoiceRecord[] = [];
const auditLogStore: PrismaAuditLogRecord[] = [];

// ---------------------------------------------------------------------------
// Stub Prisma client
// ---------------------------------------------------------------------------

export const prisma = {
  invoice: {
    findMany: async (args: {
      where?: Partial<PrismaInvoiceRecord>;
      orderBy?: Partial<Record<keyof PrismaInvoiceRecord, "asc" | "desc">>;
    }): Promise<PrismaInvoiceRecord[]> => {
      let results = [...invoiceStore];
      if (args.where) {
        const w = args.where;
        results = results.filter((r) =>
          (Object.keys(w) as (keyof PrismaInvoiceRecord)[]).every(
            (k) => r[k] === w[k]
          )
        );
      }
      return results;
    },

    findFirst: async (args: {
      where?: Partial<PrismaInvoiceRecord>;
    }): Promise<PrismaInvoiceRecord | null> => {
      if (!args.where) return invoiceStore[0] ?? null;
      const w = args.where;
      return (
        invoiceStore.find((r) =>
          (Object.keys(w) as (keyof PrismaInvoiceRecord)[]).every(
            (k) => r[k] === w[k]
          )
        ) ?? null
      );
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
} as const;
