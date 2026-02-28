import type {
  InvoiceListRequestContract,
  InvoiceListResponseContract,
  InvoiceSummaryContract,
} from '../../../types/billing';

function normalizeQuery(query: InvoiceListRequestContract): InvoiceListRequestContract {
  const page = Math.max(1, Math.trunc(query.pagination.page));
  const pageSize = Math.min(200, Math.max(1, Math.trunc(query.pagination.pageSize)));

  return {
    ...query,
    pagination: {
      page,
      pageSize,
    },
  };
}

function applyFilter(
  records: readonly InvoiceSummaryContract[],
  query: InvoiceListRequestContract,
): readonly InvoiceSummaryContract[] {
  const status = query.filter?.status;
  const customerEmailQuery = query.filter?.customerEmailQuery?.trim().toLowerCase();

  return records.filter((record) => {
    if (status && record.status !== status) {
      return false;
    }

    if (customerEmailQuery && !record.customerEmail.toLowerCase().includes(customerEmailQuery)) {
      return false;
    }

    return true;
  });
}

function compareString(left: string, right: string, direction: 'asc' | 'desc'): number {
  const comparison = left.localeCompare(right);
  return direction === 'asc' ? comparison : comparison * -1;
}

function compareNumber(left: number, right: number, direction: 'asc' | 'desc'): number {
  const comparison = left - right;
  return direction === 'asc' ? comparison : comparison * -1;
}

function applySort(
  records: readonly InvoiceSummaryContract[],
  query: InvoiceListRequestContract,
): readonly InvoiceSummaryContract[] {
  const field = query.sort?.field ?? 'id';
  const direction = query.sort?.direction ?? 'asc';

  return [...records].sort((left, right) => {
    if (field === 'customerEmail') {
      return compareString(left.customerEmail, right.customerEmail, direction)
        || left.id.localeCompare(right.id);
    }

    if (field === 'amountCents') {
      return compareNumber(left.amountCents, right.amountCents, direction)
        || left.id.localeCompare(right.id);
    }

    if (field === 'status') {
      return compareString(left.status, right.status, direction)
        || left.id.localeCompare(right.id);
    }

    return compareString(left.id, right.id, direction);
  });
}

function paginate(
  records: readonly InvoiceSummaryContract[],
  query: InvoiceListRequestContract,
): InvoiceListResponseContract {
  const page = query.pagination.page;
  const pageSize = query.pagination.pageSize;
  const total = records.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const normalizedPage = Math.min(page, pageCount);
  const start = (normalizedPage - 1) * pageSize;
  const end = start + pageSize;

  return {
    items: records.slice(start, end),
    total,
    page: normalizedPage,
    pageSize,
    pageCount,
    hasNextPage: normalizedPage < pageCount,
  };
}

export function queryInvoices(
  records: readonly InvoiceSummaryContract[],
  query: InvoiceListRequestContract,
): InvoiceListResponseContract {
  const normalizedQuery = normalizeQuery(query);
  const filtered = applyFilter(records, normalizedQuery);
  const sorted = applySort(filtered, normalizedQuery);
  return paginate(sorted, normalizedQuery);
}
