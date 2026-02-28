import type {
  BookingListRequestContract,
  BookingListResponseContract,
  BookingSummaryContract,
} from '../../../types/scheduling';

function normalizeQuery(query: BookingListRequestContract): BookingListRequestContract {
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
  records: readonly BookingSummaryContract[],
  query: BookingListRequestContract,
): readonly BookingSummaryContract[] {
  const customerNameQuery = query.filter?.customerNameQuery?.trim().toLowerCase();
  const startsAfterIso = query.filter?.startsAfterIso;
  const endsBeforeIso = query.filter?.endsBeforeIso;

  return records.filter((record) => {
    if (customerNameQuery && !record.customerName.toLowerCase().includes(customerNameQuery)) {
      return false;
    }

    if (startsAfterIso && record.startsAtIso < startsAfterIso) {
      return false;
    }

    if (endsBeforeIso && record.endsAtIso > endsBeforeIso) {
      return false;
    }

    return true;
  });
}

function compareValues(left: string, right: string, direction: 'asc' | 'desc'): number {
  const comparison = left.localeCompare(right);
  return direction === 'asc' ? comparison : comparison * -1;
}

function applySort(
  records: readonly BookingSummaryContract[],
  query: BookingListRequestContract,
): readonly BookingSummaryContract[] {
  const field = query.sort?.field ?? 'startsAtIso';
  const direction = query.sort?.direction ?? 'asc';

  return [...records].sort((left, right) => {
    if (field === 'customerName') {
      return compareValues(left.customerName, right.customerName, direction)
        || left.id.localeCompare(right.id);
    }

    return compareValues(left.startsAtIso, right.startsAtIso, direction)
      || left.id.localeCompare(right.id);
  });
}

function paginate(
  records: readonly BookingSummaryContract[],
  query: BookingListRequestContract,
): BookingListResponseContract {
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

export function queryBookings(
  records: readonly BookingSummaryContract[],
  query: BookingListRequestContract,
): BookingListResponseContract {
  const normalizedQuery = normalizeQuery(query);
  const filtered = applyFilter(records, normalizedQuery);
  const sorted = applySort(filtered, normalizedQuery);
  return paginate(sorted, normalizedQuery);
}
