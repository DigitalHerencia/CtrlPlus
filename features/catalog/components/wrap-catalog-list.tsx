import Link from 'next/link';

import type { WrapDesign } from '../types';

export interface WrapCatalogListProps {
  readonly wraps: readonly WrapDesign[];
}

export function WrapCatalogList({ wraps }: WrapCatalogListProps) {
  if (wraps.length === 0) {
    return (
      <p className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-4 text-[color:var(--text-muted)]">
        No wraps are currently available.
      </p>
    );
  }

  return (
    <ul className="mt-6 grid list-none gap-4 p-0">
      {wraps.map((wrap) => (
        <li
          className="grid gap-2 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4"
          key={wrap.id}
        >
          <h2 className="text-xl font-semibold text-[color:var(--text)]">{wrap.name}</h2>
          <p className="text-[color:var(--text-muted)]">{wrap.description ?? 'Details available on request.'}</p>
          <p className="font-semibold text-[color:var(--text)]">${(wrap.priceCents / 100).toFixed(2)}</p>
          <Link
            className="inline-flex w-fit items-center gap-1 font-semibold text-[color:var(--color-accent-primary)] hover:underline"
            href={`/wraps/${wrap.id}`}
          >
            Review wrap
          </Link>
        </li>
      ))}
    </ul>
  );
}

